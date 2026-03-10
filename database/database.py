from pymongo import MongoClient
import uuid
from backend.config import Config

# If a real MongoDB URI is provided, use it; otherwise fall back to an in-memory store
USE_MONGO = False
if Config.MONGO_URI and 'example.mongodb.net' not in Config.MONGO_URI and '<' not in (Config.MONGO_URI or ''):
    USE_MONGO = True

client = None
db = None
contacts = None
contacts_store = []

if USE_MONGO:
    client = MongoClient(Config.MONGO_URI)
    db = client[Config.DB_NAME]
    contacts = db[Config.COLLECTION]

class DummyResult:
    def __init__(self, _id):
        self.inserted_id = _id

def insert_doc(doc):
    if USE_MONGO:
        result = contacts.insert_one(doc)
        return result.inserted_id
    else:
        _id = str(uuid.uuid4())
        entry = dict(doc)
        entry['_id'] = _id
        contacts_store.append(entry)
        return _id

def find_docs(limit: int = 100):
    if USE_MONGO:
        cursor = contacts.find().sort('_id', -1).limit(int(limit))
        docs = []
        for d in cursor:
            d['_id'] = str(d.get('_id'))
            docs.append(d)
        return docs
    else:
        return list(reversed(contacts_store))[:int(limit)]
