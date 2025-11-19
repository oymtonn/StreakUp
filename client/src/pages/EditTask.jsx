import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidemenu from "../components/Sidemenu";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const [taskRes, subtasksRes] = await Promise.all([
          fetch(`http://localhost:3001/tasks/${id}`, { credentials: 'include' }),
          fetch(`http://localhost:3001/tasks/${id}/subtasks`, { credentials: 'include' })
        ]);
        
        if (!taskRes.ok) {
          throw new Error("Failed to fetch task");
        }
        
        const taskData = await taskRes.json();
        const subtasksData = await subtasksRes.json();
        
        console.log('Task data:', taskData);
        console.log('Subtasks data:', subtasksData);
        
        // Format date for input
        if (taskData.due_date) {
          taskData.due_date = new Date(taskData.due_date).toISOString().split('T')[0];
        }
        
        setTask(taskData);
        setSubtasks(subtasksData);
      } catch (err) {
        console.error(err);
        setError("Could not load this task. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task) return;

    setError("");

    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updated = await response.json();
      console.log("Task updated:", updated);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to update task. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "DELETE",
        credentials: 'include'
      });
      navigate("/dashboard");
    } catch (err) {
      console.log('error deleting task');
    }
  };

  const handleAddSubtask = async () => {
    console.log('handleAddSubtask called!');
    console.log('Event prevented, newSubtask:', newSubtask);
    
    if (!newSubtask.trim()) {
      console.log('Subtask is empty, returning');
      return;
    }

    const subtaskData = {
      title: newSubtask,
      priority: task.priority,
      tag: task.tag,
      parent_task_id: id,
      is_subtask: true,
      completed: false,
      progress: 0
    };

    console.log('Creating subtask with data:', subtaskData);

    try {
      console.log('Sending request to create subtask...');
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(subtaskData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newSubtaskData = await response.json();
      console.log('Subtask created:', newSubtaskData);
      
      setSubtasks([...subtasks, newSubtaskData]);
      setNewSubtask("");
      setShowSubtaskForm(false);
      
      // Refresh task to get updated progress
      const taskRes = await fetch(`http://localhost:3001/tasks/${id}`, { credentials: 'include' });
      const updatedTask = await taskRes.json();
      if (updatedTask.due_date) {
        updatedTask.due_date = new Date(updatedTask.due_date).toISOString().split('T')[0];
      }
      setTask(updatedTask);
    } catch (err) {
      console.error('Error adding subtask:', err);
      console.error('Error details:', err.message);
      alert('Failed to add subtask: ' + err.message);
    }
  };

  const handleToggleSubtask = async (subtaskId, currentCompleted) => {
    try {
      const subtask = subtasks.find(st => st.id === subtaskId);
      const response = await fetch(`http://localhost:3001/tasks/${subtaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...subtask,
          completed: !currentCompleted
        }),
      });

      const updatedSubtask = await response.json();
      setSubtasks(subtasks.map(st => st.id === subtaskId ? updatedSubtask : st));
      
      // Refresh task to get updated progress
      const taskRes = await fetch(`http://localhost:3001/tasks/${id}`, { credentials: 'include' });
      const updatedTask = await taskRes.json();
      if (updatedTask.due_date) {
        updatedTask.due_date = new Date(updatedTask.due_date).toISOString().split('T')[0];
      }
      setTask(updatedTask);
    } catch (err) {
      console.error('Error toggling subtask:', err);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await fetch(`http://localhost:3001/tasks/${subtaskId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      setSubtasks(subtasks.filter(st => st.id !== subtaskId));
      
      // Refresh task to get updated progress
      const taskRes = await fetch(`http://localhost:3001/tasks/${id}`, { credentials: 'include' });
      const updatedTask = await taskRes.json();
      if (updatedTask.due_date) {
        updatedTask.due_date = new Date(updatedTask.due_date).toISOString().split('T')[0];
      }
      setTask(updatedTask);
    } catch (err) {
      console.error('Error deleting subtask:', err);
    }
  };

  return (
    <div style={{ display: "flex", fontFamily: "Poppins, system-ui, sans-serif" }}>
      <Sidemenu />

      <div
        style={{
          flex: 1,
          marginLeft: "250px",
          minHeight: "100vh",
          width: "calc(100vw - 250px)",
          background:
            "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 40%, #f9fafb 100%)",
          padding: "24px 32px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <h1
              style={{
                color: "#1f2937",
                marginBottom: "6px",
                fontSize: "2rem",
                fontWeight: "700",
              }}
            >
              Edit Task
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#6b7280",
                margin: 0,
              }}
            >
              Update the details to keep this task aligned with your current goals.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "10px",
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "0.75rem",
                backgroundColor: "rgba(191, 219, 254, 0.7)",
                color: "#1d4ed8",
                border: "1px solid rgba(96, 165, 250, 0.8)",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "999px",
                  backgroundColor: "#1d4ed8",
                }}
              />
              Task #{id}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "16px",
              boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
              border: "1px solid rgba(148,163,184,0.25)",
              padding: "24px 28px",
              backdropFilter: "blur(8px)",
              minHeight: "220px",
            }}
          >
            {loading ? (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#6b7280",
                }}
              >
                Loading task details...
              </p>
            ) : error ? (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#b91c1c",
                  backgroundColor: "#fef2f2",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  border: "1px solid #fecaca",
                }}
              >
                {error}
              </p>
            ) : !task ? (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#6b7280",
                }}
              >
                Task not found.
              </p>
            ) : (
              <>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#6b7280",
                    marginBottom: "18px",
                  }}
                >
                  Make adjustments to keep your task up to date with your progress.
                </p>

                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                >
                  <div>
                    <label
                      htmlFor="title"
                      style={{
                        display: "block",
                        fontSize: "0.9rem",
                        color: "#4b5563",
                        marginBottom: "4px",
                        fontWeight: "600",
                      }}
                    >
                      Task Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      value={task.title || ""}
                      onChange={handleChange}
                      placeholder="e.g. Complete project report"
                      style={{
                        width: "80%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1px solid #d1d5db",
                        fontSize: "0.9rem",
                        outline: "none",
                        backgroundColor: "#f9fafb",
                        color: "#111827",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <label
                        htmlFor="priority"
                        style={{
                          display: "block",
                          fontSize: "0.9rem",
                          color: "#4b5563",
                          marginBottom: "4px",
                          fontWeight: "600",
                        }}
                      >
                        Priority
                      </label>
                      <input
                        id="priority"
                        name="priority"
                        value={task.priority || ""}
                        onChange={handleChange}
                        placeholder="High, Medium, or Low"
                        style={{
                          width: "80%",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "1px solid #d1d5db",
                          fontSize: "0.9rem",
                          outline: "none",
                          backgroundColor: "#f9fafb",
                          color: "#111827",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tag"
                        style={{
                          display: "block",
                          fontSize: "0.9rem",
                          color: "#4b5563",
                          marginBottom: "4px",
                          fontWeight: "600",
                        }}
                      >
                        Tag
                      </label>
                      <input
                        id="tag"
                        name="tag"
                        value={task.tag || ""}
                        onChange={handleChange}
                        placeholder="e.g. Work, Personal"
                        style={{
                          width: "80%",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "1px solid #d1d5db",
                          fontSize: "0.9rem",
                          outline: "none",
                          backgroundColor: "#f9fafb",
                          color: "#111827",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <label
                        htmlFor="progress"
                        style={{
                          display: "block",
                          fontSize: "0.9rem",
                          color: "#4b5563",
                          marginBottom: "4px",
                          fontWeight: "600",
                        }}
                      >
                        Progress (%)
                      </label>
                      <input
                        id="progress"
                        name="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={task.progress || 0}
                        onChange={handleChange}
                        readOnly={subtasks.length > 0}
                        title={subtasks.length > 0 ? "Progress is auto-calculated from subtasks" : ""}
                        style={{
                          width: "80%",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "1px solid #d1d5db",
                          fontSize: "0.9rem",
                          outline: "none",
                          backgroundColor: subtasks.length > 0 ? "#e5e7eb" : "#f9fafb",
                          color: "#111827",
                          cursor: subtasks.length > 0 ? "not-allowed" : "text",
                        }}
                      />
                      {subtasks.length > 0 && (
                        <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "4px 0 0 0" }}>
                          Auto-calculated from subtasks
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="due_date"
                        style={{
                          display: "block",
                          fontSize: "0.9rem",
                          color: "#4b5563",
                          marginBottom: "4px",
                          fontWeight: "600",
                        }}
                      >
                        Due Date
                      </label>
                      <input
                        id="due_date"
                        name="due_date"
                        type="date"
                        value={task.due_date || ""}
                        onChange={handleChange}
                        style={{
                          width: "80%",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "1px solid #d1d5db",
                          fontSize: "0.9rem",
                          outline: "none",
                          backgroundColor: "#f9fafb",
                          color: "#111827",
                        }}
                      />
                    </div>
                  </div>

                  {/* Subtasks Section */}
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "16px",
                      backgroundColor: "#f9fafb",
                      borderRadius: "10px",
                      border: "1px solid #d1d5db",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <label
                        style={{
                          fontSize: "0.9rem",
                          color: "#4b5563",
                          fontWeight: "600",
                        }}
                      >
                        Subtasks ({subtasks.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSubtaskForm(!showSubtaskForm)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "#ffffff",
                          color: "#4b5563",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        + Add Subtask
                      </button>
                    </div>

                    {showSubtaskForm && (
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            type="text"
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            placeholder="Enter subtask title..."
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid #d1d5db",
                              fontSize: "0.85rem",
                              outline: "none",
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddSubtask}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "6px",
                              border: "none",
                              backgroundColor: "#4b5563",
                              color: "white",
                              fontWeight: "600",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                            }}
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowSubtaskForm(false);
                              setNewSubtask("");
                            }}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "6px",
                              border: "1px solid #d1d5db",
                              backgroundColor: "#ffffff",
                              color: "#6b7280",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {subtasks.length === 0 ? (
                      <p style={{ fontSize: "0.85rem", color: "#9ca3af", margin: 0 }}>
                        No subtasks yet. Break this task into smaller steps!
                      </p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {subtasks.map((subtask) => (
                          <div
                            key={subtask.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "10px 12px",
                              backgroundColor: subtask.completed ? "#f3f4f6" : "#ffffff",
                              borderRadius: "8px",
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={subtask.completed}
                              onChange={() => handleToggleSubtask(subtask.id, subtask.completed)}
                              style={{
                                width: "16px",
                                height: "16px",
                                cursor: "pointer",
                              }}
                            />
                            <span
                              style={{
                                flex: 1,
                                fontSize: "0.85rem",
                                color: subtask.completed ? "#9ca3af" : "#374151",
                                textDecoration: subtask.completed ? "line-through" : "none",
                              }}
                            >
                              {subtask.title}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubtask(subtask.id)}
                              style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                border: "none",
                                backgroundColor: "transparent",
                                color: "#ef4444",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#fef2f2";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      backgroundColor: "#f9fafb",
                      border: "1px solid #d1d5db",
                    }}
                  >
                    <input
                      id="completed"
                      name="completed"
                      type="checkbox"
                      checked={task.completed || false}
                      onChange={handleChange}
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                    <label
                      htmlFor="completed"
                      style={{
                        fontSize: "0.9rem",
                        color: "#4b5563",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Mark as completed
                    </label>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "18px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleDelete}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "999px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#ffffff",
                        color: "#FF474D",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#fef2f2";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                      }}
                    >
                      Delete Task
                    </button>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "999px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "#ffffff",
                          color: "#4b5563",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        style={{
                          padding: "10px 16px",
                          borderRadius: "999px",
                          border: "none",
                          backgroundColor: "#4b5563",
                          color: "white",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                          transition: "background-color 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#374151";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#4b5563";
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
