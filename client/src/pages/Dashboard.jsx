import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidemenu from '../components/Sidemenu';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();

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
        console.error('Error fetching tasks', err);
      }
    };
    getTasks();
  }, []);

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',    // red-ish badge
      medium: '#f59e0b',  // amber
      low: '#10b981',     // green
    };
    return colors[priority?.toLowerCase()] || '#6b7280';
  };

  const getTagColor = (tag) => {
    const colors = {
      work: '#0f766e',
      personal: '#4f46e5',
      health: '#16a34a',
      fitness: '#db2777',
    };
    return colors[tag?.toLowerCase()] || '#4b5563';
  };

  const formatShortDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const totalHabits = habits.length;
  const highPriorityHabits = habits.filter(
    (h) => h.priority?.toLowerCase() === 'high'
  ).length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div style={{ display: 'flex', fontFamily: 'Poppins, system-ui, sans-serif' }}>
      <Sidemenu />

      <div
        style={{
          flex: 1,
          marginLeft: '250px',
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 40%, #f9fafb 100%)',
          padding: '24px 32px',
          boxSizing: 'border-box',
        }}
      >
        {/* Top header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            gap: '16px',
          }}
        >
          {/* Left: centered title + subtitle */}
          <div
            style={{
              flex: 1,
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '1.9rem',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                marginTop: '12px',
                fontSize: '0.9rem',
                color: '#6b7280',
              }}
            >
              A quick snapshot of your habits and tasks today.
            </p>
          </div>

          {/* Right: pills */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                padding: '8px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(15, 118, 110, 0.06)',
                border: '1px solid rgba(45, 212, 191, 0.5)',
                fontSize: '0.8rem',
                color: '#0f766e',
                fontWeight: 600,
              }}
            >
              {totalHabits} habits · {highPriorityHabits} high priority
            </div>
            <div
              style={{
                padding: '8px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(79, 70, 229, 0.06)',
                border: '1px solid rgba(129, 140, 248, 0.6)',
                fontSize: '0.8rem',
                color: '#4f46e5',
                fontWeight: 600,
              }}
            >
              {completedTasks}/{totalTasks || 0} tasks completed
            </div>
          </div>
        </header>

        {/* Main content layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
            gap: '20px',
          }}
        >
          {/* Habits column */}
          <section>
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '18px',
                padding: '20px 22px',
                boxShadow: '0 18px 45px rgba(15,23,42,0.08)',
                border: '1px solid rgba(148,163,184,0.25)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#111827',
                      margin: 0,
                    }}
                  >
                    Habits
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      marginTop: '4px',
                      fontSize: '0.8rem',
                      color: '#6b7280',
                    }}
                  >
                    Stay consistent with your routines.
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    backgroundColor: '#f3f4ff',
                    color: '#4338ca',
                    fontWeight: 600,
                  }}
                >
                  {totalHabits || 'No'} habits tracked
                </span>
              </div>

              {habits.length === 0 ? (
                <div
                  style={{
                    borderRadius: '12px',
                    border: '1px dashed #cbd5f5',
                    padding: '18px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: '#6b7280',
                    background:
                      'linear-gradient(135deg, rgba(239,246,255,0.8), rgba(249,250,251,0.9))',
                    marginTop: '10px',
                  }}
                >
                  You don’t have any habits yet.
                  <br />
                  <span style={{ fontWeight: 600 }}>
                    Create your first habit from the sidebar.
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginTop: '12px',
                    maxHeight: '420px',
                    overflowY: 'auto',
                    paddingRight: '4px',
                  }}
                >
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      style={{
                        position: 'relative', // Edit chip anchor
                        background: 'linear-gradient(135deg,#f9fafb,#f3f4f6)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow =
                          '0 10px 25px rgba(15,23,42,0.08)';
                        e.currentTarget.style.background =
                          'linear-gradient(135deg,#f3f4f6,#e5e7eb)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.background =
                          'linear-gradient(135deg,#f9fafb,#f3f4f6)';
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3
                          style={{
                            fontSize: '0.95rem',
                            color: '#111827',
                            margin: 0,
                            marginBottom: '6px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {habit.title}
                        </h3>
                        <div
                          style={{
                            display: 'flex',
                            gap: '6px',
                            flexWrap: 'wrap',
                            marginBottom: '4px',
                          }}
                        >
                          {habit.priority && (
                            <span
                              style={{
                                backgroundColor: `rgba(15,23,42,0.03)`,
                                border: `1px solid ${getPriorityColor(
                                  habit.priority
                                )}`,
                                color: getPriorityColor(habit.priority),
                                padding: '2px 8px',
                                borderRadius: '999px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                              }}
                            >
                              {habit.priority}
                            </span>
                          )}
                          {habit.tag && (
                            <span
                              style={{
                                backgroundColor: `rgba(17,24,39,0.04)`,
                                border: `1px solid ${getTagColor(habit.tag)}`,
                                color: getTagColor(habit.tag),
                                padding: '2px 8px',
                                borderRadius: '999px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                              }}
                            >
                              {habit.tag}
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span>
                            <strong>Streak:</strong> {habit.streak} days
                          </span>
                          <span>
                            <strong>Last:</strong>{' '}
                            {formatShortDate(habit.last_completed_date)}
                          </span>
                        </div>
                      </div>

                      {/* Edit button for habit */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/habits/edit/${habit.id}`);
                        }}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '10px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          border: '1px solid #d1d5db',
                          backgroundColor: '#ffffff',
                          fontSize: '0.75rem',
                          color: '#4b5563',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Tasks column */}
          <section>
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '18px',
                padding: '20px 22px',
                boxShadow: '0 18px 45px rgba(15,23,42,0.08)',
                border: '1px solid rgba(148,163,184,0.25)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      margin: 0,
                      color: '#111827',
                    }}
                  >
                    Tasks
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      marginTop: '4px',
                      fontSize: '0.8rem',
                      color: '#6b7280',
                    }}
                  >
                    Focus on what actually moves you forward.
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    background:
                      'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(132,204,22,0.15))',
                    color: '#166534',
                    fontWeight: 700,
                    border: '1px solid rgba(34,197,94,0.45)',
                  }}
                >
                  {completedTasks}/{totalTasks || 0} done
                </span>
              </div>

              {tasks.length === 0 ? (
                <div
                  style={{
                    borderRadius: '12px',
                    border: '1px dashed rgba(148,163,184,0.8)',
                    padding: '18px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: '#6b7280',
                    background:
                      'linear-gradient(135deg, rgba(219,234,254,0.8), rgba(249,250,251,0.9))',
                    marginTop: '10px',
                  }}
                >
                  No tasks yet.
                  <br />
                  <span style={{ fontWeight: 600 }}>
                    Create a task from the sidebar to get started.
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginTop: '12px',
                    maxHeight: '420px',
                    overflowY: 'auto',
                    paddingRight: '4px',
                  }}
                >
                  {tasks.map((task) => {
                    const progressValue = task.completed ? 100 : (task.progress || 0);

                    return (
                      <div
                        key={task.id}
                        style={{
                          position: 'relative', // anchor for Edit + Done
                          borderRadius: '12px',
                          padding: '12px 14px',
                          border: task.completed
                            ? '1px solid rgba(148,163,184,0.9)'
                            : '1px solid #e5e7eb',
                          background:
                            'linear-gradient(135deg,#f9fafb,#f3f4f6)',
                          opacity: task.completed ? 0.85 : 1,
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow =
                            '0 12px 30px rgba(15,23,42,0.08)';
                          e.currentTarget.style.background =
                            'linear-gradient(135deg,#f3f4f6,#e5e7eb)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.background =
                            'linear-gradient(135deg,#f9fafb,#f3f4f6)';
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '12px',
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3
                              style={{
                                fontSize: '0.95rem',
                                margin: 0,
                                marginBottom: '6px',
                                fontWeight: 600,
                                color: '#111827',
                                textDecoration: task.completed
                                  ? 'line-through'
                                  : 'none',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {task.title}
                            </h3>
                            <div
                              style={{
                                display: 'flex',
                                gap: '6px',
                                flexWrap: 'wrap',
                                marginBottom: '6px',
                              }}
                            >
                              {task.priority && (
                                <span
                                  style={{
                                    backgroundColor: 'rgba(15,23,42,0.02)',
                                    border: `1px solid ${getPriorityColor(
                                      task.priority
                                    )}`,
                                    color: getPriorityColor(task.priority),
                                    padding: '2px 8px',
                                    borderRadius: '999px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  {task.priority}
                                </span>
                              )}
                              {task.tag && (
                                <span
                                  style={{
                                    backgroundColor: 'rgba(15,23,42,0.02)',
                                    border: `1px solid ${getTagColor(task.tag)}`,
                                    color: getTagColor(task.tag),
                                    padding: '2px 8px',
                                    borderRadius: '999px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  {task.tag}
                                </span>
                              )}
                            </div>

                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: '#6b7280',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                              }}
                            >
                              <div>
                                <strong>Due:</strong>{' '}
                                {formatFullDate(task.due_date)}
                              </div>
                              <div style={{ marginTop: '2px' }}>
                                <strong>Progress:</strong>
                                <div
                                  style={{
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '999px',
                                    height: '6px',
                                    marginTop: '4px',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div
                                    style={{
                                      background:
                                        'linear-gradient(90deg,#22c55e,#a3e635)',
                                      height: '100%',
                                      width: `${progressValue}%`,
                                      transition: 'width 0.25s ease',
                                    }}
                                  />
                                </div>
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    color: '#6b7280',
                                  }}
                                >
                                  {progressValue}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Edit button for task */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Edit task', task.id);
                            // later: navigate(`/tasks/${task.id}/edit`);
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '10px',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            border: '1px solid #d1d5db',
                            backgroundColor: '#ffffff',
                            fontSize: '0.75rem',
                            color: '#4b5563',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                          }}
                        >
                          Edit
                        </button>

                        {task.completed && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '34px',
                              right: '10px',
                              fontSize: '0.75rem',
                              color: '#166534',
                              fontWeight: 600,
                              padding: '4px 8px',
                              borderRadius: '999px',
                              backgroundColor: 'rgba(187,247,208,0.9)',
                            }}
                          >
                            ✓ Done
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
