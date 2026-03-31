import { useEffect, useState } from "react";
import API from "../services/api";
import NoteEditor from "./NoteEditor";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes/");
      setNotes(res.data.notes || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ DELETE
  const deleteNote = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  // ✏️ UPDATE
  const updateNote = async () => {
    try {
      await API.put(`/notes/${editingNote.id}`, editingNote);
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔍 SEARCH
  const searchNotes = async () => {
    try {
      const res = await API.get(`/notes/search?q=${search}`);
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>

      {/* ➕ CREATE NOTE */}
      <NoteEditor onNoteCreated={fetchNotes} />

      {/* 🔍 SEARCH */}
      <div className="mb-4 flex">
        <input
          placeholder="Search notes..."
          className="border p-2 mr-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={searchNotes}
          className="bg-gray-800 text-white px-4 rounded"
        >
          Search
        </button>
      </div>

      {/* ✏️ EDIT NOTE */}
      {editingNote && (
        <div className="mb-4">
          <input
            className="border p-2 mr-2"
            value={editingNote.title}
            onChange={(e) =>
              setEditingNote({ ...editingNote, title: e.target.value })
            }
          />

          <input
            className="border p-2 mr-2"
            value={editingNote.content}
            onChange={(e) =>
              setEditingNote({ ...editingNote, content: e.target.value })
            }
          />

          <button
            onClick={updateNote}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Update
          </button>

          <button
            onClick={() => setEditingNote(null)}
            className="ml-2 bg-gray-400 px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 📝 NOTES LIST */}
      {notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div key={note.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold text-lg">{note.title}</h2>
              <p className="text-gray-600">{note.content}</p>

              {/* ACTION BUTTONS */}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setEditingNote(note)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteNote(note.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}