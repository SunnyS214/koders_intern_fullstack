const express = require("express");
const Task = require("../models/taskModel");
const route = express.Router();

// testing
route.get("/", (req, res) => {
  res.send("Task API is working");
});

// new task
route.post("/", async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // validation
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: "Title must be at least 3 characters long" });
    }

    if (!description || description.trim().length < 5) {
      return res.status(400).json({ message: "Description must be at least 5 characters long" });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "pending",
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// all task
route.get("/all", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// edit task
route.put("/:id", async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // validation
    if (title && title.trim().length < 3) {
      return res.status(400).json({ message: "Title must be at least 3 characters long" });
    }

    if (description && description.trim().length < 5) {
      return res.status(400).json({ message: "Description must be at least 5 characters long" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// status pending 
// UPDATE task status
route.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    // validation
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// delete
route.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = route;
