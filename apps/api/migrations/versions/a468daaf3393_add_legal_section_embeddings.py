"""add legal section embeddings

Revision ID: a468daaf3393
Revises: 517522b70308
Create Date: 2026-08-12 10:13:09.403903

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a468daaf3393'
down_revision: Union[str, Sequence[str], None] = '517522b70308'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
