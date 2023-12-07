<script setup lang="ts">
import { inject } from 'vue'
import { type AudioManagerType, audioManagerKey } from './audio-manager'

const audioManager = inject(audioManagerKey) as AudioManagerType

const playAudio = () => {
  audioManager.play()
}

const pauseAudio = () => {
  audioManager.pause()
}

// 5s進める
const forwardAudio = () => {
  audioManager.forward()
}

// 5s戻す
const backAudio = () => {
  audioManager.rewind()
}
</script>

<template>
  <div style="padding-left: 5%; padding-right: 5%">
    <div class="video-controls">
      <button class="control-button" @click="playAudio">▶再生</button>
      <button class="control-button" @click="pauseAudio">■停止</button>
      <button class="control-button" @click="forwardAudio" id="forward">>>5秒</button>
      <button class="control-button" @click="backAudio" id="rewind">&lt;&lt;5秒</button>
    </div>
    <div style="color: red">※端末の音量を15倍にして再生してください。</div>
  </div>
</template>

<style scoped>
.video-controls {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px;
}

.control-button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #e1e6e7;
  border: 1px solid #37494c;
  font-size: 16px;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 25%;
}

.control-button:hover {
  filter: brightness(0.9);
}

.control-button:disabled {
  filter: brightness(0.7);
  cursor: default;
}
</style>
