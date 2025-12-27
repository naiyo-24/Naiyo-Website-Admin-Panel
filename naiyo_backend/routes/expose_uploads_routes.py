from flask import Blueprint, send_from_directory, abort
import os

static_files_bp = Blueprint('static_files_bp', __name__)

# Path to uploads directory (relative to backend root)
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")

@static_files_bp.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    """Serve uploaded files from the uploads directory"""
    try:
        return send_from_directory(uploads_dir, filename)
    except FileNotFoundError:
        abort(404)
