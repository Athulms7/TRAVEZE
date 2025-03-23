import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
from sklearn.model_selection import train_test_split
from model import TravelRecommender
import os

def train_model():
    # Check if dataset exists
    if not os.path.exists("enhanced_travel_dataset.csv"):
        print("Dataset not found. Please ensure 'enhanced_travel_dataset.csv' exists.")
        return

    # Load dataset
    df = pd.read_csv("enhanced_travel_dataset.csv")
    X = pd.get_dummies(df[['budget', 'accommodation_rate']])
    y = df[['destination']].apply(lambda x: hash(str(x)))

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Convert data to tensors
    X_train_tensor = torch.tensor(X_train.values, dtype=torch.float32)
    y_train_tensor = torch.tensor(y_train.values, dtype=torch.float32).view(-1, 1)
    X_test_tensor = torch.tensor(X_test.values, dtype=torch.float32)
    y_test_tensor = torch.tensor(y_test.values, dtype=torch.float32).view(-1, 1)

    # Initialize model
    input_size = X_train.shape[1]
    hidden_size = 10
    output_size = 1
    model = TravelRecommender(input_size, hidden_size, output_size)

    # Loss and optimizer
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)

    # Training loop
    epochs = 100
    for epoch in range(epochs):
        optimizer.zero_grad()
        outputs = model(X_train_tensor)
        loss = criterion(outputs, y_train_tensor)
        loss.backward()
        optimizer.step()
        
        if (epoch+1) % 10 == 0:
            print(f'Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.4f}')

    # Evaluate model
    model.eval()
    with torch.no_grad():
        test_outputs = model(X_test_tensor)
        test_loss = criterion(test_outputs, y_test_tensor)
        print(f'Test Loss: {test_loss.item():.4f}')

    # Save the trained model
    torch.save(model.state_dict(), "travel_model.pth")
    print("Model training complete and saved as travel_model.pth")

if __name__ == "__main__":
    train_model() 