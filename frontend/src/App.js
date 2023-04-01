import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateNote from "./components/CreateNote";

function App() {
	const [notes, setNotes] = useState([]);
	const [editingNote, setEditingNote] = useState(null);

	// Fetch notes from the server when the component mounts
	useEffect(() => {
		axios
			.get("http://localhost:5000/")
			.then((response) => {
				setNotes(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [notes]);

	// Handle form submit when the user updates a note
	const handleEditNote = (event) => {
		event.preventDefault();

		axios
			.put(`http://localhost:5000/${editingNote._id}`, editingNote)
			.then((response) => {
				setNotes(
					notes.map((note) => {
						if (note._id === response.data._id) {
							return response.data;
						}
						return note;
					})
				);
				setEditingNote(null);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	// Handle click on "Edit" button
	const handleEditButtonClick = (note) => {
		setEditingNote(note);
	};

	// Handle click on "Delete" button
	const handleDeleteButtonClick = (note) => {
		axios
			.delete(`http://localhost:5000/${note._id}`)
			.then((response) => {
				setNotes(notes.filter((note) => note._id !== response.data._id));
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div>
			<CreateNote />
			<h1>Note List</h1>
			<ul>
				{notes.map((note) => (
					<li key={note._id}>
						{editingNote && editingNote._id === note._id ? (
							<form onSubmit={handleEditNote}>
								<input
									type="text"
									value={editingNote.title}
									onChange={(event) => setEditingNote({ ...editingNote, title: event.target.value })}
								/>
								<button type="submit">Save</button>
							</form>
						) : (
							<div>
								<span>{note.title}</span>
								<button onClick={() => handleEditButtonClick(note)}>Edit</button>
								<button onClick={() => handleDeleteButtonClick(note)}>Delete</button>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
