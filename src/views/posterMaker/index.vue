<template>
  <div class="online-design-general-container">
    <div class="design-workbench-container">
      <div class="drawing-board-container">
        <div class="drawing-canvas-container">
          <div class="drawing-canvas">
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
import { initCanvasTransform } from './utils/canvasTransform'
import { getAncestorByClass, getLayerItemModelById, getDesignWorkbench, getDrawingCanvas } from './utils/index.js'
import { useCanvasStageStore, minScale, maxScale } from './useCanvasStage.js'
import { registerMouseEvt } from './mouseEvent'
import { regKeyupCb } from './useKeyboardEvent.js'
import bgLayerComp from './bgLayerComp/index.vue'
import layerRenderComp from './layerRenderComp.vue'
import dragSelectionBox from './dragSelectionBox/dragSelectionBox.vue'
import userLayerListChange from './useLayerListChange.js'
import useKeyboardEvent from './useKeyboardEvent.js'
const canvasStageStore = useCanvasStageStore()
// 初始化监听图层数据变化
userLayerListChange(canvasStageStore.layerList)
// 全局注册keyboard事件
useKeyboardEvent()
const { selectAllLayers, fetchLayerList } = canvasStageStore

// 计算背景图层数据
const layerDataBg = computed(() => {
  if (canvasStageStore.layerList.length) {
    const [layerData] = canvasStageStore.layerList
    return layerData
  }
  return {}
})

// ctrl + a 快捷键回调
const ctrlAKeyEvt = (e) => {
  if (e.target.hasAttribute('contenteditable') || e.target instanceof HTMLInputElement) {
    return
  }
  e.preventDefault()
  selectAllLayers()
}

onMounted(async () => {
  await fetchLayerList()
  if (canvasStageStore.layerList.length) {
    const [layerDataBg] = canvasStageStore.layerList
    const designWorkbench = getDesignWorkbench()
    if (designWorkbench) {
      const drawingCanvasOuter = getDrawingCanvas().parentElement
      initCanvasTransform({ target: drawingCanvasOuter, width: layerDataBg.width, heigh: layerDataBg.heigh })
      registerMouseEvt(designWorkbench)
    }
    // 注册ctrl + a 快捷键
    regKeyupCb('ctrl_a', ctrlAKeyEvt)
  }



})
</script>
<style src="./style.scss" lang="scss" scoped></style>
