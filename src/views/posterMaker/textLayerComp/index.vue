<template>
  <div
    :data-layer-id="layerData.id"
    :class="getLayerItemClass(layerData)"
    class="layer-item"
    :style="getLayerStyle(layerData)"
  >
    <div
      class="layer-element"
      v-html="layerData.html"
    ></div>
    <layerZoomBox
      v-if="canvasStageStore.selectedLayerIds.includes(layerData.id)"
      @updateLayerOption="updateLayerOptionHandler"
    />
  </div>
</template>
<script setup lang="ts" name="TextLayerComp">
  import { useCanvasStageStore, minScale, maxScale } from '../useCanvasStage.js'
  import layerZoomBox from '../layerZoomBox.vue'
  const canvasStageStore = useCanvasStageStore()
  const props = defineProps({
    layerData: {
      type: Object,
      default: () => {},
    },
  })

  const updateLayerOptionHandler = ({ x = 0, y = 0, width = 0, height = 0 }) => {
    props.layerData.x += x / canvasStageStore.scaleRate
    props.layerData.y += y / canvasStageStore.scaleRate
    props.layerData.width += width / canvasStageStore.scaleRate
    props.layerData.height += height / canvasStageStore.scaleRate
  }

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
  .layer-text {
    white-space: nowrap;
  }
</style>