import { useState } from "react";
import API from "../services/api";

export default function NoteEditor({ onNoteCreated }) {
  const [note, setNote] = useState({ title: "", content: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/notes/", note);

    setNote({ title: "", content: "" });
    onNoteCreated(); // refresh notes
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        placeholder="Title"
        className="border p-2 mr-2"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
      />

      <input
        placeholder="Content"
        className="border p-2 mr-2"
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
      />

      <button className="bg-green-500 text-white px-4 py-2">
        Add
      </button>
    </form>
  );
}