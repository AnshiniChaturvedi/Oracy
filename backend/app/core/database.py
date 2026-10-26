from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client: AsyncIOMotorClient = None
db = None

def get_db():
    return db

async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db_name]
    # Ensure unique index on email
    await db["users"].create_index("email", unique=True)

async def close_mongo_connection():
    global client
    if client:
        client.close()
