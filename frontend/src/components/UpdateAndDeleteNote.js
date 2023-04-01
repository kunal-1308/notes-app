import React, { useState, useEffect } from "react";
import axios from "axios";

function TodoList() {
	const [todos, setTodos] = useState([]);
	const [editingTodo, setEditingTodo] = useState(null);

	// Fetch todos from the server when the component mounts
	useEffect(() => {
		axios
			.get("http://localhost:5000/todos")
			.then((response) => {
				setTodos(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	// Handle form submit when the user updates a todo
	const handleEditTodo = (event) => {
		event.preventDefault();

		axios
			.put(`http://localhost:5000/todos/${editingTodo._id}`, editingTodo)
			.then((response) => {
				setTodos(
					todos.map((todo) => {
						if (todo._id === response.data._id) {
							return response.data;
						}
						return todo;
					})
				);
				setEditingTodo(null);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	// Handle click on "Edit" button
	const handleEditButtonClick = (todo) => {
		setEditingTodo(todo);
	};

	// Handle click on "Delete" button
	const handleDeleteButtonClick = (todo) => {
		axios
			.delete(`http://localhost:5000/todos/${todo._id}`)
			.then((response) => {
				setTodos(todos.filter((todo) => todo._id !== response.data._id));
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div>
			<h1>Todo List</h1>
			<ul>
				{todos.map((todo) => (
					<li key={todo._id}>
						{editingTodo && editingTodo._id === todo._id ? (
							<form onSubmit={handleEditTodo}>
								<input
									type="text"
									value={editingTodo.title}
									onChange={(event) => setEditingTodo({ ...editingTodo, title: event.target.value })}
								/>
								<button type="submit">Save</button>
							</form>
						) : (
							<div>
								<span>{todo.title}</span>
								<button onClick={() => handleEditButtonClick(todo)}>Edit</button>
								<button onClick={() => handleDeleteButtonClick(todo)}>Delete</button>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

export default TodoList;
