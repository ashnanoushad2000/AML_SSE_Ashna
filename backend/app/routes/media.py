from flask import Blueprint, request, jsonify
from app.models import MediaItems, MediaCategories, db
from sqlalchemy.exc import SQLAlchemyError
from uuid import uuid4
from datetime import datetime
import logging

media_bp = Blueprint('media', __name__)

@media_bp.route('/categories', methods=['GET'])
def get_categories():
    """
    Fetch all media categories.
    """
    try:
        categories = MediaCategories.query.all()
        return jsonify([{
            'category_id': category.category_id,
            'category_name': category.category_name,
            'category_description': category.category_description
        } for category in categories]), 200
    except Exception as e:
        logging.error(f"Error fetching categories: {str(e)}")
        return jsonify({'message': f"Error fetching categories: {str(e)}"}), 500

import logging
logging.basicConfig(level=logging.DEBUG)

@media_bp.route('/add', methods=['POST'])
def add_media():
    try:
        data = request.json
        logging.debug(f"Request Data: {data}")

        # Check for duplicate ISBN
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
            item_description=data.get('item_description')
        )
        db.session.add(media)
        db.session.commit()
        return jsonify({'message': 'Media item added successfully.'}), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"Database Error: {str(e)}")
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    except Exception as e:
        logging.error(f"Error Adding Media: {str(e)}")
        return jsonify({'message': f'Error adding media: {str(e)}'}), 500
    
@media_bp.route('/', methods=['OPTIONS'])
def options_media():
    response = jsonify({'message': 'CORS preflight successful'})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    response.headers.add('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response, 200
