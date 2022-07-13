import { LatLngLiteral } from "leaflet";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainMap from "../components/MainMap";
import { OptimizedRoute, optimizeRoute } from "../sunCalc";

export default function Plan() {
  let [searchParams, _] = useSearchParams()
  let routeId = parseInt(searchParams.get("route") || "")

  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute>()

  useEffect(() => {
    (async () => {
      let response = await fetch(`/api/optimize/${routeId}`)

      if (response.ok) {
        let shape: LatLngLiteral[] = await response.json()
        let route = optimizeRoute(shape, new Date(), shape[0])
        setOptimizedRoute(route)
      }
    })()
  }, [searchParams])

  return (
    <>
      {(routeId !== null && optimizedRoute !== undefined)
        && <MainMap polyline={optimizedRoute.parts} sunPosition={optimizedRoute.sunPosition} currentRoute={routeId} />
        || <div>Loading...</div>
      }
    </>
  )
}
