from flask import Blueprint, jsonify, request
from models.service_master import ServiceMaster
# --- FIX: Import db correctly to match main.py ---
from models.db import sqlalchemy_db as db  

service_master_bp = Blueprint('service_master_bp', __name__)


# ==========================================
#        PUBLIC API (For Naiyo Website)
# ==========================================

# GET all services (Public)
@service_master_bp.route('/services', methods=['GET'])
def get_public_services():
    records = ServiceMaster.query.all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


# GET unique main services (Public)
@service_master_bp.route('/services/categories', methods=['GET'])
def get_service_categories():
    unique_services = ServiceMaster.query.with_entities(ServiceMaster.main_service).distinct().all()
    result = [s.main_service for s in unique_services if s.main_service]
    return jsonify(result)


# GET services by category (Public)
@service_master_bp.route('/services/<string:category>', methods=['GET'])
def get_services_by_category(category):
    # Convert URL-friendly category to actual category name
    category_map = {
        'web-development-services': 'Web Development Services',
        'mobile-application-services': 'Mobile Application Services',
        'servers-and-hosting-services': 'Servers & Hosting Services',
        'professional-email-services': 'Professional Email Services',
        'domain-registration-services': 'Domain Registration Services',
        'marketing-services': 'Marketing Services',
        'business-solution-services': 'Business Solution Services',
        'logo-and-branding-services': 'Logo & Branding Services',
        'seo-services': 'SEO Services',
        'market-research-services': 'Market Research Services',
        'finance-services': 'Finance Services',
        'miscservices': 'MISC'
    }
    
    actual_category = category_map.get(category.lower(), category)
    records = ServiceMaster.query.filter_by(main_service=actual_category).all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


# ==========================================
#        LEGACY PUBLIC ROUTES (Backward Compatibility)
# ==========================================

# Ping route for health check
@service_master_bp.route('/service_master/ping', methods=['GET'])
def ping():
    return {'message': 'service_master blueprint active'}


@service_master_bp.route('/service_master/miscservices', methods=['GET'])
def get_service_master_misc_services():
    records = ServiceMaster.query.filter_by(main_service='MISC').all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


@service_master_bp.route('/service_master/web-development-services', methods=['GET'])
def get_service_master_webdevelopment_services():
    records = ServiceMaster.query.filter_by(main_service='Web Development Services').all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


@service_master_bp.route('/service_master/mobile-application-services', methods=['GET'])
def get_service_master_mobile_application_services():
    records = ServiceMaster.query.filter_by(main_service='Mobile Application Services').all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


@service_master_bp.route('/service_master/servers-and-hosting-services', methods=['GET'])
def get_service_master_servers_and_hosting_services():
    records = ServiceMaster.query.filter_by(main_service='Servers & Hosting Services').all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


@service_master_bp.route('/service_master/professional-email-services', methods=['GET'])
def get_service_master_professional_email_services():
    records = ServiceMaster.query.filter_by(main_service='Professional Email Services').all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


@service_master_bp.route('/service_master/domain-registration-services', methods=['GET'])
def get_service_master_domain_registration_services():
    records = ServiceMaster.query.filter_by(main_service='Domain Registration Services').all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


@service_master_bp.route('/service_master/marketing-services', methods=['GET'])
def get_service_master_marketing_services():
    records = ServiceMaster.query.filter_by(main_service='Marketing Services').all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


@service_master_bp.route('/service_master/business-solution-services', methods=['GET'])
def get_service_master_business_solution_services():
    records = ServiceMaster.query.filter_by(main_service='Business Solution Services').all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


@service_master_bp.route('/service_master/logo-and-branding-services', methods=['GET'])
def get_service_master_logo_and_branding_services():
    records = ServiceMaster.query.filter_by(main_service='Logo & Branding Services').all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


@service_master_bp.route('/service_master/seo-services', methods=['GET'])
def get_service_master_seo_services():
    records = ServiceMaster.query.filter_by(main_service='SEO Services').all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


@service_master_bp.route('/service_master/market-research-services', methods=['GET'])
def get_service_master_market_research_services():
    records = ServiceMaster.query.filter_by(main_service='Market Research Services').all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


