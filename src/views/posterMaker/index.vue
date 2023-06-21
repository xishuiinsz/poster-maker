<template>
  <div class="online-design-general-container">
    <div class="design-workbench-container">
      <div class="drawing-board-container">
        <div class="drawing-canvas-container">
          <div class="drawing-canvas" :style="stageStyle">
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
import { getAncestorByClass, getLayerItemModelById, getDesignWorkbench, getDrawingCanvas } from './utils/index.js'
import { wzoomModel } from './var.js'
import { useCanvasStageStore, minScale, maxScale } from './useCanvasStage.js'
import { registerMouseEvt } from './mouseEvent'
import { regKeyupCb } from './useKeyboardEvent.js'
import bgLayerComp from './bgLayerComp/index.vue'
import layerRenderComp from './layerRenderComp.vue'
import dragSelectionBox from './dragSelectionBox/dragSelectionBox.vue'
import userLayerListChange from './useLayerListChange.js'
import useKeyboardEvent from './useKeyboardEvent.js'
import axios from 'axios'
import { ElLoading } from 'element-plus'
const canvasStageStore = useCanvasStageStore()
userLayerListChange(canvasStageStore.layerList)
// 全局注册keyboard事件
useKeyboardEvent()
const { scaleChange, updateOverallLayer, selectAllLayers } = canvasStageStore
const stageSize = reactive({
  width: 800,
  height: 600,
})

const layerDataBg = computed(() => {
  if (canvasStageStore.layerList.length) {
    const [layerData] = canvasStageStore.layerList
    return layerData
  }
  return {}
})
const stageStyle = computed(() => {
  const { width = 800, height = 600 } = layerDataBg
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

const fetchLayerList = async () => {
  const designWorkbench = getDesignWorkbench()
  const loadingInstance = ElLoading.service({ target: designWorkbench })
  const resp = await axios.get('./template1.json')
  loadingInstance.close()
  if (resp?.data) {
    return resp.data
  }
  return []
}

const ctrlAKeyEvt = (e) => {
  if (e.target.hasAttribute('contenteditable') || e.target instanceof HTMLInputElement) {
    return
  }
  e.preventDefault()
  selectAllLayers()
}

onMounted(async () => {
  const list = await fetchLayerList()
  if (list.length) {
    updateOverallLayer(list)
  }
  const designWorkbench = getDesignWorkbench()
  if (designWorkbench) {
    const drawingCanvasOuter = getDrawingCanvas().parentElement
    init(drawingCanvasOuter)
    registerMouseEvt(designWorkbench)

  }
  regKeyupCb('ctrl_a', ctrlAKeyEvt)
})
</script>
<style src="./style.scss" lang="scss" scoped></style>
