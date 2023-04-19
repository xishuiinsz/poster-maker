import { defineStore } from 'pinia'
export const scaleStep = 0.1
export const minScale = 0.2
export const maxScale = 4
export const useCanvasStageStore = defineStore('canvasStage', {
  state: () => {
    return {
      currentScale: 1,
      scaleRate: 1,
      selectedLayerIds: [],
    }
  },
  getters: {},
  actions: {
    scaleChange(value) {
      console.log(value)
      this.scaleRate = value
    },
  },
})
