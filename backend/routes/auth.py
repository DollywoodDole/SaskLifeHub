import secrets
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from extensions import db
from models.user import User
from services.notification_service import send_welcome_notification
from services.email_service import send_verification_email, send_password_reset_email

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    name = data.get("name", "").strip()

    if not email or not password or not name:
        return jsonify({"error": "Email, password, and name are required"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with this email already exists"}), 409

    user = User(email=email, name=name)
    user.set_password(password)
    user.email_verification_token = secrets.token_urlsafe(32)
    user.email_verification_expires = datetime.now(timezone.utc) + timedelta(hours=24)

    db.session.add(user)
    db.session.commit()

    # Send verification email (non-blocking failure)
    try:
        send_verification_email(email, name, user.email_verification_token)
    except Exception:
        pass

    # Send welcome notification
    try:
        send_welcome_notification(user.id, name)
    except Exception:
        pass

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(),
        "message": "Account created! Please check your email to verify your account.",
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(),
    }), 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    access_token = create_access_token(identity=user_id)
    return jsonify({"access_token": access_token}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200


@auth_bp.route("/verify-email", methods=["POST"])
def verify_email():
    data = request.get_json()
    token = data.get("token", "") if data else ""
    if not token:
        return jsonify({"error": "Token is required"}), 400

    user = User.query.filter_by(email_verification_token=token).first()
    if not user:
        return jsonify({"error": "Invalid or expired verification token"}), 400

    if user.email_verification_expires and datetime.now(timezone.utc) > user.email_verification_expires.replace(tzinfo=timezone.utc):
        return jsonify({"error": "Verification link has expired. Please request a new one."}), 400

    user.is_verified = True
    user.email_verification_token = None
    user.email_verification_expires = None
    db.session.commit()

    return jsonify({"message": "Email verified successfully"}), 200


@auth_bp.route("/resend-verification", methods=["POST"])
def resend_verification():
    data = request.get_json()
    email = (data.get("email", "") if data else "").strip().lower()
    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "If that account exists, a verification email has been sent"}), 200
    if user.is_verified:
        return jsonify({"message": "Email is already verified"}), 200

    user.email_verification_token = secrets.token_urlsafe(32)
    user.email_verification_expires = datetime.now(timezone.utc) + timedelta(hours=24)
    db.session.commit()

    try:
        send_verification_email(email, user.name, user.email_verification_token)
    except Exception:
        return jsonify({"error": "Failed to send email. Please try again later."}), 500

    return jsonify({"message": "Verification email sent"}), 200


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = (data.get("email", "") if data else "").strip().lower()
    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    # Always return success to prevent email enumeration
    if not user:
        return jsonify({"message": "If that account exists, a password reset email has been sent"}), 200

    user.password_reset_token = secrets.token_urlsafe(32)
    user.password_reset_expires = datetime.now(timezone.utc) + timedelta(hours=1)
    db.session.commit()

    try:
        send_password_reset_email(email, user.name, user.password_reset_token)
    except Exception:
        return jsonify({"error": "Failed to send email. Please try again later."}), 500

    return jsonify({"message": "If that account exists, a password reset email has been sent"}), 200


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    token = data.get("token", "") if data else ""
    password = data.get("password", "") if data else ""

    if not token or not password:
        return jsonify({"error": "Token and password are required"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    user = User.query.filter_by(password_reset_token=token).first()
    if not user:
        return jsonify({"error": "Invalid or expired reset token"}), 400
    if datetime.now(timezone.utc) > user.password_reset_expires.replace(tzinfo=timezone.utc):
        return jsonify({"error": "Reset link has expired. Please request a new one."}), 400

    user.set_password(password)
    user.password_reset_token = None
    user.password_reset_expires = None
    db.session.commit()

    return jsonify({"message": "Password reset successfully"}), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # Stateless JWT — client clears cookies; server-side blacklist can be added here with Redis
    return jsonify({"message": "Logged out successfully"}), 200
