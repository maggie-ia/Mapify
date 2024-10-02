"""add duration to memberships

Revision ID: add_duration_to_memberships
Revises: previous_revision_id
Create Date: 2023-05-10 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_duration_to_memberships'
down_revision = 'previous_revision_id'  # Reemplaza esto con el ID de la revisión anterior
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('memberships', sa.Column('duration', sa.String(20), nullable=False, server_default='monthly'))
    op.execute("UPDATE memberships SET duration = 'monthly' WHERE duration IS NULL")
    op.execute("INSERT INTO memberships (name, duration, price) VALUES ('basic', 'sixMonths', 54.99)")
    op.execute("INSERT INTO memberships (name, duration, price) VALUES ('basic', 'yearly', 99.99)")
    op.execute("INSERT INTO memberships (name, duration, price) VALUES ('premium', 'sixMonths', 109.99)")
    op.execute("INSERT INTO memberships (name, duration, price) VALUES ('premium', 'yearly', 199.99)")

def downgrade():
    op.execute("DELETE FROM memberships WHERE duration IN ('sixMonths', 'yearly')")
    op.drop_column('memberships', 'duration')