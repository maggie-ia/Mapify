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
    # Primero, eliminamos las claves foráneas que dependen de 'documents'
    op.drop_constraint('fk_operations_document_id', 'operations', type_='foreignkey')
    
    # Ahora podemos eliminar la tabla 'documents' de forma segura
    op.drop_table('documents')
    
    # Recreamos la tabla 'documents'
    op.create_table('documents',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('file_type', sa.String(length=10), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Recreamos la clave foránea en 'documents'
    op.create_foreign_key('fk_documents_user_id', 'documents', 'users', ['user_id'], ['id'])
    
    # Recreamos la clave foránea en 'operations'
    op.create_foreign_key('fk_operations_document_id', 'operations', 'documents', ['document_id'], ['id'])

def downgrade():
    # Eliminamos las claves foráneas
    op.drop_constraint('fk_operations_document_id', 'operations', type_='foreignkey')
    op.drop_constraint('fk_documents_user_id', 'documents', type_='foreignkey')
    
    # Eliminamos la tabla 'documents'
    op.drop_table('documents')