from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Loans, db
from sqlalchemy.exc import SQLAlchemyError
import logging
from datetime import datetime, timedelta
from uuid import uuid4

# First, create the Blueprint
loans_bp = Blueprint('loans', __name__)

@loans_bp.route('/user/<user_id>/active', methods=['GET'])
@jwt_required()
def get_user_active_loans(user_id):
    """Fetch all active loans for a specific user"""
    print(f"\n=== GET /user/{user_id}/active ===")
    print(f"Headers: {dict(request.headers)}")
    try:
        current_user = get_jwt_identity()
        print(f"JWT User: {current_user}, Requested User: {user_id}")

        if current_user != user_id:
            print(f"Unauthorized: JWT user {current_user} tried to access loans for {user_id}")
            return jsonify({'message': 'Unauthorized access'}), 403

        active_loans = Loans.query.filter_by(
            user_id=user_id,
            status='ACTIVE'
        ).all()

        print(f"Found {len(active_loans)} active loans for user {user_id}")
        for loan in active_loans:
            print(f"Loan: {loan.loan_id}, Media: {loan.media_id}, Status: {loan.status}")

        return jsonify([{
            'loan_id': loan.loan_id,
            'media_id': loan.media_id,
            'issue_date': loan.issue_date.isoformat(),
            'due_date': loan.due_date.isoformat(),
            'status': loan.status,
            'renewals_count': loan.renewals_count
        } for loan in active_loans]), 200

    except Exception as e:
        print(f"Error in get_user_active_loans: {str(e)}")
        logging.error(f"Error fetching active loans: {str(e)}")
        return jsonify({'message': f"Error fetching active loans: {str(e)}"}), 500

@loans_bp.route('/user/<user_id>/all', methods=['GET'])
@jwt_required()
def get_user_all_loans(user_id):
    """Fetch all loans for a specific user"""
    print(f"\n=== GET /user/{user_id}/all ===")
    print(f"Headers: {dict(request.headers)}")
    try:
        current_user = get_jwt_identity()
        print(f"JWT User: {current_user}, Requested User: {user_id}")
        
        if current_user != user_id:
            print(f"Unauthorized: JWT user {current_user} tried to access all loans for {user_id}")
            return jsonify({'message': 'Unauthorized access'}), 403
            
        all_loans = Loans.query.filter_by(user_id=user_id).all()
        print(f"Found {len(all_loans)} total loans for user {user_id}")
        
        return jsonify([{
            'loan_id': loan.loan_id,
            'media_id': loan.media_id,
            'issue_date': loan.issue_date.isoformat(),
            'due_date': loan.due_date.isoformat(),
            'return_date': loan.return_date.isoformat() if loan.return_date else None,
            'status': loan.status,
            'renewals_count': loan.renewals_count
        } for loan in all_loans]), 200

    except Exception as e:
        print(f"Error in get_user_all_loans: {str(e)}")
        logging.error(f"Error fetching all loans: {str(e)}")
        return jsonify({'message': f"Error fetching all loans: {str(e)}"}), 500

@loans_bp.route('/create', methods=['POST'])
@jwt_required()
def create_loan():
    """Create a new loan"""
    print("\n=== POST /create ===")
    print(f"Headers: {dict(request.headers)}")
    try:
        data = request.json
        print(f"Request data: {data}")
        
        current_user = get_jwt_identity()
        print(f"JWT User: {current_user}, Requested User: {data.get('user_id')}")
        
        if current_user != data.get('user_id'):
            print(f"Unauthorized: JWT user {current_user} tried to create loan for {data.get('user_id')}")
            return jsonify({'message': 'Unauthorized access'}), 403
        
        new_loan = Loans(
            loan_id=str(uuid4()),
            user_id=data['user_id'],
            media_id=data['media_id'],
            issue_date=datetime.utcnow(),
            due_date=datetime.utcnow() + timedelta(days=14),
            status='ACTIVE'
        )
        
        db.session.add(new_loan)
        db.session.commit()
        print(f"Created new loan: {new_loan.loan_id}")
        
        return jsonify({
            'message': 'Loan created successfully',
            'loan_id': new_loan.loan_id
        }), 201

    except Exception as e:
        print(f"Error in create_loan: {str(e)}")
        db.session.rollback()
        logging.error(f"Error creating loan: {str(e)}")
        return jsonify({'message': f"Error creating loan: {str(e)}"}), 500

@loans_bp.route('/<loan_id>/renew', methods=['PUT'])
@jwt_required()
def renew_loan(loan_id):
    """Renew a loan by extending its due date"""
    print(f"\n=== PUT /{loan_id}/renew ===")
    print(f"Headers: {dict(request.headers)}")
    try:
        # Get current user from JWT token
        current_user = get_jwt_identity()
        
        # Find the loan
        loan = Loans.query.filter_by(loan_id=loan_id).first()
        if not loan:
            print(f"Loan not found: {loan_id}")
            return jsonify({'message': 'Loan not found'}), 404
            
        # Verify loan belongs to current user
        if current_user != loan.user_id:
            print(f"Unauthorized: JWT user {current_user} tried to renew loan {loan_id}")
            return jsonify({'message': 'Unauthorized access'}), 403
            
        # Check if loan can be renewed
        if loan.status != 'ACTIVE':
            return jsonify({'message': 'Only active loans can be renewed'}), 400
            
        if loan.renewals_count >= 3:
            return jsonify({'message': 'Maximum number of renewals reached'}), 400

        # Extend due date by 10 days and increment renewal count
        loan.due_date = loan.due_date + timedelta(days=10)
        loan.renewals_count += 1
        
        # Update the database
        db.session.commit()
        print(f"Loan {loan_id} renewed successfully. New due date: {loan.due_date}")
        
        return jsonify({
            'message': 'Loan renewed successfully',
            'new_due_date': loan.due_date.isoformat(),
            'renewals_count': loan.renewals_count
        }), 200

    except Exception as e:
        print(f"Error in renew_loan: {str(e)}")
        db.session.rollback()
        logging.error(f"Error renewing loan: {str(e)}")
        return jsonify({'message': f"Error renewing loan: {str(e)}"}), 500