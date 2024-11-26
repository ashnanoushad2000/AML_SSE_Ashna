from flask import Flask, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_session import Session
from config import Config
from sqlalchemy import text
from datetime import datetime

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
    
    # Configure CORS
    CORS(app, 
         resources={
             r"/api/*": {
                 "origins": app.config['CORS_ORIGINS'],
                 "supports_credentials": True,
                 "allow_headers": app.config['CORS_HEADERS']
             }
         })
    
    # Session activity tracker
    @app.before_request
    def before_request():
        if 'user_id' in session:
            session['last_activity'] = datetime.now().isoformat()
            if 'created_at' not in session:
                session['created_at'] = datetime.now().isoformat()

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
    
    # Register blueprints
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    return app

# Import models after db is defined
from app.models import Users, MediaItems, MediaCategories, Loans