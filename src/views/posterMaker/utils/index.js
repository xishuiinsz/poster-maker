import { layerItemClass, wzoomModel } from '../var.js'
import WZoom from '../vanilla-js-wheel-zoom/wheel-zoom'
import { useCanvasStageStore } from '../useCanvasStage.js'

// const { scaleChange } = canvasStageStore
// 获取工作台
export const getDesignWorkbench = (selector = 'design-workbench-container') => {
  let className = selector
  if (!selector.startsWith('.')) {
    className = `.${selector}`
  }
  const container = document.querySelector(className)
  if (container) {
    return container
  }
  return null
}

// 获取画板
export const getDrawingBoard = (selector = 'drawing-board-container') => {
  let className = selector
  if (!selector.startsWith('.')) {
    className = `.${selector}`
  }
  const container = document.querySelector(className)
  if (container) {
    return container
  }
  return null
}

// 获取画布外容器
export const getDrawingCanvasContainer = (selector = 'drawing-canvas-container') => {
  let className = selector
  if (!selector.startsWith('.')) {
    className = `.${selector}`
  }
  const canvas = document.querySelector(className)
  if (canvas) {
    return canvas
  }
  return null
}
// 获取画布
export const getDrawingCanvas = (selector = 'drawing-canvas') => {
  let className = selector
  if (!selector.startsWith('.')) {
    className = `.${selector}`
  }
  const canvas = document.querySelector(className)
  if (canvas) {
    return canvas
  }
  return null
}

export const getAncestorByClass = (target, className) => {
  if (target === null || target === document.body) {
    return null
  } else if (target.classList.contains(className)) {
    return target
  } else {
    return getAncestorByClass(target.parentElement, className)
  }
}
export const getLayerItemDomById = (id) => {
  const canvas = getDrawingCanvas()
  if (canvas) {
    const elementList = document.querySelectorAll(`.${layerItemClass}`)
    if (elementList) {
      return Array.from(elementList).find((item) => item.dataset.layerId === id)
    }
  }

  return null
}

export const getLayerItemModelById = (id, layerList) => {
  const layerItemModel = layerList.find((item) => item.id === id)
  if (layerItemModel) {
    return layerItemModel
  }
  return null
}

export const removeLayerItemModelById = (id, layerList) => {
  const index = layerList.findIndex((item) => item.id === id)
  if (index > -1) {
    layerList.splice(index, 1)
  }
}

export const rectTransformBox = (el) => {
  const { x, y, width, height } = el.getBoundingClientRect()
  const div = document.createElement('div')
  Object.assign(div.style, {
    position: 'fixed',
    width: `${width + 1}px`,
    height: `${height + 1}px`,
    left: `${x}px`,
    top: `${y}px`,
    outline: '1px solid green',
  })
  document.body.appendChild(div)
  return div
}

const generateRectTransformBox = (function () {
  let instance
  return function (el) {
    if (instance) {
      document.body.removeChild(instance)
    }
    instance = rectTransformBox(el)
    return instance
  }
})()

export const generateRectOperateBox = (ids) => {
  if (ids.length === 1) {
    const [id] = ids
    const el = getLayerItemDomById(id)
    generateRectTransformBox(el)
  }
  if (ids.size > 1) {
    generateRectSelectionBox()
  }
}

export const getRootItemById = (id, list) => {
  const hasId = (id, array) => {
    for (let index = 0; index < array.length; index++) {
      const el = array[index]
      if (el.id === id) {
        return true
      }
      if (el.children && el.children.length) {
        return hasId(id, el.children)
      }
    }
    return false
  }
  for (let index = 0; index < list.length; index++) {
    const element = list[index]
    if (element.id === id) {
      return element
    }
    if (element.children && element.children.length) {
      if (hasId(id, element.children)) {
        return element
      }
    }
  }
}

export const getActiveLayers = () => {
  const canvas = getDrawingCanvas()
  if (canvas) {
    const activeLayers = Array.from(canvas.children).filter((ele) => ele.classList.contains('is-active') && ele.classList.contains('layer-item'))
    if (activeLayers.length) {
      return activeLayers
    }
  }
  return []
}

export const getCanvasLeftTop = () => {
  const canvas = getDrawingCanvas()
  if (canvas) {
    const { left, top } = canvas.getBoundingClientRect()
    return { left, top }
  }
  return { left: 0, top: 0 }
}

// 基于子元素，获取顶级图层元素
export const getTopLayerItemEle = (target, selector = 'layer-item', result = null) => {
  if (!target) {
    return null
  }
  if (target.classList.contains(selector)) {
    result = target
  }
  if (target === getDrawingCanvas()) {
    return result
  }
  return getTopLayerItemEle(target.parentElement, selector, result)
}

export const getElementsInContentEditable = () => {
  const drawingCanvas = getDrawingCanvas()
  if (drawingCanvas) {
    const ele = drawingCanvas.querySelector('[contenteditable=true]')
    if (ele) {
      return true
    }
  }
  return false
}

export const computedRotatedCoordinate = (pointOrigin, pointCenter, deg) => {
  const angle = (Math.PI / 180) * deg
  const x = (pointOrigin.x - pointCenter.x) * Math.cos(angle) - (pointOrigin.y - pointCenter.y) * Math.sin(angle) + pointCenter.x
  const y = (pointOrigin.x - pointCenter.x) * Math.sin(angle) + (pointOrigin.y - pointCenter.y) * Math.cos(angle) + pointCenter.y
  return { x, y }
}

// 获取所有普通图层
export const getAllLayerItems = () => {
  const canvasContainer = getDrawingCanvas()
  if (canvasContainer) {
    return Array.from(canvasContainer.children).slice(1)
  }
  return []
}

// 生成随机颜色
export const getRandomColor = function () {
  return '#' + ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)
}

export function init(content) {
  const canvasStageStore = useCanvasStageStore()
  wzoomModel.instance = WZoom.create(content, {
    type: 'html',
    maxScale: maxScale,
    width: stageSize.width,
    height: stageSize.height,
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

// target2是否是target1的祖先元素
export const isAncestorElement = (target1, target2) => {
  if (target1 === document.body) {
    return false
  } else if (Array.from(target2.children).includes(target1)) {
    return true
  } else {
    return isAncestorElement(target1.parentElement, target2)
  }
}
