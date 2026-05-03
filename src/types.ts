export interface Reference {
  id: string
  title: string
  description: string
  client: string
  notes?: string[]
  url: string
  process_time?: string
  completion_date: string
  show_as_reference: boolean
  active: boolean
  photos: string[]
}

export interface ReferencesFile {
  references: Reference[]
}

export interface Decade {
  id: string
  label: string
  ambient: string
  accent: string
  start: number
  end: number
}

export interface Exhibit extends Reference {
  year: number
  images: string[]
  decade: Decade
}
