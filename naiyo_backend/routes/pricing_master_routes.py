from flask import Blueprint, jsonify, request
from models.pricing_master import PricingMaster
from models.db import sqlalchemy_db as db
from sqlalchemy.orm.attributes import flag_modified

pricing_master_bp = Blueprint('pricing_master_bp', __name__)


# ==========================================
#        PUBLIC API (For Naiyo Website)
# ==========================================

# GET all pricing (Public)
@pricing_master_bp.route('/pricing', methods=['GET'])
def get_public_pricing():
    records = PricingMaster.query.all()
    result = []
    for r in records:
        data = {
            'id': r.id,
            'main_service': r.main_service,
            'service_pack_1': r.service_pack_1,
            'service_pack_2': r.service_pack_2,
            'service_pack_3': r.service_pack_3,
            'service_pack_4': r.service_pack_4,
            'service_pack_5': r.service_pack_5,
            'service_pack_6': r.service_pack_6,
            'service_pack_7': r.service_pack_7,
            'service_pack_8': r.service_pack_8,
            'service_pack_9': r.service_pack_9,
        }
        result.append(data)
    return jsonify(result)


# GET pricing by service type (Public) - Dynamic route
@pricing_master_bp.route('/pricing/<string:service_type>', methods=['GET'])
def get_pricing_by_service(service_type):
    """Dynamic route to get pricing by service type"""
    # Convert URL-friendly service type to actual service name
    service_map = {
        'web-development-services': 'Web Development Services',
        'mobile-application-services': 'Mobile Application Services',
        'servers-and-hosting-services': 'Servers & Hosting Services',
        'professional-email-services': 'Professional Email Services',
        'market-research-services': 'Market Research Services',
        'business-solution-services': 'Business Solution Services',
        'marketing-services': 'Marketing Services',
        'logo-branding-services': 'Logo & Branding Services',
        'seo-services': 'SEO Services',
        'domain-registration-services': 'Domain Registration Services',
        'finance-services': 'Finance Services'
    }
    
    actual_service = service_map.get(service_type.lower(), service_type)
    
    try:
        records = PricingMaster.query.filter_by(main_service=actual_service).all()
        result = [{
            'id': record.id,
            'main_service': record.main_service,
            'service_pack_1': record.service_pack_1,
            'service_pack_2': record.service_pack_2,
            'service_pack_3': record.service_pack_3,
            'service_pack_4': record.service_pack_4,
            'service_pack_5': record.service_pack_5,
            'service_pack_6': record.service_pack_6,
            'service_pack_7': record.service_pack_7,
            'service_pack_8': record.service_pack_8,
            'service_pack_9': record.service_pack_9,
        } for record in records]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==========================================
#        LEGACY PUBLIC ROUTES (Backward Compatibility)
# ==========================================

@pricing_master_bp.route('/pricing_master/web-development-services', methods=['GET'])
def get_web_development_pricing():
    records = PricingMaster.query.filter_by(main_service="Web Development Services").all()
    result = [{
        'id': record.id,
        'main_service': record.main_service,
        'service_pack_1': record.service_pack_1,
        'service_pack_2': record.service_pack_2,
        'service_pack_3': record.service_pack_3,
        'service_pack_4': record.service_pack_4,
        'service_pack_5': record.service_pack_5,
        'service_pack_6': record.service_pack_6,
        'service_pack_7': record.service_pack_7,
        'service_pack_8': record.service_pack_8,
        'service_pack_9': record.service_pack_9,
    } for record in records]
    return jsonify(result)


@pricing_master_bp.route('/pricing_master/mobile-application-services', methods=['GET'])
def get_mobile_application_pricing():
    records = PricingMaster.query.filter_by(main_service="Mobile Application Services").all()
    result = [{
        'id': record.id,
        'main_service': record.main_service,
        'service_pack_1': record.service_pack_1,
        'service_pack_2': record.service_pack_2,
        'service_pack_3': record.service_pack_3,
        'service_pack_4': record.service_pack_4,
        'service_pack_5': record.service_pack_5,
        'service_pack_6': record.service_pack_6,
        'service_pack_7': record.service_pack_7,
        'service_pack_8': record.service_pack_8,
        'service_pack_9': record.service_pack_9,
    } for record in records]
    return jsonify(result)


