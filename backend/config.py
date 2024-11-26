from datetime import timedelta
import os

class Config:
    # Basic Flask config
    SECRET_KEY = 'dev-secret-key'
    DEBUG = True
    
    # Database config
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:bibin9019@localhost/myaml'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT config
    JWT_SECRET_KEY = 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Session config (new)
    SESSION_TYPE = 'filesystem'
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = timedelta(hours=1)
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # CORS config
    CORS_HEADERS = 'Content-Type'
    CORS_ORIGIN_ALLOW_ALL = True
    CORS_ALLOW_CREDENTIALS = True
    CORS_SUPPORTS_CREDENTIALS = True

    def __init__(self):
        self.SECRET_KEY = os.environ.get('SECRET_KEY', self.SECRET_KEY)
        self.JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', self.JWT_SECRET_KEY)
        self.SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', self.SQLALCHEMY_DATABASE_URI)