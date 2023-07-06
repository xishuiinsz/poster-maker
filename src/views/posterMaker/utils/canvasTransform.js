import { wzoomModel } from '../var.js'
import WZoom from '../vanilla-js-wheel-zoom/wheel-zoom'
import { useCanvasStageStore, maxScale } from '../useCanvasStage.js'
import { getDrawingCanvasContainer } from './index.js'
export function initCanvasTransform() {
  const canvasStageStore = useCanvasStageStore()
  const { scaleChange, bgLayerData } = canvasStageStore
  const { width, height } = bgLayerData
  const content = getDrawingCanvasContainer()
  wzoomModel.instance = WZoom.create(content, {
    type: 'html',
    maxScale: maxScale,
    width,
    height,
    zoomOnClick: false,
    // dragScrollableOptions: {
    //   onGrab: () => {
    //     console.log('ongrab')
    //     content.parentElement.style.cursor = 'grabbing'
    //   },
    //   onDrop: () => {
    //     content.parentElement.style.cursor = 'default'
    //   },
    // },
    prepare: (instance) => {
      scaleChange(instance.content.minScale)
    },
    rescale: (instance) => {
      canvasStageStore.selectedLayerIds.length = 0
      scaleChange(instance.content.currentScale)
    },
  })

  window.addEventListener('resize', function () {
    wzoomModel.instance.prepare()
  })
}
