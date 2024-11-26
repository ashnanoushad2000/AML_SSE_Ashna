from flask import Flask, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_session import Session
from config import Config
from sqlalchemy import text

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Initialize Session
    Session(app)
    
    # Configure CORS with simpler setup
    CORS(app, supports_credentials=True)
    
    # Test route for database connection
    @app.route('/test-db')
    def test_db():
        try:
            db.session.execute(text('SELECT 1'))
            return jsonify({
                'message': 'Database connection successful!',
                'status': 'success',
                'database_url': app.config['SQLALCHEMY_DATABASE_URI']
            })
        except Exception as e:
            return jsonify({
                'message': f'Database connection failed: {str(e)}',
                'status': 'error'
            }), 500
    
    # Register blueprints with the original prefix
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    return app

# Import models after db is defined
from app.models import Users, MediaItems, MediaCategories, Loans