<template>
  <div @click.stop @mousedown.stop @mouseup.stop :data-layer-id="layerData.id" :class="getLayerItemClass(layerData)"
    class="layer-item" :style="getLayerStyle(layerData)">
    <div class="layer-element" style="outline: none;" :class="layerElementClassName" ref="refLayerElement"
      v-html="layerData.html" @mousemove.stop></div>
    <layerZoomBox v-bind="propsToLayZoomBox" @layerZoomBoxMouseupEvt="layerZoomBoxMouseupHandler"
      @rbpResize="rbpResizeHandler" />
  </div>
</template>
<script setup>
import { ref, nextTick } from 'vue'
import { useCanvasStageStore } from '../useCanvasStage.js'
import { getAncestorByClass, isAncestorElement } from '../utils/index.js'
import layerZoomBox from '../layerZoomBox.vue'
import { toolbar, fontFamilyFormats } from './richText'
const refLayerElement = ref(null)
const canvasStageStore = useCanvasStageStore()
const cacheData = {

}
const props = defineProps({
  layerData: {
    type: Object,
    default: () => { },
  },
})
const layerElementClassName = ref('')
const propsToLayZoomBox = {
  id: props.layerData.id,
  type: props.layerData.type,
}

function blurEvt (e) {
  if (e.relatedTarget && window.tinymce?.activeEditor?.container) {
    const editor = window.tinymce.activeEditor.container
    const flag = isAncestorElement(e.relatedTarget, editor)
    if (flag) {
      return
    }
  }
  Object.assign(cacheData.zoomBox.style, { pointerEvents: 'auto' })
  // 清除tinymce实例
  window.tinymce.remove()
}

function renderTinymcd (target) {
  window.tinymce.init({
    target,
    inline: true,
    promotion: false,
    menubar: false,
    toolbar,
    branding: false,
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

function getLayerStyle (item) {
  const { width, height, x, y, rotate } = item
  return {
    width: width > 0 ? `${width}px` : width === '100%' ? '100%' : 'fit-content',
    height: height > 0 ? `${height}px` : height === '100%' ? '100%' : 'fit-content',
    transform: rotate ? `rotate(${rotate}deg)` : `rotate(0deg)`,
    left: `${x}px`,
    top: `${y}px`,
  }
}

// 文本图层点击事件
function textLayerClickEvt ({ target }) {
  const layerElement = getAncestorByClass(target, 'layer-element')
  renderTinymcd(layerElement)
  setTimeout(() => {
    layerElement.focus()
  })
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
  Object.assign(cacheData.zoomBox.style, { pointerEvents: 'auto' })
  if (e.relatedTarget && window.tinymce?.activeEditor?.container) {
    const editor = window.tinymce.activeEditor.container
    const flag = isAncestorElement(e.relatedTarget, editor)
    if (flag) {
      return
    }
  }
  // 清除tinymce实例
  window.tinymce.remove()
  unregTextLayerBlurEvt
  const el = refLayerElement.value
  el.removeAttribute('id')
}

// 注册文本图层失焦事件
function regTextLayerBlurEvt () {
  const el = refLayerElement.value
  el.addEventListener('blur', textLayerBlurEvt, true)
}
// 反注册文本图层失焦事件
function unregTextLayerBlurEvt () {
  const el = refLayerElement.value
  el.removeEventListener('blur', textLayerBlurEvt)
}

function layerZoomBoxMouseupHandler (target) {
  Object.assign(cacheData, {
    zoomBox: target
  })
  Object.assign(cacheData.zoomBox.style, { pointerEvents: 'none' })
  regTextLayerClickEvt()
}

function rbpResizeHandler ({ x: offsetX, y: offsetY }) {
  const text = refLayerElement?.value.firstChild
  if (offsetX > 0 && offsetY > 0) {
    let fontSize = text.style.fontSize ? parseFloat(text.style.fontSize) : 16
    fontSize += 0.3
    Object.assign(text.style, { fontSize: `${fontSize}px` })
  }
  if (offsetX < 0 && offsetY < 0) {
    let fontSize = text.style.fontSize ? parseFloat(text.style.fontSize) : 16
    fontSize -= 0.3
    Object.assign(text.style, { fontSize: `${fontSize}px` })
  }
}

</script>
<style lang="scss" scoped>
.layer-text {
  white-space: nowrap;

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


    &.content-editable {
      :deep(.layer-zoom-box:not(.multi-layers-selected)) {
        pointer-events: none;

        .icon-item {
          pointer-events: initial;
        }
      }
    }
  }

  .layer-element {
    white-space: pre-wrap;
    user-select: none;
    cursor: default;
    -webkit-user-modify: read-write-plaintext-only;
  }
}
</style>
