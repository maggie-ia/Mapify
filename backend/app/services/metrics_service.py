from app import db
from app.models.usage_history import UsageHistory
from sqlalchemy import func
from datetime import datetime, timedelta

def log_metric(user_id, metric_type, value=1):
    new_metric = UsageHistory(user_id=user_id, operation_type=metric_type, details=str(value))
    db.session.add(new_metric)
    db.session.commit()

def get_user_metrics(user_id, days=30):
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    metrics = db.session.query(
        UsageHistory.operation_type,
        func.count(UsageHistory.id).label('count')
    ).filter(
        UsageHistory.user_id == user_id,
        UsageHistory.timestamp >= start_date,
        UsageHistory.timestamp <= end_date
    ).group_by(UsageHistory.operation_type).all()
    
    return {metric.operation_type: metric.count for metric in metrics}

def get_system_metrics(days=30):
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    metrics = db.session.query(
        UsageHistory.operation_type,
        func.count(UsageHistory.id).label('count')
    ).filter(
        UsageHistory.timestamp >= start_date,
        UsageHistory.timestamp <= end_date
    ).group_by(UsageHistory.operation_type).all()
    
    return {metric.operation_type: metric.count for metric in metrics}