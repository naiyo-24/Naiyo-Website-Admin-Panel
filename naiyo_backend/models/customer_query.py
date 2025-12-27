from models.db import sqlalchemy_db as db
from datetime import datetime

class CustomerQuery(db.Model):
    __tablename__ = 'customer_query'

    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    cust_email = db.Column(db.String(120), nullable=False)
    cust_phone = db.Column(db.String(20), nullable=False)
    query_subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    selected_plan = db.Column(db.String(100))   
    service_type = db.Column(db.String(150))
    service_price = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    

