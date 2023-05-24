<template>
  <div
    :style="computedStyleData"
    class="drag-selection-box"
  ></div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, toRaw } from 'vue'
  import { getAncestorByClass, getDesignWorkbench } from './utils'
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
    rawScaleRate: 1,
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
  const mouseleaveDesignWorkbench = (e: MouseEvent) => {
    console.log('mouseleaveDesignWorkbench')
    // Object.assign(styleData, styleDefault)
  }
  // 鼠标移动事件
  const mousemoveEvt = (e: MouseEvent) => {
    Object.assign(cacheData, {
      x2: e.x,
      y2: e.y,
    })
    const { x1, y1, x2, y2, leftCanvas, topCanvas, rawScaleRate } = cacheData
    Object.assign(styleData, {
      left: Math.min(x1, x2) - leftCanvas,
      top: Math.min(y1, y2) - topCanvas,
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    })
  }
  // 鼠标释放事件
  const mouseupEvt = (e: MouseEvent) => {
    const designWorkbench = cacheData.designWorkbench as HTMLElement
    Object.assign(styleData, styleDefault)
    document.removeEventListener('mousemove', mousemoveEvt, true)
    document.removeEventListener('mouseup', mouseupEvt, true)
    designWorkbench.removeEventListener('mouseleave', mouseleaveDesignWorkbench, true)
  }
  // 鼠标按下件
  const mousedownEvt = (e: MouseEvent) => {
    if (e.ctrlKey || e.shiftKey) {
      return
    }
    const layerItemEle = getAncestorByClass(e.target, 'layer-item')
    if (!layerItemEle) {
      const rawScaleRate = toRaw(canvasStageStore.scaleRate)
      const designWorkbench: HTMLElement = getDesignWorkbench()
      const { left: leftCanvas, top: topCanvas } = designWorkbench.getBoundingClientRect()
      Object.assign(cacheData, {
        x1: e.x,
        y1: e.y,
        x2: e.x,
        y2: e.y,
        leftCanvas,
        topCanvas,
        rawScaleRate,
        designWorkbench,
      })
      document.addEventListener('mousemove', mousemoveEvt, true)
      document.addEventListener('mouseup', mouseupEvt, true)
      designWorkbench.addEventListener('mouseleave', mouseleaveDesignWorkbench, true)
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
