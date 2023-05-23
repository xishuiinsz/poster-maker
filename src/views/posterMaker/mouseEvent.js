import { watch, toRaw } from 'vue'
import { getCanvasLeftTop, getTopLayerItemEle, getDesignWorkbench, getDrawingBoard, getDrawingCanvas } from './utils.js'
import { useCanvasStageStore } from './useCanvasStage.js'
import { storeToRefs } from 'pinia'
const canvasStageStore = useCanvasStageStore()
const rawScaleRate = toRaw(canvasStageStore.scaleRate)
const { selectedLayerIds } = storeToRefs(canvasStageStore)
const mousePoint = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
}
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

function backgroundMousemove(e) {
  const { left: leftCanvas, top: topCanvas } = getCanvasLeftTop()
  const canvsContainer = getDrawingCanvas()
  Object.assign(mousePoint, {
    x2: e.x,
    y2: e.y,
  })
  const offsetWidth = Math.abs(mousePoint.x2 - mousePoint.x1) / rawScaleRate
  const offsetHeight = Math.abs(mousePoint.y2 - mousePoint.y1) / rawScaleRate
  const offsetX = Math.min(mousePoint.x1, mousePoint.x2) - leftCanvas / rawScaleRate
  const offsetY = Math.min(mousePoint.y1, mousePoint.y2) - topCanvas / rawScaleRate
  const div = document.createElement('div')
  const width = `${offsetWidth}px`
  const height = `${offsetHeight}px`
  const left = `${offsetX}px`
  const top = `${offsetY}px`
  Object.assign(div.style, {
    width,
    height,
    left,
    top,
    position: 'absolute',
    backgroundColor: 'red',
  })
  canvsContainer.appendChild(div)
}
function backgroundMouseup(e) {
  document.removeEventListener('mousemove', backgroundMousemove)
  document.removeEventListener('mouseup', backgroundMouseup)
}

// 背景图层点击事件
function backgroundMousedown(e) {
  window.getSelection().empty()
  canvasStageStore.$patch({
    selectedLayerIds: [],
  })
  if (e.ctrlKey) {
    return
  }
  Object.assign(mousePoint, {
    x1: e.x,
    y1: e.y,
    x2: e.x,
    y2: e.y,
  })
  document.addEventListener('mousemove', backgroundMousemove)
  document.addEventListener('mouseup', backgroundMouseup)
}

// 注册鼠标事件
export function registerMouseEvt(target) {
  target.addEventListener('mousedown', (e) => {
    e.stopImmediatePropagation()
    e.stopPropagation()
    if (e.target === getDesignWorkbench() || e.target === getDrawingBoard()) {
      backgroundMousedown(e)
    } else {
      const layerItemEl = getTopLayerItemEle(e.target, 'layer-item')
      if (layerItemEl) {
        layerItemMousedown(e, layerItemEl)
      } else {
        backgroundMousedown(e)
      }
    }
  })
}
