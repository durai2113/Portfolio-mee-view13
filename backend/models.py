from pydantic import BaseModel, EmailStr

class ContactIn(BaseModel):
    name: str | None = "Visitor"
    email: EmailStr | None = "visitor@example.com"
    message: str

class ChatInput(BaseModel):
    query: str
