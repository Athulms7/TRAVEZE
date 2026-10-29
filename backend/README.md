# Backend deployment and rate limiting

The backend runs two independent HTTP services:

- Express authentication and itinerary API (`npm run start:api`)
- Flask itinerary generation API (`npm run start:chatbot`)

For local development, `npm run dev:full` continues to run both services. They
use an in-memory rate-limit store when `REDIS_URL` is unset. That is suitable
only for local development because each process maintains its own counters.

## Rate limits

Both APIs use the shared Redis service when `REDIS_URL` is configured:

- Express API: 100 requests per IP per 15 minutes.
- Combined Express registration, login, and password recovery/reset: 10 requests per IP per 15 minutes.
- Flask API: 100 requests per IP per 15 minutes.
- Itinerary generation: 5 requests per authenticated user per 15 minutes.

Responses include standard rate-limit headers and return HTTP 429 when a limit
is reached. Production startup requires `REDIS_URL`; do not use in-memory
limits for multiple instances.

## Authentication and account recovery

- Access tokens expire after 12 hours by default. Selecting **Remember me**
  issues a 30-day token. The frontend stores temporary sessions in
  `sessionStorage` and remembered sessions in `localStorage`, validates saved
  sessions on startup, and clears them on expiry or an unauthorized response.
- Express stores a hashed-session identifier and expiry in MongoDB. Logout
  revokes only the current session; password changes and password resets
  increment the user's authentication version to invalidate every session.
  Expired session and reset-token records are removed by MongoDB TTL indexes.
- API and Flask services must use the same `JWT_SECRET`. Production requires
  at least 32 bytes. Tokens issued before session-backed authentication was
  introduced are no longer accepted; users need to sign in again after
  deploying this change.
- Password reset email uses SMTP. Configure `FRONTEND_URL`, `SMTP_HOST`,
  `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` on the Express
  service. Reset links are single-use and expire after 15 minutes. If SMTP
  is not configured, password recovery returns an explicit unavailable
  response; normal sign-in and profile-based password changes remain available.

### Configure and test reset email locally

1. In `backend/.env`, set `FRONTEND_URL` to the exact origin running Vite,
   normally `http://localhost:5173`.
2. Provide SMTP credentials. For Gmail, enable 2-Step Verification and create
   an **App Password** for this application; use `smtp.gmail.com`, port `587`,
   your Gmail address for `SMTP_USER` and `SMTP_FROM`, and the App Password for
   `SMTP_PASSWORD`. Never use your normal Google account password. For a live
   website, use a transactional email provider and verify your sending domain
   to improve delivery.
3. Restart the Express API so dotenv loads the new values. Sign in to Traveze,
   open **Forgot password?**, and submit the email address belonging to a
   registered account. Check inbox and spam/junk.
4. Open the link from the email, enter a new password of at least 12
   characters, then sign in again using it. To diagnose a delivery problem,
   check the Express API's server log for `Password reset email delivery
   failed`; the public response intentionally does not reveal whether an
   account exists.

Example configuration (replace every placeholder locally; never commit real
credentials):

```dotenv
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-sending-account@gmail.com
SMTP_PASSWORD=your-provider-app-password
SMTP_FROM=your-sending-account@gmail.com
```

In production, add these values to the Express service's secret environment
settings. `FRONTEND_URL` must be the deployed frontend origin, and the sender
address/domain must be approved by the SMTP provider.

## Deploying the backend on Render

The backend is two separate Render Web Services because each service listens
on its own Render-provided `PORT`:

1. Connect the GitHub repository to Render and create a Node Web Service for
   the Express API. Set the root directory to `backend`, build command to
   `npm ci`, start command to `npm run start:api`, and health check path to
   `/health`.
2. Create a Python Web Service from the same repository and branch. Set the
   root directory to `backend`, build command to
   `pip install -r requirements-render.txt`, start command to
   `gunicorn src.chatbot:app --bind 0.0.0.0:$PORT`, and health check path to
   `/health`. The Render-specific requirements include only the libraries
   used by the itinerary generator, not the larger ML packages needed by
   other backend scripts.
3. Configure the required `MONGODB_URI`, `JWT_SECRET`, and `REDIS_URL` on
   **both** services. Use the same values for both: both services must use the
   same Mongo database and JWT signing key. The Mongo connection URL must
   include the database name (for example `/tripwish` before any `?` options)
   because the Python service selects the default database from the URI.
   `REDIS_URL` must be the Redis/Key Value **internal** connection URL.
4. Set `NODE_ENV=production` on both services. Set `GROQ_API_KEY` on the
   Python service. Set `FRONTEND_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
   `SMTP_PASSWORD`, and `SMTP_FROM` on the Express service. Use Render's
   environment settings for secrets, never repository files. Render supplies
   `PORT`; do not hardcode it.
5. After deploying the frontend, set `FRONTEND_URL` to its exact public origin
   on the Express service, and set frontend build variables
   `VITE_AUTH_API_URL` to the Express URL ending in `/api/auth` and
   `VITE_CHATBOT_API_URL` to the Python service URL. Rebuild/redeploy the
   frontend after changing these build-time variables.
6. Confirm both services return `{"status":"healthy"}` at `/health`.

The local `dev:full` command is for development, not the production service
start command. Use Redis-backed rate limits and shared MongoDB sessions rather
than per-process state when running multiple instances.
