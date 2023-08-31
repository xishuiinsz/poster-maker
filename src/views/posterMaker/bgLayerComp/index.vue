<template>
  <div @mousedown="mousedownEvt" :class="getLayerItemClass(layerData)" :style="getLayerStyle(layerData)"
    v-html="layerData.html"></div>
</template>
<script setup lang="ts" name="BgLayerComp">
import { useCanvasStageStore, minScale, maxScale } from '../useCanvasStage.js'
const canvasStageStore = useCanvasStageStore()
const props = defineProps({
  layerData: {
    type: Object,
    default: () => { },
  },
})

function getLayerItemClass(layer) {
  let className = `layer-${layer.type}`
  if (canvasStageStore.selectedLayerIds.includes(layer.id)) {
    className += ' is-active'
  }
  return className
}

function getLayerStyle(item) {
  const { width, height, x, y, rotate } = item
  return {
    width: width > 0 ? `${width}px` : width === '100%' ? '100%' : 'fit-content',
    height: height > 0 ? `${height}px` : height === '100%' ? '100%' : 'fit-content',
    transform: rotate ? `rotate(${rotate}deg)` : `rotate(0deg)`,
    left: `${x}px`,
    top: `${y}px`,
  }
}

function mousedownEvt(e) {
  canvasStageStore.$patch({
    selectedLayerIds: [],
  })
}
</script>