@pricing_master_bp.route('/pricing_master/servers-and-hosting-services', methods=['GET'])
def get_servers_and_hosting_pricing():
    records = PricingMaster.query.filter_by(main_service="Servers & Hosting Services").all()
    result = [{
        'id': record.id,
        'main_service': record.main_service,
        'service_pack_1': record.service_pack_1,
        'service_pack_2': record.service_pack_2,
        'service_pack_3': record.service_pack_3,
        'service_pack_4': record.service_pack_4,
        'service_pack_5': record.service_pack_5,
        'service_pack_6': record.service_pack_6,
        'service_pack_7': record.service_pack_7,
        'service_pack_8': record.service_pack_8,
        'service_pack_9': record.service_pack_9,
    } for record in records]
    return jsonify(result)


@pricing_master_bp.route('/pricing_master/professional-email-services', methods=['GET'])
def get_professional_email_pricing():
    records = PricingMaster.query.filter_by(main_service="Professional Email Services").all()
    result = [{
        'id': record.id,
        'main_service': record.main_service,
        'service_pack_1': record.service_pack_1,
        'service_pack_2': record.service_pack_2,
        'service_pack_3': record.service_pack_3,
        'service_pack_4': record.service_pack_4,
        'service_pack_5': record.service_pack_5,
        'service_pack_6': record.service_pack_6,
        'service_pack_7': record.service_pack_7,
        'service_pack_8': record.service_pack_8,
        'service_pack_9': record.service_pack_9,
    } for record in records]
    return jsonify(result)


@pricing_master_bp.route('/pricing_master/market-research-services', methods=['GET'])
def get_market_research_pricing():
    try:
        records = PricingMaster.query.filter_by(main_service="Market Research Services").all()
        result = [{
            'id': record.id,
            'main_service': record.main_service,
            'service_pack_1': record.service_pack_1,
            'service_pack_2': record.service_pack_2,
            'service_pack_3': record.service_pack_3,
            'service_pack_4': record.service_pack_4,
            'service_pack_5': record.service_pack_5,
            'service_pack_6': record.service_pack_6,
            'service_pack_7': record.service_pack_7,
            'service_pack_8': record.service_pack_8,
            'service_pack_9': record.service_pack_9,
        } for record in records]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@pricing_master_bp.route('/pricing_master/business-solution-services', methods=['GET'])
def get_business_solution_services():
    try:
        records = PricingMaster.query.filter_by(main_service="Business Solution Services").all()
        result = [{
            'id': record.id,
            'main_service': record.main_service,
            'service_pack_1': record.service_pack_1,
            'service_pack_2': record.service_pack_2,
            'service_pack_3': record.service_pack_3,
            'service_pack_4': record.service_pack_4,
            'service_pack_5': record.service_pack_5,
            'service_pack_6': record.service_pack_6,
            'service_pack_7': record.service_pack_7,
            'service_pack_8': record.service_pack_8,
            'service_pack_9': record.service_pack_9,
        } for record in records]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@pricing_master_bp.route('/pricing_master/marketing-services', methods=['GET'])
def get_marketing_services():
    try:
        records = PricingMaster.query.filter_by(main_service="Marketing Services").all()
        result = [{
            'id': record.id,
            'main_service': record.main_service,
            'service_pack_1': record.service_pack_1,
            'service_pack_2': record.service_pack_2,
            'service_pack_3': record.service_pack_3,
            'service_pack_4': record.service_pack_4,
            'service_pack_5': record.service_pack_5,
            'service_pack_6': record.service_pack_6,
            'service_pack_7': record.service_pack_7,
            'service_pack_8': record.service_pack_8,
            'service_pack_9': record.service_pack_9,
        } for record in records]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@pricing_master_bp.route('/pricing_master/logo-branding-services', methods=['GET'])
