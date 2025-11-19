import './App.css'
import Dashboard from './pages/Dashboard.jsx';
import CreateHabit from './pages/CreateHabit.jsx'
import EditHabit from './pages/EditHabit.jsx'
import CreateTask from './pages/CreateTask.jsx'
import EditTask from './pages/EditTask.jsx'
import HabitDetail from './pages/HabitDetail.jsx';
import { useRoutes, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3001/auth/status', {
          credentials: 'include'
        });
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  let element = useRoutes([
    {
      path: '/',
      element: loading ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f9fafb',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '1rem',
          color: '#4b5563',
          zIndex: 9999
        }}>
          Loading...
        </div>
      ) : isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
    },
    {
      path: '/dashboard',
      element: <ProtectedRoute><Dashboard /></ProtectedRoute>
    },
    {
      path: '/habits/create',
      element: <ProtectedRoute><CreateHabit /></ProtectedRoute>
    },
    {
      path: '/habits/edit/:id',
      element: <ProtectedRoute><EditHabit /></ProtectedRoute>
    },
    {
      path: '/tasks/create',
      element: <ProtectedRoute><CreateTask /></ProtectedRoute>
    },
    {
      path: '/habits/detail/:id',
      element: <ProtectedRoute><HabitDetail /></ProtectedRoute>
    },
    {
      path: '/tasks/edit/:id',
      element: <ProtectedRoute><EditTask /></ProtectedRoute>
    },
    {
      path: '/login',
      element: isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
    },
    {
      path: '/signup',
      element: isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />
    }
  ])

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1rem',
        color: '#4b5563',
        zIndex: 9999
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className='app'>
      {element}
    </div>
  )
}

export default App
