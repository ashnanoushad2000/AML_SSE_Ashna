from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Users, db
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy.exc import SQLAlchemyError
import logging

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile/<user_id>', methods=['GET'])
@jwt_required()
def get_profile(user_id):
    """Fetch user profile information"""
    try:
        # Verify the requesting user matches the profile being accessed
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({'message': 'Unauthorized access'}), 403

        user = Users.query.filter_by(user_id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'address': user.address,
            'post_code': user.post_code,
            'phone': user.phone
        }), 200

    except Exception as e:
        logging.error(f"Error fetching profile: {str(e)}")
        return jsonify({'message': 'Error fetching profile'}), 500

@profile_bp.route('/profile/<user_id>', methods=['PUT'])
@jwt_required()
def update_profile(user_id):
    """Update user profile information"""
    try:
        # Verify the requesting user matches the profile being updated
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({'message': 'Unauthorized access'}), 403

        user = Users.query.filter_by(user_id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404

        data = request.json
        
        # Update only the fields that are provided
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            # Check if email is already taken by another user
            existing_user = Users.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.user_id != user_id:
                return jsonify({'message': 'Email already in use'}), 400
            user.email = data['email']
        if 'address' in data:
            user.address = data['address']
        if 'post_code' in data:
            user.post_code = data['post_code']
        if 'phone' in data:
            user.phone = data['phone']

        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"Database error updating profile: {str(e)}")
        return jsonify({'message': 'Database error occurred'}), 500
    except Exception as e:
        logging.error(f"Error updating profile: {str(e)}")
        return jsonify({'message': 'Error updating profile'}), 500

@profile_bp.route('/profile/<user_id>/password', methods=['PUT'])
@jwt_required()
def change_password(user_id):
    """Change user password"""
    try:
        # Verify the requesting user matches the profile being updated
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({'message': 'Unauthorized access'}), 403

        user = Users.query.filter_by(user_id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404

        data = request.json
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        if not current_password or not new_password:
            return jsonify({'message': 'Current and new password are required'}), 400

        # Verify current password
        if not check_password_hash(user.password_hash, current_password):
            return jsonify({'message': 'Current password is incorrect'}), 401

        # Update password
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()

        return jsonify({'message': 'Password changed successfully'}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"Database error changing password: {str(e)}")
        return jsonify({'message': 'Database error occurred'}), 500
    except Exception as e:
        logging.error(f"Error changing password: {str(e)}")
        return jsonify({'message': 'Error changing password'}), 500