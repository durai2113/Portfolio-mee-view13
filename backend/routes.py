import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Optional

from fastapi import APIRouter, Header, HTTPException

from .config import Config
from database.database import USE_MONGO, find_docs, insert_doc
from .models import ChatInput, ContactIn
from .services import ai_service

router = APIRouter()

@router.post('/contact', status_code=201)
def contact(payload: ContactIn):
    try:
        # Save to DB
        data = payload.dict()
        inserted_id = insert_doc(data)
        
        # Email Notification (optional, only if configured)
        if Config.MAIL_USERNAME and Config.MAIL_PASSWORD:
            try:
                msg = MIMEMultipart()
                msg['From'] = Config.MAIL_FROM
                msg['To'] = Config.MAIL_TO
                msg['Reply-To'] = payload.email
                msg['Subject'] = f"New Portfolio Message from {payload.name}"
                
                body = f"""
                New Contact Message:
                
                Name: {payload.name}
                Email: {payload.email}
                Message: {payload.message}
                """
                msg.attach(MIMEText(body, 'plain'))
                
                with smtplib.SMTP(Config.MAIL_SERVER, Config.MAIL_PORT) as server:
                    server.starttls()
                    server.login(Config.MAIL_USERNAME, Config.MAIL_PASSWORD)
                    server.send_message(msg)
                    print(f"--- DEBUG: Email sent successfully for {payload.name}")
            except Exception as mail_err:
                print(f"--- DEBUG: Mail delivery failed: {str(mail_err)}")
        
        response = {'inserted_id': str(inserted_id)}
        if not USE_MONGO:
            response['note'] = 'stored-in-memory-dev'
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail={'error': 'database error', 'details': str(e)})

@router.post('/draft-reply')
def draft_reply(payload: ContactIn, x_admin_token: str = Header(None)):
    if x_admin_token != Config.ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Unauthorized")
    try:
        reply = ai_service.draft_reply(
            name=payload.name if payload.name else "Visitor",
            email=payload.email if payload.email else "visitor@example.com",
            message=payload.message
        )
        return {'reply': reply}
    except ValueError as val_err:
        raise HTTPException(status_code=501, detail=str(val_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/chat')
def chat(payload: ChatInput):
    try:
        print(f"--- DEBUG: Chat Query: {payload.query}")
        response = ai_service.chat_response(query=payload.query)
        print(f"--- DEBUG: Chat Response: {response}")
        return {"response": response}
    except Exception as e:
        print(f"--- DEBUG: Chat Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/contacts')
def get_contacts(limit: int = 100, x_admin_token: str = Header(None)):
    if x_admin_token != Config.ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Unauthorized")
    try:
        docs = find_docs(limit)
        return {'contacts': docs}
    except Exception as e:
        raise HTTPException(status_code=500, detail={'error': 'database error', 'details': str(e)})
