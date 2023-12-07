import { ref, computed, type ComputedRef, type InjectionKey, watch } from 'vue'
import { reactionFrequencyAnimals } from '@/views/main/reaction-frequency-animals'
import { calculateSoundPressureLevelGain } from '@/views/main/gain-generater'

export type FilerNm = '人間' | '金魚' | 'ブリ' | 'ヤリイカ'

export type AudioManagerType = {
  set audioBuffer(arrayBuffer: ArrayBuffer)
  set filterNm(filterNm: FilerNm)
  get audioContext(): AudioContext
  initNode: () => void
  play: () => void
  pause: () => void
  forward: () => void
  rewind: () => void
  subscription: {
    loading: ComputedRef<boolean>
    loaded: ComputedRef<boolean>
  }
}

export class AudioManager implements AudioManagerType {
  private _audioContext = new (window.AudioContext || window.webkitAudioContext)()
  private _audioBuffer = ref<AudioBuffer | null>(null)
  private _sourceNode: AudioBufferSourceNode | null = null
  private _gainNode: GainNode | null = null
  private _startOffset = 0
  private _startTime = 0
  private _loading = ref(false)
  private _filterNm = ref<FilerNm>('人間')

  constructor() {
    watch(this._filterNm, () => {
      this.changeFilter()
    })
  }

  set audioBuffer(arrayBuffer: ArrayBuffer) {
    this._loading.value = true
    // ファイル選択した音声ファイルをweb audio apiで扱える形式に変換
    this._audioContext.decodeAudioData(
      arrayBuffer as ArrayBuffer,
      (buffer) => {
        // デコードされたオーディオデータを格納する
        this._audioBuffer.value = buffer
        this._loading.value = false
      },
      (error) => {
        console.error('Error decoding audio data', error)
        this._loading.value = false
      }
    )
  }

  set filterNm(filterNm: FilerNm) {
    this._filterNm.value = filterNm
  }
  get audioContext(): AudioContext {
    return this._audioContext
  }

  initNode = () => {
    if (this._sourceNode) {
      // BufferSourceNodeに紐づいているノードを切断
      this._sourceNode.disconnect()
      // リソースの開放
      this._sourceNode = null
    }
    // 初期化
    this._sourceNode = this._audioContext.createBufferSource()
    // 音声データを紐づける
    this._sourceNode.buffer = this._audioBuffer.value
    // Gainノードを紐付ける
    this._gainNode = this._audioContext.createGain()
    this._sourceNode.connect(this._gainNode)
    // スピーカーと紐付ける。
    this._gainNode.connect(this._audioContext.destination)
  }

  play = () => {
    this.initNode()
    this.changeFilter()
    if (!this._audioBuffer || !this._sourceNode || !this._audioBuffer.value) return
    this._startTime = this._audioContext.currentTime
    this._sourceNode.start(0, this._startOffset % this._audioBuffer.value.duration)
  }
  pause = () => {
    if (!this._audioBuffer || !this._sourceNode) return
    this._sourceNode.stop(0)
    this._startOffset += this._audioContext.currentTime - this._startTime
  }
  forward = () => {
    if (!this._audioBuffer || !this._sourceNode) return
    this._startOffset += 5
    this.pause()
    this.play()
  }
  rewind = () => {
    if (!this._audioBuffer || !this._sourceNode) return
    this._startOffset -= 5
    if (this._startOffset < 0) this._startOffset = 0
    this.pause()
    this.play()
  }

  changeFilter = () => {
    if (!this._gainNode) return

    // Gainの下に紐づくNodeを更新する
    this._gainNode.disconnect()

    if (this._filterNm.value !== '人間') {
      const humanReaction = reactionFrequencyAnimals.find((animal) => animal.name === '人間')
      const targetReaction = reactionFrequencyAnimals.find(
        (animal) => animal.name === this._filterNm.value
      )
      if (!humanReaction || !targetReaction) {
        this._gainNode.connect(this._audioContext.destination)
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

      const biquadFilter = this._audioContext.createBiquadFilter()
      biquadFilter.type = 'bandpass'
      // 中心周波数とQ値を計算
      const centerFrequency = Math.sqrt(minFrequency * maxFrequency)
      const QValue = centerFrequency / (maxFrequency - minFrequency)

      // フィルターのパラメータを設定
      biquadFilter.frequency.value = centerFrequency
      biquadFilter.Q.value = QValue
      this._gainNode.connect(biquadFilter)
      // biquadFilter.connect(audioContext.value.destination)

      let lastNode = biquadFilter
      for (const filterConfig of targetReaction.auditoryPressure) {
        const filter = this._audioContext.createBiquadFilter()
        // 人間との差分を計算
        const humanAuditoryPressure = humanReaction.auditoryPressure.find(
          (human) => human.frequency === filterConfig.frequency
        )
        if (!humanAuditoryPressure) {
          biquadFilter.connect(this._audioContext.destination)
          return
        }

        const gain = calculateSoundPressureLevelGain(humanAuditoryPressure.db, filterConfig.db)
        console.log(
          `frequency: ${filterConfig.frequency} db-up: ${
            filterConfig.db - humanAuditoryPressure.db
          }`
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

      lastNode.connect(this._audioContext.destination)
    } else {
      this._gainNode.connect(this._audioContext.destination)
    }
  }
  subscription = {
    loading: computed(() => this._loading.value),
    loaded: computed(() => this._audioBuffer.value !== null)
  }
}

export const audioManagerKey: InjectionKey<AudioManagerType> = Symbol('AudioManagerType')
