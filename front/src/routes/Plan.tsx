import { LatLngLiteral } from "leaflet";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainMap from "../components/MainMap";
import { optimizeRoute } from "../sunCalc";
import "./Plan.scss"

export default function Plan() {
  let [searchParams, _] = useSearchParams()
  let routeId = parseInt(searchParams.get("route") || "")

  const [shape, setShape] = useState<LatLngLiteral[]>()
  const [hour, setHour] = useState<number>(new Date().getHours())

  useEffect(() => {
    (async () => {
      let response = await fetch(`/api/optimize/${routeId}`)

      if (response.ok) {
        let shape: LatLngLiteral[] = await response.json()
        setShape(shape)
      } else {
        console.error("Received error from server")
      }
    })()
  }, [searchParams])

  let date = new Date()
  date.setHours(hour)
  let optimizedRoute = shape === undefined ? undefined : optimizeRoute(shape, date, shape[0])

  return (
    <div className="plan">
      <div className="plan__map">
        {(routeId !== null && optimizedRoute !== undefined)
          && <MainMap polyline={optimizedRoute.parts} sunPosition={optimizedRoute.sunPosition} routeKey={`${routeId},${date}`} />
          || <div>Loading...</div>
        }
      </div>
      <div className="plan__hour-slider">
        <input
          className="plan__hour-slider__slider" type="range" min="0" max="23"
          value={hour} onInput={e => setHour(parseInt((e.target as HTMLInputElement).value))}
        />
        <div className="plan__hour-slider__ticks">
          {Array(24).fill(0).map(_ => <span className="plan__hour-slider__ticks__tick">|</span>)}
        </div>
      </div>
    </div>
  )
}
