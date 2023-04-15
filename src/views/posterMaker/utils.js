export const minScale = 0.2
export const maxScale = 4
export const layerList = [
  {
    id: '0',
    width: -1,
    height: -1,
    x: 0,
    y: 0,
    type: 'background',
    html: null
  },
  {
    id: '1',
    width: 300,
    height: 100,
    x: 50,
    y: 100,
    type: 'svg',
    html: `
      <svg class="online-design-svg" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <rect width="300" height="100" style="fill:white;stroke-width:1;stroke:rgb(0,0,0)" />
      </svg>
      `
  },
  {
    id: '2',
    width: 300,
    height: 148,
    x: 300,
    y: 300,
    type: 'img',
    html: '<img class="online-design-img" src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png"  />'
  },
  {
    id: '3',
    width: 'auto',
    height: 'auto',
    x: 200,
    y: 300,
    type: 'text',
    html: '<span contenteditable="true" data-layer-type="text">我是文本我是文本</span>'
  }
]
export const getAncestorByClass = (target, classAname) => {
  if (target === null || target === document.body) {
    return null
  } else if (target.classList.contains(classAname)) {
    return target
  } else {
    return getAncestorByClass(target.parentElement, classAname)
  }
}
export const getLayerItemModelById = id => {
  const layerItemModel = layerList.find(item => item.id === id)
  if (layerItemModel) {
    return layerItemModel
  }
  return null
}

export const generateRectTransformBox = el => {
  const { x, y, width, height } = el.getBoundingClientRect()
  const div = document.createElement('div')
  Object.assign(div.style, {
    position: 'fixed',
    width: `${width + 1}px`,
    height: `${height + 1}px`,
    left: `${x}px`,
    top: `${y}px`,
    outline: '1px solid green'
  })
  document.body.appendChild(div)
  return div
}
export const generateRectSelectionBox = el => {}
export const generateRectOperateBox = map => {
  if (map instanceof Map) {
    if (map.size === 1) {
      const { value: el } = map.values().next()
      generateRectTransformBox(el)
    }
    if (map.size > 1) {
      generateRectSelectionBox()
    }
  }
}
