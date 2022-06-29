import { LatLngExpression, LatLngLiteral, Map } from 'leaflet'
import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import './MainMap.css'

interface Props {
  polyline?: {sunOnLeft: boolean, p: LatLngExpression[]}[],
  sunPosition?: { altitude: number, azimuth: number },
}

export default function MainMap({ polyline, sunPosition }: Props) {
  if (!polyline || !sunPosition) {
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
        {polyline.map((line, idx) =>
          <Polyline key={idx} positions={line.p} color={line.sunOnLeft ? "blue" : "red"} />
        )}
        <Polyline positions={[sunLocation, center]} color="red" />

        {/* {polyline.slice(1).map((l, idx) => */}
        {/*   <Marker position={l} key={idx}> */}
        {/*   <Popup>{(l as any).sunOnLeft ? "left" : "right" }</Popup> */}
        {/*   </Marker> */}
        {/* )} */}

        {/* <Marker position={sunLocation}> */}
        {/*   <Popup>{(sunPosition.altitude * 180 / Math.PI).toFixed(2)} deg</Popup> */}
        {/* </Marker> */}
      </>
    </MapContainer>
  )
}
