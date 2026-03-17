import uuid
from datetime import datetime
from extensions import db

LISTING_CATEGORIES = [
    "Local Goods", "Agricultural Equipment", "Construction Services",
    "Homemade Food", "Second-Hand Goods", "Local Services",
    "Manufacturing Machinery", "Event Planning",
]

class Listing(db.Model):
    __tablename__ = "listings"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    price_unit = db.Column(db.String(50), nullable=True)
    category = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    images = db.Column(db.JSON, default=list)
    seller_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    status = db.Column(db.String(20), default="active", nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    seller = db.relationship("User", back_populates="listings", foreign_keys=[seller_id])
    orders = db.relationship("Order", back_populates="listing", lazy="dynamic")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "price": float(self.price),
            "price_unit": self.price_unit,
            "category": self.category,
            "location": self.location,
            "images": self.images or [],
            "seller_id": self.seller_id,
            "seller_name": self.seller.name if self.seller else "",
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    listing_id = db.Column(db.String(36), db.ForeignKey("listings.id"), nullable=False)
    buyer_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    seller_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    status = db.Column(db.String(20), default="pending", nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    listing = db.relationship("Listing", back_populates="orders")
    buyer = db.relationship("User", foreign_keys=[buyer_id])
    seller = db.relationship("User", foreign_keys=[seller_id])

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "listing_id": self.listing_id,
            "buyer_id": self.buyer_id,
            "seller_id": self.seller_id,
            "status": self.status,
            "amount": float(self.amount),
            "created_at": self.created_at.isoformat(),
        }
