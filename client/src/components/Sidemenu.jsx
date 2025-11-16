import { useState } from 'react';
import logo from '../assets/logo.png'
import settings from '../assets/setting.png'
import dashboard from '../assets/dashboard.png'
import habit from '../assets/sync.png'
import task from '../assets/clipboard.png'

const Sidemenu = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: dashboard },
        { id: 'habits', label: 'Habits', icon: habit },
        { id: 'tasks', label: 'Tasks', icon: task },
        { id: 'settings', label: 'Settings', icon: settings },
    ];

    return (
        <div
            style={{
                width: '250px',
                backgroundColor: '#ffffff',
                height: '100vh',
                borderRight: '1px solid #e5e7eb',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                left: 0,
                top: 0,
            }}
        >
            <div style={{ marginBottom: '40px' }}>
                <img src={logo} alt="Logo" style={{ width: '120px', height: 'auto' }} />
            </div>



            <nav style={{ flex: 1 }}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            marginBottom: '8px',
                            backgroundColor: activeTab === item.id ? '#f3f4f6' : 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '0.95rem',
                            color: activeTab === item.id ? '#1f2937' : '#6b7280',
                            fontWeight: activeTab === item.id ? '600' : '400',
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== item.id) {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== item.id) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        <img src={item.icon} alt="icon" style={{ width: '30px', height: 'auto' }} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div
                style={{
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    marginTop: 'auto',
                    marginBottom: '12px'
                }}
            >
                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
                    <strong>User</strong>
                </p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '4px 0 0 0' }}>
                    user@example.com
                </p>
            </div>
        </div>
    );
};

export default Sidemenu;
