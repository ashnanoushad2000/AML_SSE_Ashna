from app import create_app
from app.models import db
from app.models.activity_log import ActivityLog  # ✅ only needed if using logging

app = create_app()

with app.app_context():
    db.create_all()  # 👈 This will create all tables in the DB
    print("✅ All tables created.")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
