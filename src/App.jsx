import React, { useEffect, useState } from "react";
import './App.css'

function App() {

    const [words, setWords] = React.useState("");
    const [list, setList] = React.useState([]);
    const [editIndex, setEditIndex] = React.useState(null);
    const [editText, setEditText] = React.useState("");


    useEffect(() => {
        fetch("http://localhost:5000/api/todos")
            .then((res) => res.json())
            .then((data) => setList(data))
            .catch((err) => console.error("Error fetching todos:", err));
    }, []);


    const handleChange = (e) => {
        setWords(e.target.value);
    }

    const handleSubmit = async () => {
        if(words.trim() ===""){
            return
        }
        const res = await fetch("http://localhost:5000/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: words }),
        });

        const newTask = await res.json();
        setList([...list, newTask]);
        setWords("");
    }





    const handleDelete = async (id) => {
        await fetch(`http://localhost:5000/api/todos/${id}`, { method: "DELETE" });
        setList(list.filter((item) => item.id !== id));
    };


    const handleEdit = (index) => {
        setEditIndex(index);
        setEditText(list[index].task);
    };

    const handleSave = async (id) => {
        if (editText.trim() === "") return;

        const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: editText }),
        });

        const updatedTask = await res.json();

        setList(list.map((item) => (item.id === id ? updatedTask : item)));
        setEditIndex(null);
        setEditText("");
    };


    return (
        <div className="app-container">
            <h1>Task Manager</h1>
            <div className="input-group">
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    onChange={handleChange}
                    value={words}
                />
                <button className="add-btn" onClick={handleSubmit}>Add Task</button>
            </div>

            <ul className="todo-list">
                {list.map((word, index) => (
                    <li key={word.id} className="todo-item">
                        {editIndex === index ? (
                            <div className="edit-group">
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <button className="save-btn" onClick={() => handleSave(word.id)}>Save</button>
                                <button className="cancel-btn" onClick={() => setEditIndex(null)}>Cancel</button>
                            </div>
                        ) : (
                            <>
                                <span className="task-text">{word.task}</span>
                                <div className="button-group">
                                    <button className="edit-btn" onClick={() => handleEdit(index)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(word.id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;