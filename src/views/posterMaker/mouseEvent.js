import { watch, computed } from 'vue'
import { selectedLayersMap, selectedLayerIds } from './var'
import { getAncestorByClass, getLayerItemModelById, generateRectOperateBox } from './utils.js'
export function registerEvt(target) {
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
      const { layerId } = layerItemEl.dataset
      const layerItemModel = getLayerItemModelById(layerId)
      if (layerId) {
        selectedLayerIds.length = 0
        if (layerItemModel.type !== 'background' && !selectedLayerIds.includes(layerId)) {
          selectedLayerIds.push(layerId)
        }
        generateRectOperateBox(layerId)
      }
    }
  })
}
