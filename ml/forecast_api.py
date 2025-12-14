from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

app = Flask(__name__)

def prepare_dataset(series, window=3):
    X, y = [], []
    for i in range(len(series) - window):
        X.append(series[i:i+window])
        y.append(series[i+window])
    return np.array(X), np.array(y)

def build_lstm_model(window=3):
    model = Sequential()
    model.add(LSTM(32, return_sequences=False, input_shape=(window, 1)))
    model.add(Dense(16, activation="relu"))
    model.add(Dense(1))
    model.compile(optimizer="adam", loss="mse")
    return model

@app.route("/forecast", methods=["POST"])
def forecast():
    data = request.json
    series = data["series"]
    steps = data.get("steps", 3)  # how many months to predict

    series = np.array(series, dtype=float)

    window = 3  # moving window size
    X, y = prepare_dataset(series, window)

    X = X.reshape((X.shape[0], X.shape[1], 1))

    model = build_lstm_model(window)
    model.fit(X, y, epochs=100, batch_size=4, verbose=0)

    predictions = []
    last_input = series[-window:]

    for _ in range(steps):
        inp = np.array(last_input).reshape(1, window, 1)
        pred = model.predict(inp, verbose=0)[0][0]
        predictions.append(pred)

        last_input = np.append(last_input[1:], pred)

    return jsonify({"forecast": predictions})

app.run(port=5001)
