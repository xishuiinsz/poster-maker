// 图层数据变化回调收口
import { onMounted, onUnmounted, watch, toRaw, nextTick } from 'vue'
export const layerListChangeCb = []
const tempList = []
const userLayerListChange = (list) => {
  const mousedownEvt = (e) => {
    tempList.length = 0
  }

  const mouseupEvt = (e) => {
    setTimeout(() => {
      if (tempList.length) {
        const lastItem = tempList.at(-1)
        computedTempList(lastItem)
      }
    })
  }

  const computedTempList = (newList) => {
    const clonedNewList = structuredClone(newList)
    layerListChangeCb.length &&
      layerListChangeCb.forEach((fun) => {
        typeof fun === 'function' && fun(clonedNewList)
      })
  }

  onMounted(() => {
    watch(
      list,
      (newList, oldList) => {
        const rawNewLayerList = toRaw(newList)
        tempList.push(rawNewLayerList)
      },
      { deep: true, flush: 'post' }
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
