<template>
  <div @click.stop @mousedown.stop @mouseup.stop :data-layer-id="layerData.id" :class="getLayerItemClass(layerData)"
    class="layer-item" :style="getLayerCommonStyle">
    <div class="layer-element" :style="getLayerElementStyle" style="display: grid;" :class="layerElementClassName"
      ref="refLayerElement" v-html="layerData.html" @mousemove.stop></div>
    <layerZoomBox v-bind="propsToLayZoomBox" @layerZoomBoxMouseupEvt="layerZoomBoxMouseupHandler"
      @rbpMousedown="rbpMousedownEvt" />
  </div>
</template>
<script setup>
import { ref, computed, toRaw, onMounted } from 'vue'
import { useCanvasStageStore } from '../useCanvasStage.js'
import { getAncestorByClass, isAncestorElement, getLayerItemDomById, getTransformScaleValues, setTransformScaleValues } from '../utils/index.js'
import { lineHeightDefault } from '../utils/textLayer'
import layerZoomBox from '../layerZoomBox.vue'
import { toolbar, fontFamilyFormats } from './richText'
import { getTextLayerHtmlById } from '../utils/textLayer.js'
const refLayerElement = ref(null)
const canvasStageStore = useCanvasStageStore()
const { updateLayerDataById, silentUpdateLayerDataById } = canvasStageStore
const cacheData = {

}
const props = defineProps({
  layerData: {
    type: Object,
    default: () => { },
  },
})
// 图层缩放值
const scaleLayer = ref(1)
const layerElementClassName = ref('')
const propsToLayZoomBox = {
  id: props.layerData.id,
  type: props.layerData.type,
}
const getLayerElementStyle = computed(() => {
  const { width, height, x, y, rotate } = props.layerData
  return {
    width: isNaN(width) ? width : `${width}px`,
    height: isNaN(height) ? height : `${height}px`,
  }

})
function renderTinymcd (target) {
  tinymce.init({
    target,
    inline: true,
    promotion: false,
    menubar: false,
    width: 600,
    toolbar,
    branding: false,
    auto_focus: true,
    language: 'zh-Hans',
    font_size_formats: '11px 12px 14px 16px 18px 24px 36px 48px 56px 72px',
    font_family_formats: fontFamilyFormats,
    valid_elements: 'p[style],strong,em,span[style],a[href],ul,ol,li',
    valid_styles: {
      '*': 'font-size,font-family,color,text-decoration,text-align'
    },
    init_instance_callback: function (editor) {
      // 编辑器完成初始化后取消监听文本图层的点击事件
      unregTextLayerClickEvt()
      // 编辑器完成初始化后监听文本图层的失焦事件
      regTextLayerBlurEvt()
    },
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',
  });
}

function getLayerItemClass (layer) {
  let className = `layer-${layer.type}`
  if (canvasStageStore.selectedLayerIds.includes(layer.id)) {
    className += ' is-active'
  }
  return className
}

const getLayerCommonStyle = computed(() => {
  const { width, height, x, y, rotate } = props.layerData
  return {
    transform: rotate ? `rotate(${rotate}deg)` : `rotate(0deg)`,
    left: `${x}px`,
    top: `${y}px`,
  }
})

// 文本图层点击事件
function textLayerClickEvt ({ target }) {
  const layerElement = getAncestorByClass(target, 'layer-element')
  renderTinymcd(layerElement)
}

// 注册文本图层点击事件
function regTextLayerClickEvt () {
  const el = refLayerElement.value
  el.addEventListener('click', textLayerClickEvt)
}

// 反注册文本图层点击事件
function unregTextLayerClickEvt () {
  const el = refLayerElement.value
  el.removeEventListener('click', textLayerClickEvt)
}


// 文本图层失焦事件
function textLayerBlurEvt (e) {
  // 如果点击范围在tinymce工具栏上
  if (e.relatedTarget && tinymce?.activeEditor?.container) {
    const editor = tinymce.activeEditor.container
    const flag = isAncestorElement(e.relatedTarget, editor)
    if (flag) {
      return
    }
  }

  // 清除tinymce实例
  tinymce.remove()
  unregTextLayerBlurEvt
  const el = refLayerElement.value
  const layerCommon = getAncestorByClass(el, 'layer-text')
  layerCommon instanceof HTMLDivElement && layerCommon.classList.remove('layer-item-focus-in')
  el.removeAttribute('id')
  const { id, html } = props.layerData
  const htmlNew = getTextLayerHtmlById(id)
  htmlNew !== html && updateLayerDataById({ id, html: htmlNew })
}

// 注册文本图层失焦事件
function regTextLayerBlurEvt () {
  const el = refLayerElement.value
  el.addEventListener('focusout', textLayerBlurEvt, true)
}
// 反注册文本图层失焦事件
function unregTextLayerBlurEvt () {
  const el = refLayerElement.value
  el.removeEventListener('blur', textLayerBlurEvt)
}

function layerZoomBoxMouseupHandler (target) {
  const layerCommon = getAncestorByClass(target, 'layer-item')
  layerCommon instanceof HTMLDivElement && layerCommon.classList.add('layer-item-focus-in')
  regTextLayerClickEvt()
}
// 右下点 鼠标按下事件
function rbpMousedownEvt (e) {
  document.addEventListener('mousemove', rbpResizeHandler)
  document.addEventListener('mouseup', rbpMouseUpHandler, true)
  const { width, height, id } = props.layerData
  const rootEle = getLayerItemDomById(id)
  Object.assign(rootEle.style, { 'transform-origin': '0 0' })
  Object.assign(cacheData, {
    aspectRate: width / height,
    rootEle
  })
}

// 鼠标 移动事件
function rbpResizeHandler ({ movementX, movementY }) {
  const rawScaleRate = toRaw(canvasStageStore.scaleRate)
  const { width, id, height } = props.layerData
  const _width = width * rawScaleRate
  const scale = movementX / _width
  const currentScale = getTransformScaleValues(cacheData.rootEle).x
  const scaleTotal = parseFloat(scale) + parseFloat(currentScale)
  setTransformScaleValues(cacheData.rootEle, { x: scaleTotal, y: scaleTotal })
}

// 鼠标 释放事件
function rbpMouseUpHandler () {
  document.removeEventListener('mouseup', rbpMouseUpHandler)
  document.removeEventListener('mousemove', rbpResizeHandler)
  // Object.assign(cacheData.rootEle.style, { 'transform-origin': 'center center' })
  const scale = getTransformScaleValues(cacheData.rootEle).x;
  const { width, id, height } = props.layerData
  const _width = width * scale
  const _height = height * scale
  setTransformScaleValues(cacheData.rootEle, { x: 1, y: 1 })
  updateLayerDataById({ id, width: _width, height: _height })

}
onMounted(() => { })
</script>
<style lang="scss" scoped>
.layer-text {
  white-space: nowrap;
  line-height: 28px;

  &.is-active {
    .layer-element {

      outline: none;


    }


    :deep(.layer-zoom-box) {
      .icon-item {
        &.bmp {
          display: none !important;
        }
      }
    }
  }

  &.layer-item-focus-in {
    .layer-zoom-box {
      pointer-events: none;
    }
  }

  .layer-element {
    white-space: pre-wrap;
    user-select: none;
    cursor: default;
    line-height: 1.2;
  }
}

:focus-visible {
  outline: 0;
}
</style>
