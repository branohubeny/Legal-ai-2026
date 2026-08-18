"""add embeddings to legal sections

Revision ID: 517522b70308
Revises: fd206520bf53
Create Date: 2026-08-12 10:06:19.547945

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '517522b70308'
down_revision: Union[str, Sequence[str], None] = 'fd206520bf53'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
