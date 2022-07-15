import { Map } from 'leaflet'
import { useEffect, createRef } from 'react'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import { RoutePart } from '../types'
import './MainMap.scss'

interface Props {
  polyline: RoutePart[],
  sunPosition: { altitude: number, azimuth: number },
  routeKey: string,
}

function angleColor(angle: number): string {
  // Imagine cartesian coordinates, your bus is facing east.
  // Then the color used for the direction of the sun is purple at east and west, red in south (right), blue in north (left).
  // That's achieved with a sine function - the y coordinate.
  const colorDirection = Math.sin(angle)
  const colorProgress = (colorDirection + 1) / 2
  const START = 240
  const END = 360
  const hue = START + (END - START) * colorProgress

  return `hsl(${hue}, ${Math.abs(colorDirection) * 100}%, 50%)`
}

export default function MainMap({ polyline, sunPosition, routeKey }: Props) {
  let center = polyline[Math.floor(polyline.length / 2)].p[0]

  let sunDistance = Math.cos(sunPosition.altitude) * 95
  let sunHeight = Math.sin(sunPosition.altitude) * 30
  // y is negated because svg y axis points down
  let sunOffset = [Math.cos(sunPosition.azimuth) * sunDistance, -Math.sin(sunPosition.azimuth) * sunDistance]

  let map = createRef<Map>()
  useEffect(() => {
    map.current?.setView(center, 13)
  }, [polyline])

  return (
    <div className="main-map">
      <MapContainer scrollWheelZoom={true} className="main-map__map" ref={map} center={center} zoom={13}>
        <>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {polyline.map((line, idx) =>
            <Polyline key={`${routeKey},${idx}`} positions={line.p} color={angleColor(line.angle)} />
          )}
        </>
      </MapContainer>
      <svg className="main-map__overlay" viewBox='-100 -100 200 200'>
        <line className="main-map__overlay__sun-line-shadow" x1="0" y1="0" x2={sunOffset[0]} y2={sunOffset[1] + sunHeight} filter="url(#blur-shadow)" />
        <circle className="main-map__overlay__sun-shadow" cx={sunOffset[0]} cy={sunOffset[1] + sunHeight} r="10" filter="url(#blur-shadow)" />

        <circle className="main-map__overlay__sun" cx={sunOffset[0]} cy={sunOffset[1]} r="10" />
        <line className="main-map__overlay__sun-line" x1="0" y1="0" x2={sunOffset[0]} y2={sunOffset[1]} />

        <defs>
          <filter id="blur-shadow" x="0" y="0">
            <feGaussianBlur in="SourceGraphic" stdDeviation={3} />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
