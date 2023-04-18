<template>
  <div class="rect-zoom-box"></div>
</template>

<script setup lang="ts">
  import { onMounted, getCurrentInstance } from 'vue'
  function computedZoomBoxStyle(elmentList) {
    console.log(elmentList)
  }
  defineExpose({
    computedZoomBoxStyle,
  })
</script>
