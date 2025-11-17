import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidemenu from "../components/Sidemenu";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTaskById = async () => {
      try {
        const response = await fetch(`http://localhost:3001/tasks/${id}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }
        const data = await response.json();
        // Format date for input
        if (data.due_date) {
          data.due_date = new Date(data.due_date).toISOString().split('T')[0];
        }
        setTask(data);
      } catch (err) {
        console.error(err);
        setError("Could not load this task. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getTaskById();
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

  return (
    <div style={{ display: "flex", fontFamily: "Poppins, system-ui, sans-serif" }}>
      <Sidemenu />

      <div
        style={{
          flex: 1,
          marginLeft: "180px",
          minHeight: "100vh",
          minWidth: "80vw",
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
