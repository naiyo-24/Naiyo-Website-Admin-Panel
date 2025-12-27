from flask_sqlalchemy import SQLAlchemy
sqlalchemy_db = SQLAlchemy()

# Provide db_session for compatibility
db_session = sqlalchemy_db.session
