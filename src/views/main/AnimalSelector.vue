<script setup lang="ts">
import { ref, inject } from 'vue'
import KingyoImage from '@/assets/kingyo.jpg'
import HumanImage from '@/assets/human.jpg'
import BuriImage from '@/assets/buri.jpg'
import YariikaImage from '@/assets/yariika.jpg'
import {
  type AudioManagerStateType,
  audioManagerStateKey,
  type FilerNm
} from './audio-manager-state'

const audioManager = inject(audioManagerStateKey) as AudioManagerStateType

const selectedAnimal = ref<FilerNm>('人間')
const clickHuman = () => {
  selectedAnimal.value = '人間'
  audioManager.filterNm = selectedAnimal.value
}

const clickKingyo = () => {
  selectedAnimal.value = '金魚'
  audioManager.filterNm = selectedAnimal.value
}

const clickBuri = () => {
  selectedAnimal.value = 'ブリ'
  audioManager.filterNm = selectedAnimal.value
}

const clickYariika = () => {
  selectedAnimal.value = 'ヤリイカ'
  audioManager.filterNm = selectedAnimal.value
}
</script>

<template>
  <h3>最適化する動物</h3>
  <div class="animal-area">
    <button
      class="image-button"
      style="width: 25%"
      @click="clickHuman"
      :class="selectedAnimal === '人間' ? 'selected-button' : ''"
    >
      <img :src="HumanImage" />
      <span>人間</span>
    </button>
    <button
      class="image-button"
      style="width: 25%"
      @click="clickKingyo"
      :class="selectedAnimal === '金魚' ? 'selected-button' : ''"
    >
      <img :src="KingyoImage" />
      <span>金魚</span>
    </button>
    <button
      class="image-button"
      style="width: 25%"
      @click="clickBuri"
      :class="selectedAnimal === 'ブリ' ? 'selected-button' : ''"
    >
      <img :src="BuriImage" />
      <span>ブリ</span>
    </button>
    <button
      class="image-button"
      style="width: 25%"
      @click="clickYariika"
      :class="selectedAnimal === 'ヤリイカ' ? 'selected-button' : ''"
    >
      <img :src="YariikaImage" />
      <span>ヤリイカ</span>
    </button>
  </div>
</template>
<style scoped>
.animal-area {
  margin-bottom: 25px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
}
.image-button {
  display: inline;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  border: 1px solid #37494c;
  background-color: #e1e6e7;
  cursor: pointer;
  border-radius: 15px;
}

.image-button:hover {
  filter: brightness(0.9);
}

.image-button:disabled {
  filter: brightness(0.7);
  cursor: default;
}

.image-button img {
  width: 100%;
  height: auto;
}

.selected-button {
  filter: brightness(0.85);
}
</style>
./audioManagereState
