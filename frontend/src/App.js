import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateNote from "./components/CreateNote";
import "./App.css";

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
			.patch(`http://localhost:5000/${editingNote._id}`, editingNote)
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
	if (notes.length === 0) {
		return <div>Loading...🔃</div>;
	}
	return (
		<div>
			<CreateNote />
			<h1>Note List</h1>
			<table>
				<tr>
					<th>ID</th>
					<th>Title</th>
					<th>Content</th>
					<th>Date Created</th>
					<th>Actions</th>
				</tr>

				{notes.map((note, index) => {
					return (
						<tr>
							<td>{index + 1}</td>
							<td>
								{editingNote && editingNote._id === note._id ? (
									<form onSubmit={handleEditNote}>
										<input
											type="text"
											value={editingNote.title}
											onChange={(event) =>
												setEditingNote({ ...editingNote, title: event.target.value })
											}
										/>
										<button type="submit">Save</button>
									</form>
								) : (
									<>
										<>{note.title}</>
									</>
								)}
							</td>
							<td>{note.content}</td>
							<td>{note.createdAt.toString().split("T")[0]}</td>
							<td>
								<button className="edit" onClick={() => handleEditButtonClick(note)}>
									Edit
								</button>
								<button className="delete" onClick={() => handleDeleteButtonClick(note)}>
									Delete
								</button>
							</td>
						</tr>
					);
				})}
			</table>
		</div>
	);
}

export default App;
