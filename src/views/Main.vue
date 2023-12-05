<script setup lang="ts">
import { ref, onMounted } from 'vue'
import KingyoImage from '@/assets/kingyo.jpg'
import HumanImage from '@/assets/human.jpg'
import BuriImage from '@/assets/buri.jpg'
import YariikaImage from '@/assets/yariika.jpg'

const audioContext = ref<AudioContext | null>(null)
const audioBuffer = ref<AudioBuffer | null>(null)
const state = ref({
  isFilterOn: false,
  sourceNode: null as AudioBufferSourceNode | null
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

    audioContext.value.decodeAudioData(
      arrayBuffer as ArrayBuffer,
      (buffer) => {
        audioBuffer.value = buffer
      },
      (error) => {
        console.error('Error decoding audio data', error)
      }
    )
  }

  reader.readAsArrayBuffer(file)
}

const playAudio = () => {
  if (!audioContext.value || !audioBuffer.value) return

  if (state.value.sourceNode) {
    state.value.sourceNode.disconnect()
    state.value.sourceNode = null
  }

  const source = audioContext.value.createBufferSource()
  source.buffer = audioBuffer.value
  state.value.sourceNode = source

  // バンドパスフィルターを作成
  if (state.value.isFilterOn) {
    const biquadFilter = audioContext.value.createBiquadFilter()
    biquadFilter.type = 'bandpass'
    biquadFilter.frequency.value = 1525 // 中心周波数
    biquadFilter.Q.value = Math.sqrt(3000 / 50) // 品質因子

    // オーディオチェーンにフィルターを挿入
    source.connect(biquadFilter)
    biquadFilter.connect(audioContext.value.destination)
  } else {
    source.connect(audioContext.value.destination)
  }

  source.start(0)
}

const stopAudio = () => {
  // audioContextから音声を停止
  audioContext.value?.suspend()
}

const forwardAudio = () => {
  if (!audioBuffer.value) return
  startOffset += 5
  playAudio()
}

const isKingyo = ref(false)
const clickKingyo = () => {
  state.value.isFilterOn = !state.value.isFilterOn
  playAudio()
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
    <button @click="stopAudio">停止</button>
    <button @click="forwardAudio">5s 進む</button>
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
