import { LatLngExpression } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import './MainMap.css'

interface Props {
  polyline: LatLngExpression[],
}

export default function MainMap({ polyline }: Props) {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} id="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Polyline positions={polyline} />
    </MapContainer>
  )
}
