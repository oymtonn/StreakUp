import SideMenu from '../components/Sidemenu.jsx';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const HabitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getHabit = async () => {
      try {
        setLoading(true);
        const results = await fetch(`http://localhost:3001/habits/${id}`);
        const data = await results.json();
        setHabit(data);
      } catch (err) {
        console.log('Error fetching habit in detail page', err);
      } finally {
        setLoading(false);
      }
    };

    getHabit();
  }, [id, refresh]);

  const handleStreak = async () => {
    try {
      const todayStr = getLocalDate();
      const last = habit.last_completed_date;

      let newStreak = habit.streak || 0;
      let newLastCompletedDate = todayStr;

      if (!last) {
        newStreak = 1;
      } else {
        const diff = daysBetweenLocal(todayStr, last);
        if (diff === 1) newStreak = Number(newStreak) + 1;
        else newStreak = 1;
      }

      const updatedHabit = {
        ...habit,
        streak: newStreak,
        last_completed_date: newLastCompletedDate,
      };

      await fetch(`http://localhost:3001/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedHabit),
      });

      setHabit(updatedHabit);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.log('Error updating streak', err);
    }
  };

  const getLocalDate = (d = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const daysBetweenLocal = (d1, d2) => {
    const toLocalMidnight = (d) => {
      if (!d) return null;
  
      let date;
  
      if (d instanceof Date) {
        date = d;
      } else if (typeof d === 'string') {
        // If it's just a date like "2025-11-17"
        if (d.length <= 10) {
          const [y, m, day] = d.split('-').map(Number);
          date = new Date(y, m - 1, day);
        } else {
          // ISO string from backend, like "2025-11-17T00:00:00.000Z"
          date = new Date(d);
        }
      } else {
        date = new Date(d);
      }
  
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };
  
    const a = toLocalMidnight(d1);
    const b = toLocalMidnight(d2);
  
    if (!a || !b || Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) {
      return NaN;
    }
  
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((a - b) / msPerDay);
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Not completed yet';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const todayStr = getLocalDate();
  const isCompletedToday =
    habit?.last_completed_date &&
    daysBetweenLocal(todayStr, habit.last_completed_date) === 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', fontFamily: 'Poppins, system-ui, sans-serif' }}>
        <SideMenu />
        <div
          style={{
            flex: 1,
            marginLeft: '250px',
            minHeight: '100vh',
            width: 'calc(100vw - 250px)',
            background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 40%, #f9fafb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center', color: '#4b5563' }}>
            Loading habit...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', fontFamily: 'Poppins, system-ui, sans-serif' }}>
      <SideMenu />

      <div
        style={{
          flex: 1,
          marginLeft: '250px',
          minHeight: '100vh',
          width: 'calc(100vw - 250px)',
          background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 40%, #f9fafb 100%)',
          padding: '24px 32px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <h1
              style={{
                color: '#1f2937',
                marginBottom: '6px',
                fontSize: '2rem',
                fontWeight: '700',
              }}
            >
              {habit.title}
            </h1>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                margin: 0,
              }}
            >
              Track your consistency and build momentum
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '10px',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                backgroundColor: 'rgba(191, 219, 254, 0.7)',
                color: '#1d4ed8',
                border: '1px solid rgba(96, 165, 250, 0.8)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '999px',
                  backgroundColor: '#1d4ed8',
                }}
              />
              Habit #{id}
            </div>
          </div>

          {/* Main Card */}
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: '16px',
              boxShadow: '0 18px 45px rgba(15,23,42,0.08)',
              border: '1px solid rgba(148,163,184,0.25)',
              padding: '24px 28px',
              backdropFilter: 'blur(8px)',
            }}
          >

            {/* Info Section */}
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  fontSize: '0.8rem',
                  color: '#6b7280',
                  marginBottom: '16px',
                }}
              >
                {habit.tag && (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      backgroundColor: '#f3f4f6',
                    }}
                  >
                    Tag: <strong>{habit.tag}</strong>
                  </span>
                )}
                {habit.priority && (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      backgroundColor: '#f3f4f6',
                    }}
                  >
                    Priority: <strong>{habit.priority}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Streak Section */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#f9fafb',
                  padding: '18px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <p
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: '#6b7280',
                    marginBottom: '8px',
                    fontWeight: '600',
                  }}
                >
                  Current Streak
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: '700',
                      color: '#1f2937',
                    }}
                  >
                    {habit.streak || 0}
                  </span>
                  <span style={{ marginLeft: '6px', color: '#6b7280', fontSize: '0.9rem' }}>
                    {habit.streak === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  padding: '18px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <p
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: '#6b7280',
                    marginBottom: '8px',
                    fontWeight: '600',
                  }}
                >
                  Last Completed
                </p>
                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937' }}>
                  {formatDisplayDate(habit.last_completed_date)}
                </p>
              </div>
            </div>

              {/* Today Status */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '26px',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#94a3b8',
                    marginBottom: '8px',
                  }}
                >
                  Today’s Status
                </p>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: '500',
                    color: isCompletedToday ? '#059669' : '#b45309',
                  }}
                >
                  {isCompletedToday ? 'Completed 🎉' : 'Not completed yet'}
                </p>
              </div>

            {/* Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                marginTop: '18px',
              }}
            >
              <button
                type="button"
                onClick={() => navigate(`/habits/edit/${id}`)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '999px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#4b5563',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                Edit Habit
              </button>

              <button
                onClick={handleStreak}
                disabled={isCompletedToday}
                style={{
                  padding: '10px 16px',
                  borderRadius: '999px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: isCompletedToday ? 'not-allowed' : 'pointer',
                  backgroundColor: isCompletedToday ? '#e5e7eb' : '#4b5563',
                  color: isCompletedToday ? '#9ca3af' : 'white',
                  border: 'none',
                  boxShadow: isCompletedToday ? 'none' : '0 1px 4px rgba(0,0,0,0.15)',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isCompletedToday) {
                    e.currentTarget.style.backgroundColor = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCompletedToday) {
                    e.currentTarget.style.backgroundColor = '#4b5563';
                  }
                }}
              >
                {isCompletedToday ? 'Already completed today' : 'Complete for today'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitDetail;
