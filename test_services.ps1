# Test script to check all services and their communication
Write-Host "🔍 Testing Service Status and Communication" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if ports are in use
Write-Host "`n📡 Checking Port Status:" -ForegroundColor Yellow

$ports = @(5000, 8000, 5173)
foreach ($port in $ports) {
    $connection = netstat -ano | findstr ":$port"
    if ($connection) {
        Write-Host "✅ Port $port is in use" -ForegroundColor Green
    } else {
        Write-Host "❌ Port $port is not in use" -ForegroundColor Red
    }
}

# Test Backend API (Port 5000)
Write-Host "`n🔧 Testing Backend API (Port 5000):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend API is responding: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend API is not responding: $($_.Exception.Message)" -ForegroundColor Red
}

# Test ML Model API (Port 8000)
Write-Host "`n🤖 Testing ML Model API (Port 8000):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ ML Model API is responding: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ ML Model API is not responding: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Frontend (Port 5173)
Write-Host "`n🌐 Testing Frontend (Port 5173):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173/" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend is responding: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend is not responding: $($_.Exception.Message)" -ForegroundColor Red
}

# Test communication between services
Write-Host "`n🔄 Testing Service Communication:" -ForegroundColor Yellow

# Test Backend to ML Model communication
Write-Host "`n📤 Backend -> ML Model:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/ml/status" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend can communicate with ML routes: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend ML routes not working: $($_.Exception.Message)" -ForegroundColor Red
}

# Test ML Model endpoints
Write-Host "`n🤖 ML Model Endpoints:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/docs" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ ML Model API docs accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ ML Model API docs not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 Test Complete!" -ForegroundColor Green
