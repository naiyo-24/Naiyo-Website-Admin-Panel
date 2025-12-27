from flask import Blueprint, request, jsonify
from models.customer_query import CustomerQuery
from models.db import sqlalchemy_db as db

customer_query_bp = Blueprint('customer_query_bp', __name__)


# ==========================================
#        PUBLIC API (For Naiyo Website)
# ==========================================

# ================= CREATE (POST) - Public =================
@customer_query_bp.route('/customer_query', methods=['POST'])
def create_customer_query():
    """Public endpoint for customers to submit queries from the website"""
    data = request.get_json()

    try:
        new_query = CustomerQuery(
            customer_name=data.get('customer_name'),
            cust_email=data.get('cust_email'),
            cust_phone=data.get('cust_phone'),
            query_subject=data.get('query_subject'),
            message=data.get('message'),
            selected_plan=data.get('selected_plan'),  
            service_type=data.get('service_type'),
            service_price=data.get('service_price'),
        )

        db.session.add(new_query)
        db.session.commit()

        return jsonify({'message': 'Customer query submitted successfully.'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


# ==========================================
#        ADMIN CRUD API (For Admin Panel)
# ==========================================

# ================= READ (GET ALL) =================
@customer_query_bp.route('/admin/customer_query', methods=['GET'])
def admin_get_customer_queries():
    try:
        # Fetch newest first
        queries = CustomerQuery.query.order_by(CustomerQuery.id.desc()).all()
        result = [{
            'id': q.id,
            'customer_name': q.customer_name,
            'cust_email': q.cust_email,
            'cust_phone': q.cust_phone,
            'query_subject': q.query_subject,
            'message': q.message,
            'selected_plan': q.selected_plan,
            'service_type': q.service_type,
            'service_price': q.service_price,
            'created_at': q.created_at if hasattr(q, 'created_at') else None
        } for q in queries]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================= READ (GET BY ID) =================
@customer_query_bp.route('/admin/customer_query/<int:id>', methods=['GET'])
def admin_get_customer_query_by_id(id):
    try:
        query = CustomerQuery.query.get(id)
        if not query:
            return jsonify({'error': 'Query not found'}), 404
        
        result = {
            'id': query.id,
            'customer_name': query.customer_name,
            'cust_email': query.cust_email,
            'cust_phone': query.cust_phone,
            'query_subject': query.query_subject,
            'message': query.message,
            'selected_plan': query.selected_plan,
            'service_type': query.service_type,
            'service_price': query.service_price,
            'created_at': query.created_at if hasattr(query, 'created_at') else None
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================= UPDATE (PUT) =================
@customer_query_bp.route('/admin/customer_query/<int:id>', methods=['PUT'])
def admin_update_customer_query(id):
    try:
        query = CustomerQuery.query.get(id)
        if not query:
            return jsonify({'error': 'Query not found'}), 404

        data = request.get_json()
        
        query.customer_name = data.get('customer_name', query.customer_name)
        query.cust_email = data.get('cust_email', query.cust_email)
        query.cust_phone = data.get('cust_phone', query.cust_phone)
        query.query_subject = data.get('query_subject', query.query_subject)
        query.message = data.get('message', query.message)
        query.selected_plan = data.get('selected_plan', query.selected_plan)
        query.service_type = data.get('service_type', query.service_type)
        query.service_price = data.get('service_price', query.service_price)

        db.session.commit()
        return jsonify({'message': 'Query updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ================= DELETE =================
@customer_query_bp.route('/admin/customer_query/<int:id>', methods=['DELETE'])
def admin_delete_customer_query(id):
    try:
        query = CustomerQuery.query.get(id)
        if not query:
            return jsonify({'error': 'Query not found'}), 404

        db.session.delete(query)
        db.session.commit()
        return jsonify({'message': 'Query deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ================= LEGACY ROUTES (for backward compatibility) =================
# Keep old routes for backward compatibility with existing integrations

@customer_query_bp.route('/customer_query', methods=['GET'])
def get_customer_queries():
    """Legacy endpoint - redirects to admin endpoint logic"""
    try:
        queries = CustomerQuery.query.order_by(CustomerQuery.id.desc()).all()
        result = [{
            'id': q.id,
            'customer_name': q.customer_name,
            'cust_email': q.cust_email,
            'cust_phone': q.cust_phone,
            'query_subject': q.query_subject,
            'message': q.message,
            'selected_plan': q.selected_plan,
            'service_type': q.service_type,
            'service_price': q.service_price,
            'created_at': q.created_at if hasattr(q, 'created_at') else None
        } for q in queries]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@customer_query_bp.route('/customer_query/<int:id>', methods=['DELETE'])
def delete_customer_query(id):
    """Legacy endpoint - redirects to admin endpoint logic"""
    try:
        query = CustomerQuery.query.get(id)
        if not query:
            return jsonify({'error': 'Query not found'}), 404

        db.session.delete(query)
        db.session.commit()
        return jsonify({'message': 'Query deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500