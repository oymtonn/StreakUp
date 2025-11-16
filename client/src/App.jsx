import { useState } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard.jsx';
import CreateHabit from './pages/CreateHabit.jsx'
import EditHabit from './pages/EditHabit.jsx'
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
            path:'/habits/edit/:id',
            element: <EditHabit/>
          },
      ])
    
      return (
        <div className='app'>
            { element }
        </div>
      )
    }
    
    export default App
