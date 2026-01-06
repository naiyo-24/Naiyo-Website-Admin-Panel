# main.py
# Entry point for Naiyo24 backend Flask app
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy import create_engine
import os
import sys
import logging

from models.db import sqlalchemy_db as db
from models.about_naiyo import AboutNaiyo
from models.customer_query import CustomerQuery
from models.partner_companies import PartnerCompanies
from models.service_master import ServiceMaster
from models.pricing_master import PricingMaster
from models.testimonials import Testimonial
from models.our_projects import OurProjects
from models.admin_user import AdminUser
from routes.testimonials_routes import testimonials_bp


# Ensure parent directory is in sys.path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])


# Database configuration
DATABASE_URL = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Test database connection
engine = create_engine(DATABASE_URL)
try:
    conn = engine.connect()
    conn.close()
except Exception as e:
    print(f"Database connection error: {e}")

# Create tables
with app.app_context():
    try:
        db.create_all()  # Only creates tables if not present
        logging.info("All tables created successfully.")
    except Exception as e:
        logging.error(f"Error creating tables: {e}")

from routes.about_naiyo_routes import about_naiyo_bp
from routes.customer_query_routes import customer_query_bp
from routes.partner_companies_routes import partner_companies_bp
from routes.service_master_routes import service_master_bp
from routes.pricing_master_routes import pricing_master_bp
from routes.testimonials_routes import testimonials_bp
from routes.our_projects_routes import our_projects_bp
from routes.expose_uploads_routes import static_files_bp
from routes.auth_routes import auth_bp
app.register_blueprint(about_naiyo_bp)
app.register_blueprint(customer_query_bp)
app.register_blueprint(partner_companies_bp)
app.register_blueprint(service_master_bp)
app.register_blueprint(pricing_master_bp)
app.register_blueprint(testimonials_bp)
app.register_blueprint(our_projects_bp)
app.register_blueprint(static_files_bp)
app.register_blueprint(auth_bp)

# Root route to verify backend is running
@app.route('/')
def index():
	return "Naiyo24 backend is running!"

if __name__ == "__main__":
	# Listen on port 5010 for local and Docker compatibility
	app.run(host='0.0.0.0', port=5010, debug=False)
