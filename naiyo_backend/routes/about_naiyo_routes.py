# API endpoints for AboutNaiyo table
from flask import Blueprint, request, jsonify
from models.about_naiyo import AboutNaiyo
from models.db import sqlalchemy_db as db

about_naiyo_bp = Blueprint('about_naiyo', __name__)


# ==========================================
#        PUBLIC API (For Naiyo Website)
# ==========================================

# GET all about_naiyo records (Public)
@about_naiyo_bp.route('/about_naiyo', methods=['GET'])
def get_about_naiyo():
    records = AboutNaiyo.query.all()
    result = [
        {
            'id': r.id,
            'name': r.name,
            'address': r.address,
            'phone': r.phone,
            'landline': r.landline,
            'email': r.email,
            'website': r.website,
            'about_us': r.about_us,
            'ceo_name': r.ceo_name,
            'ceo_message': r.ceo_message,
            'mission': r.mission,
            'vision': r.vision,
            'business_hours': r.business_hours
        } for r in records
    ]
    return jsonify(result)


# GET only about_us, ceo_name, ceo_message, mission, vision (Public)
@about_naiyo_bp.route('/about_naiyo_about', methods=['GET'])
def get_about_naiyo_about():
    records = AboutNaiyo.query.all()
    result = [
        {
            'about_us': r.about_us,
            'ceo_name': r.ceo_name,
            'ceo_message': r.ceo_message,
            'mission': r.mission,
            'vision': r.vision
        } for r in records
    ]
    return jsonify(result)


# GET only email, phone, address, business_hours (Public)
@about_naiyo_bp.route('/about_naiyo_contact', methods=['GET'])
def get_about_naiyo_contact():
    records = AboutNaiyo.query.all()
    result = [
        {
            'email': r.email,
            'phone': r.phone,
            'address': r.address,
            'business_hours': r.business_hours
        } for r in records
    ]
    return jsonify(result)


# ==========================================
#        ADMIN CRUD API (For Admin Panel)
# ==========================================

# ================= READ (GET ALL) =================
@about_naiyo_bp.route('/admin/about_naiyo', methods=['GET'])
def admin_get_about_naiyo():
    try:
        records = AboutNaiyo.query.order_by(AboutNaiyo.id.desc()).all()
        result = [
            {
                'id': r.id,
                'name': r.name,
                'address': r.address,
                'phone': r.phone,
                'landline': r.landline,
                'email': r.email,
                'website': r.website,
                'about_us': r.about_us,
                'ceo_name': r.ceo_name,
                'ceo_message': r.ceo_message,
                'mission': r.mission,
                'vision': r.vision,
                'business_hours': r.business_hours
            } for r in records
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================= READ (GET BY ID) =================
@about_naiyo_bp.route('/admin/about_naiyo/<int:id>', methods=['GET'])
def admin_get_about_naiyo_by_id(id):
    try:
        record = AboutNaiyo.query.get(id)
        if not record:
            return jsonify({'error': 'Record not found'}), 404
        
        result = {
            'id': record.id,
            'name': record.name,
            'address': record.address,
            'phone': record.phone,
            'landline': record.landline,
            'email': record.email,
            'website': record.website,
            'about_us': record.about_us,
            'ceo_name': record.ceo_name,
            'ceo_message': record.ceo_message,
            'mission': record.mission,
            'vision': record.vision,
            'business_hours': record.business_hours
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================= CREATE (POST) =================
@about_naiyo_bp.route('/admin/about_naiyo', methods=['POST'])
def admin_create_about_naiyo():
    try:
        data = request.get_json()
        
        new_record = AboutNaiyo(
            name=data.get('name'),
            address=data.get('address'),
            phone=data.get('phone'),
            landline=data.get('landline'),
            email=data.get('email'),
            website=data.get('website'),
            about_us=data.get('about_us'),
            ceo_name=data.get('ceo_name'),
            ceo_message=data.get('ceo_message'),
            mission=data.get('mission'),
            vision=data.get('vision'),
            business_hours=data.get('business_hours')
        )
        
        db.session.add(new_record)
        db.session.commit()
        
        return jsonify({'message': 'Record created successfully', 'id': new_record.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ================= UPDATE (PUT) =================
@about_naiyo_bp.route('/admin/about_naiyo/<int:id>', methods=['PUT'])
def admin_update_about_naiyo(id):
    try:
        record = AboutNaiyo.query.get(id)
        if not record:
            return jsonify({'error': 'Record not found'}), 404
        
        data = request.get_json()
        
        record.name = data.get('name', record.name)
        record.address = data.get('address', record.address)
        record.phone = data.get('phone', record.phone)
        record.landline = data.get('landline', record.landline)
        record.email = data.get('email', record.email)
        record.website = data.get('website', record.website)
        record.about_us = data.get('about_us', record.about_us)
        record.ceo_name = data.get('ceo_name', record.ceo_name)
        record.ceo_message = data.get('ceo_message', record.ceo_message)
        record.mission = data.get('mission', record.mission)
        record.vision = data.get('vision', record.vision)
        record.business_hours = data.get('business_hours', record.business_hours)
        
        db.session.commit()
        
        return jsonify({'message': 'Record updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ================= DELETE =================
@about_naiyo_bp.route('/admin/about_naiyo/<int:id>', methods=['DELETE'])
def admin_delete_about_naiyo(id):
    try:
        record = AboutNaiyo.query.get(id)
        if not record:
            return jsonify({'error': 'Record not found'}), 404
        
        db.session.delete(record)
        db.session.commit()
        
        return jsonify({'message': 'Record deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500