"""Initial migration

Revision ID: f318b8c9bf0d
Revises: 
Create Date: 2023-05-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'f318b8c9bf0d'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Drop foreign key constraints
    op.drop_constraint('fk_documents_user_id', 'documents', type_='foreignkey')
    
    # Drop the documents table
    op.drop_table('documents')
    
    # Recreate the documents table
    op.create_table('documents',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('filename', sa.String(length=128), nullable=True),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('file_type', sa.String(length=10), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Recreate foreign key constraint
    op.create_foreign_key('fk_documents_user_id', 'documents', 'users', ['user_id'], ['id'])

def downgrade():
    # Drop foreign key constraints
    op.drop_constraint('fk_documents_user_id', 'documents', type_='foreignkey')
    
    # Drop the documents table
    op.drop_table('documents')