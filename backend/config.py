from datetime import timedelta
import os
import secrets

class Config:
    # Basic Flask config
    SECRET_KEY = secrets.token_hex(32)
    DEBUG = True
    
    # Database config
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:ChessFun%402@localhost/auth_db'
    SQLALCHEMY_BINDS = {
        'media_db': 'mysql+pymysql://root:ChessFun%402@localhost/media_db'
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True

    # JWT config
    JWT_SECRET_KEY = secrets.token_hex(32)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Session Configuration
    SESSION_TYPE = 'filesystem'
    SESSION_FILE_DIR = os.path.join(os.getcwd(), 'flask_session')
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = timedelta(hours=1)
    
    # CORS Configuration
    CORS_HEADERS = ['Content-Type', 'Authorization']
    CORS_ORIGINS = ["http://localhost:4200"]
    CORS_SUPPORTS_CREDENTIALS = True

    def __init__(self):
        os.makedirs(self.SESSION_FILE_DIR, exist_ok=True)