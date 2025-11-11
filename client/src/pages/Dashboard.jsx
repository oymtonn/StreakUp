import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [habits, setHabits] = useState([]);


    // habits
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

    // tasks

return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        margin: 0,
        padding: "40px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          width: "90%",
          maxWidth: "900px",
          padding: "30px 40px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#333",
            marginBottom: "25px",
            fontSize: "1.8rem",
          }}
        >
          Habit Dashboard
        </h1>

        {habits.length === 0 ? (
          <p style={{ textAlign: "center", color: "#555" }}>Loading habits...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {habits.map((habit) => (
              <div
                key={habit.id}
                style={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "15px 20px",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-4px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <h2
                  style={{
                    fontSize: "1.1rem",
                    color: "#1f2937",
                    marginBottom: "8px",
                  }}
                >
                  {habit.title}
                </h2>
                <p style={{ margin: "4px 0", color: "#4b5563" }}>
                  <strong>Frequency:</strong> {habit.frequency}
                </p>
                <p style={{ margin: "4px 0", color: "#4b5563" }}>
                  <strong>Streak:</strong> {habit.streak}
                </p>
                <p style={{ margin: "4px 0", color: "#4b5563" }}>
                  <strong>Last Completed:</strong> {habit.last_completed_date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
);
}

export default Dashboard;