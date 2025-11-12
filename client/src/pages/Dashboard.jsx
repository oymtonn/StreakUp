import { useState, useEffect } from 'react';
import Sidemenu from '../components/Sidemenu';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getHabits = async () => {
      try {
        const res = await fetch('http://localhost:3001/habits');
        const data = await res.json();
        setHabits(data);
      } catch (err) {
        console.log('Error fetching habits', err);
      }
    };

    getHabits();
  }, []);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const res = await fetch('http://localhost:3001/tasks');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks");
      }
    };
    getTasks();
  }, []);

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#4b5563',
      medium: '#6b7280',
      low: '#9ca3af'
    };
    return colors[priority?.toLowerCase()] || '#6b7280';
  };

  const getTagColor = (tag) => {
    const colors = {
      work: '#374151',
      personal: '#4b5563',
      health: '#6b7280',
      fitness: '#9ca3af'
    };
    return colors[tag?.toLowerCase()] || '#6b7280';
  };

  return (
    <div style={{ display: "flex", fontFamily: "Poppins, sans-serif" }}>
      <Sidemenu />

      <div
        style={{
          marginLeft: "250px",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          width: "100vw",
          padding: "30px 20px",
          overflowY: "auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1f2937",
            marginBottom: "30px",
            fontSize: "2rem",
            fontWeight: "700",
          }}
        >
          Dashboard
        </h1>

        <div style={{ display: "flex", gap: "20px" }}>
          {/* Habits Section */}
          <div style={{ flex: "1" }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                padding: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.2rem",
                  color: "#1f2937",
                  marginBottom: "15px",
                  borderBottom: "2px solid #d1d5db",
                  paddingBottom: "8px",
                }}
              >
                Habits
              </h2>

              {habits.length === 0 ? (
                <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.9rem" }}>Loading habits...</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      style={{
                        background: "#fafafa",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "12px",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#fafafa";
                      }}
                    >
                      <h3 style={{ fontSize: "1rem", color: "#1f2937", marginBottom: "8px", fontWeight: "600" }}>
                        {habit.title}
                      </h3>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
                        <span
                          style={{
                            backgroundColor: getPriorityColor(habit.priority),
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "0.7rem",
                            fontWeight: "600",
                          }}
                        >
                          {habit.priority}
                        </span>
                        <span
                          style={{
                            backgroundColor: getTagColor(habit.tag),
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "0.7rem",
                            fontWeight: "600",
                          }}
                        >
                          {habit.tag}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: "1.4" }}>
                        <div><strong>Frequency:</strong> {habit.frequency}</div>
                        <div><strong>Streak:</strong> {habit.streak} days</div>
                        <div><strong>Last Completed:</strong> {new Date(habit.last_completed_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tasks Section */}
          <div style={{ flex: "1" }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                padding: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.2rem",
                  color: "#1f2937",
                  marginBottom: "15px",
                  borderBottom: "2px solid #d1d5db",
                  paddingBottom: "8px",
                }}
              >
                Tasks
              </h2>

              {tasks.length === 0 ? (
                <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.9rem" }}>Loading tasks...</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        background: task.completed ? "#f3f4f6" : "#fafafa",
                        border: task.completed ? "1px solid #9ca3af" : "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "12px",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        opacity: task.completed ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = task.completed ? "#e5e7eb" : "#f3f4f6";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = task.completed ? "#f3f4f6" : "#fafafa";
                      }}
                    >
                      <h3 style={{
                        fontSize: "1rem",
                        color: "#1f2937",
                        marginBottom: "8px",
                        fontWeight: "600",
                        textDecoration: task.completed ? "line-through" : "none"
                      }}>
                        {task.title}
                      </h3>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
                        <span
                          style={{
                            backgroundColor: getPriorityColor(task.priority),
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "0.7rem",
                            fontWeight: "600",
                          }}
                        >
                          {task.priority}
                        </span>
                        <span
                          style={{
                            backgroundColor: getTagColor(task.tag),
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "0.7rem",
                            fontWeight: "600",
                          }}
                        >
                          {task.tag}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: "1.4" }}>
                        <div style={{ marginBottom: "4px" }}>
                          <strong>Progress:</strong>
                          <div style={{
                            backgroundColor: "#e5e7eb",
                            borderRadius: "8px",
                            height: "6px",
                            marginTop: "4px",
                            overflow: "hidden"
                          }}>
                            <div style={{
                              backgroundColor: "#4b5563",
                              height: "100%",
                              width: `${task.progress}%`,
                              transition: "width 0.3s ease"
                            }} />
                          </div>
                          <span style={{ fontSize: "0.75rem" }}>{task.progress}%</span>
                        </div>
                        <div><strong>Due Date:</strong> {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        {task.completed && <div style={{ color: "#6b7280", fontWeight: "600" }}>✓ Completed</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;