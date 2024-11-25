from flask import Flask, jsonify  
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from sqlalchemy import text  # Add this import

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)
    jwt.init_app(app)
    
    # Test route for database connection
    @app.route('/test-db')
    def test_db():
        try:
            # Try to query the database - wrapped in text()
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