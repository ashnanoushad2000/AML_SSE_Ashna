from flask_sqlalchemy import SQLAlchemy
from app import db

# User Model
class Users(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    password_hash = db.Column(db.String(255))
    email = db.Column(db.String(100))
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    date_of_birth = db.Column(db.Date)
    address = db.Column(db.Text)
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
    __tablename__ = 'loans'
    loan_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.inventory_id'))
    checkout_date = db.Column(db.TIMESTAMP)
    due_date = db.Column(db.TIMESTAMP)
    return_date = db.Column(db.TIMESTAMP)
    renewed_count = db.Column(db.Integer)
    status = db.Column(db.String(20))
    created_by = db.Column(db.Integer)
