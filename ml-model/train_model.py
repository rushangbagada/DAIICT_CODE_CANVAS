#!/usr/bin/env python3
"""
Train and save the Hydrogen Site Recommender ML model
"""

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score
from xgboost import XGBRegressor
import os

def generate_synthetic_dataset(num_sites=1000, seed=42):
    """Generate synthetic hydrogen site data"""
    print(f"Generating synthetic dataset with {num_sites} sites...")
    
    np.random.seed(seed)
    
    # India geographic bounds
    lat_range = (8.0, 37.0)  # India latitude range
    lon_range = (68.0, 97.0)  # India longitude range
    
    # Generate synthetic data
    data = {
        "lat": np.random.uniform(*lat_range, num_sites),
        "lon": np.random.uniform(*lon_range, num_sites),
        "capacity": np.random.uniform(50, 150, num_sites),
        "distance_to_renewable": np.random.uniform(1, 20, num_sites),
        "demand_index": np.random.uniform(50, 100, num_sites),
        "water_availability": np.random.uniform(30, 80, num_sites),
        "land_cost": np.random.uniform(30, 70, num_sites),
    }
    
    df = pd.DataFrame(data)
    
    # Generate realistic site scores based on features
    df["site_score"] = (
        0.4 * np.log1p(df["capacity"]) +
        0.3 * df["demand_index"] -
        0.3 * np.log1p(df["distance_to_renewable"]) +
        0.2 * df["water_availability"] -
        0.1 * df["land_cost"] +
        np.random.normal(0, 1, size=len(df))
    )
    
    # Add site IDs
    df["site_id"] = [f"site_{i:04d}" for i in range(len(df))]
    
    # Ensure all required features exist
    required_features = ["capacity", "distance_to_renewable", "demand_index", "water_availability", "land_cost"]
    for feature in required_features:
        if feature not in df.columns:
            df[feature] = 0
    
    print(f"Dataset generated successfully!")
    print(f"Features: {list(df.columns)}")
    print(f"Shape: {df.shape}")
    
    return df

def train_model(df, model_name="hydrogen_site_model.pkl"):
    """Train the ML model and save as PKL file"""
    print(f"\nTraining ML model...")
    
    # Define features and target
    features = ["capacity", "distance_to_renewable", "demand_index", "water_availability", "land_cost"]
    target = "site_score"
    
    # Prepare data
    X = df[features].copy()
    y = df[target]
    
    # Handle missing values
    X = X.fillna(0)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"Training set: {X_train.shape}")
    print(f"Test set: {X_test.shape}")
    
    # Create and train pipeline
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("model", XGBRegressor(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            n_jobs=-1
        ))
    ])
    
    print("Training XGBoost model...")
    pipeline.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = pipeline.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"\nModel Performance:")
    print(f"Mean Squared Error: {mse:.4f}")
    print(f"R² Score: {r2:.4f}")
    
    # Save model
    model_path = os.path.join(os.path.dirname(__file__), model_name)
    joblib.dump(pipeline, model_path)
    print(f"\n✅ Model saved to: {model_path}")
    
    # Save dataset
    dataset_path = os.path.join(os.path.dirname(__file__), "hydrogen_sites_generated.csv")
    df.to_csv(dataset_path, index=False)
    print(f"✅ Dataset saved to: {dataset_path}")
    
    return pipeline, df

def validate_model(pipeline, df):
    """Validate the trained model"""
    print(f"\nValidating model...")
    
    features = ["capacity", "distance_to_renewable", "demand_index", "water_availability", "land_cost"]
    X = df[features].fillna(0)
    
    # Make predictions
    predictions = pipeline.predict(X)
    
    # Add predictions to dataframe
    df_with_predictions = df.copy()
    df_with_predictions["predicted_score"] = predictions
    
    # Show sample predictions
    print(f"\nSample predictions:")
    sample_data = df_with_predictions[["site_id", "lat", "lon", "site_score", "predicted_score"]].head(10)
    print(sample_data.to_string(index=False))
    
    # Calculate correlation
    correlation = np.corrcoef(df["site_score"], predictions)[0, 1]
    print(f"\nCorrelation between actual and predicted scores: {correlation:.4f}")
    
    return df_with_predictions

def main():
    """Main training function"""
    print("🚀 Hydrogen Site Recommender - Model Training")
    print("=" * 60)
    
    # Generate dataset
    df = generate_synthetic_dataset(num_sites=1000)
    
    # Train model
    model, df = train_model(df, "hydrogen_site_model.pkl")
    
    # Validate model
    df_validated = validate_model(model, df)
    
    # Save validated dataset
    validated_path = os.path.join(os.path.dirname(__file__), "hydrogen_sites_with_predictions.csv")
    df_validated.to_csv(validated_path, index=False)
    print(f"✅ Validated dataset saved to: {validated_path}")
    
    print(f"\n🎉 Model training completed successfully!")
    print(f"Files created:")
    print(f"  • hydrogen_site_model.pkl - Trained ML model")
    print(f"  • hydrogen_sites_generated.csv - Training dataset")
    print(f"  • hydrogen_sites_with_predictions.csv - Dataset with predictions")
    
    print(f"\nNext steps:")
    print(f"1. Start FastAPI server: python start_server.py")
    print(f"2. Test API: python test_api.py")
    print(f"3. Run demo: python demo.py")

if __name__ == "__main__":
    main()
