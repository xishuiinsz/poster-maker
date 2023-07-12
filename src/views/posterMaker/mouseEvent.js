import { watch, toRaw } from 'vue'
import { getDesignWorkbench, getDrawingBoard } from './utils/index.js'
import { useCanvasStageStore } from './useCanvasStage.js'
const canvasStageStore = useCanvasStageStore()

// 注册鼠标事件
export function registerMouseEvt(target) {
  target.addEventListener('mousedown', (e) => {
    e.stopImmediatePropagation()
    e.stopPropagation()
    if (e.target === getDesignWorkbench() || e.target === getDrawingBoard()) {
      canvasStageStore.$patch({
        selectedLayerIds: [],
      })
    }
  })
}
