import { defineStore } from 'pinia'
import { toRaw, watch } from 'vue'
import axios from 'axios'
import { ElLoading } from 'element-plus'
import { getDesignWorkbench } from './utils/index.js'
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
  getters: {
    bgLayerData(state) {
      let _bgLayerData = {}
      if (state.layerList.length) {
        ;[_bgLayerData] = state.layerList
      }
      return _bgLayerData
    },
  },
  actions: {
    // 调接口获取图层列表数据
    async fetchLayerList() {
      const designWorkbench = getDesignWorkbench()
      const loadingInstance = ElLoading.service({ target: designWorkbench })
      const resp = await axios.get('./template1.json')
      loadingInstance.close()
      if (resp?.data.length) {
        this.layerList.push(...resp.data)
      } else {
        this.layerList.length = 0
      }
    },
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
    // 覆盖全部图层
    overrideAllLayers(list) {
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
    getLayerDataById(id) {
      const [layerData] = this.layerList.filter((item) => item.id === id)
      return layerData
    },
    getLayerTypeById(id) {
      let type = ''
      const layerData = this.getLayerDataById(id)
      if (layerData && layerData.type) {
        type = layerData.type
      }
      return type
    },
  },
})
