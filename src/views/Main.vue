<script setup lang="ts">
import { provide } from 'vue'
import { AudioManager, audioManagerKey } from './main/audio-manager'
import SongSelector from '@/views/main/SongSelector.vue'
import AnimalSelector from '@/views/main/AnimalSelector.vue'
import Player from '@/views/main/Player.vue'

const audioManger = new AudioManager()
provide(audioManagerKey, audioManger)
</script>

<template>
  <div style="padding-left: 3%; padding-right: 3%; max-width: 1300px">
    <h1 style="text-align: center">魚類に最適化した音楽プレイヤー</h1>
    <SongSelector />
    <hr size="1" color="#d5cecf" />
    <AnimalSelector />
    <hr size="1" color="#d5cecf" />
    <Player />
  </div>
</template>

<style scoped></style>
