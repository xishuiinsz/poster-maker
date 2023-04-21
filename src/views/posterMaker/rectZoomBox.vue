<template>
  <div
    :style="computedStyle"
    class="rect-zoom-box"
    @mousedown.self="mousedownEvt"
  ></div>
</template>

<script setup lang="ts">
  import { watch, computed, toRaw, reactive } from 'vue'
  import { getLayerItemDomById } from './utils'
  const styleData = reactive({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  })
  const computedStyle = computed(() => {
    const { width, height, x, y } = styleData
    return {
      width: `${width}px`,
      height: `${height}px`,
      left: `${x}px`,
      top: `${y}px`,
    }
  })
  function computedZoomBoxStyle(elmentList) {
    console.log(elmentList)
  }
  const props = defineProps({
    selectedLayerIds: {
      type: Array,
      default: () => [],
    },
  })
  defineExpose({
    computedZoomBoxStyle,
  })
  const emits = defineEmits(['updatePosition'])
  const generateStyle = () => {
    return { width: 300, height: 400, x: 300, y: 300 }
  }
  const generateStyleData = () => {
    const layerItemDom = getLayerItemDomById(props.selectedLayerIds[0])
    const { x, y, width, height } = layerItemDom.getBoundingClientRect()
    Object.assign(styleData, { width, height, x, y })
  }
  watch(
    () => props.selectedLayerIds,
    (newVal, oldval) => {
      if (toRaw(newVal).length) {
        generateStyleData()
      }
    }
  )
  generateStyleData()
  // 鼠标按下事件
  const mousedownEvt = (e) => {
    document.addEventListener('mousemove', mousemoveEvt)
    document.addEventListener('mouseup', mouseupEvt)
  }
  // 鼠标移动事件
  const mousemoveEvt = (e) => {
    styleData.x += e.movementX
    styleData.y += e.movementY
    emits('updatePosition', { offsetX: e.movementX, offsetY: e.movementY })
  }
  // 鼠标释放事件
  const mouseupEvt = (e) => {
    document.removeEventListener('mousemove', mousemoveEvt)
    document.removeEventListener('mouseup', mouseupEvt)
  }
</script>
<style lang="scss" scoped>
  .rect-zoom-box {
    position: absolute;
    outline: 1px solid #2932e1;
  }
</style>
