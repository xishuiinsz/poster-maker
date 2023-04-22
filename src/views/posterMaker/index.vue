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
        <Teleport to="body">
          <rectZoomBox
            v-if="canvasStageStore.selectedLayerIds.length"
            :selectedLayerIds="canvasStageStore.selectedLayerIds"
            ref="refRectZoomBox"
            @updateLayerOption="updateLayerOptionHandler"
          />
        </Teleport>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="PosterMaker">
  import { onMounted, reactive, ref, computed, watch } from 'vue'
  import WZoom from './vanilla-js-wheel-zoom/wheel-zoom'
  import { getAncestorByClass, getLayerItemModelById, generateRectOperateBox } from './utils.js'
  import { layerData, wzoomModel } from './var.js'
  import { useCanvasStageStore, minScale, maxScale } from './useCanvasStage.js'
  import rectZoomBox from './rectZoomBox.vue'
  import { registerEvt } from './mouseEvent'
  const canvasStageStore = useCanvasStageStore()
  const { scaleChange, scaleRate } = canvasStageStore
  const designWorkbench = ref(null)
  const refRectZoomBox = ref(null)
  const stageSize = reactive({
    width: 800,
    height: 600,
  })
  const layerList = reactive(layerData)
  const stageStyle = computed(() => {
    const { width, height } = stageSize
    return {
      width: `${width}px`,
      height: `${height}px`,
    }
  })

  function getLayerItemClass(layer) {
    let className = `layer-${layer.type}`
    if (canvasStageStore.selectedLayerIds.includes(layer.id)) {
      className += ' is-active'
    }
    return className
  }

  function getLayerStyle(item) {
    const { width, height, x, y } = item
    return {
      width: width > 0 ? `${width}px` : width === '100%' ? '100%' : 'fit-content',
      height: height > 0 ? `${height}px` : height === '100%' ? '100%' : 'fit-content',
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
        console.log('prepare')
        scaleChange(instance.content.minScale)
      },
      rescale: (instance) => {
        canvasStageStore.selectedLayerIds.length = 0
        scaleChange(instance.content.currentScale)
      },
    })

    window.addEventListener('resize', function () {
      wzoomModel.instance.prepare()
    })
  }
  const updateLayerOptionHandler = ({ x = 0, y = 0, width = 0, height = 0 }) => {
    canvasStageStore.selectedLayerIds.forEach((id: string) => {
      const layerItemModel = getLayerItemModelById(id, layerList)
      if (layerItemModel) {
        layerItemModel.x += x / canvasStageStore.scaleRate
        layerItemModel.y += y / canvasStageStore.scaleRate
        layerItemModel.width += width / canvasStageStore.scaleRate
        layerItemModel.height += height / canvasStageStore.scaleRate
      }
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
