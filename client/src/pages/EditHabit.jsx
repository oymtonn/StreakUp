import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidemenu from "../components/Sidemenu";

const EditHabit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getHabitById = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/habits/${id}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error("Failed to fetch habit");
        }
        const data = await response.json();
        setHabit(data);
      } catch (err) {
        console.error(err);
        setError("Could not load this habit. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getHabitById();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHabit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!habit) return;

    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/habits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habit),
      });

      if (!response.ok) {
        throw new Error("Failed to update habit");
      }

      const updated = await response.json();
      console.log("Habit updated:", updated);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/habits/${id}`, {
            method: "DELETE",
            credentials: 'include'
        });
        navigate("/dashboard");
    }
    catch (err) {
        console.log('error deleting habit');
    }

  }

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
              Edit Habit
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#6b7280",
                margin: 0,
              }}
            >
              Update the details to keep this habit aligned with your current goals.
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
              Habit #{id}
            </div>
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
                Loading habit details...
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
            ) : !habit ? (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#6b7280",
                }}
              >
                Habit not found.
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
                  Make small adjustments—name, priority, or tag—without breaking your streak.
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
                      value={habit.title || ""}
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
                        value={habit.priority || ""}
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
                        value={habit.tag || ""}
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
                        }}
                      />
                    </div>
                  </div>

                  
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginTop: "4px",
                      fontSize: "0.8rem",
                      color: "#6b7280",
                    }}
                  >
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "999px",
                        backgroundColor: "#f3f4f6",
                      }}
                    >
                      Current streak:{" "}
                      <strong>{habit.streak ?? "0"} days</strong>
                    </span>
                    {habit.last_completed_date && (
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "999px",
                          backgroundColor: "#f3f4f6",
                        }}
                      >
                        Last completed:{" "}
                        <strong>
                          {new Date(habit.last_completed_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </strong>
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
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
                        Delete Habit
                    </button>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                        type="button"
                        onClick={() => navigate(`/habits/detail/${id}`)}
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
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f9fafb";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#ffffff";
                        }}
                        >
                        View Details
                        </button>

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

export default EditHabit;
