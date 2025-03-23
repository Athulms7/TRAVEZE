import torch
import torch.nn as nn
import requests
import os
from dotenv import load_dotenv

load_dotenv()

class TravelRecommender(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(TravelRecommender, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, output_size)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        x = self.softmax(x)
        return x

    def get_travel_info(self, destination):
        travel_info = {}

        try:
            # OpenTripMap API for popular places
            places_url = f'https://api.opentripmap.com/0.1/en/places/geoname?name={destination}&apikey={os.getenv("OPENTRIPMAP_API_KEY")}'
            places_data = requests.get(places_url).json()
            
            if places_data.get('lat') and places_data.get('lon'):
                # Get nearby places
                nearby_url = f'https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon={places_data["lon"]}&lat={places_data["lat"]}&apikey={os.getenv("OPENTRIPMAP_API_KEY")}'
                nearby_data = requests.get(nearby_url).json()
                travel_info['places_to_visit'] = [place['name'] for place in nearby_data.get('features', [])[:5]]
            else:
                travel_info['places_to_visit'] = ['Data not available']

            # OpenWeatherMap API for climate
            weather_url = f'https://api.openweathermap.org/data/2.5/weather?q={destination}&appid={os.getenv("OPENWEATHERMAP_API_KEY")}&units=metric'
            weather_data = requests.get(weather_url).json()
            if weather_data.get('weather'):
                travel_info['weather'] = {
                    'description': weather_data['weather'][0]['description'],
                    'temperature': weather_data['main']['temp'],
                    'humidity': weather_data['main']['humidity'],
                    'feels_like': weather_data['main']['feels_like']
                }
            else:
                travel_info['weather'] = 'Weather data not available'

            # NewsAPI for local news
            news_url = f'https://newsapi.org/v2/everything?q={destination}&apiKey={os.getenv("NEWSAPI_KEY")}&pageSize=5'
            news_data = requests.get(news_url).json()
            travel_info['local_news'] = [
                {'title': article['title'], 'url': article['url']}
                for article in news_data.get('articles', [])[:5]
            ] if news_data.get('articles') else []

        except Exception as e:
            travel_info['error'] = str(e)

        return travel_info

    def predict_destination(self, budget, accommodation_rate):
        # Convert input to tensor
        input_data = torch.tensor([[float(budget), float(accommodation_rate)]], dtype=torch.float32)
        
        # Get prediction
        with torch.no_grad():
            output = self(input_data)
        
        return output.numpy()[0] 