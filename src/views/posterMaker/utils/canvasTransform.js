import { wzoomModel } from '../var.js'
import WZoom from '../vanilla-js-wheel-zoom/wheel-zoom'
import { useCanvasStageStore, maxScale } from '../useCanvasStage.js'
export function initCanvasTransform(data) {
  const canvasStageStore = useCanvasStageStore()
  const { scaleChange } = canvasStageStore
  const { target: content, width, height } = data
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
