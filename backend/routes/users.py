from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User

users_bp = Blueprint("users", __name__, url_prefix="/users")


@users_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    allowed = ["name", "bio", "location", "phone"]
    for field in allowed:
        if field in data:
            value = data[field]
            if field == "name" and (not value or len(value.strip()) < 2):
                return jsonify({"error": "Name must be at least 2 characters"}), 400
            setattr(user, field, value.strip() if isinstance(value, str) else value)

    db.session.commit()
    return jsonify({"user": user.to_dict()}), 200


@users_bp.route("/<user_id>", methods=["GET"])
def get_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    # Return public profile only
    return jsonify({
        "user": {
            "id": user.id,
            "name": user.name,
            "bio": user.bio,
            "location": user.location,
            "avatar_url": user.avatar_url,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat(),
        }
    }), 200
