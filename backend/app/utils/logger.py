# backend/app/utils/logger.py
from app.models import db
from app.models.activity_log import ActivityLog
from datetime import datetime

def log_admin_action(admin_id, action, details=None):
    log = ActivityLog(
        admin_id=admin_id,
        action=action,
        details=details,
        timestamp=datetime.utcnow()
    )
    db.session.add(log)
    db.session.commit()
