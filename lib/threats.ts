export type ThreatSeverity = 'CRITICAL' | 'HIGH' | 'ELEVATED'

export interface ThreatAlert {
  id: string
  txnId: string
  amount: number
  distanceKm: number
  atmTarget: string
  sector: string
  severity: ThreatSeverity
  confidence: number
  timestamp: string
  x: number // map position %, 0-100
  y: number // map position %, 0-100
  latitude: number
longitude: number
atmLatitude: number
atmLongitude: number
}

export const THREAT_ALERTS: ThreatAlert[] = [
  {
    id: '1',
    txnId: 'TXN-9F3A-77C1',
    amount: 248500,
    distanceKm: 412.6,
    atmTarget: 'ATM-DL-0421 · Connaught Place',
    sector: '',
    severity: 'CRITICAL',
    confidence: 97,
  timestamp: '00:00:04',
x: 62,
y: 38,
latitude: 28.6139,
longitude: 77.2090,
atmLatitude: 28.6304,
atmLongitude: 77.2177,
  },
  {
    id: '2',
    txnId: 'TXN-1B8E-42D9',
    amount: 89250,
    distanceKm: 278.1,
    atmTarget: 'ATM-MH-1188 · Bandra West',
    sector: 'MUMBAI',
    severity: 'HIGH',
    confidence: 88,
    timestamp: '00:00:19',
    x: 30,
    y: 64,
    latitude: 19.0760,
longitude: 72.8777,
atmLatitude: 28.6304,
atmLongitude: 77.2177,
  },
  {
    id: '3',
    txnId: 'TXN-4C2D-90AA',
    amount: 415000,
    distanceKm: 631.9,
    atmTarget: 'ATM-KA-0093 · MG Road',
    latitude: 12.9716,
longitude: 77.5946,
    sector: 'BENGALURU',
    severity: 'CRITICAL',
    confidence: 94,
    timestamp: '00:00:33',
    x: 44,
    y: 78,
    atmLatitude: 28.6304,
atmLongitude: 77.2177,
  },
  {
    id: '4',
    txnId: 'TXN-7A5F-11B3',
    amount: 32400,
    latitude: 18.5204,
longitude: 73.8567,
    distanceKm: 121.4,
    atmTarget: 'ATM-WB-0517 · Salt Lake',
    sector: 'KOLKATA',
    severity: 'ELEVATED',
    confidence: 71,
    timestamp: '00:00:51',
    x: 78,
    y: 55,
    atmLatitude: 28.6304,
atmLongitude: 77.2177,
  },
  {
    id: '5',
    txnId: 'TXN-3E9C-66F2',
    amount: 176800,
    latitude: 13.0827,
longitude: 80.2707,
    distanceKm: 389.7,
    atmTarget: 'ATM-TN-0342 · T. Nagar',
    sector: 'CHENNAI',
    severity: 'HIGH',
    confidence: 85,
    timestamp: '00:01:07',
    x: 52,
    y: 88,
    atmLatitude: 28.6304,
atmLongitude: 77.2177,
  },
 
  {
    id: '6',
    txnId: 'TXN-8D1A-05E7',
    amount: 521300,
    distanceKm: 744.2,
    atmTarget: 'ATM-TS-0761 · HITEC City',
    sector: 'HYDERABAD',
    severity: 'CRITICAL',
    confidence: 91,
    timestamp: '00:01:22',
    latitude: 17.3850,
longitude: 78.4867,
    x: 48,
    y: 70,
    atmLatitude: 28.6304,
atmLongitude: 77.2177,
  },
  {
    id: '7',
    txnId: 'TXN-2F6B-38C4',
    amount: 64900,
    distanceKm: 205.8,
    atmTarget: 'ATM-RJ-0284 · C-Scheme',
    sector: 'JAIPUR',
    severity: 'ELEVATED',
    latitude: 23.0225,
longitude: 72.5714,
    confidence: 68,
    timestamp: '00:01:40',
    x: 40,
    y: 44,
    atmLatitude: 28.6304,
atmLongitude: 77.2177,
  },
  {
    id: '8',
    txnId: 'TXN-5A0D-72E1',
    amount: 298700,
    distanceKm: 498.3,
    atmTarget: 'ATM-GJ-0619 · SG Highway',
    sector: 'AHMEDABAD',
    severity: 'HIGH',
    confidence: 83,
    timestamp: '00:01:58',
    x: 26,
    y: 50,
    latitude: 23.0225,
  longitude: 72.5714,
  atmLatitude: 28.6304,
atmLongitude: 77.2177,
  },
]

export const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
