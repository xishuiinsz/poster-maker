<template>
  <div
    :style="computedStyle"
    class="rect-zoom-box"
    @mousedown.stop="mousedownEvt"
  >
    <span
      @mousedown.stop="rmpMousedownEvt"
      class="icon-item rmp"
    ></span>
    <span
      @mousedown.stop="bmpMousedownEvt"
      class="icon-item bmp"
    ></span>
  </div>
</template>

<script setup lang="ts">
  import { watch, computed, toRaw, reactive, onMounted } from 'vue'
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

  const props = defineProps({
    selectedLayerIds: {
      type: Array,
      default: () => [],
    },
  })

  const emits = defineEmits(['updateLayerOption'])

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
        mousedownEvt()
      }
    }
  )
  generateStyleData()
  // 鼠标按下事件
  const mousedownEvt = () => {
    document.addEventListener('mousemove', mousemoveEvt)
    document.addEventListener('mouseup', mouseupEvt)
  }
  // 鼠标移动事件
  const mousemoveEvt = (e) => {
    styleData.x += e.movementX
    styleData.y += e.movementY
    emits('updateLayerOption', { x: e.movementX, y: e.movementY })
  }
  // 鼠标释放事件
  const mouseupEvt = (e) => {
    document.removeEventListener('mousemove', mousemoveEvt)
    document.removeEventListener('mouseup', mouseupEvt)
  }

  // 右中点鼠标按下事件
  const rmpMousedownEvt = (e) => {
    document.addEventListener('mousemove', rmpMousemoveEvt)
    document.addEventListener('mouseup', rmpMouseupEvt)
  }
  // 右中点鼠标移动事件
  const rmpMousemoveEvt = (e) => {
    Object.assign(styleData, {
      width: styleData.width + e.movementX,
    })
    emits('updateLayerOption', { width: e.movementX })
  }
  // 右中点鼠标释放事件
  const rmpMouseupEvt = (e) => {
    document.removeEventListener('mousemove', rmpMousemoveEvt)
    document.removeEventListener('mouseup', rmpMouseupEvt)
  }
  // 底中点鼠标按下事件
  const bmpMousedownEvt = (e) => {
    document.addEventListener('mousemove', bmpMousemoveEvt)
    document.addEventListener('mouseup', bmpMouseupEvt)
  }
  // 底中点鼠标移动事件
  const bmpMousemoveEvt = (e) => {
    Object.assign(styleData, {
      height: styleData.height + e.movementY,
    })
    emits('updateLayerOption', { height: e.movementY })
  }
  // 底中点鼠标释放事件
  const bmpMouseupEvt = (e) => {
    document.removeEventListener('mousemove', bmpMousemoveEvt)
    document.removeEventListener('mouseup', bmpMouseupEvt)
  }

  onMounted(() => {
    mousedownEvt()
  })
</script>
<style lang="scss" scoped>
  $handlerSize1: 20px;
  $handlerSize2: 8px;
  .rect-zoom-box {
    position: absolute;
    outline: 1px solid #2932e1;
    .icon-item {
      display: inline-block;
      border: 2px solid #2932e1;
      border-radius: 8px;
      position: absolute;
      box-sizing: border-box;
      &.rmp {
        height: $handlerSize1;
        width: $handlerSize2;
        right: 0;
        top: 50%;
        transform: translate(50%, -50%);
        cursor: ew-resize;
      }
      &.bmp {
        height: $handlerSize2;
        width: $handlerSize1;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 50%);
        cursor: ns-resize;
      }
    }
  }
</style>
