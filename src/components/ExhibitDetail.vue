<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import type { Exhibit } from '@/types'

const props = defineProps<{ exhibit: Exhibit }>()
const emit = defineEmits<{ close: [] }>()

const activeImage = ref(0)

watch(
  () => props.exhibit.id,
  () => {
    activeImage.value = 0
  },
)

const clientLines = computed(() =>
  props.exhibit.client.split('\n').map((l) => l.trim()).filter(Boolean),
)

const yearLabel = computed(() =>
  props.exhibit.year > 0 ? String(props.exhibit.year) : props.exhibit.completion_date,
)

const linkHref = computed(() => {
  if (!props.exhibit.url) return ''
  return /^https?:/i.test(props.exhibit.url) ? props.exhibit.url : `https://${props.exhibit.url}`
})

const linkLabel = computed(() => props.exhibit.url.replace(/^https?:\/\//i, ''))

const hasMultiple = computed(() => props.exhibit.images.length > 1)

function next() {
  if (props.exhibit.images.length === 0) return
  activeImage.value = (activeImage.value + 1) % props.exhibit.images.length
}
function prev() {
  if (props.exhibit.images.length === 0) return
  activeImage.value =
    (activeImage.value - 1 + props.exhibit.images.length) % props.exhibit.images.length
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}

let wheelLock = 0
function onWheel(e: WheelEvent) {
  if (!hasMultiple.value) return
  e.preventDefault()
  const now = Date.now()
  if (now - wheelLock < 220) return
  wheelLock = now
  if (e.deltaY > 0 || e.deltaX > 0) next()
  else if (e.deltaY < 0 || e.deltaX < 0) prev()
}

function onImageClick() {
  if (!hasMultiple.value) return
  next()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <div
    class="overlay"
    role="dialog"
    aria-modal="true"
    :aria-label="exhibit.title"
    :style="{ '--accent': exhibit.decade.accent }"
    @click.self="emit('close')"
  >
    <button class="close" type="button" aria-label="Close exhibit" @click="emit('close')">
      <span aria-hidden="true">×</span>
    </button>

    <div class="content">
      <div class="image-stack">
        <div
          class="primary"
          :class="{ cyclable: hasMultiple }"
          :key="exhibit.images[activeImage] ?? 'empty'"
          @click="onImageClick"
          @wheel="onWheel"
        >
          <img
            v-if="exhibit.images[activeImage]"
            :src="exhibit.images[activeImage]"
            :alt="exhibit.title"
            decoding="async"
            draggable="false"
          />
          <div v-else class="empty">no image preserved</div>
          <div v-if="hasMultiple" class="counter" aria-hidden="true">
            {{ activeImage + 1 }} / {{ exhibit.images.length }}
          </div>
        </div>
        <div v-if="hasMultiple" class="thumbs">
          <button
            v-for="(img, i) in exhibit.images"
            :key="img"
            type="button"
            class="thumb"
            :class="{ active: i === activeImage }"
            :aria-label="`View image ${i + 1}`"
            @click.stop="activeImage = i"
          >
            <img :src="img" :alt="''" loading="lazy" decoding="async" />
          </button>
        </div>
      </div>

      <aside class="text">
        <div class="era-tag">{{ exhibit.decade.label }} · {{ yearLabel }}</div>
        <h2>{{ exhibit.title }}</h2>
        <p class="desc">{{ exhibit.description }}</p>

        <dl class="meta">
          <dt>Client</dt>
          <dd>
            <span v-for="(line, i) in clientLines" :key="i">
              {{ line }}<br v-if="i < clientLines.length - 1" />
            </span>
          </dd>

          <template v-if="exhibit.location">
            <dt>Location</dt>
            <dd>{{ exhibit.location }}</dd>
          </template>

          <dt>Completed</dt>
          <dd>{{ exhibit.completion_date }}</dd>

          <template v-if="exhibit.process_time">
            <dt>Time invested</dt>
            <dd>{{ exhibit.process_time.replace(/:00:00$/, ' h') }}</dd>
          </template>
        </dl>

        <div v-if="exhibit.notes && exhibit.notes.length" class="notes">
          <h3>Notes</h3>
          <ul>
            <li v-for="line in exhibit.notes" :key="line">{{ line }}</li>
          </ul>
        </div>

        <div v-if="exhibit.active && linkHref" class="link-area">
          <a
            class="visit"
            :href="linkHref"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Visit</span>
            <span class="addr">{{ linkLabel }}</span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background:
    radial-gradient(
      ellipse at 50% 0%,
      color-mix(in oklab, var(--accent) 18%, transparent) 0%,
      transparent 60%
    ),
    rgba(8, 6, 4, 0.94);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 2rem;
  overflow-y: auto;
  animation: fade-in 0.35s ease both;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.close {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: 1px solid rgba(245, 232, 210, 0.25);
  background: rgba(20, 14, 8, 0.6);
  color: rgba(245, 232, 210, 0.9);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.close:hover {
  transform: scale(1.05);
  background: rgba(40, 28, 16, 0.85);
}

.content {
  width: min(72rem, 100%);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
  animation: slide-up 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

@media (min-width: 980px) {
  .content {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 3.5rem;
    align-items: start;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.image-stack {
  display: grid;
  gap: 0.75rem;
}

.primary {
  position: relative;
  background: linear-gradient(145deg, #1d1610 0%, #0c0805 100%);
  padding: 0.75rem;
  border-radius: 4px;
  box-shadow:
    0 0 0 1px rgba(255, 220, 170, 0.05) inset,
    0 40px 80px -30px rgba(0, 0, 0, 0.85);
  animation: fade-in 0.4s ease both;
  user-select: none;
}

.primary.cyclable {
  cursor: pointer;
}

.primary img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  background: #050402;
  border-radius: 2px;
  pointer-events: none;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.6),
    0 14px 32px -14px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(0, 0, 0, 0.6);
}

.primary .empty {
  display: grid;
  place-items: center;
  aspect-ratio: 4 / 3;
  color: rgba(220, 200, 170, 0.4);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.counter {
  position: absolute;
  bottom: 1.25rem;
  right: 1.25rem;
  padding: 0.25rem 0.6rem;
  background: rgba(8, 6, 4, 0.75);
  border: 1px solid rgba(245, 232, 210, 0.12);
  border-radius: 2px;
  font-family: 'Courier New', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: rgba(245, 232, 210, 0.7);
  pointer-events: none;
}

.thumbs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.thumb {
  width: 4.5rem;
  height: 3.25rem;
  padding: 0;
  border: 1px solid rgba(245, 232, 210, 0.12);
  background: #0c0805;
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.55;
  transition:
    opacity 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.thumb:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

.thumb.active {
  opacity: 1;
  border-color: color-mix(in oklab, var(--accent) 70%, white);
}

.text {
  color: rgba(245, 232, 210, 0.92);
  font-family: 'Cormorant Garamond', Georgia, serif;
}

.era-tag {
  font-family: 'Cormorant Garamond', 'Times New Roman', Georgia, serif;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  color: color-mix(in oklab, var(--accent) 70%, white);
  opacity: 0.85;
  margin-bottom: 0.75rem;
}

.text h2 {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  margin: 0 0 0.5rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.text .desc {
  font-style: italic;
  margin: 0 0 1.5rem;
  font-size: 1.1rem;
  color: rgba(245, 232, 210, 0.75);
}

.meta {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.4rem 1.25rem;
  margin: 0 0 1.5rem;
  font-family: system-ui, sans-serif;
  font-size: 0.85rem;
}

.meta dt {
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(245, 232, 210, 0.45);
  font-size: 0.7rem;
  align-self: center;
}

.meta dd {
  margin: 0;
  color: rgba(245, 232, 210, 0.85);
  line-height: 1.4;
}

.notes {
  border-top: 1px solid rgba(245, 232, 210, 0.1);
  padding-top: 1.25rem;
  margin-bottom: 1.75rem;
  font-family: system-ui, sans-serif;
  font-size: 0.9rem;
}

.notes h3 {
  margin: 0 0 0.6rem;
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(245, 232, 210, 0.5);
  font-weight: 500;
}

.notes ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.notes li {
  position: relative;
  padding-left: 1rem;
  margin-bottom: 0.4rem;
  color: rgba(245, 232, 210, 0.78);
  line-height: 1.55;
}

.notes li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: color-mix(in oklab, var(--accent) 70%, white);
}

.link-area {
  margin-top: 1rem;
}

.visit {
  display: inline-flex;
  align-items: baseline;
  gap: 0.6rem;
  padding: 0.7rem 1.1rem;
  border-radius: 2px;
  background: linear-gradient(160deg, #c4a368 0%, #8a6f3d 70%, #5d4621 100%);
  color: #1a1208;
  font-family: system-ui, sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow:
    0 1px 0 rgba(255, 235, 195, 0.4) inset,
    0 -1px 0 rgba(0, 0, 0, 0.4) inset,
    0 6px 18px -6px rgba(0, 0, 0, 0.6);
  transition: transform 0.2s ease;
}

.visit:hover {
  transform: translateY(-1px);
}

.visit .addr {
  font-family: 'Courier New', monospace;
  text-transform: lowercase;
  letter-spacing: 0;
  color: #2a1d0d;
}

.visit .arrow {
  margin-left: 0.25rem;
  color: #2a1d0d;
}
</style>
