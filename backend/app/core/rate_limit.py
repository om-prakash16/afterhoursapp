import time
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.ip_cache = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Skip for health checks or non-API routes if needed
        if not request.url.path.startswith("/api"):
            return await call_next(request)

        client_ip = request.client.host
        current_time = time.time()
        
        # Clean up old timestamps
        self.ip_cache[client_ip] = [
            t for t in self.ip_cache[client_ip] 
            if current_time - t < 60
        ]
        
        if len(self.ip_cache[client_ip]) >= self.requests_per_minute:
            raise HTTPException(status_code=429, detail="Too many neural requests. Calm your mind and try again in a minute.")
            
        self.ip_cache[client_ip].append(current_time)
        
        response = await call_next(request)
        return response
