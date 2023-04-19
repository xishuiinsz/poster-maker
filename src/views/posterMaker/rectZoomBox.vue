<template>
  <div
    :style="computedStyle"
    class="rect-zoom-box"
  ></div>
</template>

<script setup lang="ts">
  import { computed } from '@vue/reactivity'
  import { watch, getCurrentInstance, toRaw, reactive } from 'vue'
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
  const generateStyle = () => {
    return { width: 300, height: 400, x: 300, y: 300 }
  }
  const generateStyleData = () => {
    const { width, height, x, y } = generateStyle()
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
</script>
<style lang="scss" scoped>
  .rect-zoom-box {
    position: absolute;
    background-color: green;
  }
</style>
