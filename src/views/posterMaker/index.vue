<template>
  <div class="online-design-general-container">
    <div
      ref="designWorkbench"
      class="design-workbench-container"
    >
      <div class="drawing-board-container">
        <div class="drawing-canvas-container">
          <div
            class="drawing-canvas"
            :style="stageStyle"
          >
            <layerRenderComp :layerList="canvasStageStore.layerList" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="PosterMaker">
  import { onMounted, reactive, ref, computed, watch } from 'vue'
  import WZoom from './vanilla-js-wheel-zoom/wheel-zoom'
  import { getAncestorByClass, getLayerItemModelById, getDesignWorkbench, getDrawingCanvas } from './utils.js'
  import { wzoomModel } from './var.js'
  import { useCanvasStageStore, minScale, maxScale } from './useCanvasStage.js'
  import layerZoomBox from './layerZoomBox.vue'
  import { registerMouseEvt } from './mouseEvent'
  import { registerKeyboardEvt } from './keyboardEvent'
  import layerRenderComp from './layerRenderComp.vue'
  const canvasStageStore = useCanvasStageStore()
  const { scaleChange, scaleRate } = canvasStageStore
  const designWorkbench = ref(null)
  const refRectZoomBox = ref(null)
  const stageSize = reactive({
    width: 800,
    height: 600,
  })
  const stageStyle = computed(() => {
    const { width, height } = stageSize
    return {
      width: `${width}px`,
      height: `${height}px`,
    }
  })

  function init(content) {
    wzoomModel.instance = WZoom.create(content, {
      type: 'html',
      maxScale: maxScale,
      width: stageSize.width,
      height: stageSize.height,
      zoomOnClick: false,
      dragScrollableOptions: {
        onGrab: () => {
          content.parentElement.style.cursor = 'grabbing'
        },
        onDrop: () => {
          console.log('onDrop')
          content.parentElement.style.cursor = 'default'
        },
      },
      prepare: (instance) => {
        scaleChange(instance.content.minScale)
      },
      rescale: (instance) => {
        canvasStageStore.selectedLayerIds.length = 0
        scaleChange(instance.content.currentScale)
      },
    })

    window.addEventListener('resize', function () {
      wzoomModel.instance.prepare()
    })
  }

  onMounted(() => {
    const designWorkbench = getDesignWorkbench()

    if (designWorkbench) {
      const drawingCanvasOuter = getDrawingCanvas().parentElement
      init(drawingCanvasOuter)
      registerMouseEvt(designWorkbench)
      registerKeyboardEvt()
    }
  })
</script>
<style src="./style.scss" lang="scss" scoped></style>
