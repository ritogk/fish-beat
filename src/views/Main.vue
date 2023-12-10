<script setup lang="ts">
import { provide } from 'vue'
import { AudioManagerState, audioManagerStateKey } from './main/audio-manager-state'
import SongSelector from '@/views/main/SongSelector.vue'
import AnimalSelector from '@/views/main/AnimalSelector.vue'
import Player from '@/views/main/Player.vue'
import Fotter from '@/views/main/Fotter.vue'

const audioManagerState = new AudioManagerState()
provide(audioManagerStateKey, audioManagerState)
</script>

<template>
  <div style="padding-left: 3%; padding-right: 3%; max-width: 1300px">
    <h1 style="text-align: center">魚類のための音楽プレイヤー</h1>
    <SongSelector />
    <hr size="1" color="#d5cecf" />
    <AnimalSelector />
    <hr size="1" color="#d5cecf" />
    <Player />
    <Fotter></Fotter>
  </div>
</template>

<style scoped></style>
./main/audioManagereState
