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
    # Verificar si la tabla 'documents' existe
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    if 'documents' in inspector.get_table_names():
        # Si la tabla existe, intentamos eliminar la clave foránea si existe
        try:
            op.drop_constraint('fk_documents_user_id', 'documents', type_='foreignkey')
        except:
            pass  # Si la clave foránea no existe, simplemente continuamos
        
        # Eliminamos la tabla existente
        op.drop_table('documents')
    
    # Creamos la nueva tabla 'documents'
    op.create_table('documents',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('file_type', sa.String(length=10), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Creamos la nueva clave foránea
    op.create_foreign_key('fk_documents_user_id', 'documents', 'users', ['user_id'], ['id'])

def downgrade():
    # Eliminamos la clave foránea
    op.drop_constraint('fk_documents_user_id', 'documents', type_='foreignkey')
    
    # Eliminamos la tabla 'documents'
    op.drop_table('documents')