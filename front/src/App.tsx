import { LatLngExpression } from 'leaflet'
import MainMap from './MainMap'
import './App.scss'
import { useEffect, useState } from 'react'

export default function App() {
  const [line, setLine] = useState<LatLngExpression[]>()

  useEffect(() => {
    (async () => {
      let response = await fetch("/api/pog")
      if (response.ok) {
        setLine(await response.json())
      }
    })()
  }, [])

  return (
    <div className="app">
      <div>sidebar</div>
      {line && <MainMap polyline={line} />}
    </div>
  )
}
