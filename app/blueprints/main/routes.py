from flask import Blueprint, render_template

bp = Blueprint("main", __name__)


@bp.get("/")
def home():
    return render_template("main/home.html")


@bp.get("/chatbot")
def chatbot():
    return render_template("main/chatbot.html")
