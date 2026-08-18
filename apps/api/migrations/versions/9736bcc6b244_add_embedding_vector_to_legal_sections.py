"""add embedding vector to legal sections

Revision ID: 9736bcc6b244
Revises: a468daaf3393
Create Date: 2026-08-18
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector


revision: str = "9736bcc6b244"
down_revision: Union[str, Sequence[str], None] = "a468daaf3393"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "legal_sections",
        sa.Column(
            "embedding",
            Vector(1536),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column("legal_sections", "embedding")
