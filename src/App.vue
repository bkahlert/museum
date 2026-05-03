<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import EntranceHall from '@/components/EntranceHall.vue'
import DecadeGallery from '@/components/DecadeGallery.vue'
import DecadeNav from '@/components/DecadeNav.vue'
import ExhibitDetail from '@/components/ExhibitDetail.vue'
import { useExhibits } from '@/composables/useExhibits'
import type { Exhibit } from '@/types'

const { byDecade, loaded, error } = useExhibits()
const selected = ref<Exhibit | null>(null)
const scrollProgress = ref(0)

function open(exhibit: Exhibit) {
  selected.value = exhibit
}
function close() {
  selected.value = null
}

let raf = 0
function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrollProgress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0
    raf = 0
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (raf) cancelAnimationFrame(raf)
})

const totalExhibits = computed(() =>
  byDecade.value.reduce((sum, g) => sum + g.exhibits.length, 0),
)
</script>

<template>
  <div class="museum">
    <EntranceHall />

    <DecadeNav v-if="loaded" :decades="byDecade.map((g) => g.decade)" />

    <main class="galleries">
      <template v-if="loaded">
        <DecadeGallery
          v-for="group in byDecade"
          :key="group.decade.id"
          :decade="group.decade"
          :exhibits="group.exhibits"
          @open="open"
        />
      </template>
      <div v-else-if="error" class="loading error">
        <span>Exhibits unavailable · {{ error }}</span>
      </div>
      <div v-else class="loading">
        <span>Opening the museum…</span>
      </div>
    </main>

    <footer class="exit-hall">
      <div class="exit-plate">
        <div class="eyebrow">End of tour</div>
        <p>
          {{ totalExhibits }} exhibits across {{ byDecade.length }} decades.<br />
          Thank you for visiting.
        </p>
      </div>
    </footer>

    <div
      class="progress"
      aria-hidden="true"
      :style="{ transform: `scaleX(${scrollProgress})` }"
    />

    <Transition name="fade">
      <ExhibitDetail v-if="selected" :exhibit="selected" @close="close" />
    </Transition>
  </div>
</template>

<style>
:root {
  color-scheme: dark;
}

html {
  scrollbar-gutter: stable;
  scroll-snap-type: y proximity;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #050402;
  color: #f5e8d2;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

a {
  color: inherit;
}
</style>

<style scoped>
.museum {
  position: relative;
  min-height: 100vh;
  background: #050402;
}

.galleries {
  position: relative;
}

.loading {
  display: grid;
  place-items: center;
  min-height: 50vh;
  color: rgba(245, 232, 210, 0.4);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.loading.error {
  color: rgba(245, 200, 180, 0.55);
}

.exit-hall {
  background:
    radial-gradient(
      ellipse 60% 50% at 50% 100%,
      rgba(196, 163, 104, 0.1) 0%,
      transparent 70%
    ),
    #050402;
  padding: 8rem 1.5rem 6rem;
  text-align: center;
  color: rgba(245, 232, 210, 0.7);
  font-family: 'Cormorant Garamond', Georgia, serif;
}

.exit-plate {
  max-width: 28rem;
  margin: 0 auto;
}

.exit-plate .eyebrow {
  font-family: system-ui, sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: rgba(196, 163, 104, 0.8);
  margin-bottom: 1.5rem;
}

.exit-plate p {
  font-size: 1.1rem;
  font-style: italic;
  line-height: 1.6;
  margin: 0;
}

.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(196, 163, 104, 0.7), transparent);
  transform-origin: left center;
  transition: transform 0.1s linear;
  z-index: 50;
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
