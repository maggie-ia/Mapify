from app.extensions import cache

def verify_sms_code(phone_number, code):
    stored_code = cache.get(f"sms_code_{phone_number}")
    if stored_code and stored_code == code:
        cache.delete(f"sms_code_{phone_number}")
        return True
    return False