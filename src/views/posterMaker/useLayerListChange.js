// 图层数据变化回调收口
import { onUnmounted, watch, toRaw } from 'vue'
import { getAncestorByClass } from './utils/index.js'
const cacheData = {
  flagMouseDown: false,
}
export const layerListChangeCb = []
// 注册change回调
export const registerChangeCb = (changeCb) => {
  if (!layerListChangeCb.includes(changeCb)) {
    layerListChangeCb.push(changeCb)
  }
}
// 反注册change回调
export const unregisterChangeCb = (changeCb) => {
  const index = layerListChangeCb.findIndex((fun) => fun === changeCb)
  if (index > -1) {
    layerListChangeCb.splice(index, 1)
  }
}

const tempList = []

const mousedownEvt = (e) => {
  Object.assign(cacheData, { flagMouseDown: true })
}

const mouseupEvt = (e) => {
  setTimeout(() => {
    if (tempList.length) {
      const lastItem = tempList.at(-1)
      callbackStart(lastItem)
      tempList.length = 0
    }
    Object.assign(cacheData, { flagMouseDown: false })
  })
}

export const callbackStart = (newList) => {
  const clonedNewList = structuredClone(newList)
  layerListChangeCb.length &&
    layerListChangeCb.forEach((fun) => {
      typeof fun === 'function' && fun(clonedNewList)
    })
}

const userLayerListChange = (list) => {
  watch(
    list,
    (newList, oldList) => {
      const rawNewLayerList = toRaw(newList)
      if (!cacheData.flagMouseDown) {
        callbackStart(rawNewLayerList)
      } else {
        tempList.push(rawNewLayerList)
      }
    },
    { deep: true, flush: 'post' }
  )
  document.addEventListener('mousedown', mousedownEvt, true)
  document.addEventListener('mouseup', mouseupEvt, true)

  onUnmounted(() => {
    document.removeEventListener('mousedown', mousedownEvt)
    document.removeEventListener('mouseup', mouseupEvt)
  })
}
export default userLayerListChange
