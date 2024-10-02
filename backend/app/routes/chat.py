from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.document import Document
from app.models.chat_conversation import ChatConversation
from app import db
from app.services.ai_service import process_ai_response

chat = Blueprint('chat', __name__)

@chat.route('/<int:document_id>', methods=['GET'])
@jwt_required()
def get_chat_conversation(document_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.membership_type != 'premium':
        return jsonify({"error": "Chat access is only available for premium users"}), 403
    
    conversation = ChatConversation.query.filter_by(user_id=user_id, document_id=document_id).first()
    
    if not conversation:
        return jsonify({"messages": []}), 200
    
    return jsonify({"messages": conversation.conversation_data}), 200

@chat.route('/<int:document_id>', methods=['POST'])
@jwt_required()
def send_chat_message(document_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.membership_type != 'premium':
        return jsonify({"error": "Chat access is only available for premium users"}), 403
    
    message = request.json.get('message')
    if not message:
        return jsonify({"error": "No message provided"}), 400
    
    document = Document.query.get(document_id)
    if not document:
        return jsonify({"error": "Document not found"}), 404
    
    conversation = ChatConversation.query.filter_by(user_id=user_id, document_id=document_id).first()
    if not conversation:
        conversation = ChatConversation(user_id=user_id, document_id=document_id, conversation_data=[])
        db.session.add(conversation)
    
    user_message = {"sender": "user", "content": message}
    conversation.conversation_data.append(user_message)
    
    ai_response = process_ai_response(document.content, message)
    ai_message = {"sender": "ai", "content": ai_response}
    conversation.conversation_data.append(ai_message)
    
    db.session.commit()
    
    return jsonify({"userMessage": user_message, "aiResponse": ai_message}), 200