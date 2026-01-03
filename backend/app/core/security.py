import time
from typing import Dict, List, Optional
from fastapi import Request, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from backend.app.core.logging import logger
from datetime import datetime

# ETHICAL AI & PRIVACY NOTICE:
# 1. No raw video or audio data is persisted. Only derived metadata (posture, distress level) is stored.
# 2. GDPR Compliance: Users can request data deletion. Metadata is anonymized where possible.
# 3. No facial recognition or identity tracking is implemented to prevent bias and surveillance abuse.
# 4. Audit logs track all access to safety-critical endpoints.

API_KEY_NAME = "X-SafeNet-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

class SecurityEnforcer:
    """
    Enforces security, privacy, and audit logging.
    """
    def __init__(self):
        self.audit_logs: List[Dict] = []
        self.rate_limits: Dict[str, List[float]] = {}
        # Mock valid keys for demo
        self.valid_api_keys = {"safenet_admin_2026", "safenet_guard_2026"}
        self.role_permissions = {
            "admin": ["analytics", "sos", "dispatch", "audit"],
            "guard": ["sos", "dispatch"],
            "student": ["sos"]
        }

    async def verify_api_key(self, api_key: str = Security(api_key_header)):
        if not api_key or api_key not in self.valid_api_keys:
            raise HTTPException(status_code=403, detail="Invalid or missing API Key")
        return api_key

    async def check_rate_limit(self, identifier: str, limit: int = 10, window: int = 60):
        now = time.time()
        if identifier not in self.rate_limits:
            self.rate_limits[identifier] = []
        
        # Clean old requests
        self.rate_limits[identifier] = [t for t in self.rate_limits[identifier] if now - t < window]
        
        if len(self.rate_limits[identifier]) >= limit:
            logger.warning(f"Rate limit exceeded for {identifier}")
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        
        self.rate_limits[identifier].append(now)

    def log_audit(self, user_id: str, action: str, resource: str, status: str):
        entry = {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "action": action,
            "resource": resource,
            "status": status
        }
        self.audit_logs.append(entry)
        logger.info(f"AUDIT: {user_id} | {action} | {resource} | {status}")

    async def enforce_rbac(self, api_key: str, required_permission: str):
        # Mock role mapping based on key suffix for demo
        role = "guard" if "guard" in api_key else "admin"
        if required_permission not in self.role_permissions.get(role, []):
            raise HTTPException(status_code=403, detail="Insufficient permissions")

security_enforcer = SecurityEnforcer()
