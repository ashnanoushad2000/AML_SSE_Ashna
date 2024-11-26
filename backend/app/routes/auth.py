from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from app.models import Users, db
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

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
        
        # Log incoming request data (remove in production)
        print("Login attempt for email:", data.get('email'))
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing email or password'}), 400
        
        user = Users.query.filter_by(email=data['email']).first()
        
        # Log user lookup result (remove in production)
        print("User found:", bool(user))
        
        # Temporary: Log password comparison for debugging
        if user:
            print("Stored hash:", user.password_hash)
            print("Incoming password:", data['password'])
        
        # For testing: accept plain text comparison temporarily
        if not user or (user.password_hash != data['password'] and 
                       not check_password_hash(user.password_hash, data['password'])):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        access_token = create_access_token(
            identity=user.user_id,
            expires_delta=timedelta(hours=1)
        )
        
        # Add session management
        session['user_id'] = user.user_id
        session['user_type'] = user.user_type
        session['email'] = user.email
        session.permanent = True
        
        return jsonify({
            'access_token': access_token,
            'user_type': user.user_type,
            'user_id': user.user_id,
            'full_name': user.full_name
        }), 200
        
    except Exception as e:
        print("Login error:", str(e))  # Log the error (remove in production)
        return jsonify({'message': f'Error during login: {str(e)}'}), 500

@auth_bp.route('/validate', methods=['GET'])
def validate_session():
    try:
        if 'user_id' not in session:
            return jsonify({'message': 'Session invalid'}), 401
            
        user = Users.query.get(session['user_id'])
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        return jsonify({
            'user_id': user.user_id,
            'full_name': user.full_name,
            'user_type': user.user_type
        }), 200
    except Exception as e:
        print("Validation error:", str(e))
        return jsonify({'message': 'Session validation error'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({'message': 'Logged out successfully'}), 200
    except Exception as e:
        print("Logout error:", str(e))
        return jsonify({'message': 'Logout error'}), 500