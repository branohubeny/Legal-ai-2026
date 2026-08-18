"""add embedding vector to legal sections

Revision ID: 8673ec8b9e96
Revises: a468daaf3393
Create Date: 2026-08-18 17:03:09.443430

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8673ec8b9e96'
down_revision: Union[str, Sequence[str], None] = 'a468daaf3393'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
