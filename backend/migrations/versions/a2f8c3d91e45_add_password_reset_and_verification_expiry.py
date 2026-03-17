"""add password reset and verification expiry columns

Revision ID: a2f8c3d91e45
Revises: 1f3e38d142d8
Create Date: 2026-03-17 20:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = 'a2f8c3d91e45'
down_revision = '1f3e38d142d8'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('email_verification_expires', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('password_reset_token', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('password_reset_expires', sa.DateTime(), nullable=True))
        batch_op.drop_column('refresh_token_hash')


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('refresh_token_hash', sa.String(length=255), nullable=True))
        batch_op.drop_column('password_reset_expires')
        batch_op.drop_column('password_reset_token')
        batch_op.drop_column('email_verification_expires')
