import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import settings from '../assets/setting.png';
import dashboard from '../assets/dashboard.png';
import habit from '../assets/sync.png';
import task from '../assets/clipboard.png';

const Sidemenu = () => {
  const location = useLocation();
  const activeTab = location.pathname;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3001/auth/status', {
          credentials: 'include'
        });
        const data = await response.json();
        console.log('User data:', data);
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, []);

  const menuItems = [
    { id: '/dashboard', label: 'Dashboard', icon: dashboard },
    { id: '/habits/create', label: 'Create Habit', icon: habit },
    { id: '/tasks/create', label: 'Create Task', icon: task }
  ];

  return (
    <div
      style={{
        width: '250px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 18px',
        boxSizing: 'border-box',
        background:
          'linear-gradient(180deg, #ffffff 0%, #f3f4f6 40%, #e5e7eb 100%)',
        borderRight: '1px solid rgba(148,163,184,0.35)',
        boxShadow: '0 18px 45px rgba(15,23,42,0.12)',
        fontFamily: 'Poppins, system-ui, sans-serif',
      }}
    >
      {/* Logo / app header */}
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 4px 4px 2px',
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ width: '38px', height: '38px', borderRadius: '12px' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#111827',
              letterSpacing: '0.03em',
            }}
          >
            StreakUp
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              color: '#9ca3af',
            }}
          >
            Habits · Tasks
          </span>
        </div>
      </div>

      {/* Section label */}
      <div
        style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: '#9ca3af',
          marginBottom: '10px',
          paddingLeft: '4px',
        }}
      >
        Overview
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              to={item.id}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px 9px 10px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  backgroundColor: isActive
                    ? 'rgba(15,23,42,0.04)'
                    : 'transparent',
                  color: isActive ? '#0f172a' : '#6b7280',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(249,250,251,1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {/* Left accent bar */}
                <div
                  style={{
                    width: '4px',
                    height: '22px',
                    borderRadius: '999px',
                    background: isActive
                      ? 'linear-gradient(180deg,#4f46e5,#22c55e)'
                      : 'transparent',
                    marginRight: '4px',
                    transition: 'background 0.18s ease',
                  }}
                />

                <img
                  src={item.icon}
                  alt={`${item.label} icon`}
                  style={{
                    width: '22px',
                    height: '22px',
                    flexShrink: 0,
                    opacity: isActive ? 1 : 0.75,
                    transition: 'opacity 0.18s ease, transform 0.18s ease',
                  }}
                />

                <span
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px 14px',
          borderRadius: '14px',
          background:
            'linear-gradient(135deg, rgba(15,23,42,0.02), rgba(209,213,219,0.4))',
          border: '1px solid rgba(209,213,219,0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt="User avatar"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '2px solid #e5e7eb',
            }}
          />
        ) : (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#4b5563',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.9rem',
            }}
          >
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div
            style={{
              fontSize: '0.8rem',
              color: '#4b5563',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.username || 'User'}
          </div>
          {user?.email && (
            <p
              style={{
                fontSize: '0.74rem',
                color: '#9ca3af',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidemenu;
