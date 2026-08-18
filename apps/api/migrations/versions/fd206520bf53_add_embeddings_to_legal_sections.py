"""add embeddings to legal sections

Revision ID: fd206520bf53
Revises: 7ba833bae24c
Create Date: 2026-08-12 10:04:32.578442

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fd206520bf53'
down_revision: Union[str, Sequence[str], None] = '7ba833bae24c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
