import { defineStore } from 'pinia'
export const scaleStep = 0.1
export const minScale = 0.2
export const maxScale = 4
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
