from app.utils.exceptions import ExportError
from app.models.user import User
from app.services.membership_service import can_export, increment_export
import logging
from docx import Document
from reportlab.pdfgen import canvas
from io import BytesIO

logger = logging.getLogger(__name__)

def export_to_pdf(content, user_id):
    try:
        if not can_export(user_id):
            raise ExportError("Has alcanzado el límite de exportaciones para tu membresía")
        
        buffer = BytesIO()
        p = canvas.Canvas(buffer)
        p.drawString(100, 100, content)
        p.showPage()
        p.save()
        
        pdf = buffer.getvalue()
        buffer.close()
        
        increment_export(user_id)
        return pdf
    except Exception as e:
        logger.error(f"Error al exportar a PDF: {str(e)}")
        raise ExportError("No se pudo exportar el contenido a PDF")

def export_to_docx(content, user_id):
    try:
        if not can_export(user_id):
            raise ExportError("Has alcanzado el límite de exportaciones para tu membresía")
        
        document = Document()
        document.add_paragraph(content)
        
        buffer = BytesIO()
        document.save(buffer)
        docx = buffer.getvalue()
        buffer.close()
        
        increment_export(user_id)
        return docx
    except Exception as e:
        logger.error(f"Error al exportar a DOCX: {str(e)}")
        raise ExportError("No se pudo exportar el contenido a DOCX")

def export_to_txt(content, user_id):
    try:
        if not can_export(user_id):
            raise ExportError("Has alcanzado el límite de exportaciones para tu membresía")
        
        txt = content.encode('utf-8')
        
        increment_export(user_id)
        return txt
    except Exception as e:
        logger.error(f"Error al exportar a TXT: {str(e)}")
        raise ExportError("No se pudo exportar el contenido a TXT")