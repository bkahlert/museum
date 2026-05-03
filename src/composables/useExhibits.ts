import { ref, computed } from 'vue'
import type { Reference, ReferencesFile, Exhibit, Decade } from '@/types'
import { DECADES, decadeFor } from '@/decades'

function parseYear(date: string): number {
  const m = date.match(/^(\d{4})/)
  return m ? Number(m[1]) : 0
}

function compareDateDesc(a: string, b: string): number {
  if (a === b) return 0
  return a > b ? -1 : 1
}

const exhibits = ref<Exhibit[]>([])
const loaded = ref(false)
let loadingPromise: Promise<void> | null = null

export function useExhibits() {
  if (!loadingPromise) {
    loadingPromise = (async () => {
      const res = await fetch(`${import.meta.env.BASE_URL}references.json`, { cache: 'no-cache' })
      const data = (await res.json()) as ReferencesFile
      const base = `${import.meta.env.BASE_URL}references/`
      const filtered: Exhibit[] = data.references
        .filter((r: Reference) => r.show_as_reference)
        .map<Exhibit>((r) => {
          const year = parseYear(r.completion_date)
          return {
            ...r,
            year,
            images: r.photos.map((p) => base + p),
            decade: decadeFor(year),
          }
        })
        .sort((a, b) => compareDateDesc(a.completion_date, b.completion_date))
      exhibits.value = filtered
      loaded.value = true
    })()
  }

  const byDecade = computed<Array<{ decade: Decade; exhibits: Exhibit[] }>>(() => {
    const groups = new Map<string, Exhibit[]>()
    for (const e of exhibits.value) {
      const list = groups.get(e.decade.id) ?? []
      list.push(e)
      groups.set(e.decade.id, list)
    }
    const ordered = [...DECADES].sort((a, b) => b.start - a.start)
    return ordered
      .filter((decade) => groups.has(decade.id))
      .map((decade) => ({ decade, exhibits: groups.get(decade.id)! }))
  })

  return { exhibits, byDecade, loaded, ready: loadingPromise }
}
