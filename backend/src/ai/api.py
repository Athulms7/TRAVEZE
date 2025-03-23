from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from model import TravelRecommender
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Load the trained model
input_size = 2  # budget and accommodation_rate
hidden_size = 10
output_size = 1
model = TravelRecommender(input_size, hidden_size, output_size)

if os.path.exists("travel_model.pth"):
    model.load_state_dict(torch.load("travel_model.pth"))
    model.eval()
else:
    print("Warning: No trained model found. Predictions will be random.")

class TravelRequest(BaseModel):
    destination: str = None
    budget: float = None
    accommodation_rate: float = None

@app.post("/predict")
async def predict_travel(request: TravelRequest):
    try:
        if request.destination:
            # Get travel information for a specific destination
            travel_info = model.get_travel_info(request.destination)
            return travel_info
        elif request.budget is not None and request.accommodation_rate is not None:
            # Get destination prediction based on budget and accommodation rate
            prediction = model.predict_destination(request.budget, request.accommodation_rate)
            return {"prediction": prediction.tolist()}
        else:
            raise HTTPException(status_code=400, message="Invalid request parameters")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/destination/{destination}")
async def get_destination_info(destination: str):
    try:
        travel_info = model.get_travel_info(destination)
        return travel_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 