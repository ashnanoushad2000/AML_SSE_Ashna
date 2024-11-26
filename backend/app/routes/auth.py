from flask import Blueprint, request, jsonify, session, current_app
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from app.models import Users, db
from datetime import timedelta, datetime
from functools import wraps

auth_bp = Blueprint('auth', __name__)

# Session validation decorator
def validate_session(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('user_id'):
            return jsonify({'message': 'Session expired'}), 401
        
        # Check session age
        if 'created_at' in session:
            age = datetime.now() - datetime.fromisoformat(session['created_at'])
            if age.total_seconds() > 1800:  # 30 minutes
                # Rotate session
                old_data = dict(session)
                session.clear()
                session.update(old_data)
                session['created_at'] = datetime.now().isoformat()
        
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/test', methods=['GET'])
def test():
    try:
        user = Users.query.first()
        if user:
            return jsonify({
                'message': 'Database connection successful',
                'status': 'success',
                'test_user_email': user.email
            })
        return jsonify({
            'message': 'Database connected but no users found',
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'message': f'Database error: {str(e)}',
            'status': 'error'
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Login attempt for email:", data.get('email'))
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing email or password'}), 400
        
        user = Users.query.filter_by(email=data['email']).first()
        print("User found:", bool(user))
        
        if user:
            print("Stored hash:", user.password_hash)
            print("Incoming password:", data['password'])
        
        if not user or (user.password_hash != data['password'] and 
                       not check_password_hash(user.password_hash, data['password'])):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Create JWT token
        access_token = create_access_token(
            identity=user.user_id,
            expires_delta=timedelta(hours=1)
        )
        
        # Set session data
        session.clear()  # Clear any existing session
        session['user_id'] = user.user_id
        session['user_type'] = user.user_type
        session['email'] = user.email
        session['created_at'] = datetime.now().isoformat()
        session['last_activity'] = datetime.now().isoformat()
        session.permanent = True
        
        return jsonify({
            'access_token': access_token,
            'user_type': user.user_type,
            'user_id': user.user_id,
            'full_name': user.full_name
        }), 200
        
    except Exception as e:
        print("Login error:", str(e))
        return jsonify({'message': f'Error during login: {str(e)}'}), 500

@auth_bp.route('/session-check', methods=['GET'])
@validate_session
def check_session():
    try:
        return jsonify({
            'user_id': session.get('user_id'),
            'user_type': session.get('user_type'),
            'email': session.get('email'),
            'created_at': session.get('created_at'),
            'last_activity': session.get('last_activity'),
            'is_permanent': session.permanent,
            'cookie_config': {
                'secure': current_app.config['SESSION_COOKIE_SECURE'],
                'httponly': current_app.config['SESSION_COOKIE_HTTPONLY'],
                'samesite': current_app.config['SESSION_COOKIE_SAMESITE']
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({'message': 'Logged out successfully'}), 200
    except Exception as e:
        print("Logout error:", str(e))
        return jsonify({'message': 'Logout error'}), 500