# app/models/activity_log.py
from app.models import db
from datetime import datetime
from uuid import uuid4

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'

    log_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    admin_id = db.Column(db.String(36), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    details = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
