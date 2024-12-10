from flask import Blueprint, request, jsonify
from app.models import MediaItems, MediaCategories, db
from sqlalchemy.exc import SQLAlchemyError
from uuid import uuid4
from datetime import datetime
from sqlalchemy import text  # Import text for raw SQL queries


media_bp = Blueprint('media', __name__)

@media_bp.route('/', methods=['POST'])
def add_media():
    """
    Add a new media item. Checks for duplicate ISBN.
    """
    try:
        data = request.json

        # Check if a media item with the same ISBN already exists
        existing_media = MediaItems.query.filter_by(isbn=data.get('isbn')).first()
        if existing_media:
            return jsonify({'message': 'Media with the same ISBN already exists.'}), 400

        # Add new media item
        media = MediaItems(
            media_id=str(uuid4()),
            title=data.get('title'),
            author=data.get('author'),
            isbn=data.get('isbn'),
            category_id=data.get('categoryId'),
            publication_date=data.get('publicationDate'),
            publisher=data.get('publisher'),
            item_description=data.get('description'),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(media)
        db.session.commit()
        return jsonify({'message': 'Media item added successfully.'}), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'message': f'Error adding media item: {str(e)}'}), 500

@media_bp.route('/categories', methods=['GET'])
def get_categories():
    """
    Fetch all media categories with cache refresh.
    """
    try:
        db.session.execute(text('SELECT 1'))  # Refresh connection
        db.metadata.clear()  # Clear metadata cache

        categories = MediaCategories.query.all()
        return jsonify([{
            'category_id': category.category_id,
            'category_name': category.category_name,
            'category_description': category.category_description
        } for category in categories]), 200
    except Exception as e:
        print(f"Error fetching categories: {e}")
        return jsonify({'message': f'Error fetching categories: {str(e)}'}), 500
