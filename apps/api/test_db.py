import asyncio

from sqlalchemy import text

from app.db import engine


async def main():
    async with engine.connect() as connection:
        result = await connection.execute(text("SELECT 1"))
        print("DATABASE CONNECTION OK:", result.scalar())


asyncio.run(main())
