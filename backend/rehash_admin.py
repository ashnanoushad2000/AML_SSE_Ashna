# rehash_admin.py

from app import create_app, db
from app.models import Users
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    admin = Users.query.filter_by(email='mcgonagall@hogwarts.edu').first()
    if admin:
        admin.password_hash = generate_password_hash('hash123')
        db.session.commit()
        print("✅ Admin password updated to hashed version.")
    else:
        print("❌ Admin not found.")
