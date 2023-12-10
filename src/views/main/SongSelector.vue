<script setup lang="ts">
import { ref, inject } from 'vue'
import { audioManagerStateKey, type AudioManagerStateType } from './audio-manager-state'
const audioManagerState = inject(audioManagerStateKey) as AudioManagerStateType

const selectedSong = ref<'kimigayo' | 'other'>('kimigayo')
const elements = {
  file: ref<HTMLInputElement | null>(null)
}
const clickFile = () => {
  elements.file.value?.click()
}

const hundleFileChange = async (event: Event) => {
  selectedSong.value = 'other'
  const fileInput = event.target as HTMLInputElement
  if (!fileInput.files?.length) return

  const file = fileInput.files[0]
  // メモリに格納しているblobにアクセスするためのオブジェクト
  const reader = new FileReader()

  // メモリから音声ファイルを取得
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const arrayBuffer = e.target?.result
    if (!(arrayBuffer instanceof ArrayBuffer)) return
    audioManagerState.changeAudio(arrayBuffer)
  }
  reader.readAsArrayBuffer(file)
}

const clickSample = async () => {
  selectedSong.value = 'kimigayo'
  const sampleFilePath = './kimigayo.mp3' // サンプルファイルのパス
  const response = await fetch(sampleFilePath)
  const file = await response.blob()

  // メモリに格納しているblobにアクセスするためのオブジェクト
  const reader = new FileReader()

  // メモリから音声ファイルを取得
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const arrayBuffer = e.target?.result
    if (!(arrayBuffer instanceof ArrayBuffer)) return
    audioManagerState.changeAudio(arrayBuffer)
  }
  reader.readAsArrayBuffer(file)
}
clickSample()
</script>

<template>
  <h3>楽曲</h3>
  <div class="area">
    <button
      class="button"
      @click="clickSample"
      :class="selectedSong === 'kimigayo' ? 'selected-button' : ''"
    >
      君が代
    </button>
    <button
      class="button"
      @click="clickFile"
      :class="selectedSong === 'other' ? 'selected-button' : ''"
    >
      + 端末選択
    </button>
    <input type="file" :ref="elements.file" @change="hundleFileChange" accept="audio/*" hidden />
  </div>
</template>

<style scoped>
.area {
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px;
}

.button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #e1e6e7;
  border: 1px solid #37494c;
  font-size: 16px;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 35%;
}

.button:hover {
  filter: brightness(0.9);
}

.button:disabled {
  filter: brightness(0.7);
  cursor: default;
}

.selected-button {
  filter: brightness(0.85);
}
</style>
./audioManagereState
