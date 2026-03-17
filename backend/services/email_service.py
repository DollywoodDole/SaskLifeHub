from flask import current_app
from flask_mail import Message
from extensions import mail


def _mail_configured() -> bool:
    return bool(
        current_app.config.get("MAIL_SERVER")
        and current_app.config.get("MAIL_USERNAME")
    )


def send_verification_email(email: str, name: str, token: str):
    if not _mail_configured():
        frontend_url = current_app.config.get("FRONTEND_URL", "http://localhost:3000")
        verify_url = f"{frontend_url}/auth/verify-email?token={token}"
        current_app.logger.info(
            f"[DEV] Email skipped (MAIL not configured). Verify URL: {verify_url}"
        )
        return

    frontend_url = current_app.config.get("FRONTEND_URL", "http://localhost:3000")
    verify_url = f"{frontend_url}/auth/verify-email?token={token}"
    msg = Message(
        subject="Verify your SaskLifeHub account",
        recipients=[email],
        html=f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2196F3;">Welcome to SaskLifeHub, {name}!</h2>
            <p>Please verify your email address to activate your account.</p>
            <a href="{verify_url}" style="display: inline-block; background: #2196F3; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Verify Email
            </a>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
                If the button doesn't work, copy this link: {verify_url}
            </p>
            <p style="color: #666; font-size: 12px;">
                This link expires in 24 hours.
            </p>
        </div>
        """,
    )
    try:
        mail.send(msg)
    except Exception as e:
        current_app.logger.error(f"Failed to send verification email to {email}: {e}")
        raise
