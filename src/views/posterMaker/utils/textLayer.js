import { getActiveLayers, getLayerItemDomById } from './index.js'
export const lineHeightDefault = 28
// 缓存的选区数据
export const cacheData = {
  rangeOffset: [],
}

// 缓存元素内的选区
export function getRangeOffset(wrap_dom) {
  const txtList = []
  const map = function (chlids) {
    Array.from(chlids).forEach((el) => {
      if (el.nodeName === '#text') {
        txtList.push(el)
      } else {
        map(el.childNodes)
      }
    })
  }
  // 递归遍历，提取出所有 #text
  map(wrap_dom.childNodes)
  // 计算文本的位置区间 [0,3]、[3, 8]、[8,10]
  const clips = txtList.reduce((arr, item, index) => {
    const end = item.textContent.length + (arr[index - 1] ? arr[index - 1][2] : 0)
    arr.push([item, end - item.textContent.length, end])
    return arr
  }, [])
  const range = window.getSelection().getRangeAt(0)
  // 匹配选区与区间的#text，计算出整体偏移量
  const startOffset = clips.find((el) => range.startContainer === el[0])[1] + range.startOffset
  const endOffset = clips.find((el) => range.endContainer === el[0])[1] + range.endOffset
  return [startOffset, endOffset]
}

// 基本起点终点及元素，还原选区
export function getNodeAndOffset(wrap_dom, start = 0, end = 0) {
  const txtList = []
  const map = function (chlids) {
    Array.from(chlids).forEach((el) => {
      if (el.nodeName === '#text') {
        txtList.push(el)
      } else {
        map(el.childNodes)
      }
    })
  }
  map(wrap_dom.childNodes)
  const clips = txtList.reduce((arr, item, index) => {
    const end = item.textContent.length + (arr[index - 1] ? arr[index - 1][2] : 0)
    arr.push([item, end - item.textContent.length, end])
    return arr
  }, [])
  const startNode = clips.find((el) => start >= el[1] && start < el[2])
  const endNode = clips.find((el) => end >= el[1] && end < el[2])
  return [startNode[0], start - startNode[1], endNode[0], end - endNode[1]]
}

// 缓存选区
export const saveSelectionRange = () => {
  const singleTextElement = getSingleTextElement()
  if (singleTextElement) {
    const selection = document.getSelection()
    if (!selection.getRangeAt(0).collapsed) {
      const offsetRange = getRangeOffset(singleTextElement)
      Object.assign(cacheData, { offsetRange })
    }
  }
}

// 恢复选区
export const restoreSelectionRange = () => {
  const singleTextElement = getSingleTextElement()
  const [startOffset, endOffset] = cacheData.offsetRange
  if (singleTextElement && startOffset && endOffset && endOffset > startOffset) {
    singleTextElement.setAttribute('contenteditable', 'true')
    const nodes = getNodeAndOffset(singleTextElement, startOffset, endOffset)
    const selection = document.getSelection()
    const range = document.createRange()
    range.setStart(nodes[0], nodes[1])
    range.setEnd(nodes[2], nodes[3])
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

// 获取多个活动文本图层
export const getMultiTextLayers = () => {
  const activeLayers = getActiveLayers()
  if (activeLayers.length) {
    const activeTextLayers = activeLayers.filter((el) => el.classList.contains('layer-text'))
    if (activeTextLayers.length) {
      return activeTextLayers
    }
  }
  return []
}
export const getSingleTextLayer = () => {
  const textLayers = getActiveLayers()
  if (textLayers.length === 1) {
    const [textLayer] = textLayers
    if (textLayer.classList.contains('layer-text')) {
      return textLayer
    }
  }
  return null
}

export const getSingleTextElement = () => {
  const textLayer = getSingleTextLayer()
  if (textLayer) {
    const element = textLayer.querySelector('.layer-element')
    if (element) {
      return element
    }
  }
  return null
}

export const getTextLayerHtmlById = (id) => {
  const layerDom = getLayerItemDomById(id)
  if (layerDom) {
    const layerElement = layerDom.querySelector('.layer-element')
    if (layerElement) {
      return layerElement.innerHTML
    }
  }
  return ''
}
