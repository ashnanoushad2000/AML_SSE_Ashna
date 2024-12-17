from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from app.models import db
from sqlalchemy.sql import text
from app.models import InventoryTransfers, Branches, db
from datetime import datetime

import traceback  # Import traceback to capture detailed errors

transfers_bp = Blueprint('transfers', __name__)

@transfers_bp.route('/getTransfers', methods=['GET'])
def fetch_transfers():
    """
    Fetch all transfers with source and destination branch names.
    """
    try:
        query = text("""
            SELECT 
                t.transfer_id,
                t.media_id,
                t.quantity,
                t.reason,
                t.status,
                t.initiated_at,
                t.completed_at,
                sb.branch_name AS source_branch_name,
                db.branch_name AS destination_branch_name
            FROM 
                inventory_db.inventory_transfers t
            LEFT JOIN 
                inventory_db.branches sb ON t.source_branch_id = sb.branch_id
            LEFT JOIN 
                inventory_db.branches db ON t.destination_branch_id = db.branch_id;
        """)

        # Use a connection to execute the query
        with db.engine.connect() as connection:
            print("DEBUG: Successfully connected to the database.")  # Debug log
            result = connection.execute(query)
            print("DEBUG: Query executed successfully.")  # Debug log

            # Fetch rows safely
            transfers = [
                {
                    "transfer_id": row["transfer_id"],
                    "media_id": row["media_id"],
                    "quantity": row["quantity"],
                    "reason": row["reason"],
                    "status": row["status"],
                    "initiated_at": row["initiated_at"],
                    "completed_at": row["completed_at"],
                    "source_branch": row["source_branch_name"],
                    "destination_branch": row["destination_branch_name"]
                }
                for row in result.mappings()
            ]     

        print("DEBUG: Transfers fetched and mapped successfully.")  # Debug log
        return jsonify(transfers), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        print("Database Error:", str(e))
        traceback.print_exc()  # Log detailed traceback
        return jsonify({"message": f"Database error: {str(e)}"}), 500
    except Exception as e:
        print("Error fetching transfers:", str(e))
        traceback.print_exc()  # Log detailed traceback
        return jsonify({"message": f"Error fetching transfers: {str(e)}"}), 500


@transfers_bp.route('/updateStatus/<string:transfer_id>', methods=['PUT'])
def update_transfer_status(transfer_id):
    """
    Update the status of a transfer. 
    - If status is CANCELLED, restore copies to source branch.
    - If status is COMPLETED, add copies to destination branch.
    """
    try:
        print(f"Request to update transfer ID: {transfer_id}")
        data = request.json
        new_status = data.get("status")

        if not new_status:
            return jsonify({"message": "Status is required in the request body"}), 400

        engine = db.get_engine(bind='inventory_db')
        with engine.connect() as connection:
            # Fetch transfer details
            query = text("SELECT * FROM inventory_transfers WHERE transfer_id = :transfer_id")
            result = connection.execute(query, {"transfer_id": transfer_id}).fetchone()

            if not result:
                return jsonify({"message": "Transfer not found"}), 404

            result_mapping = result._mapping  # Convert to a mapping for easier access
            source_branch = result_mapping["source_branch_id"]
            destination_branch = result_mapping["destination_branch_id"]
            media_id = result_mapping["media_id"]
            quantity = result_mapping["quantity"]

            if new_status == "CANCELLED":
                # Restore copies back to the source branch
                update_source_query = text("""
                    UPDATE inventory_db.inventory 
                    SET available_copies = available_copies + :quantity,
                        total_copies = total_copies + :quantity
                    WHERE branch_id = :source_branch_id AND media_id = :media_id
                """)
                connection.execute(update_source_query, {
                    "quantity": quantity,
                    "source_branch_id": source_branch,
                    "media_id": media_id
                })

            elif new_status == "COMPLETED":
                # Add copies to the destination branch
                update_dest_query = text("""
                    INSERT INTO inventory_db.inventory (branch_id, media_id, available_copies, total_copies)
                    VALUES (:branch_id, :media_id, :quantity, :quantity)
                    ON DUPLICATE KEY UPDATE 
                        available_copies = available_copies + :quantity,
                        total_copies = total_copies + :quantity;
                """)
                connection.execute(update_dest_query, {
                    "branch_id": destination_branch,
                    "media_id": media_id,
                    "quantity": quantity
                })

            # Update transfer status and completed_at
            update_status_query = text("""
                UPDATE inventory_transfers 
                SET status = :status, completed_at = :completed_at
                WHERE transfer_id = :transfer_id
            """)
            connection.execute(update_status_query, {
                "status": new_status,
                "completed_at": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S') if new_status == "COMPLETED" else None,
                "transfer_id": transfer_id
            })

            connection.commit()

        return jsonify({"message": f"Transfer status updated to {new_status} successfully"}), 200

    except Exception as e:
        print(f"Error updating transfer status: {str(e)}")
        return jsonify({"message": "Error updating transfer", "error": str(e)}), 500


    
    # Route to fetch available media items for transfer
