<template>
  <div :data-layer-id="layerData.id" :class="getLayerItemClass(layerData)" class="layer-item"
    :style="getLayerStyle(layerData)">
    <div class="layer-element" :class="layerElementClassName" v-html="layerData.html" @blur.capture="layerElementBlurEvt"
      @mousedown.stop @mousemove.stop @mouseup.stop="layerElementMouseupEvt"></div>
    <layerZoomBox v-bind="propsToLayZoomBox" @layZoomBoxMouseupEvt="layZoomBoxMouseupHandler" />
  </div>
</template>
<script setup lang="ts" name="TextLayerComp">
import { ref } from 'vue'
import { useCanvasStageStore, minScale, maxScale } from '../useCanvasStage.js'
import { getAncestorByClass } from '../utils/index.js'
import layerZoomBox from '../layerZoomBox.vue'
import { saveSelectionRange } from '../utils/textLayer.js'
const canvasStageStore = useCanvasStageStore()
const props = defineProps({
  layerData: {
    type: Object,
    default: () => { },
  },
})
const layerElementClassName = ref<string>('')
const propsToLayZoomBox = {
  id: props.layerData.id,
  type: props.layerData.type,
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
// 鼠标释放事件
function layerElementMouseupEvt(e: MouseEvent) {
  saveSelectionRange()
}
function layerElementBlurEvt(e: FocusEvent) {
  const textElement = e.target as HTMLElement
  const textLayerItemEle = getAncestorByClass(textElement, 'layer-text') as HTMLElement
  if (textLayerItemEle) {
    textLayerItemEle.classList.remove('content-editable')
  }
  textElement!.removeAttribute('contenteditable')
}
function layZoomBoxMouseupHandler(target: HTMLElement) {
  const textLayerItemEle = getAncestorByClass(target, 'layer-text') as HTMLElement
  if (textLayerItemEle) {
    const textElement = textLayerItemEle.querySelector('.layer-element')
    if (textElement) {
      textElement.setAttribute('contenteditable', 'true')
    }
    textLayerItemEle.classList.add('content-editable')
  }
}
</script>
<style lang="scss" scoped>
.layer-text {
  white-space: nowrap;

  &.is-active {
    .layer-element {
      outline: none;
    }

    &.content-editable {
      :deep(.layer-zoom-box) {
        pointer-events: none;

        .icon-item {
          pointer-events: initial;
        }
      }
    }
  }

  .layer-element {
    user-select: none;
    cursor: default;
  }
}
</style>
