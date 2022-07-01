import { LatLngLiteral } from "leaflet"

export interface RoutePart {
  p: LatLngLiteral[],
  angle: number,
}

export interface OptimizedRoute {
  altitude: number,
  azimuth: number,
  parts: RoutePart[],
}

export interface SunPosition {
  altitude: number,
  azimuth: number,
}
