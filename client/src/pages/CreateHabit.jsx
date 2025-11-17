import { useState } from 'react';
import Sidemenu from '../components/Sidemenu';

const CreateHabit = () => {
  const [habit, setHabit] = useState({
    user_id: "",
    title: "",
    priority: "",
    tag: "",
    streak: "0",
    last_completed_date: null
  });

  const handleChange = (e) => {
    setHabit({
      ...habit,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habit),
      });

      const data = await response.json();
      console.log('Habit created:', data);

    } catch (err) {
      console.log('Error creating habit', err);
    }
  };

  return (
    <div style={{ display: "flex", fontFamily: "Poppins, system-ui, sans-serif" }}>
      <Sidemenu />

      <div
        style={{
          flex: 1,
          marginLeft: '180px',
          minHeight: "100vh",
          minWidth: "80vw",
          background:
            "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 40%, #f9fafb 100%)",
          padding: "24px 32px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "650px", margin: "0 auto" }}>
          {/* Heading */}
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
              Create New Habit
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#6b7280",
                margin: 0,
              }}
            >
              Set up a habit to track your consistency and momentum.
            </p>
          </div>

          {/* Card */}
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
              Choose a clear, specific habit so it’s easy to stick with over time.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {/* Habit Title */}
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
                  Habit Title
                </label>
                <input
                  id="title"
                  name="title"
                  value={habit.title}
                  onChange={handleChange}
                  placeholder="e.g. Morning walk, Read 20 minutes"
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

              {/* Priority + Tag */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                {/* Priority */}
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
                    value={habit.priority}
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

                {/* Tag */}
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
                    value={habit.tag}
                    onChange={handleChange}
                    placeholder="e.g. Health, Personal, Work"
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

              {/* Buttons */}
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
                  Create Habit
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateHabit;
