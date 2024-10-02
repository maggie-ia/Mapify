from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.document import Document
from app.models.chat_conversation import ChatConversation
from app.models.conversation_category import ConversationCategory
from app import db
from app.services.ai_service import (
    process_ai_response, generate_suggested_questions
)
from app.services.membership_service import can_perform_operation, increment_operation

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
    
    if not can_perform_operation(user_id, 'chat'):
        return jsonify({"error": "You have reached your chat limit for this period"}), 403
    
    data = request.json
    message = data.get('message')
    operation = data.get('operation', 'chat')
    
    if not message:
        return jsonify({"error": "No message provided"}), 400
    
    document = Document.query.get(document_id)
    if not document:
        return jsonify({"error": "Document not found"}), 404
    
    conversation = ChatConversation.query.filter_by(user_id=user_id, document_id=document_id).first()
    if not conversation:
        conversation = ChatConversation(user_id=user_id, document_id=document_id, conversation_data=[])
        db.session.add(conversation)
    
    user_message = {"sender": "user", "content": message, "operation": operation}
    conversation.conversation_data.append(user_message)
    
    try:
        ai_response = process_ai_response(document.content, message, operation, document.embeddings)
        ai_message = {"sender": "ai", "content": ai_response, "operation": operation}
        conversation.conversation_data.append(ai_message)
        db.session.commit()
        
        increment_operation(user_id, 'chat')
        
        suggested_questions = generate_suggested_questions(document.content, ai_response)
        
        return jsonify({
            "userMessage": user_message, 
            "aiResponse": ai_message,
            "suggestedQuestions": suggested_questions
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@chat.route('/categories', methods=['GET'])
@jwt_required()
def get_conversation_categories():
    categories = ConversationCategory.query.all()
    return jsonify([{"id": cat.id, "name": cat.name} for cat in categories]), 200

@chat.route('/feedback', methods=['POST'])
@jwt_required()
def submit_feedback():
    user_id = get_jwt_identity()
    data = request.json
    message_id = data.get('messageId')
    is_positive = data.get('isPositive')
    
    if message_id is None or is_positive is None:
        return jsonify({"error": "Invalid feedback data"}), 400
    
    # Aquí implementarías la lógica para almacenar el feedback
    # Por ahora, solo devolveremos un mensaje de éxito
    
    return jsonify({"message": "Feedback submitted successfully"}), 200