@service_master_bp.route('/service_master/finance-services', methods=['GET'])
def get_service_master_finance_services():
    records = ServiceMaster.query.filter_by(main_service='Finance Services').all()
    result = [{
        'service_id': r.service_id,
        'main_service': r.main_service,
        'sub_service': r.sub_service,
        'service_logo': r.service_logo,
        'short_desc': r.short_desc,
        'long_desc': r.long_desc,
        'service_charge': r.service_charge
    } for r in records]
    return jsonify(result)


@service_master_bp.route('/service_master/unique_main_services', methods=['GET'])
def get_unique_main_services():
    unique_services = ServiceMaster.query.with_entities(ServiceMaster.main_service).distinct().all()
    result = [s.main_service for s in unique_services if s.main_service]
    return jsonify(result)


# ==========================================
#        ADMIN CRUD API (For Admin Panel)
# ==========================================

# ================= READ (GET ALL) =================
@service_master_bp.route("/admin/services", methods=["GET"])
def admin_get_services():
    try:
        services = ServiceMaster.query.order_by(ServiceMaster.service_id.desc()).all()
        return jsonify([
            {
                "service_id": s.service_id,
                "main_service": s.main_service,
                "sub_service": s.sub_service,
                "short_desc": s.short_desc,
                "long_desc": s.long_desc,
                "service_charge": s.service_charge,
                "service_logo": s.service_logo
            } for s in services
        ]), 200
    except Exception as e:
        print(f"Error fetching services: {str(e)}")
        return jsonify({"error": str(e)}), 500


# ================= READ (GET BY ID) =================
@service_master_bp.route("/admin/services/<int:service_id>", methods=["GET"])
def admin_get_service_by_id(service_id):
    try:
        service = ServiceMaster.query.get(service_id)
        if not service:
            return jsonify({"error": "Service not found"}), 404
        
        return jsonify({
            "service_id": service.service_id,
            "main_service": service.main_service,
            "sub_service": service.sub_service,
            "short_desc": service.short_desc,
            "long_desc": service.long_desc,
            "service_charge": service.service_charge,
            "service_logo": service.service_logo
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= CREATE (POST) =================
@service_master_bp.route("/admin/services", methods=["POST"])
def admin_create_service():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Debug print
        print(f"Received create data: {data}")

        # Validate and convert service_charge
        try:
            service_charge = int(data.get("service_charge", 0))
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid service charge format"}), 400

        service = ServiceMaster(
            main_service=data.get("main_service"),
            sub_service=data.get("sub_service"),
            short_desc=data.get("short_desc"),
            long_desc=data.get("long_desc"),
            service_charge=service_charge,
            service_logo=data.get("service_logo")
        )

        db.session.add(service)
        db.session.commit()

        return jsonify({"message": "Service created successfully", "id": service.service_id}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Error creating service: {str(e)}")
        return jsonify({"error": str(e)}), 500


# ================= UPDATE (PUT) =================
@service_master_bp.route("/admin/services/<int:service_id>", methods=["PUT"])
def admin_update_service(service_id):
    try:
        service = ServiceMaster.query.get(service_id)
        if not service:
            return jsonify({"error": "Service not found"}), 404
        
        data = request.json

        # Debug print
        print(f"Received update data for {service_id}: {data}")

        service.main_service = data.get("main_service", service.main_service)
        service.sub_service = data.get("sub_service", service.sub_service)
        service.short_desc = data.get("short_desc", service.short_desc)
        service.long_desc = data.get("long_desc", service.long_desc)
        
        if "service_charge" in data:
            try:
                service.service_charge = int(data.get("service_charge"))
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid service charge format"}), 400
        
        if "service_logo" in data:
            service.service_logo = data.get("service_logo")

        db.session.commit()
        return jsonify({"message": "Service updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating service: {str(e)}")
        return jsonify({"error": str(e)}), 500


# ================= DELETE =================
@service_master_bp.route("/admin/services/<int:service_id>", methods=["DELETE"])
def admin_delete_service(service_id):
    try:
        service = ServiceMaster.query.get(service_id)
        if not service:
            return jsonify({"error": "Service not found"}), 404
        
        db.session.delete(service)
        db.session.commit()
        return jsonify({"message": "Service deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting service: {str(e)}")
        return jsonify({"error": str(e)}), 500