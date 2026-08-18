"""merge embedding migration heads

Revision ID: 91a31dce2579
Revises: 8673ec8b9e96, 9736bcc6b244
Create Date: 2026-08-18 17:10:18.782899

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '91a31dce2579'
down_revision: Union[str, Sequence[str], None] = ('8673ec8b9e96', '9736bcc6b244')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
