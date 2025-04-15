# from flask import Blueprint, jsonify, request
# from sqlalchemy.sql import text
# from app.models import db

# payments_bp = Blueprint('payments', __name__)

# # Fetch all payments and calculate the total for a user
# @payments_bp.route('/payments/<user_id>', methods=['GET'])
# def fetch_payments(user_id):
#     """
#     Fetch payment details for a specific user and calculate total.
#     """
#     try:
#         # Query to fetch pending payments grouped by category
#         payments_query = text("""
#             SELECT category, SUM(amount) AS total_amount
#             FROM payment_db.payments
#             WHERE user_id = :user_id AND status = 'Pending'
#             GROUP BY category
#         """)
#         # Use `.mappings()` to return rows as dictionaries
#         payments_result = db.session.execute(payments_query, {'user_id': user_id}).mappings().fetchall()

#         # Convert results to a dictionary
#         payments = {row['category']: float(row['total_amount']) for row in payments_result}

#         # Ensure all categories are included, even if they have no pending payments
#         for category in ['Fees', 'Fines', 'Subscriptions']:
#             if category not in payments:
#                 payments[category] = 0.00

#         # Calculate total amount
#         total = sum(payments.values())

#         return jsonify({'payments': payments, 'total': total}), 200

#     except Exception as e:
#         return jsonify({"message": f"Error fetching payments: {str(e)}"}), 500



# # Fetch upcoming deadlines for a user
# @payments_bp.route('/deadlines/<user_id>', methods=['GET'])
# def fetch_deadlines(user_id):
#     """
#     Fetch upcoming payment deadlines for a specific user.
#     """
#     try:
#         deadlines_query = text("""
#             SELECT item_name, due_date, category
#             FROM payment_db.deadlines
#             WHERE user_id = :user_id
#             ORDER BY due_date ASC
#         """)
#         # Use `.mappings()` to get rows as dictionaries
#         deadlines_result = db.session.execute(deadlines_query, {'user_id': user_id}).mappings().fetchall()

#         # Format deadlines into a list of dictionaries
#         deadlines = [
#             {"item_name": row['item_name'], "due_date": str(row['due_date']), "category": row['category']}
#             for row in deadlines_result
#         ]

#         return jsonify(deadlines), 200

#     except Exception as e:
#         return jsonify({"message": f"Error fetching deadlines: {str(e)}"}), 500



# # Mark a payment as completed
# @payments_bp.route('/api/payments/make', methods=['POST'])
# def make_payment():
#     """
#     Mark a payment as completed for a specific user and category.
#     """
#     try:
#         data = request.json
#         user_id = data['user_id']
#         category = data['category']

#         # Update payment status to 'Completed' for the selected category
#         update_query = text("""
#             UPDATE payments
#             SET status = 'Completed'
#             WHERE user_id = :user_id AND category = :category AND status = 'Pending'
#         """)
#         db.session.execute(update_query, {'user_id': user_id, 'category': category})

#         db.session.commit()
#         return jsonify({"message": f"Payment for {category} completed successfully."}), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": f"Error making payment: {str(e)}"}), 500
    
# @payments_bp.route('/pay', methods=['POST'])
# def process_payment():
#     """
#     Process a payment and update the transactions table.
#     """
#     try:
#         data = request.json
#         user_id = data['user_id']
#         amount = data['amount']
#         payment_method = data['payment_method']

#         # Mark all pending payments as completed
#         update_payment_query = text("""
#             UPDATE payment_db.payments
#             SET status = 'Completed'
#             WHERE user_id = :user_id AND status = 'Pending'
#         """)
#         db.session.execute(update_payment_query, {'user_id': user_id})

#         # Insert transaction records into the transactions table
#         insert_transaction_query = text("""
#             INSERT INTO payment_db.transactions (transaction_id, payment_id, amount, payment_method, status)
#             SELECT UUID(), payment_id, :amount, :payment_method, 'Success'
#             FROM payment_db.payments
#             WHERE user_id = :user_id AND status = 'Completed';
#         """)
#         db.session.execute(insert_transaction_query, {'user_id': user_id, 'amount': amount, 'payment_method': payment_method})

#         db.session.commit()
#         return jsonify({"message": f"Payment of {amount} completed successfully using {payment_method}."}), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": f"Error processing payment: {str(e)}"}), 500
