<script setup lang="ts">
import { ref, reactive } from 'vue'
import KingyoImage from '@/assets/kingyo.jpg'
import HumanImage from '@/assets/human.jpg'
import BuriImage from '@/assets/buri.jpg'
import YariikaImage from '@/assets/yariika.jpg'

const createFilter = () => {
  const biquadFilter = audioContext.value.createBiquadFilter()
  biquadFilter.type = 'bandpass'
  biquadFilter.frequency.value = 1525
  biquadFilter.Q.value = Math.sqrt(3000 / 50)
  return biquadFilter
}

// web audio apiの中心的な存在。AudioContextから様々な値を生成する
const audioContext = ref<AudioContext>(new (window.AudioContext || window.webkitAudioContext)())
// 音の生データ
const audioBuffer = ref<AudioBuffer | null>(null)
const state = reactive({
  isFilterOn: false,
  // 音声ファイルの再生状態を管理する
  sourceNode: null as AudioBufferSourceNode | null,
  // フィルターをかけるためのノード
  biquadFilter: createFilter(),
  // 音量を調整するためのノード
  gainNode: null as GainNode | null,
  startTime: 0,
  startOffset: 0
})

// ノードの初期化
const initNode = () => {
  if (state.sourceNode) {
    // BufferSourceNodeに紐づいているノードを切断
    state.sourceNode.disconnect()
    // リソースの開放
    state.sourceNode = null
  }
  // 初期化
  state.sourceNode = audioContext.value.createBufferSource()
  // 音声データを紐づける
  state.sourceNode.buffer = audioBuffer.value
  // Gainノードを紐付ける
  state.gainNode = audioContext.value.createGain()
  state.sourceNode.connect(state.gainNode)
  // スピーカーと紐付ける。
  state.gainNode.connect(audioContext.value.destination)
}

const updateNode = () => {
  if (!state.biquadFilter || !state.gainNode) return

  // Gainの下に紐づくNodeを更新する
  state.gainNode.disconnect()

  if (state.isFilterOn) {
    state.gainNode.connect(state.biquadFilter)
    state.biquadFilter.connect(audioContext.value.destination)
  } else {
    state.gainNode.connect(audioContext.value.destination)
  }
}

const handleFileChange = (event: Event) => {
  const fileInput = event.target as HTMLInputElement
  if (!fileInput.files?.length) return

  const file = fileInput.files[0]
  // メモリに格納しているblobにアクセスするためのオブジェクト
  const reader = new FileReader()

  // メモリから音声ファイルを取得
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const arrayBuffer = e.target?.result
    if (!arrayBuffer) return

    // ファイル選択した音声ファイルをweb audio apiで扱える形式に変換
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

const playAudio = () => {
  initNode()
  if (!audioBuffer.value || !state.sourceNode) return
  state.startTime = audioContext.value.currentTime
  state.sourceNode.start(0, state.startOffset % audioBuffer.value.duration)
}

const pauseAudio = () => {
  if (!audioBuffer.value || !state.sourceNode) return
  state.sourceNode.stop(0)
  state.startOffset += audioContext.value.currentTime - state.startTime
}

// 5s進める
const forwardAudio = () => {
  if (!audioBuffer.value || !state.sourceNode) return
  state.startOffset += 5
  pauseAudio()
  playAudio()
}

// 5s戻す
const backAudio = () => {
  if (!audioBuffer.value || !state.sourceNode) return
  state.startOffset -= 5
  if (state.startOffset < 0) state.startOffset = 0
  pauseAudio()
  playAudio()
}

const clickKingyo = () => {
  state.isFilterOn = !state.isFilterOn
  updateNode()
}

const clickTest = () => {
  state.biquadFilter?.disconnect()
  state.gainNode?.connect(audioContext.value.destination)
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
    <button class="image-button" style="width: 25%" @click="clickTest">
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
    <button @click="pauseAudio">停止</button>
    <button @click="forwardAudio">5秒進む</button>
    <button @click="backAudio">5秒戻る</button>
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
