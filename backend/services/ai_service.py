import google.generativeai as genai
from ..config import Config

class AIService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AIService, cls).__new__(cls)
            is_placeholder = 'your-gemini-api-key' in (Config.GEMINI_API_KEY or '') or not Config.GEMINI_API_KEY
            if not is_placeholder:
                genai.configure(api_key=Config.GEMINI_API_KEY)
                cls._instance.client = genai.GenerativeModel('gemini-2.5-flash')
            else:
                cls._instance.client = None
        return cls._instance

    def draft_reply(self, name: str, email: str, message: str) -> str:
        if not self.client:
            raise ValueError("GEMINI_API_KEY not configured")

        user_prompt = (
            "You are a helpful assistant that drafts concise, professional email replies to contact messages. "
            "Keep replies polite, 3-5 sentences, and suggest a clear next step.\n\n"
            f"Draft a reply to the following contact message.\n\nFrom: {name} <{email}>\nMessage: {message}\n\n" 
            "Write a short, professional reply and include a suggested next step."
        )

        try:
            response = self.client.generate_content(
                user_prompt,
                generation_config=genai.GenerationConfig(temperature=0.2, max_output_tokens=300)
            )
            return response.text.strip()
        except Exception as e:
            return f"Error drafting reply: {str(e)}"

    def chat_response(self, query: str) -> str:
        if not self.client:
            # Fallback for dev without key
            return "I'm currently in offline mode (API key not set), but I'm Aravindh's AI assistant. How can I help you?"

        system_msg = (
            "You are 'ARA-Bot', the official AI assistant for Aravindh's portfolio website. "
            "Aravindh is an MCA graduate and Software Developer specialized in Python, FastAPI, and Web Dev. "
            "Your personality is professional, friendly, and slightly futuristic. "
            "Help visitors by answering questions about his skills, projects (Attendance System, NLP Trust Evaluation), "
            "and how to contact him. Keep responses short and punchy."
        )

        try:
            response = self.client.generate_content(
                f"{system_msg}\n\nUser Question: {query}",
                generation_config=genai.GenerationConfig(temperature=0.7, max_output_tokens=200)
            )
            return response.text.strip()
        except Exception as e:
            return f"ARA-Bot is currently resting (Reason: {str(e)}). You can reach Aravindh via the contact form!"

ai_service = AIService()