def get_logo_branding_services():
    try:
        records = PricingMaster.query.filter_by(main_service="Logo & Branding Services").all()
        result = [{
            'id': record.id,
            'main_service': record.main_service,
            'service_pack_1': record.service_pack_1,
            'service_pack_2': record.service_pack_2,
            'service_pack_3': record.service_pack_3,
            'service_pack_4': record.service_pack_4,
            'service_pack_5': record.service_pack_5,
            'service_pack_6': record.service_pack_6,
            'service_pack_7': record.service_pack_7,
            'service_pack_8': record.service_pack_8,
            'service_pack_9': record.service_pack_9,
        } for record in records]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@pricing_master_bp.route('/pricing_master/seo-services', methods=['GET'])
def get_seo_services():
    try:
        records = PricingMaster.query.filter_by(main_service="SEO Services").all()
        result = [{
            'id': record.id,
            'main_service': record.main_service,
            'service_pack_1': record.service_pack_1,
            'service_pack_2': record.service_pack_2,
            'service_pack_3': record.service_pack_3,
            'service_pack_4': record.service_pack_4,
            'service_pack_5': record.service_pack_5,
            'service_pack_6': record.service_pack_6,
            'service_pack_7': record.service_pack_7,
            'service_pack_8': record.service_pack_8,
            'service_pack_9': record.service_pack_9,
        } for record in records]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@pricing_master_bp.route('/pricing_master/domain-registration-services', methods=['GET'])
def get_domain_registration_pricing():
    records = PricingMaster.query.filter_by(main_service="Domain Registration Services").all()
    result = [{
        'id': record.id,
        'main_service': record.main_service,
        'service_pack_1': record.service_pack_1,
        'service_pack_2': record.service_pack_2,
        'service_pack_3': record.service_pack_3,
        'service_pack_4': record.service_pack_4,
        'service_pack_5': record.service_pack_5,
        'service_pack_6': record.service_pack_6,
        'service_pack_7': record.service_pack_7,
        'service_pack_8': record.service_pack_8,
        'service_pack_9': record.service_pack_9,
    } for record in records]
    return jsonify(result)


@pricing_master_bp.route('/pricing_master/finance-services', methods=['GET'])
def get_finance_services_pricing():
    try:
        records = PricingMaster.query.filter_by(main_service="Finance Services").all()
        result = [{
            'id': record.id,
            'main_service': record.main_service,
            'service_pack_1': record.service_pack_1,
            'service_pack_2': record.service_pack_2,
            'service_pack_3': record.service_pack_3,
            'service_pack_4': record.service_pack_4,
            'service_pack_5': record.service_pack_5,
            'service_pack_6': record.service_pack_6,
            'service_pack_7': record.service_pack_7,
            'service_pack_8': record.service_pack_8,
            'service_pack_9': record.service_pack_9,
        } for record in records]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==========================================
#        ADMIN CRUD API (For Admin Panel)
# ==========================================

