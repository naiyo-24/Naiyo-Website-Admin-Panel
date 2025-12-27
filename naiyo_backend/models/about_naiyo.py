from models.db import sqlalchemy_db as db

class AboutNaiyo(db.Model):
	__tablename__ = 'about_naiyo'
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(128), nullable=False)
	address = db.Column(db.String(256), nullable=True)
	phone = db.Column(db.String(32), nullable=True)
	landline = db.Column(db.String(32), nullable=True)
	email = db.Column(db.String(128), nullable=True)
	website = db.Column(db.String(128), nullable=True)
	about_us = db.Column(db.Text, nullable=True)
	ceo_name = db.Column(db.String(128), nullable=True)
	ceo_message = db.Column(db.Text, nullable=True)
	mission = db.Column(db.Text, nullable=True)
	vision = db.Column(db.Text, nullable=True)
	business_hours = db.Column(db.Text, nullable=True)
