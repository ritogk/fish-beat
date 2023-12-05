<script setup lang="ts">
import KingyoImage from '@/assets/kingyo.jpg'
import HumanImage from '@/assets/human.jpg'
import BuriImage from '@/assets/buri.jpg'
import YariikaImage from '@/assets/yariika.jpg'
</script>

<template>
  <p>音声ファイル選択</p>
  <div>
    <input type="file" />
    <button>サンプル1</button>
    <button>サンプル2</button>
    <button>サンプル3</button>
  </div>
  <p>最適化種別</p>
  <div>
    <button class="image-button" style="width: 25%">
      <img :src="HumanImage" />
    </button>
    <button class="image-button" style="width: 25%">
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
    <button>再生</button>
    <button>停止</button>
    <button>はじめから</button>
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
