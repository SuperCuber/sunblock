import { LatLngExpression, LatLngLiteral } from 'leaflet'
import MainMap from './MainMap'
import './App.scss'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'

interface OptimizedRoute {
  altitude: number,
  azimuth: number,
  parts: {
    left: LatLngLiteral[][],
    right: LatLngLiteral[][],
  }
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<number>()
  const [line, setLine] = useState<{ sunOnLeft: boolean, p: LatLngExpression[] }[]>()
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
        setLine(parts.left.map(p => ({ sunOnLeft: true, p }))
          .concat(parts.right.map(p => ({ sunOnLeft: false, p }))))
        setSunPosition({ altitude, azimuth })
      }
    })()
  }, [currentRoute])

  return (
    <div className="app">
      <Sidebar routes={routes} setRoute={setCurrentRoute} />
      <MainMap polyline={line} sunPosition={sunPosition} />
    </div>
  )
}
