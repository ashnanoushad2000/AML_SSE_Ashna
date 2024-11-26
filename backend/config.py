from datetime import timedelta
import os
import secrets

class Config:
    # Basic Flask config
    SECRET_KEY = secrets.token_hex(32)
    DEBUG = True
    
    # Database config
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:bibin9019@localhost/myaml'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT config
    JWT_SECRET_KEY = secrets.token_hex(32)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Enhanced Session Configuration
    SESSION_TYPE = 'filesystem'
    SESSION_FILE_DIR = os.path.join(os.getcwd(), 'flask_session')
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = timedelta(hours=1)
    
    # Enhanced Cookie Security
    SESSION_COOKIE_NAME = 'aml_session'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_PATH = '/'
    SESSION_COOKIE_DOMAIN = 'localhost'  # Update in production
    
    # CORS Configuration
    CORS_HEADERS = ['Content-Type', 'Authorization']
    CORS_ORIGINS = ["http://localhost:4200"]
    CORS_SUPPORTS_CREDENTIALS = True
    CORS_ALLOW_CREDENTIALS = True

    def __init__(self):
        # Create session directory
        os.makedirs(self.SESSION_FILE_DIR, exist_ok=True)
        
        # Override with environment variables if available
        self.SECRET_KEY = os.environ.get('SECRET_KEY', self.SECRET_KEY)
        self.JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', self.JWT_SECRET_KEY)
        self.SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', self.SQLALCHEMY_DATABASE_URI)
        self.SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'False').lower() == 'true'