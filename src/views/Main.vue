<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import KingyoImage from '@/assets/kingyo.jpg'
import HumanImage from '@/assets/human.jpg'
import BuriImage from '@/assets/buri.jpg'
import YariikaImage from '@/assets/yariika.jpg'

const audioContext = ref<AudioContext | null>(null)
const audioBuffer = ref<AudioBuffer | null>(null)
const state = reactive({
  isFilterOn: false,
  sourceNode: null as AudioBufferSourceNode | null,
  biquadFilter: null as BiquadFilterNode | null,
  gainNode: null as GainNode | null
})

onMounted(() => {
  audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
})

const handleFileChange = (event: Event) => {
  const fileInput = event.target as HTMLInputElement
  if (!fileInput.files?.length) return

  const file = fileInput.files[0]
  const reader = new FileReader()

  reader.onload = (e: ProgressEvent<FileReader>) => {
    const arrayBuffer = e.target?.result
    if (!arrayBuffer || !audioContext.value) return

    // ここで選択したファイルをwebauidoapi形式に変換している
    audioContext.value.decodeAudioData(
      arrayBuffer as ArrayBuffer,
      (buffer) => {
        // デコードされたオーディオデータを格納する
        audioBuffer.value = buffer
      },
      (error) => {
        console.error('Error decoding audio data', error)
      }
    )
  }

  reader.readAsArrayBuffer(file)
}

const createFilter = () => {
  const biquadFilter = audioContext.value!.createBiquadFilter()
  biquadFilter.type = 'bandpass'
  biquadFilter.frequency.value = 1525
  biquadFilter.Q.value = Math.sqrt(3000 / 50)
  return biquadFilter
}

const playAudio = () => {
  if (!audioContext.value || !audioBuffer.value) return

  if (state.sourceNode) {
    state.sourceNode.disconnect()
    state.sourceNode = null
  }

  state.sourceNode = audioContext.value.createBufferSource()
  state.sourceNode.buffer = audioBuffer.value

  state.gainNode = audioContext.value.createGain()
  state.biquadFilter = createFilter()

  state.sourceNode.connect(state.gainNode)
  updateFilter()

  state.gainNode.connect(audioContext.value.destination)
  state.sourceNode.start(0)
}

const updateFilter = () => {
  if (!state.biquadFilter || !state.gainNode) return

  state.gainNode.disconnect()
  if (state.isFilterOn) {
    state.gainNode.connect(state.biquadFilter)
    state.biquadFilter.connect(audioContext.value!.destination)
  } else {
    state.gainNode.connect(audioContext.value!.destination)
  }
}

const clickKingyo = () => {
  state.isFilterOn = !state.isFilterOn
  updateFilter()
}
</script>

<template>
  <p>音声ファイル選択</p>
  <div>
    <input type="file" @change="handleFileChange" accept="audio/*" />
    <button>サンプル1</button>
    <button>サンプル2</button>
    <button>サンプル3</button>
  </div>
  <p>最適化種別</p>
  <div>
    <button class="image-button" style="width: 25%">
      <img :src="HumanImage" />
    </button>
    <button class="image-button" style="width: 25%" @click="clickKingyo">
      <img :src="KingyoImage" />
    </button>
    <button class="image-button" style="width: 25%">
      <img :src="BuriImage" />
    </button>
    <button class="image-button" style="width: 25%">
      <img :src="YariikaImage" />
    </button>
  </div>
  <p>プレイヤー</p>
  <div>
    <button @click="playAudio">再生</button>
  </div>
</template>

<style scoped>
.image-button {
  /* ボタンのスタイル設定 */
  display: inline-flex; /* フレックスボックスを使用 */
  align-items: center; /* 画像とテキストを中央揃え */
  justify-content: center; /* 中央揃え */
  padding: 10px; /* パディング */
  border: 1px solid #ddd; /* 境界線 */
  background-color: #f0f0f0; /* 背景色 */
  cursor: pointer; /* ポインター形式のカーソル */
}

.image-button img {
  max-width: 100%; /* ボタンの幅に合わせて最大100% */
  max-height: 100%; /* ボタンの高さに合わせて最大100% */
  height: auto; /* 高さを自動調整 */
}
</style>
