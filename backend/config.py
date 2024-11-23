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
    
    # CORS config
    CORS_HEADERS = 'Content-Type'
    CORS_ORIGIN_ALLOW_ALL = True  # For development - restrict in production
    CORS_ALLOW_CREDENTIALS = True

    # You can manually override these settings with environment variables if needed
    def __init__(self):
        self.SECRET_KEY = os.environ.get('SECRET_KEY', self.SECRET_KEY)
        self.JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', self.JWT_SECRET_KEY)
        self.SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', self.SQLALCHEMY_DATABASE_URI)