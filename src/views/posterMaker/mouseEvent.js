import { watch, toRaw } from 'vue'
import { getAncestorByClass, getTopLayerItemEle, getDesignWorkbench, getDrawingBoard } from './utils.js'
import { useCanvasStageStore } from './useCanvasStage.js'
import { storeToRefs } from 'pinia'
const canvasStageStore = useCanvasStageStore()
const { selectedLayerIds } = storeToRefs(canvasStageStore)

// 普通图层(除背景图层外)点击事件
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

// 背景图层点击事件
function backgroundMousedown(e) {
  window.getSelection().empty()
  canvasStageStore.$patch({
    selectedLayerIds: [],
  })
}

// 注册鼠标事件
export function registerMouseEvt(target) {
  target.addEventListener('mousedown', (e) => {
    e.stopImmediatePropagation()
    e.stopPropagation()
    if (e.target === getDesignWorkbench() || e.target === getDrawingBoard()) {
      // e.target.addEventListener('mousemove', designWorkbenchMousemoveEvt)
      // e.target.addEventListener('mouseup', designWorkbenchMouseupEvt)
      return
    }
    const layerItemEl = getTopLayerItemEle(e.target, 'layer-item')
    if (layerItemEl) {
      layerItemMousedown(e, layerItemEl)
    } else {
      backgroundMousedown(e)
    }
  })
}
