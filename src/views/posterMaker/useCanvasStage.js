import { defineStore } from 'pinia'
import { layerData } from './var.js'
export const scaleStep = 0.1
export const minScale = 0.2
export const maxScale = 4
export const useCanvasStageStore = defineStore('canvasStage', {
  state: () => {
    return {
      currentScale: 1,
      scaleRate: 1,
      layerList: layerData,
      selectedLayerIds: [],
    }
  },
  getters: {},
  actions: {
    // 更新图层位置
    updateLayerPositionlById({ id, x, y }) {
      const [layerData] = this.layerList.filter((item) => item.id === id)
      if (layerData) {
        layerData.x += x / this.scaleRate
        layerData.y += y / this.scaleRate
      }
    },
    // 整体更新图层
    updateOverallLayer(list) {
      this.layerList = list
    },
    scaleChange(value) {
      this.scaleRate = value
    },
  },
})
