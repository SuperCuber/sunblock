import { LatLngLiteral } from 'leaflet'
import MainMap from './MainMap'
import './App.scss'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'

interface OptimizedRoute {
  altitude: number,
  azimuth: number,
  parts: { p: LatLngLiteral[], angle: number }[]
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<number>()
  const [line, setLine] = useState<({ p: LatLngLiteral[], angle: number })[]>()
  const [sunPosition, setSunPosition] = useState<{ altitude: number, azimuth: number }>()
  const [routes, setRoutes] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      let response = await fetch("/api/routes")
      if (response.ok) {
        setRoutes(await response.json())
      }
    })()
  }, [])

  useEffect(() => {
    if (currentRoute === undefined) return;
    (async () => {
      let response = await fetch(`/api/optimize/${currentRoute}`)
      if (response.ok) {
        let { altitude, azimuth, parts }: OptimizedRoute = await response.json()
        setLine(parts)
        setSunPosition({ altitude, azimuth })
      }
    })()
  }, [currentRoute])

  return (
    <div className="app">
      <Sidebar routes={routes} setRoute={setCurrentRoute} />
      <MainMap polyline={line} sunPosition={sunPosition} currentRoute={currentRoute} />
    </div>
  )
}
