// 图层数据变化回调收口
import { onMounted, onUnmounted, watch, toRaw } from 'vue'
export const layerListChangeCb = []
const tempList = []
const userLayerListChange = (list) => {
  const mousedownEvt = (e) => {
    tempList.length = 0
    const option = {
      t: Date.now(),
      v: 'mousedown',
    }
    tempList.push(option)
  }
  const computedTempList = (list) => {
    const clonedList = structuredClone(list)
    layerListChangeCb.length &&
      layerListChangeCb.forEach((fun) => {
        typeof fun === 'function' && fun(clonedList)
      })
  }

  const mouseupEvt = (e) => {
    if (tempList.length > 1) {
      const lastItem = tempList.at(-1)
      computedTempList(lastItem.v)
    } else {
      const option = {
        t: Date.now(),
        v: 'mouseup',
      }
      tempList.push(option)
    }
  }
  onMounted(() => {
    watch(
      list,
      (newList, oldList) => {
        const clonedLayerList = toRaw(newList)
        if (tempList.length === 2) {
          const [firstItem, secondItem] = tempList
          if ((firstItem.v = 'mousedown' && secondItem.v === 'mouseup')) {
            computedTempList(clonedLayerList)
            tempList.length = 0
          }
        } else {
          const option = {
            t: Date.now(),
            v: clonedLayerList,
          }
          tempList.push(option)
        }
      },
      { deep: true }
    )
    document.addEventListener('mousedown', mousedownEvt, true)
    document.addEventListener('mouseup', mouseupEvt, true)
  })
  onUnmounted(() => {
    document.removeEventListener('mousedown', mousedownEvt)
    document.removeEventListener('mouseup', mouseupEvt)
  })
}
export default userLayerListChange
