<template>
  <div ref="rootEl" class="layer-zoom-box" :class="computedClassName" @mousedown.self.stop="mousedownEvt">
    <span class="line-item top-line" :style="getTopLineStyle"></span>
    <span class="line-item right-line" :style="getRightLineStyle"></span>
    <span class="line-item bottom-line" :style="getBottomLineStyle"></span>
    <span class="line-item left-line" :style="getLeftLineStyle"></span>
    <span @mousedown.stop="rmpMousedownEvt" :style="getRmpHandlerStyle" class="icon-item rmp"></span>
    <span @mousedown.stop="bmpMousedownEvt" :style="getBmpHandlerStyle" class="icon-item bmp"></span>
    <span @mousedown.stop="rbpMousedownEvt" :style="getRbpHandlerStyle" class="icon-item rbp"></span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRaw, reactive, onMounted } from 'vue'
import { getAncestorByClass, getDesignWorkbench } from './utils/index.js'
import { useCanvasStageStore } from './useCanvasStage.js'
const canvasStageStore = useCanvasStageStore()
const { updateLayerPositionById } = canvasStageStore
const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  selectedLayerIds: {
    type: Array,
    default: () => [],
  },
})
const rootEl = ref<HTMLElement | null>(null)
const computedClassName = computed(() => {
  let className = ''
  if (canvasStageStore.selectedLayerIds.length > 1) {
    className += 'multi-layers-selected'
  }
  return className
})
const getTopLineStyle = computed(() => {
  return {
    transform: `scale(1, ${1 / canvasStageStore.scaleRate})`,
  }
})
const getRightLineStyle = computed(() => {
  return {
    transform: `scale(${1 / canvasStageStore.scaleRate}, 1)`,
  }
})
const getBottomLineStyle = computed(() => {
  return {
    transform: `scale(1, ${1 / canvasStageStore.scaleRate})`,
  }
})
const getLeftLineStyle = computed(() => {
  return {
    transform: `scale( ${1 / canvasStageStore.scaleRate}, 1)`,
  }
})
const getRmpHandlerStyle = computed(() => {
  return {
    transform: `translate(50%, -50%) scale( ${1 / canvasStageStore.scaleRate})`,
  }
})
const getBmpHandlerStyle = computed(() => {
  return {
    transform: `translate(-50%, 50%) scale( ${1 / canvasStageStore.scaleRate})`,
  }
})

// 右下手柄
const getRbpHandlerStyle = computed(() => {
  return {
    transform: `translate(50%, 50%) scale( ${1 / canvasStageStore.scaleRate})`,
  }
})
const emits = defineEmits(['updateLayerOption', 'layZoomBoxMouseupEvt', 'rbpResize'])
// 图层选择
const layerItemSelectHandler = (shiftKeyFlag: boolean) => {
  const layerId = props.id
  const rawSelectedLayerIds = toRaw(canvasStageStore.selectedLayerIds)
  if (shiftKeyFlag) {

    if (rawSelectedLayerIds.includes(layerId)) {
      const index = rawSelectedLayerIds.findIndex((id: string) => id === layerId)
      canvasStageStore.selectedLayerIds.splice(index, 1)
    } else {
      canvasStageStore.selectedLayerIds.push(layerId)
    }
  } else {
    if (!rawSelectedLayerIds.includes(layerId)) {
      canvasStageStore.$patch({
        selectedLayerIds: [layerId],
      })
    }

  }
}

// 选择框鼠标按下事件
const mousedownEvt = (e: MouseEvent) => {
  if (e.shiftKey) {
    e.preventDefault()
  }
  layerItemSelectHandler(e.shiftKey)
  document.addEventListener('mousemove', mousemoveEvt, true)
  document.addEventListener('mouseup', mouseupEvt, true)
}
// 选择框鼠标移动事件
const mousemoveEvt = (e: MouseEvent) => {
  e.preventDefault()
  rootEl.value!.style.cursor = 'move'
  const ids = toRaw(canvasStageStore.selectedLayerIds)
  // 支持多图层同时位移
  ids.forEach((id: string) => updateLayerPositionById({ id, x: e.movementX, y: e.movementY }))
}

// 选择框鼠标释放事件
const mouseupEvt = (e: MouseEvent) => {
  rootEl.value!.style.cursor = 'default'
  document.removeEventListener('mousemove', mousemoveEvt, true)
  document.removeEventListener('mouseup', mouseupEvt, true)
  emits('layZoomBoxMouseupEvt', e.target)
}

// 右中点鼠标按下事件
const rmpMousedownEvt = (e) => {
  document.addEventListener('mousemove', rmpMousemoveEvt, true)
  document.addEventListener('mouseup', rmpMouseupEvt, true)
}
// 右中点鼠标移动事件
const rmpMousemoveEvt = (e) => {
  emits('updateLayerOption', { width: e.movementX })
}
// 右中点鼠标释放事件
const rmpMouseupEvt = (e) => {
  document.removeEventListener('mousemove', rmpMousemoveEvt, true)
  document.removeEventListener('mouseup', rmpMouseupEvt, true)
}
// 底中点鼠标按下事件
const bmpMousedownEvt = (e) => {
  document.addEventListener('mousemove', bmpMousemoveEvt, true)
  document.addEventListener('mouseup', bmpMouseupEvt, true)
}
// 底中点鼠标移动事件
const bmpMousemoveEvt = (e) => {
  emits('updateLayerOption', { height: e.movementY })
}
// 底中点鼠标释放事件
const bmpMouseupEvt = (e) => {
  document.removeEventListener('mousemove', bmpMousemoveEvt, true)
  document.removeEventListener('mouseup', bmpMouseupEvt, true)
}
// 右下点鼠标按下事件
const rbpMousedownEvt = (e) => {
  document.addEventListener('mousemove', rbpMousemoveEvt, true)
  document.addEventListener('mouseup', rbpMouseupEvt, true)
}
// 右下点鼠标移动事件
const rbpMousemoveEvt = (e) => {
  window.getSelection()?.empty()
  emits('rbpResize', { x: e.movementX, y: e.movementY })
}
// 右下点鼠标释放事件
const rbpMouseupEvt = (e) => {
  document.removeEventListener('mousemove', rbpMousemoveEvt, true)
  document.removeEventListener('mouseup', rbpMouseupEvt, true)
}
</script>
<style lang="scss" scoped>
$handlerSize1: 20px;
$handlerSize2: 8px;

.layer-zoom-box {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  // outline: 1px solid #2932e1;
  cursor: default;

  .line-item {
    background-color: #2932e1;
    position: absolute;

    &.top-line {
      left: 0;
      top: -1px;
      width: 100%;
      height: 2px;
    }

    &.right-line {
      right: -1px;
      top: 0;
      width: 2px;
      height: 100%;
    }

    &.bottom-line {
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 2px;
    }

    &.left-line {
      left: -1px;
      top: 0;
      width: 2px;
      height: 100%;
    }
  }

  .icon-item {
    display: inline-block;
    border: 2px solid #2932e1;
    border-radius: 8px;
    position: absolute;
    box-sizing: border-box;

    &.rmp {
      height: $handlerSize1;
      width: $handlerSize2;
      right: 0;
      top: 50%;
      cursor: ew-resize;
    }

    &.bmp {
      height: $handlerSize2;
      width: $handlerSize1;
      bottom: 0;
      left: 50%;
      cursor: ns-resize;
    }

    &.rbp {
      height: calc($handlerSize1/2);
      width: calc($handlerSize1/2);
      bottom: 0;
      right: 0;
      cursor: nwse-resize;
    }
  }
}
</style>
