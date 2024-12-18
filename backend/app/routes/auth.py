from flask import Blueprint, request, jsonify, session, current_app
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash
from app.models import Users, db
from datetime import timedelta, datetime
from functools import wraps
from uuid import uuid4

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
            'first_name': user.first_name
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
    
@auth_bp.route('/validate', methods=['GET'])
@validate_session
def validate_token():
    """
    Validate the token and optionally return user details.
    """
    try:
        include_user = request.args.get('include_user', 'false').lower() == 'true'
        response = {"message": "Validation successful"}

        if include_user:
            user_id = session.get('user_id')
            user = Users.query.filter_by(user_id=user_id).first()
            if not user:
                return jsonify({"message": "User not found"}), 404
            response.update({
                "first_name": user.first_name,
                "last_name": user.last_name
            })

        return jsonify(response), 200

    except Exception as e:
        print("Error during validation:", str(e))
        return jsonify({"message": f"Error during validation: {str(e)}"}), 500

@auth_bp.route('/register/check-email', methods=['POST'])
def check_email():
    """
    Check if an email already exists in the database
    """
    try:
        data = request.get_json()
        print("Checking email existence for:", data.get('email'))
        
        if not data or not data.get('email'):
            return jsonify({'message': 'Email is required'}), 400
            
        user = Users.query.filter_by(email=data['email']).first()
        print("Email exists:", bool(user))
        
        return jsonify({'exists': bool(user)}), 200
        
    except Exception as e:
        print("Email check error:", str(e))
        return jsonify({'message': f'Error checking email: {str(e)}'}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user
    """
    try:
        data = request.get_json()
        print("Registration attempt for email:", data.get('email'))
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 
                         'date_of_birth', 'address', 'post_code']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'Missing required field: {field}'}), 400
        
        # Check if user already exists
        existing_user = Users.query.filter_by(email=data['email']).first()
        if existing_user:
            print("User already exists with email:", data['email'])
            return jsonify({'message': 'Email already registered'}), 400
            
        # Create new user
        try:
            new_user = Users(
                user_id=str(uuid4()),
                email=data['email'],
                password_hash=generate_password_hash(data['password']),
                first_name=data['first_name'],
                last_name=data['last_name'],
                date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date(),
                address=data['address'],
                post_code=data['post_code'],
                user_type='MEMBER',
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            db.session.add(new_user)
            db.session.commit()
            print("Successfully registered user:", new_user.email)
            
            return jsonify({
                'message': 'Registration successful',
                'user_id': new_user.user_id
            }), 201
            
        except ValueError as ve:
            print("Validation error during user creation:", str(ve))
            return jsonify({'message': f'Invalid data format: {str(ve)}'}), 400
            
    except Exception as e:
        db.session.rollback()
        print("Registration error:", str(e))
        return jsonify({'message': f'Error during registration: {str(e)}'}), 500

@auth_bp.route('/profile/<user_id>/password', methods=['PUT'])
@validate_session
def change_password(user_id):
    """Change user password"""
    try:
        # Verify the requesting user matches the profile being updated
        current_user_id = session.get('user_id')
        if current_user_id != user_id:
            return jsonify({'message': 'Unauthorized access'}), 403

        user = Users.query.filter_by(user_id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404

        data = request.get_json()
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        if not current_password or not new_password:
            return jsonify({'message': 'Current and new password are required'}), 400

        # Modified password verification to handle both plain text and hashed passwords
        if user.password_hash != current_password and not check_password_hash(user.password_hash, current_password):
            print("Password verification failed for user:", user_id)
            return jsonify({'message': 'Current password is incorrect'}), 401

        # Update password (always hash the new password)
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()

        return jsonify({'message': 'Password changed successfully'}), 200

    except Exception as e:
        db.session.rollback()
        print("Error changing password:", str(e))
        return jsonify({'message': f'Error changing password: {str(e)}'}), 500