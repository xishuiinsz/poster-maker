import { useCanvasStageStore, minScale, maxScale } from './useCanvasStage.js'
import { layerData } from './var.js'
const canvasStageStore = useCanvasStageStore()
const keyupEvt = (e) => {
  e.stopPropagation()
  e.preventDefault()
  if (e.key === 'a' || e.key === 'A') {
    if (e.ctrlKey) {
      const layerList = layerData.slice(1)
      const ids = layerList.map((item) => item.id)
      canvasStageStore.selectedLayerIds = ids
    }
  }
}
export const registerKeyboardEvt = () => {
  document.addEventListener('keyup', keyupEvt)
}