@transfers_bp.route('/getAvailableMedia/<string:source_branch_id>', methods=['GET'])
def get_available_media_for_branch(source_branch_id):
    """
    Fetch available media items for a specific source branch.
    """
    try:
        query = text("""
            SELECT i.media_id, m.title, m.author, i.available_copies
            FROM inventory_db.inventory i
            INNER JOIN media_db.media_items m ON i.media_id = m.media_id
            WHERE i.branch_id = :source_branch_id AND i.available_copies > 0;
        """)
        # Use the inventory_db engine explicitly
        engine = db.get_engine(bind='inventory_db')
        with engine.connect() as connection:
            result = connection.execute(query, {"source_branch_id": source_branch_id})
            media_items = [
                {
                    "media_id": row["media_id"],
                    "title": row["title"],
                    "author": row["author"],
                    "available_copies": row["available_copies"]
                }
                for row in result.mappings()
            ]
        return jsonify(media_items), 200

    except SQLAlchemyError as e:
        traceback.print_exc()
        return jsonify({"message": "Error fetching available media", "error": str(e)}), 500





# Route to initiate a new transfer
@transfers_bp.route('/initiateTransfer', methods=['POST'])
def initiate_transfer():
    try:
        data = request.json
        print("DEBUG: Received payload:", data)

        # Extract fields
        source_branch = data.get("source_branch")
        destination_branch = data.get("destination_branch")
        media_id = data.get("media_id")
        quantity = int(data.get("quantity"))
        initiated_by = data.get("initiated_by")
        reason = data.get("reason", "")

        # Input validation
        if not all([source_branch, destination_branch, media_id, quantity, initiated_by]):
            return jsonify({"message": "All fields are required"}), 400

        if source_branch == destination_branch:
            return jsonify({"message": "Source and destination branches must be different"}), 400

        # Check available copies in source branch
        check_copies_query = text("""
            SELECT available_copies, total_copies 
            FROM inventory_db.inventory 
            WHERE branch_id = :source_branch_id AND media_id = :media_id
        """)

        with db.engine.connect() as connection:
            result = connection.execute(check_copies_query, {
                "source_branch_id": source_branch,
                "media_id": media_id
            }).fetchone()

            if result:
                result_mapping = result._mapping  # Convert row to a mapping for dictionary-like access
                available_copies = result_mapping["available_copies"]
                total_copies = result_mapping["total_copies"]
            else:
                available_copies = 0  # Default if no record exists

            if available_copies < quantity:
                return jsonify({
                    "message": f"Not enough copies available in the source branch. Available: {available_copies}"
                }), 400


            # Decrement both available_copies and total_copies in the source branch
            update_source_query = text("""
                UPDATE inventory_db.inventory 
                SET available_copies = available_copies - :quantity,
                    total_copies = total_copies - :quantity
                WHERE branch_id = :source_branch_id AND media_id = :media_id
            """)
            connection.execute(update_source_query, {
                "quantity": quantity,
                "source_branch_id": source_branch,
                "media_id": media_id
            })

            # Insert into inventory_transfers table
            insert_query = text("""
                INSERT INTO inventory_db.inventory_transfers (
                    source_branch_id, destination_branch_id, media_id, quantity,
                    status, initiated_by, initiated_at, completed_at, reason
                )
                VALUES (:source_branch_id, :destination_branch_id, :media_id, :quantity,
                        'PENDING', :initiated_by, :initiated_at, NULL, :reason);
            """)
            connection.execute(insert_query, {
                "source_branch_id": source_branch,
                "destination_branch_id": destination_branch,
                "media_id": media_id,
                "quantity": quantity,
                "initiated_by": initiated_by,
                "initiated_at": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
                "reason": reason
            })
            connection.commit()

        return jsonify({"message": "Transfer initiated successfully"}), 201

    except Exception as e:
        print("ERROR during transfer initiation:", str(e))
        return jsonify({"message": "Error initiating transfer", "error": str(e)}), 500







# Route to fetch all branches
@transfers_bp.route('/branches', methods=['GET'])
def get_branches():
    """
    Fetch all branches for source and destination dropdowns.
    """
    try:
        query = text("""
            SELECT branch_id, branch_name FROM inventory_db.branches;
        """)
        with db.engine.connect() as connection:
            result = connection.execute(query)
            branches = [
                {
                    "branch_id": row["branch_id"],
                    "branch_name": row["branch_name"]
                }
                for row in result.mappings()
            ]
        return jsonify(branches), 200

    except SQLAlchemyError as e:
        traceback.print_exc()
        return jsonify({"message": "Error fetching branches", "error": str(e)}), 500