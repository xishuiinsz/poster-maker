<template>
  <div
    :style="computedStyleData"
    class="drag-selection-box"
  ></div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, toRaw } from 'vue'
  import { getAncestorByClass, getDesignWorkbench, getAllLayerItems } from './utils'
  import { useCanvasStageStore } from './useCanvasStage.js'
  const canvasStageStore = useCanvasStageStore()
  defineOptions({
    name: 'DragSelectionBox',
  })
  // 缓存鼠标坐标
  const cacheData = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    leftCanvas: 0,
    topCanvas: 0,
    designWorkbench: null,
  }
  const styleDefault = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  }
  const styleData = reactive({ ...styleDefault })
  const computedStyleData = computed(() => {
    const { width, height, left, top } = styleData
    return {
      width: `${width}px`,
      height: `${height}px`,
      left: `${left}px`,
      top: `${top}px`,
    }
  })
  // 鼠标移动事件
  const mousemoveEvt = (e: MouseEvent) => {
    Object.assign(cacheData, {
      x2: e.x,
      y2: e.y,
    })
    const { x1, y1, x2, y2, leftCanvas, topCanvas } = cacheData
    if (Math.min(x1, x2) - leftCanvas <= 0 || Math.min(y1, y2) - topCanvas <= 0) {
      clearEvent()
      return
    }
    Object.assign(styleData, {
      left: Math.min(x1, x2) - leftCanvas,
      top: Math.min(y1, y2) - topCanvas,
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    })
  }
  const clearEvent = () => {
    Object.assign(styleData, styleDefault)
    document.removeEventListener('mousemove', mousemoveEvt, true)
    document.removeEventListener('mouseup', mouseupEvt, true)
  }
  // 碰撞检测
  const collisionChecking = (data) => {
    const allLayerItems = toRaw(canvasStageStore.layerList).slice(1)
    console.log(allLayerItems)
    console.log(data)
  }
  // 鼠标释放事件
  const mouseupEvt = (e: MouseEvent) => {
    collisionChecking({ ...styleData })
    clearEvent()
  }
  // 鼠标按下件
  const mousedownEvt = (e: MouseEvent) => {
    if (e.ctrlKey || e.shiftKey) {
      return
    }
    const designWorkbench: HTMLElement = getDesignWorkbench()
    const { left: leftCanvas, top: topCanvas } = designWorkbench.getBoundingClientRect()
    if (e.x - leftCanvas <= 0 || e.y - topCanvas <= 0) {
      return
    }
    const layerItemEle = getAncestorByClass(e.target, 'layer-item')
    if (!layerItemEle) {
      Object.assign(cacheData, {
        x1: e.x,
        y1: e.y,
        x2: e.x,
        y2: e.y,
        leftCanvas,
        topCanvas,
        designWorkbench,
      })
      document.addEventListener('mousemove', mousemoveEvt, true)
      document.addEventListener('mouseup', mouseupEvt, true)
    }
  }
  document.addEventListener('mousedown', mousedownEvt, true)
  onMounted(() => {
    document.removeEventListener('mousedown', mousedownEvt)
  })
</script>
<style>
  .drag-selection-box {
    position: absolute;
    outline: 2px solid #2932e14f;
  }
</style>
