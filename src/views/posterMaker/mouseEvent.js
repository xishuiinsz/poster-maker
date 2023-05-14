import { watch, toRaw } from 'vue'
import { selectedLayersMap } from './var'
import { getAncestorByClass, getTopLayerItemEle, getDesignWorkbench, getDrawingBoard } from './utils.js'
import { useCanvasStageStore } from './useCanvasStage.js'
import { storeToRefs } from 'pinia'
const canvasStageStore = useCanvasStageStore()
const { selectedLayerIds } = storeToRefs(canvasStageStore)
function layerItemMousedown(e, layerItemEl) {
  const { layerId } = layerItemEl.dataset
  if (layerId) {
    if (e.ctrlKey) {
      const rawSelectedLayerIds = toRaw(canvasStageStore.selectedLayerIds)
      if (rawSelectedLayerIds.includes(layerId)) {
        const index = rawSelectedLayerIds.findIndex((id) => id === layerId)
        canvasStageStore.selectedLayerIds.splice(index, 1)
      } else {
        canvasStageStore.selectedLayerIds.push(layerId)
      }
    } else {
      canvasStageStore.$patch({
        selectedLayerIds: [layerId],
      })
    }
  }
}
function backgroundMousedown(e) {
  canvasStageStore.$patch({
    selectedLayerIds: [],
  })
}

function designWorkbenchMousemoveEvt(e) {
  console.log(e)
}
function designWorkbenchMouseupEvt(e) {
  console.log(e)
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
    if (e.target === getDesignWorkbench() || e.target === getDrawingBoard()) {
      e.target.addEventListener('mousemove', designWorkbenchMousemoveEvt)
      e.target.addEventListener('mouseup', designWorkbenchMouseupEvt)
      return
    }
    const layerItemEl = getTopLayerItemEle(e.target, 'layer-item')
    if (layerItemEl) {
      if (layerItemEl.classList.contains('layer-background')) {
        backgroundMousedown(e)
      } else {
        layerItemMousedown(e, layerItemEl)
      }
    } else {
      console.log('dddd')
    }
  })
}
