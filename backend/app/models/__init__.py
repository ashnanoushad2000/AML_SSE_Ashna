from flask_sqlalchemy import SQLAlchemy
from app import db
from datetime import datetime
from uuid import uuid4

# User Model
class Users(db.Model):
    __bind_key__ = 'auth_db'  # Add binding key
    __tablename__ = 'users'
    user_id = db.Column(db.String(36), primary_key=True)  # Changed to String for UUID
    password_hash = db.Column(db.String(255))
    email = db.Column(db.String(100))
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    date_of_birth = db.Column(db.Date)
    address = db.Column(db.Text)
    post_code = db.Column(db.String(10))  # Add this line
    phone = db.Column(db.String(20))
    user_type = db.Column(db.String(20))
    created_at = db.Column(db.TIMESTAMP)
    updated_at = db.Column(db.TIMESTAMP)

# Media Items Model
class MediaItems(db.Model):
    __bind_key__ = 'media_db'
    __tablename__ = 'media_items'
    media_id = db.Column(db.String(36), primary_key=True)  # UUID
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(100))
    isbn = db.Column(db.String(20), unique=True)
    category_id = db.Column(db.String(36), db.ForeignKey('media_categories.category_id'))
    publication_date = db.Column(db.Date)
    publisher = db.Column(db.String(100))
    item_description = db.Column(db.Text)

# Media Categories Model
class MediaCategories(db.Model):
    __bind_key__ = 'media_db'
    __tablename__ = 'media_categories'
    category_id = db.Column(db.String(36), primary_key=True)
    category_name = db.Column(db.String(50), nullable=False)
    category_description = db.Column(db.Text)

# Loans Model
class Loans(db.Model):
    __bind_key__ = 'loan_db'  # Ensure this matches your database
    __tablename__ = 'loans'
    loan_id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), nullable=False)
    media_id = db.Column(db.String(36), nullable=False)
    issue_date = db.Column(db.TIMESTAMP, nullable=False, default=datetime.utcnow)
    due_date = db.Column(db.TIMESTAMP, nullable=False)
    return_date = db.Column(db.TIMESTAMP)
    status = db.Column(db.Enum('ACTIVE', 'RETURNED', 'OVERDUE'), nullable=False, default='ACTIVE')
    renewals_count = db.Column(db.Integer, nullable=False, default=0)

# Holds Model
class Holds(db.Model):
    __bind_key__ = 'loan_db'  # This should match your database structure
    __tablename__ = 'holds'
    hold_id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), nullable=False)
    media_id = db.Column(db.String(36), nullable=False)
    request_date = db.Column(db.TIMESTAMP, nullable=False, default=datetime.utcnow)
    status = db.Column(db.Enum('PENDING', 'READY', 'CANCELLED', 'FULFILLED'), nullable=False, default='PENDING')
    notification_sent = db.Column(db.Boolean, nullable=False, default=False)

class Inventory(db.Model):
    __bind_key__ = 'inventory_db'  
    __tablename__ = 'inventory'
    inventory_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    media_id = db.Column(db.String(36), nullable=False)
    branch_id = db.Column(db.String(36), db.ForeignKey('branches.branch_id'), nullable=False)
    total_copies = db.Column(db.Integer, nullable=False, default=0)
    available_copies = db.Column(db.Integer, nullable=False, default=0)
    last_updated = db.Column(
        db.TIMESTAMP,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

class Branches(db.Model):
    __bind_key__ = 'inventory_db'
    __tablename__ = 'branches'

    branch_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    branch_name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))

    # Constraints
    __table_args__ = (
        db.CheckConstraint("length(branch_name) > 0", name="chk_branch_name_not_empty"),
        db.CheckConstraint("length(address) > 0", name="chk_branch_address_not_empty"),
        db.CheckConstraint("phone ~ '^\\+?[0-9-s()]{8,20}$'", name="chk_branch_phone_valid"),
        db.CheckConstraint("email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'", name="chk_branch_email_valid"),
    )

class InventoryTransfers(db.Model):
    __bind_key__ = 'inventory_db'
    __tablename__ = 'inventory_transfers'

    transfer_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    source_branch_id = db.Column(db.String(36), db.ForeignKey('branches.branch_id'), nullable=False)
    destination_branch_id = db.Column(db.String(36), db.ForeignKey('branches.branch_id'), nullable=False)
    media_id = db.Column(db.String(36), db.ForeignKey('media_items.media_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Enum('PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'), default='PENDING')
    initiated_by = db.Column(db.String(36), db.ForeignKey('users.user_id'), nullable=False)  # Changed from Integer to String(36)
    initiated_at = db.Column(db.TIMESTAMP, server_default=db.func.now())
    completed_at = db.Column(db.TIMESTAMP)

    # Constraints
    __table_args__ = (
        db.CheckConstraint("source_branch_id != destination_branch_id", name="chk_different_branches"),
        db.CheckConstraint("quantity > 0", name="chk_positive_quantity"),
    )