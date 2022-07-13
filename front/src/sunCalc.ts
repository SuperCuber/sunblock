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
    // Angle between direction_vec and east
    let direction_theta = Math.acos(
      direction_vec[0]
      / Math.sqrt(direction_vec[0] * direction_vec[0]
        + direction_vec[1] * direction_vec[1]
      )
    )
    if (direction_vec[1] < 0) {
      // In case of south, convert clockwise angle to anticlockwise "big" angle
      direction_theta = 2 * Math.PI - direction_theta
    }

    let angle_with_sun = direction_theta - azimuth
    if (angle_with_sun > 2 * Math.PI) {
      angle_with_sun -= 2 * Math.PI
    }

    parts.push({ p: [a, b], angle: angle_with_sun })
  }

  return {
    sunPosition: { altitude, azimuth },
    parts,
  }
}
