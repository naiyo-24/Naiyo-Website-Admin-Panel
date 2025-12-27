from models.db import sqlalchemy_db as db

class PricingMaster(db.Model):
	__tablename__ = 'pricing_master'

	id = db.Column(db.Integer, primary_key=True)
	main_service = db.Column(db.String(128), nullable=False)
	service_pack_1 = db.Column(db.JSON, nullable=True)
	service_pack_2 = db.Column(db.JSON, nullable=True)
	service_pack_3 = db.Column(db.JSON, nullable=True)
	service_pack_4 = db.Column(db.JSON, nullable=True)
	service_pack_5 = db.Column(db.JSON, nullable=True)
	service_pack_6 = db.Column(db.JSON, nullable=True)
	service_pack_7 = db.Column(db.JSON, nullable=True)
	service_pack_8 = db.Column(db.JSON, nullable=True)
	service_pack_9 = db.Column(db.JSON, nullable=True)