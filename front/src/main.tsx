import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import App from './App'
import './index.css'

// Leaflet
import "leaflet/dist/leaflet.css"
import "leaflet/dist/leaflet.js"
import Search from './routes/Search'
import Plan from './routes/Plan'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="" element={<Search />} />
        <Route path="plan" element={<Plan />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>404</p>
            </main>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>
)
