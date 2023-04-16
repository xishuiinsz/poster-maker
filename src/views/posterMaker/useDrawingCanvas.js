import { defineStore } from 'pinia'
export const selectedLayerIds = []
export const useSidebarStore = defineStore('CanvasStage', {
  state: () => {
    return {
      currentScale: 1,
    }
  },
  getters: {},
  actions: {
    scaleChange(value) {
      this.currentScale = value
    },
  },
})
