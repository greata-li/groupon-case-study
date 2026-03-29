.PHONY: dev backend frontend install

# Run both servers concurrently
dev: backend frontend

# Start backend (FastAPI with hot-reload)
backend:
	cd backend && source venv/Scripts/activate && uvicorn main:app --reload --port 8000 &

# Start frontend (Vite dev server)
frontend:
	cd frontend && npm run dev &

# Install all dependencies
install:
	cd backend && python -m venv venv && source venv/Scripts/activate && pip install -r requirements.txt
	cd frontend && npm install

# Stop all dev servers
stop:
	taskkill //F //IM "uvicorn*" 2>/dev/null || true
	taskkill //F //IM "node*" 2>/dev/null || true
