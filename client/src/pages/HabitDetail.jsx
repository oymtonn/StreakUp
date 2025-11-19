import SideMenu from '../components/Sidemenu.jsx';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const HabitDetail = () => {
  const { id } = useParams();
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
      <div
        style={{
          minHeight: '100vh',
          minWidth: '100vw',
          display: 'flex',
          backgroundColor: '#f1f5f9',
          color: '#0f172a',
        }}
      >
        <SideMenu />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                height: '36px',
                width: '36px',
                borderRadius: '50%',
                border: '3px solid rgba(148,163,184,0.3)',
                borderTopColor: '#0ea5e9',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px',
              }}
            ></div>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Loading habit...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '90vh',
        minWidth: '80vw',
        marginLeft: '180px',
        display: 'flex',
        backgroundColor: '#f1f5f9',
        color: '#0f172a'
      }}
    >
      <SideMenu />

      <main style={{ flex: 1, padding: '32px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Header */}
          <div
            style={{
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#94a3b8',
                  marginBottom: '6px',
                }}
              >
                Habit Detail
              </p>
              <h1 style={{ fontSize: '32px', fontWeight: '600' }}>
                {habit.title}
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {habit.tag && (
                <span
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                  }}
                >
                  #{habit.tag}
                </span>
              )}
              {habit.priority && (
                <span
                  style={{
                    backgroundColor: '#e0f2fe',
                    border: '1px solid #7dd3fc',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    color: '#0369a1',
                  }}
                >
                  Priority: {habit.priority}
                </span>
              )}
            </div>
          </div>

          {/* Main layout: card + summary */}
          <div
            style={{
              display: 'grid',
              gap: '28px',
              gridTemplateColumns: '2fr 1fr',
            }}
          >
            {/* Main Card */}
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.85)',
                borderRadius: '18px',
                padding: '24px 28px',
                border: '1px solid rgba(148,163,184,0.25)',
                boxShadow: '0 18px 45px rgba(15,23,42,0.06)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>
                Habit ID #{habit.id}
              </p>

              <p
                style={{
                  fontSize: '14px',
                  color: '#475569',
                  marginBottom: '24px',
                }}
              >
                Stay consistent with this habit to keep your streak alive.
              </p>

              {/* Streak */}
              <div
                style={{
                  display: 'flex',
                  gap: '18px',
                  marginBottom: '22px',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    background:
                      'linear-gradient(to bottom right, #f0f9ff, white, #ecfdf5)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #bae6fd',
                  }}
                >
                  <p
                    style={{
                      fontSize: '11px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#0284c7',
                      marginBottom: '8px',
                    }}
                  >
                    Current Streak
                  </p>

                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span
                      style={{
                        fontSize: '44px',
                        fontWeight: '600',
                        color: '#0f172a',
                      }}
                    >
                      {habit.streak || 0}
                    </span>
                    <span style={{ marginLeft: '6px', color: '#475569' }}>
                      {habit.streak === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                </div>

                {/* Last Completed */}
                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #cbd5e1',
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
                    Last Completed
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: '500' }}>
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

              {/* Button */}
              <button
                onClick={handleStreak}
                disabled={isCompletedToday}
                style={{
                  padding: '12px 18px',
                  borderRadius: '12px',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: isCompletedToday ? 'not-allowed' : 'pointer',
                  backgroundColor: isCompletedToday ? '#e2e8f0' : '#0ea5e9',
                  color: isCompletedToday ? '#94a3b8' : 'white',
                  border: 'none',
                  transition: '0.2s',
                }}
              >
                {isCompletedToday ? 'Already completed today' : 'Complete for today'}
              </button>
            </div>

            {/* Right panel */}
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.85)',
                borderRadius: '18px',
                padding: '22px',
                border: '1px solid rgba(148,163,184,0.25)',
                boxShadow: '0 14px 38px rgba(15,23,42,0.04)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px' }}>
                Habit Overview
              </h3>

              <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.8' }}>
                <p><strong>Title:</strong> {habit.title}</p>
                <p><strong>Tag:</strong> {habit.tag || 'None'}</p>
                <p><strong>Priority:</strong> {habit.priority}</p>
                <p><strong>Streak:</strong> {habit.streak || 0} days</p>
                <p>
                  <strong>Last Completed:</strong>{' '}
                  {formatDisplayDate(habit.last_completed_date)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HabitDetail;
