// 图层选中总入口 lsc=Layer Select Change
import { onUnmounted, watch, toRaw, onMounted } from 'vue'

const changeCbList = []

// 注册LSC回调
export const regLscCb = (cb) => {
  !changeCbList.includes(cb) && changeCbList.push(cb)
}

// 反注册LSC回调
export const unregLscCb = (cb) => {
  const index = changeCbList.findIndex((fun) => fun === cb)
  if (index > -1) {
    changeCbList.splice(index, 1)
  }
}

// 初始化监听图层选择数据
const initLscWatch = (data) => {
  let stopWatch
  stopWatch = watch(
    () => [...data.selectedLayerIds],
    (newSelectedLayers, oldSelectedLayers) => {
      changeCbList.forEach((fun) => {
        typeof fun === 'function' && fun(newSelectedLayers, oldSelectedLayers)
      })
    },
    { deep: true, flush: 'post' }
  )

  onUnmounted(() => {
    typeof stopWatch === 'function' && stopWatch()
  })
}
export default initLscWatch
