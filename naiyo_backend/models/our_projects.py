from models.db import sqlalchemy_db as db

class OurProjects(db.Model):
    __tablename__ = 'our_projects'
    
    project_id = db.Column(db.String(100), primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(255), nullable=False)
    images = db.Column(db.JSON, nullable=False)  # Store as JSON array
    technologies = db.Column(db.JSON, nullable=False)  # Store as JSON array
    year = db.Column(db.String(10), nullable=False)
    team_size = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    highlights = db.Column(db.JSON, nullable=False)  # Store as JSON array
    website = db.Column(db.String(500), nullable=True)
    color = db.Column(db.String(7), nullable=False)  # Hex color code