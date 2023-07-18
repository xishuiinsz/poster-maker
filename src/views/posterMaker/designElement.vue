<template>
  <div class="design-element">
    <el-form class="layer-toolbar">
      <el-form-item>
        <el-input-number v-model="canvasStageStore.scaleRate" :precision="2" @change="scaleChange" :step="scaleStep"
          :max="maxScale" :min="minScale"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button type="primary" @click="fitBtnClick">合适大小</el-button>
          <el-button type="primary" @click="originBtnClick">原始大小</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button @mousedown.prevent @click="fontWeigthClick" type="primary"
            :class="`font-weight-${styleOptions.fontWeight}`">
            B</el-button>
          <el-button @mousedown.prevent @click="fontStyleClick" type="primary"
            :class="`font-style-${styleOptions.fontStyle}`">I</el-button>
          <el-button @mousedown.prevent @click="textDecorationClick"
            :class="`text-decoration-${styleOptions.textDecoration}`" type="primary">U</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item label="字号">
        <el-popover placement="bottom" :width="80" trigger="click">
          <template #reference>
            <el-input style="width: 60px;" @mousedown="fontSizeInputMousedown" @change="fontSizeChange"
              v-model="fontSize" />
          </template>
          <div class="el-select-dropdown">
            <div class="el-scrollbar">
              <div class="el-select-dropdown__wrap el-scrollbar__wrap el-scrollbar__wrap--hidden-default">
                <ul class="el-scrollbar__view el-select-dropdown__list">
                  <li class="el-select-dropdown__item"><span>16</span></li>
                  <li class="el-select-dropdown__item hover"><span>20</span></li>
                  <li class="el-select-dropdown__item"><span>30</span></li>
                  <li class="el-select-dropdown__item"><span>48</span></li>
                  <li class="el-select-dropdown__item"><span>80</span></li>
                </ul>
              </div>
              <div class="el-scrollbar__bar is-horizontal" style="display: none">
                <div class="el-scrollbar__thumb" style="transform: translateX(0%)"></div>
              </div>
              <div class="el-scrollbar__bar is-vertical" style="display: none">
                <div class="el-scrollbar__thumb" style="transform: translateY(0%)"></div>
              </div>
            </div>
          </div>
        </el-popover>
        <el-button-group>
          <el-button type="primary" @mousedown.prevent @click="fontSizeAdd(1)" :icon="Plus" />
          <el-button type="primary" @mousedown.prevent @click="fontSizeAdd(-1)" :icon="Minus" />
        </el-button-group>
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-button type="warning" @mousedown.prevent @click="fontColorChange" :icon="Star" circle />
      </el-form-item>
      <el-form-item label="字体集">
        <el-select @mousedown.prevent.stop @mouseup.prevent.stop @focus="fontFamilyFocus" @change="fontFamilyChange"
          v-model="fontFamily">
          <el-option label="微软雅黑" value="microsoft yahei"></el-option>
          <el-option label="华文黑体" value="STHeiTi"></el-option>
          <el-option label="苹方简体" value="PingFang SC"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="旋转">
        <el-slider :min="0" :max="360" @input="rotateChangeHandler" v-model="rotateLayer" />
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-upload :multiple="false" :show-file-list="false" :on-success="handleSuccess" :before-upload="beforeUpload"
            class="editor-slide-upload" action="https://httpbin.org/post">
            <el-button size="small" type="primary">
              上传图片
            </el-button>
          </el-upload>
          <el-button @click="() => { }" size="small" type="primary">
            裁剪框
          </el-button>
          <el-button @click="() => { }" size="small" type="primary">
            开始裁剪
          </el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button @click="layersGroup" size="small" type="primary">
            组合
          </el-button>
          <el-button @click="layersUngroup" size="small" type="primary">
            解除组合
          </el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button @click="layersSelectAll" size="small" type="primary">
            全选
          </el-button>
          <el-button @click="layersRemove" size="small" type="primary">
            删除
          </el-button>
        </el-button-group>
      </el-form-item>

    </el-form>
  </div>
</template>
<script setup>
import { ref, toRaw, nextTick, unref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useCanvasStageStore, scaleStep, minScale, maxScale } from './useCanvasStage'
import { wzoomModel } from './var.js'
import { v4 as uuidv4 } from 'uuid'
import { Plus, Minus, Star } from '@element-plus/icons-vue';
import {
  getActiveLayers,
  getCanvasLeftTop,
  getLayerItemDomById,
  getLayerItemModelById,
  removeLayerItemModelById,
  getRandomColor
} from './utils/index.js'
import { restoreSelectionRange } from './utils/textLayer.js'
import { regLscCb } from './useLayerSelectChange.js'

const rotateDefault = 0
const canvasStageStore = useCanvasStageStore()
const { updateLayerDataById, getLayerDataById, getLayerTypeById } = canvasStageStore
const rotateLayer = ref(rotateDefault)
const fontSize = ref(14)
const fontFamily = ref('microsoft yahei')
const fontColor = ref('#333')
// 回显元素旋转角度
const echoLayerRotate = (ids) => {
  if (ids.length === 1) {
    const [id] = ids
    const layerData = getLayerDataById(id)
    rotateLayer.value = layerData.rotate
  } else {
    rotateLayer.value = 0
  }
}

