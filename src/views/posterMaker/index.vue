<template>
  <div class="online-design-general-container">
    <div class="design-workbench-container">
      <div class="drawing-board-container">
        <div class="drawing-canvas-container">
          <div
            class="drawing-canvas"
            :style="stageStyle"
          >
            <bgLayerComp :layerData="layerDataBg" />
            <layerRenderComp :layerList="canvasStageStore.layerList.slice(1)" />
          </div>
        </div>
      </div>
      <dragSelectionBox />
    </div>
  </div>
</template>
<script setup lang="ts" name="PosterMaker">
  import { onMounted, reactive, ref, computed, watch } from 'vue'
  import WZoom from './vanilla-js-wheel-zoom/wheel-zoom'
  import { getAncestorByClass, getLayerItemModelById, getDesignWorkbench, getDrawingCanvas } from './utils.js'
  import { wzoomModel } from './var.js'
  import { useCanvasStageStore, minScale, maxScale } from './useCanvasStage.js'
  import { registerMouseEvt } from './mouseEvent'
  import { registerKeyboardEvt } from './keyboardEvent'
  import bgLayerComp from './bgLayerComp/index.vue'
  import layerRenderComp from './layerRenderComp.vue'
  import dragSelectionBox from './dragSelectionBox.vue'
  const canvasStageStore = useCanvasStageStore()
  const { scaleChange, scaleRate } = canvasStageStore
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
  const layerDataBg = computed(() => {
    let layerData = {}
    if (canvasStageStore.layerList.length) {
      ;[layerData] = canvasStageStore.layerList
    }
    return layerData
  })
  function init(content) {
    wzoomModel.instance = WZoom.create(content, {
      type: 'html',
      maxScale: maxScale,
      width: stageSize.width,
      height: stageSize.height,
      zoomOnClick: false,
      // dragScrollableOptions: {
      //   onGrab: () => {
      //     console.log('ongrab')
      //     content.parentElement.style.cursor = 'grabbing'
      //   },
      //   onDrop: () => {
      //     content.parentElement.style.cursor = 'default'
      //   },
      // },
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
