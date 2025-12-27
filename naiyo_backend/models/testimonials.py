from models.db import sqlalchemy_db as db

class Testimonial(db.Model):
	__tablename__ = 'testimonials'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(100), nullable=False)
	role = db.Column(db.String(100), nullable=True)
	company = db.Column(db.String(100), nullable=True) 
	content = db.Column(db.Text, nullable=False)
	rating = db.Column(db.Float, nullable=True)