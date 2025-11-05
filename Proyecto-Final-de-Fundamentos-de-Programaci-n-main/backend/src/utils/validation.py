"""
Validation utilities for reservation data.
"""

from datetime import datetime, timezone
from typing import Dict, Optional

def validate_reservation_data(data: Dict) -> Optional[str]:
    """
    Validate reservation data.
    Returns error message if invalid, None if valid.
    """
    if not data:
        return 'Request body is required'
    
    required_fields = ['roomId', 'userId', 'start', 'end']
    for field in required_fields:
        if field not in data:
            return f'{field} is required'
    
    # Validate datetimes
    start_str = data.get('start')
    end_str = data.get('end')
    
    try:
        start_dt = datetime.fromisoformat(start_str.replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(end_str.replace('Z', '+00:00'))
    except (ValueError, AttributeError):
        return 'Invalid datetime format. Use ISO 8601 format (e.g., 2024-01-15T10:00:00Z)'
    
    # Ensure UTC
    if start_dt.tzinfo is None:
        start_dt = start_dt.replace(tzinfo=timezone.utc)
    if end_dt.tzinfo is None:
        end_dt = end_dt.replace(tzinfo=timezone.utc)
    
    # Validate start < end
    if start_dt >= end_dt:
        return 'Start time must be before end time'
    
    return None

def validate_datetime(dt_str: str) -> Optional[datetime]:
    """
    Validate and parse datetime string.
    Returns datetime object if valid, None otherwise.
    """
    try:
        dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except (ValueError, AttributeError):
        return None


