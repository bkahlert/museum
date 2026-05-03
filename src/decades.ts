import type { Decade } from './types'

export const DECADES: Decade[] = [
  {
    id: '2000s',
    label: '2000s',
    ambient: '#1a1410',
    accent: '#c9a567',
    start: 2000,
    end: 2009,
  },
  {
    id: '2010s',
    label: '2010s',
    ambient: '#15131e',
    accent: '#b89bd9',
    start: 2010,
    end: 2019,
  },
  {
    id: '2020s',
    label: '2020s',
    ambient: '#0f1816',
    accent: '#9bd9b8',
    start: 2020,
    end: 2029,
  },
]

export function decadeFor(year: number): Decade {
  return DECADES.find((d) => year >= d.start && year <= d.end) ?? DECADES[DECADES.length - 1]!
}