// 图层change事件
const selectedLayerChange = (newSelectedIds, oldSelectedIds) => {
  // 回显rotate
  echoLayerRotate(newSelectedIds)
}

// 元素旋转角度change事件
const rotateChangeHandler = (value) => {
  const rawSelectedLayerIds = toRaw(canvasStageStore.selectedLayerIds)
  if (rawSelectedLayerIds.length === 1) {
    const [id] = rawSelectedLayerIds
    const data = { id, rotate: value }
    updateLayerDataById(data)
  }
}
const styleDefault = {
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
}
const styleOptions = reactive({ ...styleDefault })
function fitBtnClick () {
  wzoomModel.instance.prepare()
}
function originBtnClick () {
  wzoomModel.instance.transform(0, 0, 1)
}
function scaleChange (currentValue, oldValue) {
  const { instance } = wzoomModel
  if (currentValue > oldValue) {
    instance.zoomUp()
  } else {
    instance.zoomDown()
  }
}

function fontColorChange () {
  const color = getRandomColor()
  setRangeStyle({ color })
}

// 字体集列表出现|隐藏回调
function fontFamilyFocus (flag) {
  restoreSelectionRange()
}

// 字体集改变事件
function fontFamilyChange (value) {


}

// 字号输入框鼠标按下事件
function fontSizeInputMousedown () { }


// 字号输入框change事件
function fontSizeChange (value) {
  document.getSelection()?.empty()
  setRangeStyle({ fontSize: `${value}px` })
}

// 增加 | 减少 字号
function fontSizeAdd (num) {
  fontSize.value = Number(unref(fontSize)) + num
  setRangeStyle({ fontSize: `${unref(fontSize)}px` })
}

function handleSuccess (response) {
  console.log(response)
  const { file } = response.files
  const img = new Image()
  img.onload = () => {
    console.log(img)
  }
  img.src = file
}
function beforeUpload (file) {
  this.loadingInstance = this.$loading({
    target: this.$el,
  })
}

function getOffsetOfDirection (elementList, direction, minMax) {
  const array = elementList.map((ele) => {
    const value = ele.getBoundingClientRect()[direction]
    return value
  })
  return Math[minMax](...array)
}
// 组合
function layersGroup () {
  const rawSelectedLayerIds = toRaw(canvasStageStore.selectedLayerIds)
  const rawLayerList = toRaw(canvasStageStore.layerList)
  const activeLayers = getActiveLayers()
  if (activeLayers.length > 1) {
    const left = getOffsetOfDirection(activeLayers, 'left', 'min')
    const top = getOffsetOfDirection(activeLayers, 'top', 'min')
    const right = getOffsetOfDirection(activeLayers, 'right', 'max')
    const bottom = getOffsetOfDirection(activeLayers, 'bottom', 'max')
    const width = right - left
    const height = bottom - top
    const { left: leftCanvas, top: topCanvas } = getCanvasLeftTop()
    const xGroup = left - leftCanvas
    const yGroup = top - topCanvas
    const children = []
    const rawScaleRate = toRaw(canvasStageStore.scaleRate)
    layerData.forEach((item) => {
      if (rawSelectedLayerIds.includes(item.id)) {
        const { x, y, ...rest } = item
        const data = {
          x: (x * rawScaleRate - xGroup) / rawScaleRate,
          y: (y * rawScaleRate - yGroup) / rawScaleRate,
          ...rest,
        }
        children.push(data)
      }
    })
    const id = uuidv4()
    const groupLayer = {
      id,
      type: 'group',
      x: xGroup / rawScaleRate,
      y: yGroup / rawScaleRate,
      width: width / rawScaleRate,
      height: height / rawScaleRate,
      children,
    }
    rawSelectedLayerIds.forEach((id) => {
      const index = rawLayerList.findIndex((item) => item.id === id)
      canvasStageStore.layerList.splice(index, 1)
    })
    canvasStageStore.layerList.push(groupLayer)
    nextTick(() => {
      canvasStageStore.selectedLayerIds = [id]
    })
  }
}

