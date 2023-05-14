<template>
  <div class="layer-zoom-box">
    <span
      class="item-line top-line"
      :style="getTopLineStyle"
    ></span>
    <span
      class="item-line right-line"
      :style="getRightLineStyle"
    ></span>
    <span
      class="item-line bottom-line"
      :style="getBottomLineStyle"
    ></span>
    <span
      class="item-line left-line"
      :style="getLeftLineStyle"
    ></span>
    <span
      @mousedown.stop="rmpMousedownEvt"
      :style="getRmpHandlerStyle"
      class="icon-item rmp"
    ></span>
    <span
      @mousedown.stop="bmpMousedownEvt"
      :style="getBmpHandlerStyle"
      class="icon-item bmp"
    ></span>
  </div>
</template>

<script setup lang="ts">
  import { watch, computed, toRaw, reactive, onMounted } from 'vue'
  import { getLayerItemDomById, getDesignWorkbench } from './utils'
  import { useCanvasStageStore } from './useCanvasStage.js'
  const designWorkbench = getDesignWorkbench()
  const canvasStageStore = useCanvasStageStore()
  const { scaleRate } = canvasStageStore
  const props = defineProps({
    selectedLayerIds: {
      type: Array,
      default: () => [],
    },
  })

  const getTopLineStyle = computed(() => {
    return {
      transform: `scale(1, ${1 / scaleRate})`,
    }
  })
  const getRightLineStyle = computed(() => {
    return {
      transform: `scale(${1 / scaleRate}, 1)`,
    }
  })
  const getBottomLineStyle = computed(() => {
    return {
      transform: `scale(1, ${1 / scaleRate})`,
    }
  })
  const getLeftLineStyle = computed(() => {
    return {
      transform: `scale( ${1 / scaleRate}, 1)`,
    }
  })
  const getRmpHandlerStyle = computed(() => {
    return {
      transform: `translate(50%, -50%) scale( ${1 / scaleRate})`,
    }
  })
  const getBmpHandlerStyle = computed(() => {
    return {
      transform: `translate(-50%, 50%) scale( ${1 / scaleRate})`,
    }
  })
  const emits = defineEmits(['updateLayerOption'])

  const mousedownEvt = () => {
    designWorkbench.addEventListener('mousemove', mousemoveEvt, true)
    designWorkbench.addEventListener('mouseup', mouseupEvt, true)
  }
  // 鼠标移动事件
  const mousemoveEvt = (e) => {
    emits('updateLayerOption', { x: e.movementX, y: e.movementY })
  }
  // 鼠标释放事件
  const mouseupEvt = (e) => {
    designWorkbench.removeEventListener('mousemove', mousemoveEvt, true)
    designWorkbench.removeEventListener('mouseup', mouseupEvt, true)
  }

  // 右中点鼠标按下事件
  const rmpMousedownEvt = (e) => {
    designWorkbench.addEventListener('mousemove', rmpMousemoveEvt, true)
    designWorkbench.addEventListener('mouseup', rmpMouseupEvt, true)
  }
  // 右中点鼠标移动事件
  const rmpMousemoveEvt = (e) => {
    emits('updateLayerOption', { width: e.movementX })
  }
  // 右中点鼠标释放事件
  const rmpMouseupEvt = (e) => {
    designWorkbench.removeEventListener('mousemove', rmpMousemoveEvt, true)
    designWorkbench.removeEventListener('mouseup', rmpMouseupEvt, true)
  }
  // 底中点鼠标按下事件
  const bmpMousedownEvt = (e) => {
    designWorkbench.addEventListener('mousemove', bmpMousemoveEvt, true)
    designWorkbench.addEventListener('mouseup', bmpMouseupEvt, true)
  }
  // 底中点鼠标移动事件
  const bmpMousemoveEvt = (e) => {
    emits('updateLayerOption', { height: e.movementY })
  }
  // 底中点鼠标释放事件
  const bmpMouseupEvt = (e) => {
    designWorkbench.removeEventListener('mousemove', bmpMousemoveEvt, true)
    designWorkbench.removeEventListener('mouseup', bmpMouseupEvt, true)
  }
  onMounted(() => {
    designWorkbench.addEventListener('mousedown', mousedownEvt, true)
  })
</script>
<style lang="scss" scoped>
  $handlerSize1: 20px;
  $handlerSize2: 8px;
  .layer-zoom-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    // outline: 1px solid #2932e1;
    cursor: default;
    .item-line {
      background-color: #2932e1;
      position: absolute;
      &.top-line {
        left: 0;
        top: -1px;
        width: 100%;
        height: 2px;
      }
      &.right-line {
        right: -1px;
        top: 0;
        width: 2px;
        height: 100%;
      }
      &.bottom-line {
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
      }
      &.left-line {
        left: -1px;
        top: 0;
        width: 2px;
        height: 100%;
      }
    }
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
        cursor: ew-resize;
      }
      &.bmp {
        height: $handlerSize2;
        width: $handlerSize1;
        bottom: 0;
        left: 50%;
        cursor: ns-resize;
      }
    }
  }
</style>
