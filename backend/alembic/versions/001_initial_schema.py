"""Initial schema

Revision ID: 001_initial
Revises: 
Create Date: 2026-02-09 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create campaigns table
    op.create_table(
        'campaigns',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('platform', sa.Enum('GOOGLE', 'META', 'AMAZON', name='platform'), nullable=False),
        sa.Column('campaign_type', sa.Enum('PMAX', 'SHOPPING', 'SPONSORED_BRANDS', name='campaigntype'), nullable=False),
        sa.Column('status', sa.Enum('CREATED', 'PENDING', 'ACTIVE', 'FAILED', name='campaignstatus'), nullable=False),
        sa.Column('objective', sa.String(), nullable=False),
        sa.Column('daily_budget', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('product_categories', sa.JSON(), nullable=False),
        sa.Column('platform_campaign_id', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_campaigns_id'), 'campaigns', ['id'], unique=False)
    op.create_index(op.f('ix_campaigns_name'), 'campaigns', ['name'], unique=False)
    op.create_index(op.f('ix_campaigns_platform'), 'campaigns', ['platform'], unique=False)
    op.create_index(op.f('ix_campaigns_status'), 'campaigns', ['status'], unique=False)

    # Create campaign_metrics table
    op.create_table(
        'campaign_metrics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('campaign_id', sa.Integer(), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('spend', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('impressions', sa.Integer(), nullable=False),
        sa.Column('clicks', sa.Integer(), nullable=False),
        sa.Column('conversions', sa.Integer(), nullable=True),
        sa.Column('conversion_value', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('currency', sa.String(length=3), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['campaign_id'], ['campaigns.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_campaign_metrics_id'), 'campaign_metrics', ['id'], unique=False)
    op.create_index(op.f('ix_campaign_metrics_campaign_id'), 'campaign_metrics', ['campaign_id'], unique=False)
    op.create_index(op.f('ix_campaign_metrics_date'), 'campaign_metrics', ['date'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_campaign_metrics_date'), table_name='campaign_metrics')
    op.drop_index(op.f('ix_campaign_metrics_campaign_id'), table_name='campaign_metrics')
    op.drop_index(op.f('ix_campaign_metrics_id'), table_name='campaign_metrics')
    op.drop_table('campaign_metrics')
    op.drop_index(op.f('ix_campaigns_status'), table_name='campaigns')
    op.drop_index(op.f('ix_campaigns_platform'), table_name='campaigns')
    op.drop_index(op.f('ix_campaigns_name'), table_name='campaigns')
    op.drop_index(op.f('ix_campaigns_id'), table_name='campaigns')
    op.drop_table('campaigns')
