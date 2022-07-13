import './App.scss'
import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <>
      <div className="app-bar">
        Sunblock
      </div>

      <div className="app">
        <Outlet />
      </div>
    </>
  )
}
