# ML Service Deployment Checklist for Render

## Render Service Configuration

### 1. Create New Web Service
- Name: `daiict-code-canvas-ml` (or similar)
- Repository: `rushangbagada/DAIICT_CODE_CANVAS`
- Branch: `main`
- Root Directory: `ml-model`

### 2. Build Settings
- Build Command: `pip install -r requirements.txt`
- Start Command: `python app.py`

### 3. Environment Variables (Auto-provided by Render)
- ✅ PORT - Automatically set by Render
- ✅ Your app already handles this correctly

### 4. Service URL
- Will be: `https://your-service-name.onrender.com`
- Update main backend to use this URL

### 5. Files Required in ml-model folder:
- ✅ app.py (FastAPI application)
- ✅ requirements.txt (Python dependencies)
- ✅ Procfile (web: python app.py)
- ✅ ML model files (.pkl files)
- ✅ Dataset files (.csv files)

## Troubleshooting
- Check Render logs for startup errors
- Ensure all Python dependencies are in requirements.txt
- Verify ML model files exist in the ml-model directory
