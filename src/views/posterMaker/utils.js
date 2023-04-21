import { layerItemClass } from './var.js'
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
  let instance = null
  const elementList = document.querySelectorAll(`.${layerItemClass}`)
  if (elementList) {
    return Array.from(elementList).find((item) => item.dataset.layerId === id)
  }
  return instance
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

export const generateRectSelectionBox = (el) => {}
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
