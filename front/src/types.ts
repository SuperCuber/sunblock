import { LatLngLiteral } from "leaflet"

export interface OptimizedRoute {
  altitude: number,
  azimuth: number,
  parts: RoutePart[],
}

export interface RoutePart {
  p: LatLngLiteral[],
  angle: number,
}

export interface SunPosition {
  altitude: number,
  azimuth: number,
}

export interface Route {
  route_id: number,
  agency: string,
  route_short_name: string,
  route_long_name: {
    from: string,
    to: string,
  },
}