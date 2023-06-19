import { defineStore } from 'pinia'
import { toRaw } from 'vue'
export const scaleStep = 0.1
export const minScale = 0.2
export const maxScale = 4
export const useCanvasStageStore = defineStore('canvasStage', {
  state: () => {
    return {
      currentScale: 1,
      scaleRate: 1,
      layerList: [],
      selectedLayerIds: [],
    }
  },
  getters: {},
  actions: {
    // 更新图层数据，基于ID
    updateLayerDataById({ id, ...rest }) {
      const [layerData] = this.layerList.filter((item) => item.id === id)
      if (layerData) {
        Object.assign(layerData, rest)
      }
    },
    // 静默更新图层数据，基于ID
    silentUpdateLayerDataById({ id, ...rest }) {
      const [layerData] = toRaw(this.layerList).filter((item) => item.id === id)
      if (layerData) {
        Object.assign(layerData, rest)
      }
    },

    // 更新图层位置
    updateLayerPositionById({ id, x, y }) {
      const [layerData] = this.layerList.filter((item) => item.id === id)
      if (layerData) {
        layerData.x += x / this.scaleRate
        layerData.y += y / this.scaleRate
      }
    },
    // 整体更新图层
    updateOverallLayer(list) {
      this.layerList.length = 0
      this.layerList.push(...list)
    },
    scaleChange(value) {
      this.scaleRate = value
    },
    // 清空所选图层
    clearSelectedLayers() {
      this.selectedLayerIds.length = 0
    },
    // 全选图层
    selectAllLayers() {
      this.selectedLayerIds.length = 0
      const ids = toRaw(this.layerList)
        .slice(1)
        .map((item) => item.id)
      this.selectedLayerIds.push(...ids)
    },
  },
})
