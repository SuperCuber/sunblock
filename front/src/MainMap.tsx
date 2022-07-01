import { LatLngLiteral, Map } from 'leaflet'
import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import './MainMap.css'

interface Props {
  polyline?: ({ p: LatLngLiteral[], angle: number })[],
  sunPosition?: { altitude: number, azimuth: number },
  currentRoute?: number,
}

export default function MainMap({ polyline, sunPosition, currentRoute }: Props) {
  if (!polyline || !sunPosition || !currentRoute) {
    return (
      <MapContainer center={[0, 0]} zoom={1} scrollWheelZoom={true} id="map">
        <>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </>
      </MapContainer>
    )
  }

  let center = polyline[Math.floor(polyline.length / 2)].p[0] as LatLngLiteral
  let sunDistance = Math.cos(sunPosition.altitude) / 40
  let sunLocation: LatLngLiteral = {
    lng: center.lng + Math.cos(sunPosition.azimuth) * sunDistance,
    lat: center.lat + Math.sin(sunPosition.azimuth) * sunDistance,
  }

  let map = React.createRef<Map>()
  useEffect(() => {
    map.current?.setView(center, 13)
  }, [polyline])

  return (
    <MapContainer scrollWheelZoom={true} id="map" ref={map}>
      <>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {polyline.map((line, idx) => {
          // Imagine cartesian coordinates, your bus is facing east.
          // Then the color used for the direction of the sun is purple at east and west, red in south (right), blue in north (left).
          // That's achieved with a sine function - the y coordinate.
          const colorDirection = Math.sin(line.angle)
          const colorProgress = (colorDirection + 1) / 2
          const START = 240
          const END = 360
          const hue = START + (END - START) * colorProgress

          const key = `${currentRoute},${idx}`
          return <Polyline key={key} positions={line.p} color={`hsl(${hue}, ${Math.abs(colorDirection) * 100}%, 50%)`} />
        })}

        <Polyline positions={[sunLocation, center]} color="red" />
        {/* <Marker position={sunLocation}> */}
        {/*   <Popup>{(sunPosition.altitude * 180 / Math.PI).toFixed(2)} deg</Popup> */}
        {/* </Marker> */}
      </>
    </MapContainer>
  )
}
