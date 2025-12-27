from models.db import sqlalchemy_db as db

class PartnerCompanies(db.Model):
	__tablename__ = 'partner_companies'

	id = db.Column(db.Integer, primary_key=True)
	logo = db.Column(db.String(256), nullable=True)
	initials = db.Column(db.String(10), nullable=False)
	name = db.Column(db.String(128), nullable=False)
	contact = db.Column(db.String(128), nullable=True)
	short_desc = db.Column(db.String(256), nullable=True)
	long_desc = db.Column(db.Text, nullable=True)
	color = db.Column(db.String(32), nullable=True)
	website = db.Column(db.String(256), nullable=True)
