// 图层数据变化回调收口
import { onUnmounted, watch, toRaw } from 'vue'
const keyEvtHub = {
  // 形如：  'ctrl+a': ()=>{},
}
export const layerListChangeCb = []
// 注册keyup回调
export const regKeyupCb = (keyCode, cb) => {
  Object.assign(keyEvtHub, { [keyCode]: cb })
}
// 反注册keyup回调
export const unregKeyupCb = (keyCode) => {
  Object.assign(keyEvtHub, { [keyCode]: null })
}

const keyupEvt = (e) => {
  if (e.ctrlKey) {
    const keyCode = e.key.toLowerCase()
    const fun = keyEvtHub[`ctrl_${keyCode}`]
    typeof fun === 'function' && fun(e)
  }
}

const regKeyboardEvent = () => {
  document.addEventListener('keyup', keyupEvt, true)

  onUnmounted(() => {
    document.removeEventListener('keyup', keyupEvt)
  })
}
export default regKeyboardEvent
