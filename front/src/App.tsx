import MainMap from './MainMap'
import './App.scss'
import { useEffect, useState } from 'react'
import SearchRoute from './SearchRoute'
import { OptimizedRoute, RoutePart, SunPosition } from './types'

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<number>()
  const [line, setLine] = useState<RoutePart[]>()
  const [sunPosition, setSunPosition] = useState<SunPosition>()
  const [searching, setSearching] = useState(true)

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

  function setRoute(route: any) {
    setCurrentRoute(route)
    setSearching(false)
  }

  return (
    <div className="app">
      <div className="app-bar">
        Sunblock
      </div>
      {
        searching
          ? <SearchRoute setRoute={setRoute} />
          : <MainMap polyline={line} sunPosition={sunPosition} currentRoute={currentRoute} />
      }
    </div>
  )
}
