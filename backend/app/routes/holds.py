from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Holds, db
from sqlalchemy.exc import SQLAlchemyError
import logging
from datetime import datetime
from uuid import uuid4

# First, create the Blueprint
holds_bp = Blueprint('holds', __name__)

def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@holds_bp.route('/', methods=['OPTIONS'])
def options_holds():
    """CORS preflight handler for all hold routes"""
    print("OPTIONS request received for /holds")
    response = jsonify({'message': 'CORS preflight successful'})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response, 200

# All other route handlers below
@holds_bp.route('/user/<user_id>', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_user_holds(user_id):
    """Fetch all holds for a specific user"""
    if request.method == 'OPTIONS':
        print(f"OPTIONS request received for /user/{user_id}")
        response = jsonify({'message': 'CORS preflight successful'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

    print(f"\n=== GET /user/{user_id} ===")
    print(f"Headers: {dict(request.headers)}")
    try:
        current_user = get_jwt_identity()
        print(f"JWT User: {current_user}, Requested User: {user_id}")

        if current_user != user_id:
            print(f"Unauthorized: JWT user {current_user} tried to access holds for {user_id}")
            response = jsonify({'message': 'Unauthorized access'})
            return add_cors_headers(response), 403

        user_holds = Holds.query.filter_by(user_id=user_id).all()
        print(f"Found {len(user_holds)} holds for user {user_id}")

        response = jsonify([{
            'hold_id': hold.hold_id,
            'media_id': hold.media_id,
            'request_date': hold.request_date.isoformat(),
            'status': hold.status,
            'notification_sent': hold.notification_sent
        } for hold in user_holds])
        print("Successfully prepared response")
        return add_cors_headers(response), 200

    except Exception as e:
        print(f"Error in get_user_holds: {str(e)}")
        logging.error(f"Error fetching holds: {str(e)}")
        response = jsonify({'message': f"Error fetching holds: {str(e)}"})
        return add_cors_headers(response), 500

@holds_bp.route('/create', methods=['POST'])
@jwt_required()
def create_hold():
    """Create a new hold"""
    print("\n=== POST /create ===")
    print(f"Headers: {dict(request.headers)}")
    try:
        data = request.json
        print(f"Request data: {data}")
        
        current_user = get_jwt_identity()
        print(f"JWT User: {current_user}, Requested User: {data.get('user_id')}")
        
        if current_user != data.get('user_id'):
            print(f"Unauthorized: JWT user {current_user} tried to create hold for {data.get('user_id')}")
            response = jsonify({'message': 'Unauthorized access'})
            return add_cors_headers(response), 403
        
        # Check if user already has a hold for this media
        existing_hold = Holds.query.filter_by(
            user_id=data['user_id'],
            media_id=data['media_id'],
            status='PENDING'
        ).first()
        
        if existing_hold:
            print(f"Hold already exists for user {data['user_id']} on media {data['media_id']}")
            response = jsonify({'message': 'Hold already exists for this item'})
            return add_cors_headers(response), 400
        
        new_hold = Holds(
            hold_id=str(uuid4()),
            user_id=data['user_id'],
            media_id=data['media_id'],
            request_date=datetime.utcnow(),
            status='PENDING'
        )
        
        db.session.add(new_hold)
        db.session.commit()
        print(f"Created new hold: {new_hold.hold_id}")
        
        response = jsonify({
            'message': 'Hold created successfully',
            'hold_id': new_hold.hold_id
        })
        return add_cors_headers(response), 201

    except Exception as e:
        print(f"Error in create_hold: {str(e)}")
        db.session.rollback()
        logging.error(f"Error creating hold: {str(e)}")
        response = jsonify({'message': f"Error creating hold: {str(e)}"})
        return add_cors_headers(response), 500

@holds_bp.route('/<hold_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_hold(hold_id):
    """Cancel a hold"""
    print(f"\n=== PUT /{hold_id}/cancel ===")
    print(f"Headers: {dict(request.headers)}")
    try:
        hold = Holds.query.get(hold_id)
        if not hold:
            print(f"Hold not found: {hold_id}")
            response = jsonify({'message': 'Hold not found'})
            return add_cors_headers(response), 404
            
        current_user = get_jwt_identity()
        print(f"JWT User: {current_user}, Hold User: {hold.user_id}")
        
        if current_user != hold.user_id:
            print(f"Unauthorized: JWT user {current_user} tried to cancel hold {hold_id}")
            response = jsonify({'message': 'Unauthorized access'})
            return add_cors_headers(response), 403
            
        hold.status = 'CANCELLED'
        db.session.commit()
        print(f"Hold {hold_id} cancelled successfully")
        
        response = jsonify({'message': 'Hold cancelled successfully'})
        return add_cors_headers(response), 200

    except Exception as e:
        print(f"Error in cancel_hold: {str(e)}")
        db.session.rollback()
        logging.error(f"Error cancelling hold: {str(e)}")
        response = jsonify({'message': f"Error cancelling hold: {str(e)}"})
        return add_cors_headers(response), 500

@holds_bp.route('/<hold_id>/ready', methods=['PUT'])
@jwt_required()
def mark_hold_ready(hold_id):
    """Mark a hold as ready for pickup"""
    print(f"\n=== PUT /{hold_id}/ready ===")
    print(f"Headers: {dict(request.headers)}")
    try:
        hold = Holds.query.get(hold_id)
        if not hold:
            print(f"Hold not found: {hold_id}")
            response = jsonify({'message': 'Hold not found'})
            return add_cors_headers(response), 404
            
        current_user = get_jwt_identity()
        print(f"JWT User: {current_user}, Hold User: {hold.user_id}")
        
        if current_user != hold.user_id:
            print(f"Unauthorized: JWT user {current_user} tried to mark hold {hold_id} as ready")
            response = jsonify({'message': 'Unauthorized access'})
            return add_cors_headers(response), 403
            
        hold.status = 'READY'
        hold.notification_sent = True
        db.session.commit()
        print(f"Hold {hold_id} marked as ready")
        
        response = jsonify({'message': 'Hold marked as ready'})
        return add_cors_headers(response), 200

    except Exception as e:
        print(f"Error in mark_hold_ready: {str(e)}")
        db.session.rollback()
        logging.error(f"Error updating hold: {str(e)}")
        response = jsonify({'message': f"Error updating hold: {str(e)}"})
        return add_cors_headers(response), 500

@holds_bp.route('/<hold_id>/fulfill', methods=['PUT'])
@jwt_required()
def fulfill_hold(hold_id):
    """Mark a hold as fulfilled (when item is checked out)"""
    print(f"\n=== PUT /{hold_id}/fulfill ===")
    print(f"Headers: {dict(request.headers)}")
    try:
        hold = Holds.query.get(hold_id)
        if not hold:
            print(f"Hold not found: {hold_id}")
            response = jsonify({'message': 'Hold not found'})
            return add_cors_headers(response), 404
            
        current_user = get_jwt_identity()
        print(f"JWT User: {current_user}, Hold User: {hold.user_id}")
        
        if current_user != hold.user_id:
            print(f"Unauthorized: JWT user {current_user} tried to fulfill hold {hold_id}")
            response = jsonify({'message': 'Unauthorized access'})
            return add_cors_headers(response), 403
            
        hold.status = 'FULFILLED'
        db.session.commit()
        print(f"Hold {hold_id} fulfilled successfully")
        
        response = jsonify({'message': 'Hold fulfilled successfully'})
        return add_cors_headers(response), 200

    except Exception as e:
        print(f"Error in fulfill_hold: {str(e)}")
        db.session.rollback()
        logging.error(f"Error fulfilling hold: {str(e)}")
        response = jsonify({'message': f"Error fulfilling hold: {str(e)}"})
        return add_cors_headers(response), 500