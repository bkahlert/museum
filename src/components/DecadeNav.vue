<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import type { Decade } from '@/types'

const props = defineProps<{ decades: Decade[] }>()

const activeId = ref<string | null>(null)
const visible = ref(false)

let observer: IntersectionObserver | null = null

function jumpTo(id: string) {
  document.getElementById(`decade-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onScroll() {
  visible.value = window.scrollY > window.innerHeight * 0.4
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const inView = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (inView) {
        const id = inView.target.id.replace(/^decade-/, '')
        activeId.value = id
      }
    },
    { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
  )
  for (const d of props.decades) {
    const el = document.getElementById(`decade-${d.id}`)
    if (el) observer.observe(el)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <nav
    class="decade-nav"
    :class="{ visible }"
    role="navigation"
    aria-label="Jump to decade"
  >
    <ul>
      <li v-for="d in decades" :key="d.id">
        <button
          type="button"
          :class="{ active: activeId === d.id }"
          @click="jumpTo(d.id)"
        >
          {{ d.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.decade-nav {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%) translateY(-1rem);
  z-index: 40;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.decade-nav.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0.4rem 0.5rem;
  display: flex;
  gap: 0.25rem;
  background: rgba(8, 6, 4, 0.7);
  border: 1px solid rgba(196, 163, 104, 0.18);
  border-radius: 999px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 6px 18px -8px rgba(0, 0, 0, 0.7);
}

button {
  appearance: none;
  background: transparent;
  border: none;
  color: rgba(245, 232, 210, 0.55);
  font-family: system-ui, sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

button:hover {
  color: rgba(245, 232, 210, 0.95);
}

button.active {
  color: #1a1208;
  background: linear-gradient(160deg, #c4a368 0%, #8a6f3d 100%);
  box-shadow:
    0 1px 0 rgba(255, 235, 195, 0.4) inset,
    0 -1px 0 rgba(0, 0, 0, 0.4) inset;
}

button:focus-visible {
  outline: 1px solid rgba(196, 163, 104, 0.7);
  outline-offset: 2px;
}
</style>
