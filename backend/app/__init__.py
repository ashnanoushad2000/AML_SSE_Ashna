from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os
from flask_session import Session
import pymysql

# Replace MySQLdb with PyMySQL
pymysql.install_as_MySQLdb()

# Initialize SQLAlchemy
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    # Configure Flask app
    app.config['SECRET_KEY'] = 'your-secret-key-here'
    app.config['JWT_SECRET_KEY'] = 'your-jwt-secret-key'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    
    # CORS Configuration
    app.config['CORS_HEADERS'] = 'Content-Type'
    CORS(app, 
         origins=["http://localhost:4200"],
         allow_credentials=True,
         supports_credentials=True,
         expose_headers=["Content-Type", "Authorization"],
         headers=['Content-Type', 'Authorization'])
    
    # Database configuration with PyMySQL and correct credentials
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:bibin9019@localhost/auth_db?charset=utf8mb4'
    app.config['SQLALCHEMY_BINDS'] = {
        'auth_db': 'mysql+pymysql://root:bibin9019@localhost/auth_db?charset=utf8mb4',
        'loan_db': 'mysql+pymysql://root:bibin9019@localhost/loan_db?charset=utf8mb4',
        'media_db': 'mysql+pymysql://root:bibin9019@localhost/media_db?charset=utf8mb4',
        'inventory_db': 'mysql+pymysql://root:bibin9019@localhost/inventory_db?charset=utf8mb4',
        'payment_db': 'mysql+pymysql://root:bibin9019@localhost/payment_db?charset=utf8mb4'
    }
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'connect_args': {
            'ssl': False
        }
    }
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Session configuration
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_COOKIE_SECURE'] = False
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

    # Initialize extensions
    db.init_app(app)
    JWTManager(app)
    Session(app)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.media import media_bp
    from app.routes.loans import loans_bp
    from app.routes.holds import holds_bp
    from app.routes.transfers import transfers_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(media_bp, url_prefix='/api/media')
    app.register_blueprint(loans_bp, url_prefix='/api/loans')
    app.register_blueprint(holds_bp, url_prefix='/api/holds')
    app.register_blueprint(transfers_bp, url_prefix='/api/transfers')

    return app

# Import models after db is defined
from app.models import Users, MediaItems, MediaCategories, Loans