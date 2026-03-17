from extensions import db
from models.notification import Notification

def create_notification(user_id: str, notification_type: str, title: str, body: str) -> Notification:
    """Create and persist a notification for a user."""
    notif = Notification(
        user_id=user_id,
        type=notification_type,
        title=title,
        body=body,
    )
    db.session.add(notif)
    db.session.commit()
    return notif

def send_welcome_notification(user_id: str, name: str):
    return create_notification(
        user_id=user_id,
        notification_type="system",
        title=f"Welcome to SaskLifeHub, {name}!",
        body="You're now part of Saskatchewan's all-in-one services hub. Browse the marketplace or explore utilities, finances, and health services.",
    )

def send_order_notification(seller_id: str, buyer_name: str, listing_title: str):
    return create_notification(
        user_id=seller_id,
        notification_type="order",
        title="New order received!",
        body=f"{buyer_name} is interested in your listing: {listing_title}",
    )

def send_listing_notification(user_id: str, listing_title: str):
    return create_notification(
        user_id=user_id,
        notification_type="listing",
        title="Listing posted successfully!",
        body=f'Your listing "{listing_title}" is now live on the marketplace.',
    )
