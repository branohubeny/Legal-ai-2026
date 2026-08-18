import pytest_asyncio

from app.db import engine


@pytest_asyncio.fixture(scope="session", autouse=True)
async def dispose_database_engine():
    yield
    await engine.dispose()
