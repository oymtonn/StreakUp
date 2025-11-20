import { useState } from 'react';
import Sidemenu from '../components/Sidemenu';

const CreateTask = () => {
  const [task, setTask] = useState({
    title: "",
    priority: "",
    tag: "",
    completed: false,
    progress: 0,
    due_date: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask({
      ...task,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(task),
      });

      const data = await response.json();
      console.log('Task created:', data);
      window.location = "/dashboard";
    } catch (err) {
      console.log('Error creating task', err);
    }
  };

  return (
    <div style={{ display: "flex", fontFamily: "Poppins, system-ui, sans-serif" }}>
      <Sidemenu />

      <div
        style={{
          flex: 1,
          marginLeft: '250px',
          minHeight: "100vh",
          width: "calc(100vw - 250px)",
          background:
            "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 40%, #f9fafb 100%)",
          padding: "24px 32px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "650px", margin: "0 auto" }}>
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
              Create New Task
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#6b7280",
                margin: 0,
              }}
            >
              Add a task to track your progress and stay organized.
            </p>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "16px",
              boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
              border: "1px solid rgba(148,163,184,0.25)",
              padding: "24px 28px",
              backdropFilter: "blur(8px)",
            }}
          >
            <p
              style={{
                fontSize: "0.9rem",
                color: "#6b7280",
                marginBottom: "18px",
              }}
            >
              Define your task clearly with a deadline to stay on track.
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
                  value={task.title}
                  onChange={handleChange}
                  placeholder="e.g. Complete project report, Buy groceries"
                  required
                  style={{
                    width: "80%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    fontSize: "0.9rem",
                    outline: "none",
                    backgroundColor: "#f9fafb",
                    color: "#111827",
                    caretColor: "#111827",
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
                    value={task.priority}
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
                      caretColor: "#111827",
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
                    value={task.tag}
                    onChange={handleChange}
                    placeholder="e.g. Work, Personal, Health"
                    style={{
                      width: "80%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid #d1d5db",
                      fontSize: "0.9rem",
                      outline: "none",
                      backgroundColor: "#f9fafb",
                      color: "#111827",
                      caretColor: "#111827",
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
                    value={task.progress}
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
                      caretColor: "#111827",
                    }}
                  />
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
                    value={task.due_date}
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
                      caretColor: "#111827",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={() => (window.location = "/dashboard")}
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
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#374151";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#4b5563";
                  }}
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
