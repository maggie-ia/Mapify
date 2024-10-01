from flask import Blueprint, jsonify

# Crear un Blueprint llamado "main"
main = Blueprint('main', __name__)

@main.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Bienvenido a Mapify"})

@main.route("/status", methods=["GET"])
def status():
    return jsonify({"status": "El servidor está funcionando correctamente."})