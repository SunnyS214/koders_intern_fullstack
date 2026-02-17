import React, { useEffect, useState } from "react";
import axios from "axios";
import editIcon from "../icons/edit_icon.png";
import deleteIcon from "../icons/delet_icon.png";
const API = "http://localhost:5000/api/tasks";


const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingTask, setEditingTask] = useState(null); // for edit mode

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/all`);
      setTasks(res.data);
    } catch (err) {
      console.log("Fetch error", err);
      setError("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        // Edit request
        await axios.put(`${API}/${editingTask._id}`, formData);
        setSuccess("Task updated successfully!");
        setEditingTask(null);
      } else {
        // Create request
        await axios.post(API, formData);
        setSuccess("Task created successfully!");
      }
      setFormData({ title: "", description: "", status: "pending" });
      setError("");
      fetchTasks();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      console.log("Error", err);
      setError(err.response?.data?.message || "Operation failed");
    }
  };



  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}/status`, { status });
      setSuccess(`Task marked ${status}`);
      setError("");
      fetchTasks();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      console.log("Status update error", err);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setSuccess("Task deleted successfully");
      setError("");
      fetchTasks();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.log("Delete error", err);
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const editTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to form
  };


  const cancelEdit = () => {
    setEditingTask(null);
    setFormData({ title: "", description: "", status: "pending" });
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-10 py-8">
      <h1 className="text-3xl font-semibold mb-6">Task Board</h1>

    
      <form
        onSubmit={submitHandler}
        className="w-130 flex-col p-4 rounded mb-8 flex gap-2 flex-wrap"
      >
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border p-2 flex-1 rounded-lg"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border p-2 flex-1 resize-none h-24 rounded-lg"
          required
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingTask ? "Update Task" : "Add Task"}
        </button>

        {editingTask && (
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}
      </form>

    
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mt-4 w-130">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-2 rounded mt-4 w-130">
          {success}
        </div>
      )}

   
      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks available. Add your first task!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded shadow relative mt-2"
            >
            
              <span
                className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${
                  task.status === "pending"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {task.status.toUpperCase()}
              </span>

              <h3
                className={`font-semibold ${
                  task.status === "completed" ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </h3>
              <p className="text-sm text-gray-600">{task.description}</p>

              <div className="flex gap-3 mt-4 text-sm">
                {task.status === "pending" ? (
                  <button
                    className="text-green-600"
                    onClick={() => updateStatus(task._id, "completed")}
                  >
                    Mark Completed
                  </button>
                ) : (
                  <button
                    className="text-blue-600"
                    onClick={() => updateStatus(task._id, "pending")}
                  >
                    Mark Pending
                  </button>
                )}

              



<div className="relative group">
  <button
    onClick={() => editTask(task)}
    className="p-1"
  >
    <img src={editIcon} alt="Edit" className="h-5 w-5" />
  </button>

  {/* Tooltip */}
  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs rounded bg-yellow-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
    Edit
  </span>
</div>






                {/* <button
                  className="text-red-500"
                  onClick={() => deleteTask(task._id)}
                >
                                    <img src={deleteIcon} alt="edit" className="h-7 w-7" />

                                     <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs rounded bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
    Delete
  </span>

                </button> */}

{/* Delete button with hover tooltip */}
<div className="relative group">
  <button
    onClick={() => deleteTask(task._id)}
    className="p-1"
  >
    <img src={deleteIcon} alt="Delete" className="h-7 w-7" />
  </button>

  {/* Tooltip */}
  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs rounded bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
    Delete
  </span>
</div>


              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Task;
