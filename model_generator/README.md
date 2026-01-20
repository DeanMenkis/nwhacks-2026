# Model Generator Service

This service generates 3D printable business cards with custom text and QR codes. It exposes a REST API powered by FastAPI.

## Prerequisites

- Python 3.8+
- pip
- OpenSCAD (must be in system PATH)

## Setup

It is recommended to use a virtual environment to manage dependencies.

### 1. Create a Virtual Environment

Run the following command in your terminal:

```bash
# Windows
python -m venv venv

# macOS/Linux
python3 -m venv venv
```

### 2. Activate the Virtual Environment

**Windows:**
```powershell
.\venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

## Running the Server

Start the server using `python`:

```bash
python server.py
```

Or using `uvicorn` directly (useful for development with auto-reload):

```bash
uvicorn server:app --reload
```

The server will start at `http://0.0.0.0:8000`.

## API Usage

### Generate Card

**Endpoint:** `POST /generate`

**Description:** Generates a 3MF file of a business card based on the provided design, content, and positions.

**Example Request:**

See `test_payload.json` or `test_server.py` for example usage.
