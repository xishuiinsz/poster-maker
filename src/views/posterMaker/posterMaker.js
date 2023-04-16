import WZoom from './vanilla-js-wheel-zoom/wheel-zoom'
import { maxScale, minScale, layerList, getAncestorByClass, getLayerItemModelById, generateRectOperateBox } from './utils'
const wzoomModel = {
  instance: null
}
const selectedLayersMap = new Map()
export default {
  name: 'OnlinePosterHome',
  data() {
    return {
      scaleStep: 0.1,
      min: null,
      minScale,
      maxScale,
      defaultValue: 1,
      currentScale: null,
      step: 4,
      value: 2,
      stageSize: {
        width: 800,
        height: 600
      },
      activeLayerList: [],
      layerConfig: {
        clip: {}
      },
      configClip: {
        width: 200,
        height: 300
      },
      scaleRate: 100,
      configRect: {
        x: 200,
        y: 100,
        width: 100,
        height: 200,
        stroke: 'green',
        strokeWidth: 2,
        draggable: true
      },
      isShowClipBox: true,
      layerList,
      imageMainOption: {
        image: null,
        draggable: true,
        x: 100,
        y: 100,
        scaleX: 1,
        scaleY: 1,
        width: 0,
        height: 0,
        centeredScaling: true
      }
    }
  },
  computed: {
    stageStyle() {
      const { width, height } = this.stageSize
      return {
        width: `${width}px`,
        height: `${height}px`
      }
    }
  },
  methods: {
    getLayerItemClass(layer) {
      let className = `layer-${layer.type}`
      if (this.activeLayerList.map(item => item.layerId).includes(layer.id)) {
        className += ' is-active'
      }
      return className
    },
    getLayerStyle(item) {
      const { width, height, x, y } = item
      return {
        width: width > 0 ? `${width}px` : 'fit-content',
        height: height > 0 ? `${height}px` : 'fit-content',
        left: `${x}px`,
        top: `${y}px`
      }
    },
    fitBtnClick() {
      wzoomModel.instance.prepare()
    },
    originBtnClick() {
      wzoomModel.instance.transform(0, 0, 1)
    },
    scaleChange(currentValue, oldValue) {
      const { instance } = wzoomModel
      if (currentValue > oldValue) {
        instance.zoomUp()
      } else {
        instance.zoomDown()
      }
    },
    getLayerId(element) {
      if (element.classList.contains('drawing-canvas')) return null
      if (element.dataset.layerId) return { layerId: element.dataset.layerId, element }
      else return this.getLayerId(element.parentElement)
    },
    stageMousedownEvt(e) {
      if (this.keyCode !== 'Space') {
        const layerId = this.getLayerId(e.target)
        if (layerId) {
          if (!this.activeLayerList.map(item => item.layerId).includes(layerId)) {
            this.activeLayerList = []
            this.activeLayerList.push(layerId)
          }
        } else {
          this.activeLayerList = []
        }
      }
      this.x1 = this.x2 = e.x
      this.y1 = this.y2 = e.y
      window.addEventListener('mousemove', this.mouseMove)
      window.addEventListener('mouseup', () => {
        document.body.style.cursor = 'default'
        window.removeEventListener('mousemove', this.mouseMove)
      })
    },
    beforeUpload(file) {
      this.loadingInstance = this.$loading({
        target: this.$el
      })
    },
    handleSuccess(response) {
      this.loadingInstance.close()
      const { file } = response.files
      const img = new Image()
      const _this = this
      img.onload = () => {
        this.imageMainOption.width = img.width
        this.imageMainOption.height = img.height
        if (img.width > this.stageSize.width || img.height > this.stageSize.height) {
          if (img.width / img.height > this.stageSize.width / this.stageSize.height) {
            this.imageMainOption.scaleX = this.imageMainOption.scaleY = this.stageSize.width / img.width
            this.imageMainOption.x = 0
            this.imageMainOption.y = (this.stageSize.height - this.imageMainOption.height * this.imageMainOption.scaleX) / 2
          } else {
            this.imageMainOption.scaleX = this.imageMainOption.scaleY = this.stageSize.height / img.height
            this.imageMainOption.y = 0
            this.imageMainOption.x = (this.stageSize.width - this.imageMainOption.width * this.imageMainOption.scaleX) / 2
          }
          this.scaleRate = this.imageMainOption.scaleX * 100
        } else {
          this.imageMainOption.x = (this.stageSize.width - img.width) / 2
          this.imageMainOption.y = (this.stageSize.height - img.height) / 2
          this.imageMainOption.width = img.width
          this.imageMainOption.height = img.height
        }
        _this.imageMainOption.image = img
      }
      img.src = file
    },
    resize() {
      this.stageSize = {
        width: 0,
        height: 0
      }
    },
    // 开始裁剪
    confirmClipAction() {
      this.layerConfig.clip = {}
      const { x, y, width, height } = this.configRect
      this.layerConfig.clip = {
        x,
        y,
        width,
        height
      }
    },
    init() {
      const myContent = this.$el.querySelector('.drawing-canvas-container')
      wzoomModel.instance = WZoom.create(myContent, {
        type: 'html',
        maxScale: maxScale,
        width: this.stageSize.width,
        height: this.stageSize.height,
        zoomOnClick: false,
        dragScrollableOptions: {
          onGrab: () => {
            this.$el.querySelector('.drawing-board-container').style.cursor = 'grabbing'
          },
          onDrop: () => {
            this.$el.querySelector('.drawing-board-container').style.cursor = 'default'
          }
        },
        prepare: instance => {
          this.min = instance.content.minScale
          this.defaultValue = instance.content.minScale
          this.step = 1 / instance.options.speed
        },
        rescale: instance => {
          this.currentScale = instance.content.currentScale
        }
      })

      window.addEventListener('resize', function () {
        wzoomModel.instance.prepare()
      })
    },
    textLayerMousedown(e) {
      const el = e.target
      el.setAttribute('contenteditable', true)
      // el.focus()
      const range = window.getSelection()
      range.selectAllChildren(el)
      range.collapseToEnd()
      el.addEventListener('blur', () => {
        console.log('blur')
      })
    },
    registerEvt(target) {
      target.addEventListener('mouseup', e => {
        e.stopPropagation()
        e.stopImmediatePropagation()
      })
      target.addEventListener('click', e => {
        e.stopPropagation()
        e.stopImmediatePropagation()
      })
      target.addEventListener('mousedown', e => {
        e.stopImmediatePropagation()
        e.stopPropagation()
        const layerItemEl = getAncestorByClass(e.target, 'layer-item')
        if (layerItemEl) {
          const { layerId } = layerItemEl.dataset
          const layerItemModel = getLayerItemModelById(layerId)
          if (layerItemModel) {
            if (!e.ctrlKey) {
              selectedLayersMap.clear()
            }
            layerItemModel.type !== 'background' && selectedLayersMap.set(layerItemModel, layerItemEl)
          }
        }
        generateRectOperateBox(selectedLayersMap)
      })
    }
  },
  mounted() {
    this.drawingBoardContainer = this.$el.querySelector('.drawing-board-container')
    if (this.drawingBoardContainer) {
      this.init()
      this.registerEvt(this.drawingBoardContainer)
    }
  }
}
