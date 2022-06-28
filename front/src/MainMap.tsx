import { LatLngExpression } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import './MainMap.css'

interface Props {
  polyline: LatLngExpression[],
}

export default function MainMap({ polyline }: Props) {
  return (
    <MapContainer center={[31.8, 35.25]} zoom={13} scrollWheelZoom={true} id="map">
      <>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={polyline} />
        {polyline.slice(1).map((l, idx) =>
          <Marker position={l} key={idx}>
            <Popup>{l.direction}</Popup>
          </Marker>
        )}
      </>
    </MapContainer>
  )
}
