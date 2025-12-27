from flask import Blueprint, jsonify, request
from models.testimonials import Testimonial
from models.db import sqlalchemy_db as db

testimonials_bp = Blueprint('testimonials_bp', __name__)


# ==========================================
#        PUBLIC API (For Naiyo Website)
# ==========================================

# GET all testimonials (Public)
@testimonials_bp.route('/testimonials', methods=['GET'])
def get_public_testimonials():
    records = Testimonial.query.all()
    result = [
        {
            'id': r.id,
            'name': r.name,
            'role': r.role,
            'company': r.company,
            'content': r.content,
            'rating': r.rating
        } for r in records
    ]
    return jsonify(result)


# Legacy route for backward compatibility
@testimonials_bp.route('/get_testimonials', methods=['GET'])
def get_all_testimonials():
    records = Testimonial.query.all()
    result = [
        {
            'id': r.id,
            'name': r.name,
            'role': r.role,
            'company': r.company,
            'content': r.content,
            'rating': r.rating
        } for r in records
    ]
    return jsonify(result)


# ==========================================
#        ADMIN CRUD API (For Admin Panel)
# ==========================================

# ================= READ (GET ALL) =================
@testimonials_bp.route('/admin/testimonials', methods=['GET'])
def admin_get_testimonials():
    try:
        records = Testimonial.query.order_by(Testimonial.id.desc()).all()
        result = [
            {
                'id': r.id,
                'name': r.name,
                'role': r.role,
                'company': r.company,
                'content': r.content,
                'rating': r.rating
            } for r in records
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================= READ (GET BY ID) =================
@testimonials_bp.route('/admin/testimonials/<int:id>', methods=['GET'])
def admin_get_testimonial_by_id(id):
    try:
        testimonial = Testimonial.query.get(id)
        if not testimonial:
            return jsonify({'error': 'Testimonial not found'}), 404
        
        result = {
            'id': testimonial.id,
            'name': testimonial.name,
            'role': testimonial.role,
            'company': testimonial.company,
            'content': testimonial.content,
            'rating': testimonial.rating
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================= CREATE (POST) =================
@testimonials_bp.route('/admin/testimonials', methods=['POST'])
def admin_create_testimonial():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('content'):
            return jsonify({'error': 'Name and content are required'}), 400
        
        new_testimonial = Testimonial(
            name=data.get('name'),
            role=data.get('role'),
            company=data.get('company'),
            content=data.get('content'),
            rating=data.get('rating')
        )
        
        db.session.add(new_testimonial)
        db.session.commit()
        
        return jsonify({
            'message': 'Testimonial created successfully',
            'id': new_testimonial.id,
            'name': new_testimonial.name,
            'role': new_testimonial.role,
            'company': new_testimonial.company,
            'content': new_testimonial.content,
            'rating': new_testimonial.rating
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ================= UPDATE (PUT) =================
@testimonials_bp.route('/admin/testimonials/<int:id>', methods=['PUT'])
def admin_update_testimonial(id):
    try:
        testimonial = Testimonial.query.get(id)
        if not testimonial:
            return jsonify({'error': 'Testimonial not found'}), 404
        
        data = request.get_json()

        testimonial.name = data.get('name', testimonial.name)
        testimonial.role = data.get('role', testimonial.role)
        testimonial.company = data.get('company', testimonial.company)
        testimonial.content = data.get('content', testimonial.content)
        
        if 'rating' in data:
            testimonial.rating = int(data.get('rating'))

        db.session.commit()
        return jsonify({'message': 'Testimonial updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ================= DELETE =================
@testimonials_bp.route('/admin/testimonials/<int:id>', methods=['DELETE'])
def admin_delete_testimonial(id):
    try:
        testimonial = Testimonial.query.get(id)
        if not testimonial:
            return jsonify({'error': 'Testimonial not found'}), 404
        
        db.session.delete(testimonial)
        db.session.commit()
        return jsonify({'message': 'Testimonial deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==========================================
#        LEGACY ROUTES (Backward Compatibility)
# ==========================================

@testimonials_bp.route('/add_testimonial', methods=['POST'])
def add_testimonial():
    """Legacy endpoint - use /admin/testimonials POST instead"""
    try:
        data = request.get_json()
        
        if not data.get('name') or not data.get('content'):
            return jsonify({'error': 'Name and content are required'}), 400
        
        new_testimonial = Testimonial(
            name=data.get('name'),
            role=data.get('role'),
            company=data.get('company'),
            content=data.get('content'),
            rating=data.get('rating')
        )
        
        db.session.add(new_testimonial)
        db.session.commit()
        
        return jsonify({
            'id': new_testimonial.id,
            'name': new_testimonial.name,
            'role': new_testimonial.role,
            'company': new_testimonial.company,
            'content': new_testimonial.content,
            'rating': new_testimonial.rating
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@testimonials_bp.route('/update_testimonial/<int:id>', methods=['PUT'])
def update_testimonial(id):
    """Legacy endpoint - use /admin/testimonials/<id> PUT instead"""
    try:
        testimonial = Testimonial.query.get_or_404(id)
        data = request.get_json()

        testimonial.name = data.get('name', testimonial.name)
        testimonial.role = data.get('role', testimonial.role)
        testimonial.company = data.get('company', testimonial.company)
        testimonial.content = data.get('content', testimonial.content)
        
        if 'rating' in data:
            testimonial.rating = int(data.get('rating'))

        db.session.commit()
        return jsonify({'message': 'Testimonial updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@testimonials_bp.route('/delete_testimonial/<int:id>', methods=['DELETE'])
def delete_testimonial(id):
    """Legacy endpoint - use /admin/testimonials/<id> DELETE instead"""
    try:
        testimonial = Testimonial.query.get_or_404(id)
        db.session.delete(testimonial)
        db.session.commit()
        return jsonify({'message': 'Testimonial deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
