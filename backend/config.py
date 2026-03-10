import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.environ.get('MONGODB_URI')
    DB_NAME = os.environ.get('MONGODB_DB', 'portfolio_db')
    COLLECTION = os.environ.get('MONGODB_COLLECTION', 'contacts')
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    ADMIN_SECRET = os.environ.get('ADMIN_SECRET', 'admin123')
    PORT = int(os.environ.get('PORT', 5000))

    # SMTP Configuration
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_FROM = os.environ.get('MAIL_FROM', 'noreply@portfolio.com')
    MAIL_TO = os.environ.get('MAIL_TO', 'duraiaravindh2002@gmail.com')