// 解除组合
function layersUngroup () {
  const rawSelectedLayerIds = toRaw(canvasStageStore.selectedLayerIds)
  const rawScaleRate = toRaw(canvasStageStore.scaleRate)
  if (rawSelectedLayerIds.length === 1) {
    const [id] = rawSelectedLayerIds
    const rawLayerList = toRaw(canvasStageStore.layerList)
    const layerData = getLayerItemModelById(id, rawLayerList)
    const rotateGroup = layerData.rotate || 0
    if (layerData.type === 'group') {
      const { left: leftCanvas, top: topCanvas } = getCanvasLeftTop()
      const children = layerData.children
      removeLayerItemModelById(id, canvasStageStore.layerList)
      const _children = []
      children.forEach((child) => {
        const { id, width: _width, height: _height, rotate = 0, ...rest } = child
        const _rotate = (rotate + rotateGroup) % 360
        const layerEle = getLayerItemDomById(id)
        const widthElement = parseFloat(getComputedStyle(layerEle).width)
        const heightElement = parseFloat(getComputedStyle(layerEle).height)
        const { left, top, width, height } = layerEle.getBoundingClientRect()
        const xCenter = left + width / 2
        const yCenter = top + height / 2
        const xResult = xCenter - leftCanvas
        const yResult = yCenter - topCanvas
        const data = {
          ...rest,
          id,
          x: xResult / rawScaleRate - widthElement / 2,
          y: yResult / rawScaleRate - heightElement / 2,
          rotate: _rotate,
        }
        _children.push(data)
      })
      canvasStageStore.layerList.push(..._children)
    }
  }
}
// 删除
function layersRemove () {
  const rawSelectedLayerIds = toRaw(canvasStageStore.selectedLayerIds)
  const rawLayerList = toRaw(canvasStageStore.layerList)
  rawSelectedLayerIds.forEach((id) => {
    const index = rawLayerList.findIndex((item) => item.id === id)
    canvasStageStore.layerList.splice(index, 1)
  })
}

function getElementStyles (element) {
  const list = ['fontWeight', 'fontStyle', 'textDecoration']
  list.forEach((el) => {
    if (element.style[el]) {
      Object.assign(styleOptions, { [el]: element.style[el] })
    } else {
      Object.assign(styleOptions, { [el]: styleDefault[el] })
    }
  })
}

function echoStyleBasedOnContainer (element) {
  getElementStyles(element)
}

// 全选
function layersSelectAll () { }
// 选区变化事件
const selectionchangeEvt = (e) => {
  const selection = document.getSelection()
  if (selection.rangeCount) {
    const range = selection?.getRangeAt(0)
    let container
    if (range?.collapsed) {
      if (range.startContainer.nodeType === 1) {
        container = range.startContainer
      }
      if (range.startContainer.nodeType === 3) {
        container = range.startContainer.parentElement
      }
    } else {
      if (range.endContainer.nodeType === 1) {
        container = range.endContainer
      }
      if (range.endContainer.nodeType === 3) {
        container = range.endContainer.parentElement
      }
    }
    echoStyleBasedOnContainer(container)
  }
}
// 设置选区样式
function setRangeStyle (option) {
  const selection = document.getSelection()
  if (selection.rangeCount) {
    const range = selection?.getRangeAt(0)
    if (!range?.collapsed && !!range?.toString()) {
      const container = getContainerBasedOnRange(range)
      if (container) {
        Object.assign((container).style, option)
      } else {
        const textContent = range?.toString()
        const span = document.createElement('span')
        span.innerText = textContent
        Object.assign(span.style, option)
        range.deleteContents()
        range.insertNode(span)
      }
    }
  }
}

function getContainerBasedOnRange (range) {
  const { startOffset, startContainer, endOffset, endContainer, commonAncestorContainer } = range
  if (endContainer.nodeType === 1) {
    const container = commonAncestorContainer.childNodes[endOffset - 1]
    if (container.textContent === range.toString()) {
      return container
    }
  }
  if (commonAncestorContainer === startContainer && commonAncestorContainer === endContainer) {
    if (commonAncestorContainer.textContent === range.toString()) {
      return commonAncestorContainer.parentNode
    }
  }
  return null
}

// 加粗
function fontWeigthClick () {
  const fontWeight = styleOptions.fontWeight === 'normal' ? 'bold' : 'normal'
  setRangeStyle({ fontWeight })
}
// 斜体
function fontStyleClick () {
  const fontStyle = styleOptions.fontStyle === 'normal' ? 'italic' : 'normal'
  setRangeStyle({ fontStyle })
}

// 下划线
function textDecorationClick () {
  const textDecoration = styleOptions.textDecoration === 'none' ? 'underline' : 'none'
  setRangeStyle({ textDecoration })
}

onMounted(() => {
  // 注册选区变化
  document.addEventListener('selectionchange', selectionchangeEvt, true)
  regLscCb(selectedLayerChange)
})
onUnmounted(() => {
  // 注册选区变化
  document.removeEventListener('selectionchange', selectionchangeEvt)
})

</script>
<style lang="scss">
.design-element {
  width: 250px;
  background-color: #263445;
  padding: 0 16px;
  box-sizing: border-box;

  .el-form {
    &.layer-toolbar {
      .el-form-item {
        .el-form-item__label {
          color: #fff;
        }
      }
    }
  }
}

.font-weight-bold {
  >span {
    font-weight: bold;
    color: black;
  }
}

.font-weight-normal {
  >span {
    font-weight: normal;
    color: inherit;
  }
}

.font-style-italic {
  >span {
    font-style: italic;
    color: black;
  }
}

.font-style-normal {
  >span {
    font-style: normal;
    color: inherit;
  }
}

.text-decoration-underline {
  >span {
    text-decoration: underline;
    color: black;
  }
}

.text-decoration-none {
  >span {
    text-decoration: none;
    color: inherit;
  }
}

.el-color-picker__panel {
  pointer-events: initial;
}
</style>
