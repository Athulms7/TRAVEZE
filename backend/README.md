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

## Deploying on Render

1. Create a Render Key Value service and keep it private to the Render
   workspace.
2. Create an Express Web Service with this repository's `backend` directory
   as its root, `npm ci` as its build command, and `npm run start:api` as its
   start command.
3. Create a Flask Web Service with the same root directory, `pip install -r
   requirements.txt` as its build command, and
   `gunicorn src.chatbot:app --bind 0.0.0.0:$PORT` as its start command.
4. On both services, set `NODE_ENV=production` and set `REDIS_URL` to the
   Key Value service's **internal** connection URL. Set the required
   `MONGODB_URI` and `JWT_SECRET` on both services; also set `GROQ_API_KEY`
   on the Flask service. Enter secrets in Render's environment settings,
   not in this repository.
5. In the frontend's Vercel project settings, set
   `VITE_AUTH_API_URL` to the Express service URL ending in `/api/auth`, and
   `VITE_CHATBOT_API_URL` to the Flask service URL. Redeploy the frontend
   after changing these build-time variables.
6. Scale each Render Web Service to the desired instance count. Render's
   managed ingress/load balancer distributes requests across healthy
   instances for that service. Configure `/health` as the health-check path
   and enable autoscaling in the service settings as needed. Do not put an
   in-process session or rate-limit counter in an instance: JWT authentication
   and Redis-backed limits are shared across replicas.

The Express and Flask services are separate because a Render Web Service
routes traffic to one listening HTTP port. The local `dev:full` command is
for development, not the production service start command.
