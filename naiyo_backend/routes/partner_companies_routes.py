from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError
from models.db import sqlalchemy_db as db
from models.partner_companies import PartnerCompanies

partner_companies_bp = Blueprint("partner_companies_bp", __name__)


# ==========================================
#        PUBLIC API (For Naiyo Website)
# ==========================================

# GET all partner companies (Public)
@partner_companies_bp.route("/partners", methods=["GET"])
def get_public_partners():
    records = PartnerCompanies.query.all()
    return jsonify([{
        "id": r.id,
        "initials": r.initials,
        "name": r.name,
        "short_desc": r.short_desc,
        "color": r.color,
        "website": r.website,
        "logo": r.logo
    } for r in records]), 200


# Legacy route for backward compatibility
@partner_companies_bp.route("/partner_companies", methods=["GET"])
def get_partner_companies():
    records = PartnerCompanies.query.all()
    return jsonify([{
        "initials": r.initials,
        "name": r.name,
        "short_desc": r.short_desc,
        "color": r.color,
        "website": r.website,
        "logo": r.logo
    } for r in records]), 200


# ==========================================
#        ADMIN CRUD API (For Admin Panel)
# ==========================================

# ================= READ (GET ALL) =================
@partner_companies_bp.route("/admin/partners", methods=["GET"])
def admin_get_partners():
    try:
        # Sort by newest first
        records = PartnerCompanies.query.order_by(PartnerCompanies.id.desc()).all()
        return jsonify([{
            "id": r.id,
            "name": r.name,
            "initials": r.initials,
            "short_desc": r.short_desc,
            "color": r.color,
            "website": r.website,
            "logo": r.logo
        } for r in records]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= READ (GET BY ID) =================
@partner_companies_bp.route("/admin/partners/<int:id>", methods=["GET"])
def admin_get_partner_by_id(id):
    try:
        partner = PartnerCompanies.query.get(id)
        if not partner:
            return jsonify({"error": "Partner not found"}), 404
        
        return jsonify({
            "id": partner.id,
            "name": partner.name,
            "initials": partner.initials,
            "short_desc": partner.short_desc,
            "color": partner.color,
            "website": partner.website,
            "logo": partner.logo
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= CREATE (POST) =================
@partner_companies_bp.route("/admin/partners", methods=["POST"])
def admin_create_partner():
    try:
        data = request.get_json(silent=True) or {}
        
        if not data.get("name"):
            return jsonify({"error": "Partner Name is required"}), 400

        partner = PartnerCompanies(
            name=data.get("name"),
            initials=data.get("initials"),
            short_desc=data.get("short_desc"),
            color=data.get("color"),
            website=data.get("website"),
            logo=data.get("logo") or None
        )

        db.session.add(partner)
        db.session.commit()

        return jsonify({"message": "Partner created successfully", "id": partner.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ================= UPDATE (PUT) =================
@partner_companies_bp.route("/admin/partners/<int:id>", methods=["PUT"])
def admin_update_partner(id):
    try:
        partner = PartnerCompanies.query.get(id)
        if not partner:
            return jsonify({"error": "Partner not found"}), 404

        data = request.get_json(silent=True) or {}

        partner.name = data.get("name", partner.name)
        partner.initials = data.get("initials", partner.initials)
        partner.short_desc = data.get("short_desc", partner.short_desc)
        partner.color = data.get("color", partner.color)
        partner.website = data.get("website", partner.website)
        partner.logo = data.get("logo", partner.logo)

        db.session.commit()
        return jsonify({"message": "Partner updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ================= DELETE =================
@partner_companies_bp.route("/admin/partners/<int:id>", methods=["DELETE"])
def admin_delete_partner(id):
    try:
        partner = PartnerCompanies.query.get(id)
        if not partner:
            return jsonify({"error": "Partner not found"}), 404

        db.session.delete(partner)
        db.session.commit()
        return jsonify({"message": "Partner deleted successfully"}), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Partner is in use and cannot be deleted"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ==========================================
#        LEGACY ROUTES (Backward Compatibility)
# ==========================================

@partner_companies_bp.route("/admin/partner_companies", methods=["GET"])
def admin_get_partner_companies():
    """Legacy endpoint - use /admin/partners GET instead"""
    try:
        records = PartnerCompanies.query.order_by(PartnerCompanies.id.desc()).all()
        return jsonify([{
            "id": r.id,
            "name": r.name,
            "initials": r.initials,
            "short_desc": r.short_desc,
            "color": r.color,
            "website": r.website,
            "logo": r.logo
        } for r in records]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@partner_companies_bp.route("/admin/partner_companies", methods=["POST"])
def admin_create_partner_legacy():
    """Legacy endpoint - use /admin/partners POST instead"""
    try:
        data = request.get_json(silent=True) or {}
        
        if not data.get("name"):
            return jsonify({"error": "Partner Name is required"}), 400

        partner = PartnerCompanies(
            name=data.get("name"),
            initials=data.get("initials"),
            short_desc=data.get("short_desc"),
            color=data.get("color"),
            website=data.get("website"),
            logo=data.get("logo") or None
        )

        db.session.add(partner)
        db.session.commit()

        return jsonify({"message": "Partner created successfully", "id": partner.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@partner_companies_bp.route("/admin/partner_companies/<int:id>", methods=["PUT"])
def admin_update_partner_legacy(id):
    """Legacy endpoint - use /admin/partners/<id> PUT instead"""
    try:
        partner = PartnerCompanies.query.get(id)
        if not partner:
            return jsonify({"error": "Partner not found"}), 404

        data = request.get_json(silent=True) or {}

        partner.name = data.get("name", partner.name)
        partner.initials = data.get("initials", partner.initials)
        partner.short_desc = data.get("short_desc", partner.short_desc)
        partner.color = data.get("color", partner.color)
        partner.website = data.get("website", partner.website)
        partner.logo = data.get("logo", partner.logo)

        db.session.commit()
        return jsonify({"message": "Partner updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@partner_companies_bp.route("/admin/partner_companies/<int:id>", methods=["DELETE"])
def admin_delete_partner_legacy(id):
    """Legacy endpoint - use /admin/partners/<id> DELETE instead"""
    try:
        partner = PartnerCompanies.query.get(id)
        if not partner:
            return jsonify({"error": "Partner not found"}), 404

        db.session.delete(partner)
        db.session.commit()
        return jsonify({"message": "Partner deleted successfully"}), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Partner is in use and cannot be deleted"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500