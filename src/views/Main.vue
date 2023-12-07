<script setup lang="ts">
import { ref, reactive } from 'vue'
import KingyoImage from '@/assets/kingyo.jpg'
import HumanImage from '@/assets/human.jpg'
import BuriImage from '@/assets/buri.jpg'
import YariikaImage from '@/assets/yariika.jpg'

import { reactionFrequencyAnimals } from './main/reaction-frequency-animals'
import { calculateSoundPressureLevelGain } from './main/gain-generater'

const selectAnimal = ref('人間')

// web audio apiの中心的な存在。AudioContextから様々な値を生成する
const audioContext = ref<AudioContext>(new (window.AudioContext || window.webkitAudioContext)())

// 音の生データ
const audioBuffer = ref<AudioBuffer | null>(null)
const state = reactive({
  isFilterOn: false,
  // 音声ファイルの再生状態を管理する
  sourceNode: null as AudioBufferSourceNode | null,
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
  if (!state.gainNode) return

  // Gainの下に紐づくNodeを更新する
  state.gainNode.disconnect()

  if (selectAnimal.value !== '人間') {
    // 選択している動物を取得
    // 人間の場合は加工せずに出力
    // それ以外の場合はフィルターをかける

    const humanReaction = reactionFrequencyAnimals.find((animal) => animal.name === '人間')
    const targetReaction = reactionFrequencyAnimals.find(
      (animal) => animal.name === selectAnimal.value
    )
    if (!humanReaction || !targetReaction) {
      state.gainNode.connect(audioContext.value.destination)
      return
    }

    // targetReaction.auditoryPressureのfrequencyの最小値を取得する
    const minFrequency = targetReaction.auditoryPressure.reduce((prev, current) =>
      prev.frequency < current.frequency ? prev : current
    ).frequency
    const maxFrequency = targetReaction.auditoryPressure.reduce((prev, current) =>
      prev.frequency > current.frequency ? prev : current
    ).frequency

    // console.log(minFrequency)
    // console.log(maxFrequency)

    const biquadFilter = audioContext.value.createBiquadFilter()
    biquadFilter.type = 'bandpass'
    // 中心周波数とQ値を計算
    const centerFrequency = Math.sqrt(minFrequency * maxFrequency)
    const QValue = centerFrequency / (maxFrequency - minFrequency)

    // フィルターのパラメータを設定
    biquadFilter.frequency.value = centerFrequency
    biquadFilter.Q.value = QValue
    state.gainNode.connect(biquadFilter)
    // biquadFilter.connect(audioContext.value.destination)

    let lastNode = biquadFilter
    for (const filterConfig of targetReaction.auditoryPressure) {
      const filter = audioContext.value.createBiquadFilter()
      // 人間との差分を計算
      const humanAuditoryPressure = humanReaction.auditoryPressure.find(
        (human) => human.frequency === filterConfig.frequency
      )
      if (!humanAuditoryPressure) {
        biquadFilter.connect(audioContext.value.destination)
        return
      }

      const gain = calculateSoundPressureLevelGain(humanAuditoryPressure.db, filterConfig.db)
      console.log(
        `frequency: ${filterConfig.frequency} db-up: ${filterConfig.db - humanAuditoryPressure.db}`
      )
      // 調整したgain
      const adjustedGain = gain / 15
      filter.type = 'peaking'
      filter.frequency.value = filterConfig.frequency
      // filter.gain.value = (filterConfig.db - humanAuditoryPressure.db) / 10
      filter.gain.value = adjustedGain < 8 ? adjustedGain : 8
      lastNode.connect(filter)
      lastNode = filter
    }

    lastNode.connect(audioContext.value.destination)
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

const clickHuman = () => {
  selectAnimal.value = '人間'
  updateNode()
}

const clickKingyo = () => {
  selectAnimal.value = '金魚'
  updateNode()
}

const clickBuri = () => {
  selectAnimal.value = 'ブリ'
  updateNode()
}

const clickYariika = () => {
  selectAnimal.value = 'ヤリイカ'
  updateNode()
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
    <button class="image-button" style="width: 25%" @click="clickHuman">
      <img :src="HumanImage" />
      <span>人間</span>
    </button>
    <button class="image-button" style="width: 25%" @click="clickKingyo">
      <img :src="KingyoImage" />
      <span>金魚</span>
    </button>
    <button class="image-button" style="width: 25%" @click="clickBuri">
      <img :src="BuriImage" />
      <span>ブリ</span>
    </button>
    <button class="image-button" style="width: 25%" @click="clickYariika">
      <img :src="YariikaImage" />
      <span>ヤリイカ</span>
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
  display: inline;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f0f0f0;
  cursor: pointer;
}

.image-button img {
  max-width: 100%;
  max-height: 100%;
  height: auto;
}
</style>
