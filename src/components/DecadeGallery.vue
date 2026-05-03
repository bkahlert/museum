<script setup lang="ts">
import type { Exhibit, Decade } from '@/types'
import ExhibitWall from './ExhibitWall.vue'

defineProps<{ decade: Decade; exhibits: Exhibit[] }>()
defineEmits<{ open: [exhibit: Exhibit] }>()

function returnToEntrance() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <section
    class="gallery"
    :id="`decade-${decade.id}`"
    :style="{ '--ambient': decade.ambient, '--accent': decade.accent }"
  >
    <div class="threshold" aria-hidden="true">
      <div class="doorway" />
    </div>

    <header class="room-plaque">
      <div class="eyebrow">Gallery</div>
      <h2>{{ decade.label }}</h2>
    </header>

    <div class="walls">
      <ExhibitWall
        v-for="(ex, i) in exhibits"
        :key="ex.id"
        :exhibit="ex"
        :index="i"
        @open="(e) => $emit('open', e)"
      />
    </div>

    <div class="room-end">
      <button class="back-to-top" type="button" @click="returnToEntrance">
        ↑ Back to entrance
      </button>
    </div>
  </section>
</template>

<style scoped>
.gallery {
  position: relative;
  background: var(--ambient);
  background-image:
    radial-gradient(
      ellipse 80% 60% at 50% 0%,
      color-mix(in oklab, var(--accent) 12%, transparent) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 60% 40% at 50% 100%,
      rgba(0, 0, 0, 0.6) 0%,
      transparent 70%
    );
  padding-bottom: 6rem;
  isolation: isolate;
  scroll-snap-align: start;
}

.threshold {
  position: relative;
  height: 8rem;
  overflow: hidden;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.85) 0%,
    var(--ambient) 100%
  );
}

.doorway {
  position: absolute;
  left: 50%;
  top: -2rem;
  transform: translateX(-50%);
  width: min(60vw, 36rem);
  height: 12rem;
  border-radius: 50% 50% 0 0 / 60% 60% 0 0;
  background: radial-gradient(
    ellipse at center 100%,
    color-mix(in oklab, var(--accent) 25%, transparent) 0%,
    transparent 70%
  );
  filter: blur(4px);
}

.room-plaque {
  text-align: center;
  padding: 4rem 1.5rem 2rem;
  color: rgba(245, 232, 210, 0.85);
}

.room-plaque .eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--accent) 75%, white);
  opacity: 0.7;
  margin-bottom: 0.75rem;
}

.room-plaque h2 {
  font-family: 'Cormorant Garamond', 'Times New Roman', Georgia, serif;
  font-weight: 400;
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin: 0;
  letter-spacing: 0.02em;
  color: #f5e8d2;
}

.walls {
  max-width: 80rem;
  margin: 0 auto;
}

.room-end {
  display: flex;
  justify-content: center;
  padding: 2rem 1.5rem 1rem;
}

.back-to-top {
  appearance: none;
  background: transparent;
  border: 1px solid color-mix(in oklab, var(--accent) 40%, transparent);
  color: rgba(245, 232, 210, 0.75);
  padding: 0.65rem 1.4rem;
  border-radius: 2px;
  font-family: system-ui, sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;
}

.back-to-top:hover {
  background: color-mix(in oklab, var(--accent) 8%, transparent);
  border-color: color-mix(in oklab, var(--accent) 70%, transparent);
  color: #f5e8d2;
}

.back-to-top:focus-visible {
  outline: 1px solid color-mix(in oklab, var(--accent) 75%, white);
  outline-offset: 2px;
}
</style>
