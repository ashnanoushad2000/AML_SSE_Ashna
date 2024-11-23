from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from app.models import Users, db

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
        
        access_token = create_access_token(identity=user.user_id)
        
        return jsonify({
            'access_token': access_token,
            'user_type': user.user_type,
            'user_id': user.user_id,
            'full_name': user.full_name
        }), 200
        
    except Exception as e:
        print("Login error:", str(e))  # Log the error (remove in production)
        return jsonify({'message': f'Error during login: {str(e)}'}), 500