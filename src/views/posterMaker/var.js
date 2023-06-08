import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'
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
    x: 350,
    y: 100,
    rotate: 40,
    type: 'svg',
    html: `
      <svg viewBox="0,0,300,100" class="online-design-svg" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <rect width="300" height="100" style="fill:white;stroke-width:1;stroke:rgb(0,0,0)" />
      </svg>
      `,
  },
  {
    id: '2',
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
    id: '3',
    width: 300,
    height: 148,
    x: 500,
    y: 300,
    type: 'img',
    rotate: 45,
    html: '<img class="online-design-img" src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png"  />',
  },
  {
    id: '4',
    width: 220,
    height: 184.879,
    x: 80.0974,
    y: 258.347,
    rotate: 32,
    type: 'group',
    children: [
      {
        id: '41',
        width: 'auto',
        height: 'auto',
        x: 79.9026,
        y: 41.6533,
        rotate: 320,
        type: 'text',
        html: '<span style="user-select:none;" >我是文本我是文本1</span>',
      },
      {
        id: '42',
        width: 'auto',
        height: 'auto',
        rotate: 0,
        x: -0.0974366,
        y: 141.653,
        rotate: 20,
        type: 'text',
        html: '<span >选区操作测试文本</span>',
      },
    ],
  },
  {
    id: '79165b99-164f-43c9-99cb-8728e0087034',
    width: 200,
    height: 'auto',
    x: 72,
    y: 36,
    type: 'text',
    html: '<span style="user-select:none;" >你好，《在线海报》欢迎您！</span>',
  },
]
