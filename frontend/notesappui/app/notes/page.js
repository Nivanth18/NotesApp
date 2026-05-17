'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { notesAPI } from '../../lib/api'

export default function NotesPage() {
  const router = useRouter()
  const [notes, setNotes] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState({ title: '', body: '' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  // useEffect runs after the component mounts (appears on screen)
  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    // Redirect to login if no token found
    if (!token) { router.push('/login'); return }

    setUser(JSON.parse(storedUser))
    fetchNotes()
  }, []) // empty array = run once on mount

  const fetchNotes = async () => {
    try {
      const data = await notesAPI.getAll()
      setNotes(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newNote.title.trim()) return
    const note = await notesAPI.create(newNote)
    setNotes([note, ...notes]) // prepend new note
    setNewNote({ title: '', body: '' })
  }

  const handleUpdate = async (id) => {
    const updated = await notesAPI.update(id, editForm)
    setNotes(notes.map((n) => (n._id === id ? updated : n)))
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return
    await notesAPI.delete(id)
    setNotes(notes.filter((n) => n._id !== id))
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-gray-900">My Notes</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.name}</span>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-6">
        {/* Creat
        e Note Form */}
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">New note</h2>
          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full border-b border-gray-200 pb-2 mb-3 text-sm font-medium focus:outline-none"
          />
          <textarea
            placeholder="Write your note..."
            rows={3}
            value={newNote.body}
            onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}
            className="w-full text-sm text-gray-600 resize-none focus:outline-none mb-3"
          />
          <button type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Save note
          </button>
        </form>

        {/* Notes List */}
        {notes.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No notes yet. Create your first one above!</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note._id} className="bg-white rounded-xl border border-gray-200 p-5">
                {editingId === note._id ? (
                  // Edit mode
                  <div>
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full border-b border-gray-200 pb-2 mb-3 font-medium focus:outline-none"
                    />
                    <textarea
                      rows={4}
                      value={editForm.body}
                      onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                      className="w-full text-sm text-gray-600 resize-none focus:outline-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(note._id)}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">Save</button>
                      <button onClick={() => setEditingId(null)}
                        className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{note.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 whitespace-pre-wrap">{note.body}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingId(note._id); setEditForm({ title: note.title, body: note.body }) }}
                        className="text-sm text-indigo-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(note._id)}
                        className="text-sm text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}