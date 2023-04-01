import React, { useState } from "react";
import axios from "axios";

function CreateNote() {
	const [notes, setNotes] = useState([]);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();

		const newNote = {
			title: title,
			content: content,
		};

		axios
			.post("http://localhost:5000/new", newNote)
			.then((res) => {
				setNotes([...notes, res.data]);
				setTitle("");
				setContent("");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div>
			<h1>Notes</h1>
			<form onSubmit={handleSubmit}>
				<>
					<input
						type="text"
						placeholder="Enter Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</>
				<br></br>
				<>
					<input
						type="text"
						placeholder="Enter Content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
				</>
				<br></br>
				<button type="submit">Add</button>
			</form>
		</div>
	);
}

export default CreateNote;