# ================= READ (GET ALL) =================
@pricing_master_bp.route('/admin/pricing', methods=['GET'])
def admin_get_pricing():
    try:
        # Sort by newest first
        records = PricingMaster.query.order_by(PricingMaster.id.desc()).all()
        result = []
        for r in records:
            data = {
                'id': r.id,
                'main_service': r.main_service,
                'service_pack_1': r.service_pack_1,
                'service_pack_2': r.service_pack_2,
                'service_pack_3': r.service_pack_3,
                'service_pack_4': r.service_pack_4,
                'service_pack_5': r.service_pack_5,
                'service_pack_6': r.service_pack_6,
                'service_pack_7': r.service_pack_7,
                'service_pack_8': r.service_pack_8,
                'service_pack_9': r.service_pack_9,
            }
            result.append(data)
            
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================= READ (GET BY ID) =================
@pricing_master_bp.route('/admin/pricing/<int:id>', methods=['GET'])
def admin_get_pricing_by_id(id):
    try:
        pricing = PricingMaster.query.get(id)
        if not pricing:
            return jsonify({'error': 'Pricing plan not found'}), 404
        
        result = {
            'id': pricing.id,
            'main_service': pricing.main_service,
            'service_pack_1': pricing.service_pack_1,
            'service_pack_2': pricing.service_pack_2,
            'service_pack_3': pricing.service_pack_3,
            'service_pack_4': pricing.service_pack_4,
            'service_pack_5': pricing.service_pack_5,
            'service_pack_6': pricing.service_pack_6,
            'service_pack_7': pricing.service_pack_7,
            'service_pack_8': pricing.service_pack_8,
            'service_pack_9': pricing.service_pack_9,
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================= CREATE (POST) =================
@pricing_master_bp.route('/admin/pricing', methods=['POST'])
def admin_create_pricing():
    try:
        data = request.get_json()
        
        # Validation
        if not data.get('main_service'):
            return jsonify({'error': 'Main Service Name is required'}), 400

        # Check if service already exists
        existing = PricingMaster.query.filter_by(main_service=data.get('main_service')).first()
        if existing:
            return jsonify({"error": "Pricing for this service already exists"}), 409

        new_pricing = PricingMaster(
            main_service=data.get('main_service'),
            service_pack_1=data.get('service_pack_1'),
            service_pack_2=data.get('service_pack_2'),
            service_pack_3=data.get('service_pack_3'),
            service_pack_4=data.get('service_pack_4'),
            service_pack_5=data.get('service_pack_5'),
            service_pack_6=data.get('service_pack_6'),
            service_pack_7=data.get('service_pack_7'),
            service_pack_8=data.get('service_pack_8'),
            service_pack_9=data.get('service_pack_9')
        )

        db.session.add(new_pricing)
        db.session.commit()
        
        return jsonify({"message": "Pricing plan created successfully", "id": new_pricing.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ================= UPDATE (PUT) =================
@pricing_master_bp.route('/admin/pricing/<int:id>', methods=['PUT'])
def admin_update_pricing(id):
    try:
        pricing = PricingMaster.query.get(id)
        if not pricing:
            return jsonify({"error": "Pricing plan not found"}), 404

        data = request.get_json()

        # Update Main Service Name
        pricing.main_service = data.get('main_service', pricing.main_service)
        
        # Helper to update pack and flag modification
        def update_pack(field_name):
            if field_name in data:
                setattr(pricing, field_name, data[field_name])
                flag_modified(pricing, field_name)  # Important for JSON columns

        # Update all 9 packs if present in request
        for i in range(1, 10):
            update_pack(f"service_pack_{i}")

        db.session.commit()
        return jsonify({"message": "Pricing updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ================= DELETE =================
@pricing_master_bp.route('/admin/pricing/<int:id>', methods=['DELETE'])
def admin_delete_pricing(id):
    try:
        pricing = PricingMaster.query.get(id)
        if not pricing:
            return jsonify({"error": "Pricing plan not found"}), 404

        db.session.delete(pricing)
        db.session.commit()
        return jsonify({"message": "Pricing plan deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ================= TOGGLE POPULAR (PATCH) =================
@pricing_master_bp.route('/admin/pricing/<int:id>/popular', methods=['PATCH'])
def admin_toggle_popular(id):
    try:
        pricing = PricingMaster.query.get(id)
        if not pricing:
            return jsonify({"error": "Pricing plan not found"}), 404

        target_pack = request.json.get('pack')  # e.g., 'service_pack_2'

        # Helper function to modify the JSON dictionary
        def set_popular(pack_data, is_popular):
            if pack_data and isinstance(pack_data, dict):
                pack_data['popular'] = is_popular
                return pack_data
            return pack_data

        # Loop through all packs (1-9) and set popular = False
        for i in range(1, 10):
            field_name = f"service_pack_{i}"
            current_data = getattr(pricing, field_name)
            
            if current_data:
                # Update the JSON content
                updated_data = set_popular(dict(current_data), False)
                
                # If this is the target pack, set to True
                if field_name == target_pack:
                    updated_data = set_popular(updated_data, True)
                
                # Save back to model and flag as modified
                setattr(pricing, field_name, updated_data)
                flag_modified(pricing, field_name)

        db.session.commit()
        return jsonify({"message": "Popular pack updated"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500