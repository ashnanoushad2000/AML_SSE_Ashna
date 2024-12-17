from flask import Blueprint, request, jsonify
from app.models import MediaItems, MediaCategories, Inventory, db
from sqlalchemy.exc import SQLAlchemyError
from uuid import uuid4
from datetime import datetime
import logging
from sqlalchemy.sql import text


media_bp = Blueprint('media', __name__)
inventory_bp = Blueprint('inventory', __name__)

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

@media_bp.route('/all', methods=['GET'])
def get_all_media_items():
    """
    Fetch all media items from the media_items table.
    """
    try:
        media_items = MediaItems.query.all()
        return jsonify([{
            'media_id': media.media_id,
            'title': media.title,
            'author': media.author,
            'isbn': media.isbn,
            'category_id': media.category_id,
            'publication_date': media.publication_date,
            'publisher': media.publisher,
            'item_description': media.item_description
        } for media in media_items]), 200
    except Exception as e:
        logging.error(f"Error fetching media items: {str(e)}")
        return jsonify({'message': f"Error fetching media items: {str(e)}"}), 500

@media_bp.route('/delete/<media_id>', methods=['DELETE'])
def delete_media(media_id):
    """
    Delete a media item by ID.
    """
    try:
        media_item = MediaItems.query.filter_by(media_id=media_id).first()
        if not media_item:
            return jsonify({'message': 'Media item not found.'}), 404

        db.session.delete(media_item)
        db.session.commit()
        return jsonify({'message': 'Media item deleted successfully.'}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"Database Error: {str(e)}")
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    except Exception as e:
        logging.error(f"Error Deleting Media: {str(e)}")
        return jsonify({'message': f'Error deleting media: {str(e)}'}), 500
    
@media_bp.route('/<media_id>', methods=['GET'])
def get_media(media_id):
    """
    Fetch a single media item by ID.
    """
    try:
        media_item = MediaItems.query.filter_by(media_id=media_id).first()
        if not media_item:
            return jsonify({'message': 'Media item not found.'}), 404

        # Ensure publication_date is serialized to ISO format
        response = {
            'media_id': media_item.media_id,
            'title': media_item.title,
            'author': media_item.author,
            'isbn': media_item.isbn,
            'category_id': media_item.category_id,
            'publication_date': media_item.publication_date.isoformat() if media_item.publication_date else None,
            'publisher': media_item.publisher,
            'item_description': media_item.item_description
        }

        logging.debug('Fetched Media:', response)  # Optional debugging log
        return jsonify(response), 200

    except Exception as e:
        logging.error(f"Error fetching media: {str(e)}")
        return jsonify({'message': f"Error fetching media: {str(e)}"}), 500



    
@media_bp.route('/update/<media_id>', methods=['PUT'])
def update_media(media_id):
    """
    Update a media item by ID.
    """
    try:
        data = request.json
        media_item = MediaItems.query.filter_by(media_id=media_id).first()

        if not media_item:
            return jsonify({'message': 'Media item not found.'}), 404

        # Update fields
        media_item.title = data.get('title', media_item.title)
        media_item.author = data.get('author', media_item.author)
        media_item.isbn = data.get('isbn', media_item.isbn)
        media_item.category_id = data.get('categoryId', media_item.category_id)
        media_item.publication_date = data.get('publicationDate', media_item.publication_date)
        media_item.publisher = data.get('publisher', media_item.publisher)
        media_item.item_description = data.get('item_description', media_item.item_description)

        db.session.commit()
        return jsonify({'message': 'Media item updated successfully.'}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"Database Error: {str(e)}")
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    except Exception as e:
        logging.error(f"Error updating media: {str(e)}")
        return jsonify({'message': f'Error updating media: {str(e)}'}), 500
    
@media_bp.route('/inventory/categories', methods=['GET'])
def fetch_inventory_categories():
    """
    Fetch categories of media items present in the inventory.
    """
    try:
        # Define the query
        query = text("""
            SELECT DISTINCT mc.category_id, mc.category_name, mc.category_description
            FROM media_db.media_categories mc
            JOIN media_db.media_items mi ON mc.category_id = mi.category_id
            JOIN inventory_db.inventory i ON i.media_id = mi.media_id
        """)

        # Execute the query
        result = db.session.connection().execute(query)

        # Map results to dictionaries
        categories = [
            {
                "category_id": row[0],
                "category_name": row[1],
                "category_description": row[2],
            }
            for row in result
        ]

        return jsonify(categories), 200

    except Exception as e:
        logging.error(f"Error fetching inventory categories: {e}")
        return jsonify({"message": f"Error fetching inventory categories: {str(e)}"}), 500