<script setup lang="ts">
import { computed } from 'vue'
import type { Exhibit } from '@/types'

const props = defineProps<{ exhibit: Exhibit; index: number }>()
const emit = defineEmits<{ open: [exhibit: Exhibit] }>()

const primaryImage = computed(() => props.exhibit.images[0])
const offset = computed(() => (props.index % 2 === 0 ? 'left' : 'right'))
const yearLabel = computed(() => (props.exhibit.year > 0 ? String(props.exhibit.year) : '—'))
const clientLine = computed(() => props.exhibit.client.split('\n')[0] ?? '')

function open() {
  emit('open', props.exhibit)
}
</script>

<template>
  <article
    class="wall"
    :class="`align-${offset}`"
    :style="{ '--accent': exhibit.decade.accent }"
  >
    <div class="frame" @click="open">
      <div class="canvas">
        <picture v-if="primaryImage">
          <source
            :srcset="primaryImage.replace(/\.(png|jpe?g)$/i, '.webp')"
            type="image/webp"
          />
          <img :src="primaryImage" :alt="exhibit.title" loading="lazy" decoding="async" />
        </picture>
        <div v-else class="empty">no image preserved</div>
        <div class="vignette" />
      </div>
    </div>
    <button type="button" class="plaque" :aria-label="`Open ${exhibit.title}`" @click="open">
      <span class="plaque-inner">
        <span class="title">{{ exhibit.title }}</span>
        <span class="desc">{{ exhibit.description }}</span>
        <span class="meta">
          <span class="year">{{ yearLabel }}</span>
          <span v-if="clientLine" class="dot" aria-hidden="true">·</span>
          <span v-if="clientLine" class="client">{{ clientLine }}</span>
        </span>
      </span>
    </button>
  </article>
</template>

<style scoped>
.wall {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto auto;
  gap: 1.25rem;
  padding: 6rem 1.5rem;
  scroll-margin-top: 4rem;
}

@media (max-width: 899px) {
  /* Frame is dark-on-dark and visually disappears against the gallery
     background — align the plaque to the photo's optical edges (inside
     the 1rem frame padding) rather than the frame's structural edges. */
  .plaque {
    justify-self: center;
    width: calc(100% - 2rem);
  }
}

@media (min-width: 900px) {
  .wall {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    grid-template-rows: 1fr;
    gap: 3rem;
    padding: 8rem 4rem;
    align-items: center;
  }
  .wall.align-right .frame {
    order: 2;
  }
  .wall.align-right .plaque {
    order: 1;
    justify-self: end;
  }
}

.frame {
  position: relative;
  padding: 1rem;
  border-radius: 4px;
  background: linear-gradient(145deg, #2a2118 0%, #18120c 50%, #0d0905 100%);
  box-shadow:
    0 1px 0 rgba(255, 220, 170, 0.06) inset,
    0 30px 60px -20px rgba(0, 0, 0, 0.85),
    0 60px 120px -40px rgba(0, 0, 0, 0.7);
  transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
  cursor: pointer;
}

.frame:hover,
.wall:has(.plaque:hover) .frame,
.wall:has(.plaque:focus-visible) .frame {
  transform: translateY(-4px);
}

.canvas {
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  background: #050402;
  aspect-ratio: 4 / 3;
  box-shadow:
    inset 0 3px 8px rgba(0, 0, 0, 0.65),
    inset 0 -1px 2px rgba(0, 0, 0, 0.5),
    inset 0 0 0 1px rgba(0, 0, 0, 0.7);
}

.canvas img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  filter: saturate(0.85) brightness(0.92);
  transition: filter 0.5s ease;
}

.frame:hover .canvas img,
.wall:has(.plaque:hover) .canvas img {
  filter: saturate(1) brightness(1);
}

.empty {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: rgba(220, 200, 170, 0.4);
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(0, 0, 0, 0.45) 100%
  );
  pointer-events: none;
}

.plaque {
  --plaque-bg: linear-gradient(160deg, #c4a368 0%, #8a6f3d 50%, #5d4621 100%);
  position: relative;
  appearance: none;
  border: none;
  text-align: left;
  padding: 1.25rem 1.5rem;
  max-width: 26rem;
  background: var(--plaque-bg);
  border-radius: 2px;
  box-shadow:
    0 1px 0 rgba(255, 235, 195, 0.4) inset,
    0 -1px 0 rgba(0, 0, 0, 0.4) inset,
    0 8px 24px -8px rgba(0, 0, 0, 0.6);
  color: #1a1208;
  font-family: 'Times New Roman', 'Cormorant Garamond', Georgia, serif;
  cursor: pointer;
}

.plaque:focus-visible {
  outline: 1px solid color-mix(in oklab, var(--accent) 75%, white);
  outline-offset: 4px;
}

.plaque::before,
.plaque::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #f0d896, #6b4f1f 70%, #2a1a0a);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
}
.plaque::before {
  top: 6px;
  left: 6px;
}
.plaque::after {
  bottom: 6px;
  right: 6px;
}

.plaque-inner {
  display: block;
}

.plaque .title {
  display: block;
  margin: 0 0 0.35rem;
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #1a1208;
}

.plaque .desc {
  display: block;
  margin: 0 0 0.6rem;
  font-style: italic;
  font-size: 0.92rem;
  line-height: 1.4;
  color: #2a1d0d;
}

.plaque .meta {
  display: flex;
  gap: 0.4rem;
  align-items: baseline;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #3a2a14;
}

.plaque .year {
  font-weight: 700;
}

.plaque .dot {
  opacity: 0.6;
}
</style>
