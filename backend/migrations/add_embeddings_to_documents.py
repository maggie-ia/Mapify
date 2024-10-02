from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column('document', sa.Column('embeddings', sa.PickleType(), nullable=True))

def downgrade():
    op.drop_column('document', 'embeddings')