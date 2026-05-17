"""Heuristic NLP stubs: sentiment (-1..1), complaint classification, welfare hints, chatbot."""

import re
from typing import Any


NEGATIVE = re.compile(
    r"\b(delay|negligen|corrupt|bribe|fraud|angry|worst|never|poor|bad|encroach|illegal|misuse)\b",
    re.I,
)
POSITIVE = re.compile(
    r"\b(thank|good|great|resolved|happy|satisfied|timely|complete|done)\b",
    re.I,
)

GOVERNANCE_CUES = [
    ("delayed_work", r"delay|late|pending|not started"),
    ("negligence", r"neglect|ignore|no response"),
    ("corruption", r"bribe|corrupt|money|kickback"),
    ("land_encroachment", r"encroach|occupation|temple land|survey"),
    ("infrastructure", r"road|drain|water|street|light"),
]

WELFARE_CUES = [
    ("medical", r"medical|hospital|surgery|medicine|treatment|sick|cancer|dialysis"),
    ("scholarship", r"school|college|fees|education|scholar|tuition"),
    ("food", r"food|ration|hunger|meal|nutrition"),
    ("disaster", r"flood|cyclone|relief|shelter|rescue|earthquake"),
]

CHATBOT_RESPONSES = [
    (r"complaint status|my complaint", "You can track your complaint status in the Governance → Report Issues section. Look for your Reference ID."),
    (r"welfare scheme|help scheme|government scheme", "Available schemes include Amma Two Wheeler, CM Housing, Free ration, Kalaignar Magalir Urimai. Visit Charity → Request Help to apply."),
    (r"project progress|public work|road|drain", "Visit Governance → Public Works to see all ongoing projects in your ward with progress percentages."),
    (r"volunteer|register|tvk|singapadai", "To register as a volunteer, go to Singapadai → Volunteer Registration. You'll receive a digital membership card with QR code."),
    (r"donate|donation|contribute", "You can donate via Charity → Donation Dashboard. All donations are publicly logged in the Trust Ledger."),
    (r"emergency|rescue|flood|cyclone|disaster", "In emergencies, go to Governance → Emergency Mode to send an instant rescue request. Also call 108 (Ambulance) or 1077 (Disaster Helpline)."),
    (r"land|patta|encroachment|survey", "To report land encroachment, visit Governance → Land Protection and upload your survey number, images, and geo-location."),
    (r"contact|councillor|office|appointment", "To book an appointment with your councillor, visit Governance Hub → select your ward → Office Contact."),
    (r"badge|medal|points|rank|leaderboard", "Check Singapadai → Gamification to see your points, badges, and district leaderboard rankings."),
]


def sentiment_score(text: str) -> float:
    if not text:
        return 0.0
    t = text.strip()
    n = len(NEGATIVE.findall(t))
    p = len(POSITIVE.findall(t))
    if n == p == 0:
        return 0.0
    raw = (p - n) / max(1, p + n)
    return max(-1.0, min(1.0, raw))


def classify_complaint(text: str) -> str:
    low = text.lower()
    for label, pat in GOVERNANCE_CUES:
        if re.search(pat, low):
            return label
    return "general"


def welfare_hints(text: str) -> list[dict[str, Any]]:
    low = text.lower()
    out: list[dict[str, Any]] = []
    for scheme, pat in WELFARE_CUES:
        if re.search(pat, low):
            out.append({
                "scheme": scheme,
                "priority": "high" if scheme == "disaster" else "medium",
                "rationale": "Keyword alignment with citizen narrative (heuristic rules).",
            })
    if not out:
        out.append({
            "scheme": "general_assistance",
            "priority": "low",
            "rationale": "No strong scheme match; route to human review.",
        })
    return out


def chatbot_reply(message: str) -> str:
    """Rule-based chatbot for civic queries."""
    low = message.lower()
    for pattern, response in CHATBOT_RESPONSES:
        if re.search(pattern, low):
            return response
    # fallback generic response
    sentiment = sentiment_score(message)
    if sentiment < -0.3:
        return ("I understand your frustration. Please submit a formal complaint through Governance → Report Issues. "
                "Our team will review and respond within 5 business days.")
    return ("I'm the UCI AI Assistant. I can help with: complaint status, welfare schemes, project progress, "
            "volunteer registration, donations, emergency requests, land protection, and councillor contacts. "
            "Please ask me something specific!")


def governance_insights_snippet(ward_name: str, complaints: list[str]) -> dict[str, Any]:
    scores = [sentiment_score(c) for c in complaints]
    avg = sum(scores) / len(scores) if scores else 0.0
    tone = "stable" if avg > -0.2 else "elevated public stress"
    return {
        "ward": ward_name,
        "average_sentiment": round(avg, 3),
        "tone": tone,
        "hotspots": "Map overlays available in dashboard (Leaflet).",
    }


def analyze_ward_data(ward) -> dict[str, float]:
    return {
        "complaint_score": 75.0,
        "development_score": 85.0,
        "cleanliness_score": 90.0,
        "happiness_index": 80.0,
    }
