<template>
  <div class="online-design-general-container">
    <div
      ref="designWorkbench"
      class="design-workbench-container"
    >
      <div class="drawing-board-container">
        <div class="drawing-canvas-container">
          <div
            class="drawing-canvas"
            :style="stageStyle"
          >
            <template
              v-for="layer in layerList"
              :key="layer.id"
            >
              <div
                :data-layer-id="layer.id"
                :class="getLayerItemClass(layer)"
                class="layer-item"
                :style="getLayerStyle(layer)"
                v-html="layer.html"
              ></div>
            </template>
          </div>
        </div>
        <rectZoomBox ref="refRectZoomBox" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="PosterMaker">
  import { onMounted, reactive, ref, computed, watch } from 'vue'
  import WZoom from './vanilla-js-wheel-zoom/wheel-zoom'
  import { getAncestorByClass, getLayerItemModelById, generateRectOperateBox } from './utils.js'
  import { layerList, wzoomModel, selectedLayerIds } from './var.js'
  import { useSidebarStore, minScale, maxScale } from './useCanvasStage.js'
  import rectZoomBox from './rectZoomBox.vue'
  import { registerEvt } from './mouseEvent'
  const { scaleChange } = useSidebarStore()
  const designWorkbench = ref(null)
  const refRectZoomBox = ref(null)
  const stageSize = reactive({
    width: 800,
    height: 600,
  })
  const activeLayerList = reactive(layerList)
  watch(selectedLayerIds, (newVal, oldval) => {
    console.log(newVal)
  })
  const stageStyle = computed(() => {
    const { width, height } = stageSize
    return {
      width: `${width}px`,
      height: `${height}px`,
    }
  })

  function getLayerItemClass(layer) {
    let className = `layer-${layer.type}`
    if (activeLayerList.map((item) => item.layerId).includes(layer.id)) {
      className += ' is-active'
    }
    return className
  }

  function getLayerStyle(item) {
    const { width, height, x, y } = item
    return {
      width: width > 0 ? `${width}px` : 'fit-content',
      height: height > 0 ? `${height}px` : 'fit-content',
      left: `${x}px`,
      top: `${y}px`,
    }
  }

  function init(content) {
    wzoomModel.instance = WZoom.create(content, {
      type: 'html',
      maxScale: maxScale,
      width: stageSize.width,
      height: stageSize.height,
      zoomOnClick: false,
      dragScrollableOptions: {
        onGrab: () => {
          content.parentElement.style.cursor = 'grabbing'
        },
        onDrop: () => {
          console.log('onDrop')

          content.parentElement.style.cursor = 'default'
        },
      },
      prepare: (instance) => {
        scaleChange(instance.content.minScale)
      },
      rescale: (instance) => {
        scaleChange(instance.content.minScale)
      },
    })

    window.addEventListener('resize', function () {
      wzoomModel.instance.prepare()
    })
  }

  function observeEleStyleMutation(el) {
    let observer = new MutationObserver((mutations) => {
      console.log(mutations)
    })
    observer.observe(el, { attributes: true, attributeFilter: ['style'] })
  }

  onMounted(() => {
    if (designWorkbench.value) {
      const drawingCanvas = designWorkbench.value.querySelector('.drawing-canvas-container')
      init(drawingCanvas)
      registerEvt(designWorkbench.value)
    }
  })
</script>
<style src="./style.scss" lang="scss" scoped></style>
