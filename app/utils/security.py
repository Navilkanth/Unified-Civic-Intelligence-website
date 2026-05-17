from functools import wraps

from flask import abort, g, redirect, url_for, request

from app.extensions import db
from app.models import UserRole


def login_required(view_fn):
    @wraps(view_fn)
    def wrapped(*args, **kwargs):
        if getattr(g, "current_user", None) is None:
            nxt = request.full_path if request.query_string else request.path
            return redirect(url_for("auth.login", next=nxt.rstrip("?")))
        return view_fn(*args, **kwargs)

    return wrapped


def roles_required(*roles: UserRole):
    def decorator(view_fn):
        @wraps(view_fn)
        def wrapped(*args, **kwargs):
            user = getattr(g, "current_user", None)
            if user is None:
                return redirect(url_for("auth.login", next=request.path))
            if user.role not in roles:
                abort(403)
            return view_fn(*args, **kwargs)

        return wrapped

    return decorator


def log_audit(user_id, action: str, resource: str | None = None, details: str | None = None):
    from app.models import AuditLog

    entry = AuditLog(
        user_id=user_id,
        action=action,
        resource=resource,
        details=details,
    )
    db.session.add(entry)
