from models.db import sqlalchemy_db as db

class ServiceMaster(db.Model):
	__tablename__ = 'service_master'

	service_id = db.Column(db.Integer, primary_key=True)
	main_service = db.Column(db.String(128), nullable=False)
	sub_service = db.Column(db.String(128), nullable=True)
	service_logo = db.Column(db.String(128), nullable=True)
	short_desc = db.Column(db.String(256), nullable=True)
	long_desc = db.Column(db.Text, nullable=True)
	service_charge = db.Column(db.Float, nullable=True)