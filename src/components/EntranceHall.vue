<script setup lang="ts">
import { computed } from 'vue'
import { useExhibits } from '@/composables/useExhibits'

const { yearRange, decadeCount } = useExhibits()

const NUMBER_WORDS: Record<number, string> = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
}

const decadesLine = computed(() => {
  const n = decadeCount.value
  if (n === 0) return ''
  const word = NUMBER_WORDS[n] ?? String(n)
  return `${word} ${n === 1 ? 'decade' : 'decades'} of websites, applications, and experiments`
})

const yearsLine = computed(() => {
  const r = yearRange.value
  if (!r) return ''
  return r.min === r.max ? `${r.min}` : `${r.min} — ${r.max}`
})
</script>

<template>
  <header class="hall">
    <div class="title-plate">
      <div class="eyebrow">A retrospective</div>
      <h1>Werkschau</h1>
      <p v-if="decadesLine && yearsLine" class="subtitle">
        {{ decadesLine }}<br />
        by Björn Kahlert · {{ yearsLine }}
      </p>
    </div>
  </header>
</template>

<style scoped>
.hall {
  position: relative;
  background:
    radial-gradient(
      ellipse 60% 50% at 50% 0%,
      rgba(196, 163, 104, 0.1) 0%,
      transparent 70%
    ),
    #050402;
  padding: 8rem 1.5rem 6rem;
  text-align: center;
  color: rgba(245, 232, 210, 0.85);
  font-family: 'Cormorant Garamond', Georgia, serif;
}

.title-plate {
  max-width: 32rem;
  margin: 0 auto;
}

.eyebrow {
  font-family: system-ui, sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: rgba(196, 163, 104, 0.8);
  margin-bottom: 1.5rem;
}

.title-plate h1 {
  margin: 0 0 1rem;
  font-family: 'Cormorant Garamond', 'Times New Roman', Georgia, serif;
  font-weight: 300;
  font-size: clamp(2rem, 5vw, 3.25rem);
  letter-spacing: 0.01em;
  line-height: 1.1;
  color: #f5e8d2;
}

.subtitle {
  margin: 0;
  font-style: italic;
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(245, 232, 210, 0.65);
}
</style>
