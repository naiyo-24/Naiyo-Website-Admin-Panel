from flask import Blueprint, jsonify, request
from models.our_projects import OurProjects
from models.db import sqlalchemy_db as db
import uuid
import json

our_projects_bp = Blueprint('our_projects', __name__)


# Helper to safely serialize JSON for frontend display
def safe_serialize(val):
    if val is None:
        return ""
    # If the DB returns a dict or list (because it's a JSON column), verify it's not empty
    if isinstance(val, (dict, list)):
        return json.dumps(val)
    return str(val)


# Helper to prepare JSON for DB insertion
def prepare_json(val):
    # If empty string or None, return empty JSON array/object as string to satisfy NOT NULL constraint
    if not val or str(val).strip() == "":
        return json.dumps([])  # Default to empty list for JSON columns
    # If it's a string that looks like a list, try to parse or just return it
    return val


# ==========================================
#        PUBLIC API (For Naiyo Website)
# ==========================================

# GET all projects (Public)
@our_projects_bp.route('/projects', methods=['GET'])
def get_public_projects():
    records = OurProjects.query.all()
    result = [
        {
            'id': r.project_id,
            'title': r.title,
            'description': r.description,
            'category': r.category,
            'images': r.images,
            'technologies': r.technologies,
            'year': r.year,
            'teamSize': r.team_size,
            'status': r.status,
            'highlights': r.highlights,
            'website': r.website,
            'color': r.color
        } for r in records
    ]
    return jsonify(result)


# Legacy route for backward compatibility
@our_projects_bp.route('/our_projects', methods=['GET'])
def get_our_projects_legacy():
    records = OurProjects.query.all()
    result = [
        {
            'id': r.project_id,
            'title': r.title,
            'description': r.description,
            'category': r.category,
            'images': r.images,
            'technologies': r.technologies,
            'year': r.year,
            'teamSize': r.team_size,
            'status': r.status,
            'highlights': r.highlights,
            'website': r.website,
            'color': r.color
        } for r in records
    ]
    return jsonify(result)


# ==========================================
#        ADMIN CRUD API (For Admin Panel)
# ==========================================

# ================= READ (GET ALL) =================
@our_projects_bp.route('/admin/projects', methods=['GET'])
def admin_get_projects():
    try:
        # Sort by title since ID is random string now
        records = OurProjects.query.order_by(OurProjects.title.asc()).all()
        result = [
            {
                'id': r.project_id,
                'title': r.title,
                'description': r.description,
                'category': r.category,
                'images': safe_serialize(r.images),
                'technologies': safe_serialize(r.technologies),
                'year': r.year,
                'teamSize': r.team_size,
                'status': r.status,
                'highlights': safe_serialize(r.highlights),
                'website': r.website,
                'color': r.color
            } for r in records
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================= READ (GET BY ID) =================
@our_projects_bp.route('/admin/projects/<string:id>', methods=['GET'])
def admin_get_project_by_id(id):
    try:
        project = OurProjects.query.get(id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        result = {
            'id': project.project_id,
            'title': project.title,
            'description': project.description,
            'category': project.category,
            'images': safe_serialize(project.images),
            'technologies': safe_serialize(project.technologies),
            'year': project.year,
            'teamSize': project.team_size,
            'status': project.status,
            'highlights': safe_serialize(project.highlights),
            'website': project.website,
            'color': project.color
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================= CREATE (POST) =================
@our_projects_bp.route('/admin/projects', methods=['POST'])
def admin_create_project():
    try:
        data = request.get_json()
        
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400

        # Generate a String ID
        new_id = str(uuid.uuid4())

        new_project = OurProjects(
            project_id=new_id,
            title=data.get('title'),
            description=data.get('description', ''),
            category=data.get('category', 'Web Development'),
            
            # Handle JSON columns - Postgres requires valid JSON for json type
            images=prepare_json(data.get('images')),
            technologies=prepare_json(data.get('technologies')),
            highlights=prepare_json(data.get('highlights')),
            
            # Handle NOT NULL Varchar columns with defaults
            status=data.get('status', 'Completed'),
            year=data.get('year', '2024'),
            team_size=data.get('teamSize', '1'),
            color=data.get('color', '#000000'),
            
            # Optional nullable field
            website=data.get('website')
        )

        db.session.add(new_project)
        db.session.commit()

        return jsonify({'message': 'Project created successfully', 'id': new_id}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating project: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ================= UPDATE (PUT) =================
@our_projects_bp.route('/admin/projects/<string:id>', methods=['PUT'])
def admin_update_project(id):
    try:
        project = OurProjects.query.get(id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404

        data = request.get_json()

        if 'title' in data:
            project.title = data['title']
        if 'description' in data:
            project.description = data['description']
        if 'category' in data:
            project.category = data['category']
        if 'images' in data:
            project.images = prepare_json(data['images'])
        if 'technologies' in data:
            project.technologies = prepare_json(data['technologies'])
        if 'highlights' in data:
            project.highlights = prepare_json(data['highlights'])
        if 'status' in data:
            project.status = data['status']
        if 'year' in data:
            project.year = data['year']
        if 'teamSize' in data:
            project.team_size = data['teamSize']
        if 'color' in data:
            project.color = data['color']
        if 'website' in data:
            project.website = data['website']

        db.session.commit()
        return jsonify({'message': 'Project updated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating project: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ================= DELETE =================
@our_projects_bp.route('/admin/projects/<string:id>', methods=['DELETE'])
def admin_delete_project(id):
    try:
        project = OurProjects.query.get(id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404

        db.session.delete(project)
        db.session.commit()
        return jsonify({'message': 'Project deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500