import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from extensions import db
from models.listing import Listing, Order, LISTING_CATEGORIES
from models.user import User
from services.notification_service import send_order_notification, send_listing_notification

marketplace_bp = Blueprint("marketplace", __name__, url_prefix="/marketplace")


@marketplace_bp.route("/listings", methods=["GET"])
def get_listings():
    category = request.args.get("category", "")
    search = request.args.get("search", "")
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))

    query = Listing.query.filter_by(status="active")

    if category and category in LISTING_CATEGORIES:
        query = query.filter_by(category=category)

    if search:
        query = query.filter(
            db.or_(
                Listing.title.ilike(f"%{search}%"),
                Listing.description.ilike(f"%{search}%"),
            )
        )

    pagination = query.order_by(Listing.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "listings": [l.to_dict() for l in pagination.items],
        "total": pagination.total,
        "page": page,
        "pages": pagination.pages,
    }), 200


@marketplace_bp.route("/listings/<listing_id>", methods=["GET"])
def get_listing(listing_id):
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    return jsonify({"listing": listing.to_dict()}), 200


@marketplace_bp.route("/listings", methods=["POST"])
@jwt_required()
def create_listing():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Support both JSON and form data
    if request.content_type and "multipart/form-data" in request.content_type:
        data = request.form
    else:
        data = request.get_json() or {}

    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    price = data.get("price")
    category = (data.get("category") or "").strip()
    location = (data.get("location") or "").strip()
    price_unit = (data.get("price_unit") or "").strip() or None

    if not all([title, description, price, category, location]):
        return jsonify({"error": "title, description, price, category, and location are required"}), 400
    if category not in LISTING_CATEGORIES:
        return jsonify({"error": f"Invalid category. Must be one of: {', '.join(LISTING_CATEGORIES)}"}), 400

    try:
        price = float(price)
        if price <= 0:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({"error": "Price must be a positive number"}), 400

    listing = Listing(
        title=title,
        description=description,
        price=price,
        price_unit=price_unit,
        category=category,
        location=location,
        seller_id=user_id,
        images=[],
    )
    db.session.add(listing)
    db.session.commit()

    try:
        send_listing_notification(user_id, title)
    except Exception:
        pass

    return jsonify({"listing": listing.to_dict()}), 201


@marketplace_bp.route("/listings/<listing_id>", methods=["PUT"])
@jwt_required()
def update_listing(listing_id):
    user_id = get_jwt_identity()
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    if listing.seller_id != user_id:
        return jsonify({"error": "Not authorized"}), 403

    data = request.get_json() or {}
    allowed = ["title", "description", "price", "price_unit", "status"]
    for field in allowed:
        if field in data:
            setattr(listing, field, data[field])

    db.session.commit()
    return jsonify({"listing": listing.to_dict()}), 200


@marketplace_bp.route("/listings/<listing_id>", methods=["DELETE"])
@jwt_required()
def delete_listing(listing_id):
    user_id = get_jwt_identity()
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    if listing.seller_id != user_id:
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(listing)
    db.session.commit()
    return jsonify({"message": "Listing deleted"}), 200


@marketplace_bp.route("/orders", methods=["POST"])
@jwt_required()
def create_order():
    buyer_id = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get("listing_id"):
        return jsonify({"error": "listing_id is required"}), 400

    listing = Listing.query.get(data["listing_id"])
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    if listing.status != "active":
        return jsonify({"error": "Listing is no longer available"}), 400
    if listing.seller_id == buyer_id:
        return jsonify({"error": "You cannot order your own listing"}), 400

    order = Order(
        listing_id=listing.id,
        buyer_id=buyer_id,
        seller_id=listing.seller_id,
        amount=listing.price,
        status="pending",
    )
    db.session.add(order)
    db.session.commit()

    buyer = User.query.get(buyer_id)
    try:
        send_order_notification(listing.seller_id, buyer.name if buyer else "Someone", listing.title)
    except Exception:
        pass

    return jsonify({"order": order.to_dict()}), 201


@marketplace_bp.route("/orders", methods=["GET"])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    role = request.args.get("role", "buyer")

    if role == "seller":
        orders = Order.query.filter_by(seller_id=user_id).order_by(Order.created_at.desc()).all()
    else:
        orders = Order.query.filter_by(buyer_id=user_id).order_by(Order.created_at.desc()).all()

    return jsonify({"orders": [o.to_dict() for o in orders]}), 200
