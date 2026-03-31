from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Note
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Tag

notes_bp = Blueprint('notes', __name__)

@notes_bp.route('/', methods=['POST'])
@jwt_required()
def create_note():
    data = request.get_json()
    user_id = get_jwt_identity()

    new_note = Note(
        title=data.get('title'),
        content=data.get('content'),
        user_id=user_id
    )

    db.session.add(new_note)
    db.session.flush()  # get note.id

    tags = data.get('tags', [])

    for tag_name in tags:
        tag = Tag(name=tag_name, note_id=new_note.id)
        db.session.add(tag)

    db.session.commit()

    return jsonify({"message": "Note with tags created"}), 201


@notes_bp.route('/', methods=['GET'])
@jwt_required()
def get_notes():
    user_id = get_jwt_identity()

    # Get query params
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 5, type=int)

    pagination = Note.query.filter_by(user_id=user_id)\
        .paginate(page=page, per_page=limit, error_out=False)

    notes = pagination.items

    result = []
    for note in notes:
        result.append({
            "id": note.id,
            "title": note.title,
            "content": note.content
        })

    return jsonify({
        "notes": result,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    })

@notes_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_note(id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=id, user_id=user_id).first()

    if not note:
        return jsonify({"message": "Note not found"}), 404

    data = request.get_json()

    note.title = data.get('title', note.title)
    note.content = data.get('content', note.content)

    db.session.commit()

    return jsonify({"message": "Note updated"})

@notes_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_note(id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=id, user_id=user_id).first()

    if not note:
        return jsonify({"message": "Note not found"}), 404

    db.session.delete(note)
    db.session.commit()

    return jsonify({"message": "Note deleted"})

@notes_bp.route('/search', methods=['GET'])
@jwt_required()
def search_notes():
    user_id = get_jwt_identity()
    query = request.args.get('q', '')

    notes = Note.query.filter(
        Note.user_id == user_id,
        (Note.title.ilike(f"%{query}%") | Note.content.ilike(f"%{query}%"))
    ).all()

    result = [{
        "id": n.id,
        "title": n.title,
        "content": n.content
    } for n in notes]

    return jsonify(result)    