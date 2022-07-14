import { LatLngLiteral } from "leaflet"
import SunCalc from "suncalc"
import { RoutePart } from "./types"

export interface OptimizedRoute {
  sunPosition: {
    altitude: number,
    azimuth: number,
  }
  parts: RoutePart[],
}

export function optimizeRoute(shape: LatLngLiteral[], date: Date, position: LatLngLiteral): OptimizedRoute {
  // azimuth is from south clockwise:
  // azimuth=0 means south, azimuth=PI/2 means west
  let { altitude, azimuth } = SunCalc.getPosition(date, position.lat, position.lng)
  // Translate to regular theta (from east anti clockwise)
  azimuth = -Math.PI / 2 - azimuth

  let parts = []
  for (var i = 1; i < shape.length; i++) {
    let a = shape[i - 1]
    let b = shape[i]
    let direction_vec = [b.lng - a.lng, b.lat - a.lat]
    let direction_theta = Math.atan2(direction_vec[1], direction_vec[0])
    let angle_with_sun = direction_theta - azimuth

    parts.push({ p: [a, b], angle: angle_with_sun })
  }

  return {
    sunPosition: { altitude, azimuth },
    parts,
  }
}
