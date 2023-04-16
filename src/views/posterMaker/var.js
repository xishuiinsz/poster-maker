import { reactive } from 'vue'

export const minScale = 0.2
export const maxScale = 4
export const scaleStep = 0.1
export const selectedLayersMap = new Map()
export const selectedLayerIds = reactive([])
export const layerItemClass = 'layer-item'
export const wzoomModel = {
  instance: null,
}
export const layerList = [
  {
    id: '0',
    width: -1,
    height: -1,
    x: 0,
    y: 0,
    type: 'background',
    html: null,
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
      `,
  },
  {
    id: '2',
    width: 300,
    height: 148,
    x: 300,
    y: 300,
    type: 'img',
    html: '<img class="online-design-img" src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png"  />',
  },
  {
    id: '3',
    width: 'auto',
    height: 'auto',
    x: 200,
    y: 300,
    type: 'text',
    html: '<span contenteditable="true" data-layer-type="text">我是文本我是文本</span>',
  },
]
