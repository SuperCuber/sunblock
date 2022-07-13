import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainMap from "../MainMap";
import { OptimizedRoute, RoutePart, SunPosition } from "../types";

export default function Plan() {
  let [searchParams, _] = useSearchParams()
  let routeId = parseInt(searchParams.get("route") || "")

  const [line, setLine] = useState<RoutePart[]>()
  const [sunPosition, setSunPosition] = useState<SunPosition>()

  useEffect(() => {
    (async () => {
      let response = await fetch(`/api/optimize/${routeId}`)

      if (response.ok) {
        let { altitude, azimuth, parts }: OptimizedRoute = await response.json()
        setLine(parts)
        setSunPosition({ altitude, azimuth })
      }
    })()
  }, [searchParams])

  return (
    <>
      {(routeId !== null && line !== undefined && sunPosition !== undefined)
        && <MainMap polyline={line} sunPosition={sunPosition} currentRoute={routeId} />
        || <div>Loading...</div>
      }
    </>
  )
}
