from flask import Flask
from .extensions import db, migrate,jwt
from config import Config
from flask import jsonify
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    CORS(app)
    migrate.init_app(app, db)   
    jwt.init_app(app)


    # Register routes
    from .routes.auth import auth_bp
    from .routes.notes import notes_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(notes_bp, url_prefix="/api/notes")

    return app

def register_error_handlers(app):

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"error": "Internal server error"}), 500

    @app.errorhandler(Exception)
    def handle_exception(error):
        return jsonify({"error": str(error)}), 500

