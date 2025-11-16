import { useState } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard.jsx';
import CreateHabit from './pages/CreateHabit.jsx'
import { useRoutes } from 'react-router-dom'

function App() {
    let element = useRoutes([
        {
          path:'/dashboard',
          element: <Dashboard />
        },
        {
            path:'/habits/create',
            element: <CreateHabit/>
          },
          {
            path:'/createtask',
            element: <Dashboard />
          },
      ])
    
      return (
        <div className='app'>
            { element }
        </div>
      )
    }
    
    export default App
