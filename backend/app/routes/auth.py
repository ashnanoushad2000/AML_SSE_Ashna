from flask import Blueprint, request, jsonify, session, current_app
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash
from app.models import Users, db
from datetime import timedelta, datetime
from functools import wraps
from uuid import uuid4
import re  # For SR1: password regex
from app.utils.logger import log_admin_action  # For SR3 Admin Activity Logging

auth_bp = Blueprint('auth', __name__)

# -------------------------------
# Session Validation Decorator
# -------------------------------
def validate_session(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('user_id'):
            return jsonify({'message': 'Session expired'}), 401

        if 'created_at' in session:
            age = datetime.now() - datetime.fromisoformat(session['created_at'])
            if age.total_seconds() > 1800:  # 30-minute timeout
                old_data = dict(session)
                session.clear()
                session.update(old_data)
                session['created_at'] = datetime.now().isoformat()

        return f(*args, **kwargs)
    return decorated_function

# -------------------------------
# DB Test Route
# -------------------------------
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
        return jsonify({'message': f'Database error: {str(e)}'}), 500

# -------------------------------
# Login Route with SR3 + SR4
# -------------------------------
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing email or password'}), 400

        user = Users.query.filter_by(email=data['email']).first()

        # SR4: Restrict admin login based on IP address
        trusted_ips = ['127.0.0.1', '::1', '10.67.198.10']
        request_ip = request.remote_addr

        if user and user.user_type == 'ADMIN' and request_ip not in trusted_ips:
            return jsonify({'message': f'Admin login not allowed from IP: {request_ip}'}), 403

        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'message': 'Invalid email or password'}), 401

        # Create JWT
        access_token = create_access_token(identity=user.user_id, expires_delta=timedelta(hours=1))

        # Save session
        session.clear()
        session['user_id'] = user.user_id
        session['user_type'] = user.user_type
        session['email'] = user.email
        session['created_at'] = datetime.now().isoformat()
        session['last_activity'] = datetime.now().isoformat()
        session.permanent = True

        # SR3: Log admin login
        if user.user_type == 'ADMIN':
            log_admin_action(
                admin_id=user.user_id,
                action='Admin Login',
                details=f"Admin {user.email} logged in from IP {request_ip}"
            )

        return jsonify({
            'access_token': access_token,
            'user_type': user.user_type,
            'user_id': user.user_id,
            'first_name': user.first_name
        }), 200

    except Exception as e:
        print("Login error:", str(e))
        return jsonify({'message': f'Error during login: {str(e)}'}), 500

# -------------------------------
# Session Check
# -------------------------------
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

# -------------------------------
# Logout
# -------------------------------
@auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({'message': 'Logged out successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Logout error'}), 500

# -------------------------------
# Validate JWT Token
# -------------------------------
@auth_bp.route('/validate', methods=['GET'])
@validate_session
def validate_token():
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
        return jsonify({"message": f"Error during validation: {str(e)}"}), 500

# -------------------------------
# Email Exists Check
# -------------------------------
@auth_bp.route('/register/check-email', methods=['POST'])
def check_email():
    try:
        data = request.get_json()
        if not data or not data.get('email'):
            return jsonify({'message': 'Email is required'}), 400

        user = Users.query.filter_by(email=data['email']).first()
        return jsonify({'exists': bool(user)}), 200

    except Exception as e:
        return jsonify({'message': f'Error checking email: {str(e)}'}), 500

# -------------------------------
# User Registration with SR1
# -------------------------------
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        required_fields = ['email', 'password', 'first_name', 'last_name', 'date_of_birth', 'address', 'post_code']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'Missing required field: {field}'}), 400

        if Users.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already registered'}), 400

        # SR1: Strong password validation
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$'
        if not re.match(pattern, data['password']):
            return jsonify({'message': 'Password must include uppercase, lowercase, digit, and special character.'}), 400

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
        return jsonify({'message': 'Registration successful', 'user_id': new_user.user_id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error during registration: {str(e)}'}), 500

# -------------------------------
# Change Password
# -------------------------------
@auth_bp.route('/profile/<user_id>/password', methods=['PUT'])
@validate_session
def change_password(user_id):
    try:
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

        if not check_password_hash(user.password_hash, current_password):
            return jsonify({'message': 'Current password is incorrect'}), 401

        user.password_hash = generate_password_hash(new_password)
        db.session.commit()

        return jsonify({'message': 'Password changed successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error changing password: {str(e)}'}), 500
