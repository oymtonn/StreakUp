import './App.css'
import Dashboard from './pages/Dashboard.jsx';
import { useRoutes } from 'react-router-dom'

function App() {
  let element = useRoutes([
    {
      path: '/dashboard',
      element: <Dashboard />
    },
    {
      path: '/createhabit',
      element: <Dashboard />
    },
    {
      path: '/createtask',
      element: <Dashboard />
    },
  ])

  return (
    <div className='app'>
      {element}
    </div>
  )
}

export default App
