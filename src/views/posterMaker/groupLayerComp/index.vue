<template>
  <div :data-layer-id="layerData.id" :class="getLayerItemClass(layerData)" class="layer-item"
    :style="getLayerStyle(layerData)">
    <layerRenderComp :layer-list="layerData.children" />
    <layerZoomBox :id="layerData.id" />
  </div>
</template>
<script setup lang="ts" name="GroupLayerComp">
import { useCanvasStageStore, minScale, maxScale } from '../useCanvasStage.js'
import layerZoomBox from '../layerZoomBox.vue'
import layerRenderComp from '../layerRenderComp.vue'
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
</script>
<style lang="scss" scoped>
.layer-group {
  pointer-events: initial;

  :deep(.layer-zoom-box) {

    .line-item,
    .icon-item {
      display: none;
    }
  }

  &.is-active {
    :deep(.layer-zoom-box) {

      .line-item,
      .icon-item {
        display: default;
      }
    }
  }
}
</style>
