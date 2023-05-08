import { watch, computed } from 'vue'
import { selectedLayersMap } from './var'
import { getAncestorByClass, getLayerItemModelById, generateRectOperateBox } from './utils.js'
import { useCanvasStageStore } from './useCanvasStage.js'
import { storeToRefs } from 'pinia'
const canvasStageStore = useCanvasStageStore()
const { selectedLayerIds } = storeToRefs(canvasStageStore)
function layerItemMousedown(e, layerItemEl) {
  const { layerId } = layerItemEl.dataset
  if (layerId) {
    canvasStageStore.$patch({
      selectedLayerIds: [layerId],
    })
  }
}
function backgroundMousedown(e) {
  canvasStageStore.$patch({
    selectedLayerIds: [],
  })
}
export function registerMouseEvt(target) {
  target.addEventListener('mouseup', (e) => {
    e.stopPropagation()
    e.stopImmediatePropagation()
  })
  target.addEventListener('click', (e) => {
    e.stopPropagation()
    e.stopImmediatePropagation()
  })
  target.addEventListener('mousedown', (e) => {
    e.stopImmediatePropagation()
    e.stopPropagation()
    const layerItemEl = getAncestorByClass(e.target, 'layer-item')
    if (layerItemEl) {
      if (layerItemEl.classList.contains('layer-background')) {
        backgroundMousedown(e)
      } else {
        layerItemMousedown(e, layerItemEl)
      }
    }
  })
}
