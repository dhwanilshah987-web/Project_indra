"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"

interface MapboxMapProps {
  latitude?: number
  longitude?: number
  atmLatitude?: number
  atmLongitude?: number
  transactionId?: string
  severity?: string
}

export function MapboxMap({
  latitude = 18.5204,
  longitude = 73.8567,
  atmLatitude = 28.6304,
  atmLongitude = 77.2177,
  transactionId = "TXN-9F3A-77C1",
  severity = "CRITICAL",
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    if (!token) {
      console.error("Mapbox token is missing")
      return
    }

    mapboxgl.accessToken = token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [longitude, latitude],
      zoom: 10,
      pitch: 45,
      bearing: -15,
      antialias: true,
    })

    map.current.addControl(
      new mapboxgl.NavigationControl(),
      "top-right"
    )

    map.current.on("load", () => {
      if (!map.current) return

     // Pulsing threat marker
const threatMarker = document.createElement("div")
threatMarker.className = "threat-pulse-marker"

new mapboxgl.Marker({
  element: threatMarker,
})
  .setLngLat([longitude, latitude])
 
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<strong>TRANSACTION ORIGIN</strong><br/>${transactionId}`
          )
        )
        .addTo(map.current)

      // Predicted ATM marker
      new mapboxgl.Marker({
        color: "#ff1744",
      })
        .setLngLat([atmLongitude, atmLatitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<strong>PREDICTED ATM TARGET</strong><br/>${transactionId}`
          )
        )
        .addTo(map.current)

      // Draw glowing curved geo-velocity arc
const start: [number, number] = [longitude, latitude]
const end: [number, number] = [atmLongitude, atmLatitude]

const arcCoordinates: [number, number][] = []

const steps = 60

for (let i = 0; i <= steps; i++) {
  const t = i / steps

  const lng = start[0] + (end[0] - start[0]) * t
  const lat = start[1] + (end[1] - start[1]) * t

  const curve = Math.sin(Math.PI * t) * 3

  arcCoordinates.push([
    lng,
    lat + curve,
  ])
}

map.current.addSource("interception-route", {
  type: "geojson",
  data: {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: arcCoordinates,
    },
    properties: {},
  },
})

map.current.addLayer({
  id: "interception-route-glow",
  type: "line",
  source: "interception-route",
  paint: {
    "line-color": "#ff1744",
    "line-width": 8,
    "line-opacity": 0.18,
    "line-blur": 6,
  },
})

map.current.addLayer({
  id: "interception-route-line",
  type: "line",
  source: "interception-route",
  paint: {
    "line-color": "#ff1744",
    "line-width": 3,
    "line-dasharray": [2, 2],
    "line-opacity": 1,
  },
})

      // Fit both locations on screen
      const bounds = new mapboxgl.LngLatBounds()

      bounds.extend([longitude, latitude])
      bounds.extend([atmLongitude, atmLatitude])

      map.current.fitBounds(bounds, {
        padding: 100,
        duration: 1200,
      })
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [
    latitude,
    longitude,
    atmLatitude,
    atmLongitude,
    transactionId,
  ])
useEffect(() => {
  if (!map.current) return
  if (severity !== "CRITICAL") return
  if (latitude === undefined || longitude === undefined) return

  map.current.flyTo({
    center: [longitude, latitude],
    zoom: 6,
    duration: 1800,
    essential: true,
  })
}, [latitude, longitude, severity])
  return (
    <div
      ref={mapContainer}
      className="absolute inset-0 w-full h-full"
    />
  )
}