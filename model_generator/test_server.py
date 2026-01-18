import requests
import json
import os

url = "http://localhost:8000/generate"

payload = {
  "metadata": {
    "version": "1.0",
    "timestamp": "2026-01-18T09:10:58.786Z",
    "appName": "PrintMyCard"
  },
  "design": {
    "color": "#784e97",
    "fontColor": "#FFFFFF",
    "filletRadius": 3,
    "thickness": 1.6,
    "dimensions": {
      "width": 85,
      "height": 54
    }
  },
  "content": {
    "name": "Dean",
    "email": "peepeepoo@gmail",
    "jobTitle": "Peepee poo poo in india wooohoo",
    "phoneNumber": "",
    "github": None,
    "linkedin": "linkedin.com/deanmenkis",
    "qrUrl": "https://example.com/"
  },
  "positions": {
    "name": {
      "x": -36.5,
      "y": 21
    },
    "jobTitle": {
      "x": -36.5,
      "y": 14
    },
    "phone": {
      "x": -36.5,
      "y": -21
    },
    "email": {
      "x": -36.5,
      "y": -17
    },
    "github": {
      "x": -36.5,
      "y": -13
    },
    "linkedin": {
      "x": -36.5,
      "y": -9
    },
    "qrCode": {
      "x": 0,
      "y": 0,
      "face": "back"
    }
  }
}

print("Sending request...")
response = requests.post(url, json=payload, stream=True)

if response.status_code == 200:
    print("Success! Downloading file...")
    with open("test_output.3mf", "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    print(f"File saved to test_output.3mf, size: {os.path.getsize('test_output.3mf')} bytes")
else:
    print(f"Failed with status {response.status_code}")
    print(response.text)
