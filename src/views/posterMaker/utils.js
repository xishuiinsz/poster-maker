import { layerItemClass } from './var.js'
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
export const getAncestorByClass = (target, classAname) => {
  if (target === null || target === document.body) {
    return null
  } else if (target.classList.contains(classAname)) {
    return target
  } else {
    return getAncestorByClass(target.parentElement, classAname)
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
export const getTopLayerItemEle = (tartet, selector = 'layer-item') => {
  let className = selector
  if (!selector.startsWith('.')) {
    className = `.${selector}`
  }
}
