import { reactive } from 'vue'

export const minScale = 0.2
export const maxScale = 4
export const scaleStep = 0.1
export const selectedLayerIds = reactive([])
export const layerItemClass = 'layer-item'
export const wzoomModel = {
  instance: null,
}
export const layerData = [
  {
    id: '0',
    width: '100%',
    height: '100%',
    x: 0,
    y: 0,
    type: 'background',
    html: `<div style="background-color:pink;height:100%;"></div>`,
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
    id: '4',
    width: 170,
    height: 240,
    x: 540,
    y: 50,
    type: 'group',
    children: [
      {
        id: '14',
        width: 'auto',
        height: 'auto',
        x: 10,
        y: 10,
        type: 'text',
        html: '<span style="user-select:none;" >我是组合内文本1</span>',
      },
      {
        id: '15',
        width: 'auto',
        height: 'auto',
        x: 20,
        y: 100,
        type: 'text',
        html: '<span style="user-select:none;" >我是组合内文本2</span>',
      },
    ],
  },
  {
    id: '2',
    width: 300,
    height: 148,
    x: 300,
    y: 300,
    type: 'img',
    rotate: 45,
    html: '<img class="online-design-img" src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png"  />',
  },
  {
    id: '3',
    width: 'auto',
    height: 'auto',
    x: 160,
    y: 300,
    rotate: 320,
    type: 'text',
    html: '<span style="user-select:none;" >我是文本我是文本1</span>',
  },
  {
    id: '5',
    width: 'auto',
    height: 'auto',
    rotate: 0,
    x: 80,
    y: 400,
    type: 'text',
    html: '<span >选区操作测试文本-选区操作测试文本</span>',
  },
]
