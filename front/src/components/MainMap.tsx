import { LatLngLiteral, Map } from 'leaflet'
import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import { RoutePart } from '../types'
import './MainMap.css'

interface Props {
  polyline: RoutePart[],
  sunPosition: { altitude: number, azimuth: number },
  currentRoute: number,
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

export default function MainMap({ polyline, sunPosition, currentRoute }: Props) {
  let center = polyline[Math.floor(polyline.length / 2)].p[0]
  let sunDistance = Math.cos(sunPosition.altitude) / 40
  let sunLocation: LatLngLiteral = {
    lng: center.lng + Math.cos(sunPosition.azimuth) * sunDistance,
    lat: center.lat + Math.sin(sunPosition.azimuth) * sunDistance,
  }

  let map = React.createRef<Map>()
  useEffect(() => {
    map.current?.setView(center, 13)
  }, [polyline])

  return (<MapContainer scrollWheelZoom={true} id="map" ref={map} center={center} zoom={13}>
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {polyline.map((line, idx) =>
        <Polyline key={`${currentRoute},${idx}`} positions={line.p} color={angleColor(line.angle)} />
      )}

      <Polyline positions={[sunLocation, center]} color="red" />
      {/* <Marker position={sunLocation}> */}
      {/*   <Popup>{(sunPosition.altitude * 180 / Math.PI).toFixed(2)} deg</Popup> */}
      {/* </Marker> */}
    </>
  </MapContainer>
  )
}
