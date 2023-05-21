<template>
  <div
    class="design-element"
    @mousedown.prevent
  >
    <el-form class="layer-toolbar">
      <el-form-item>
        <el-input-number
          v-model="canvasStageStore.scaleRate"
          :precision="2"
          @change="scaleChange"
          :step="scaleStep"
          :max="maxScale"
          :min="minScale"
        ></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button
            type="primary"
            @click="fitBtnClick"
            >合适大小</el-button
          >
          <el-button
            type="primary"
            @click="originBtnClick"
            >原始大小</el-button
          >
        </el-button-group>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button
            @click="fontWeigthClick"
            type="primary"
            :class="`font-weight-${styleOptions.fontWeight}`"
          >
            B</el-button
          >
          <el-button
            @click="fontStyleClick"
            type="primary"
            :class="`font-style-${styleOptions.fontStyle}`"
            >I</el-button
          >
          <el-button
            @click="textDecorationClick"
            :class="`text-decoration-${styleOptions.textDecoration}`"
            type="primary"
            >U</el-button
          >
        </el-button-group>
      </el-form-item>
      <el-form-item label="旋转">
        <el-slider
          :min="0"
          :max="360"
          v-model="rotateLayer"
        />
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-upload
            :multiple="false"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            class="editor-slide-upload"
            action="https://httpbin.org/post"
          >
            <el-button
              size="small"
              type="primary"
            >
              上传图片
            </el-button>
          </el-upload>
          <el-button
            @click="() => {}"
            size="small"
            type="primary"
          >
            裁剪框
          </el-button>
          <el-button
            @click="() => {}"
            size="small"
            type="primary"
          >
            开始裁剪
          </el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button
            @click="layersGroup"
            size="small"
            type="primary"
          >
            组合
          </el-button>
          <el-button
            @click="layersUngroup"
            size="small"
            type="primary"
          >
            解除组合
          </el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button
            @click="layersSelectAll"
            size="small"
            type="primary"
          >
            全选
          </el-button>
          <el-button
            @click="layersRemove"
            size="small"
            type="primary"
          >
            删除
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
  import { ref, toRaw, nextTick, computed, reactive } from 'vue'
  import { useCanvasStageStore, scaleStep, minScale, maxScale } from './useCanvasStage'
  import { wzoomModel, layerData } from './var.js'
  import { v4 as uuidv4 } from 'uuid'
  import {
    getActiveLayers,
    getCanvasLeftTop,
    getLayerItemDomById,
    getLayerItemModelById,
    removeLayerItemModelById,
    updateLayerItemById,
  } from './utils.js'
  const canvasStageStore = useCanvasStageStore()
  const { layerList, scaleRate } = canvasStageStore
  const rotateLayer = computed({
    get() {
      let rotate = 0
      const rawSelectedLayerIds = toRaw(canvasStageStore.selectedLayerIds)
      const rawLayerList = toRaw(canvasStageStore.layerList)
      if (rawSelectedLayerIds.length === 1) {
        const [id] = rawSelectedLayerIds
        const layerData = getLayerItemModelById(id, rawLayerList)
        if (layerData) {
          if (layerData.rotate) {
            rotate = layerData.rotate
          }
        }
      }
      return rotate
    },
    set(value) {
      console.log(value)
      const rawSelectedLayerIds = toRaw(canvasStageStore.selectedLayerIds)
      if (rawSelectedLayerIds.length === 1) {
        const [id] = rawSelectedLayerIds
        const data = { id, rotate: value }
        updateLayerItemById(data, canvasStageStore.layerList)
      }
    },
  })
  const styleDefault = {
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
  }
  const styleOptions = reactive({ ...styleDefault })
  function fitBtnClick() {
    wzoomModel.instance.prepare()
  }
  function originBtnClick() {
    wzoomModel.instance.transform(0, 0, 1)
  }
  function scaleChange(currentValue, oldValue) {
    const { instance } = wzoomModel
    if (currentValue > oldValue) {
      instance.zoomUp()
    } else {
      instance.zoomDown()
    }
  }

  // rotate 实时变化
  function rotateInputEvt(rotate: number) {
    const rawSelectedLayerIds = toRaw(canvasStageStore.selectedLayerIds)
    if (rawSelectedLayerIds.length === 1) {
      const [id] = rawSelectedLayerIds
      const data = { id, rotate }
      updateLayerItemById(data, canvasStageStore.layerList)
    }
  }
  function handleSuccess(response) {
    console.log(response)
    const { file } = response.files
    const img = new Image()
    img.onload = () => {
      console.log(img)
    }
    img.src = file
  }
  function beforeUpload(file) {
    this.loadingInstance = this.$loading({
      target: this.$el,
    })
  }

  function getOffsetOfDirection(elementList: HTMLDivElement[], direction: 'left' | 'right' | 'top' | 'bottom', minMax: 'max' | 'min') {
    const array = elementList.map((ele: HTMLDivElement) => {
      const value = ele.getBoundingClientRect()[direction]
      return value
    })
    return Math[minMax](...array)
  }
  // 组合
  function layersGroup() {
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
  function layersUngroup() {
    const rawSelectedLayerIds = toRaw(canvasStageStore.selectedLayerIds)
    const rawScaleRate = toRaw(canvasStageStore.scaleRate)
    if (rawSelectedLayerIds.length === 1) {
      const [id] = rawSelectedLayerIds
      const rawLayerList = toRaw(canvasStageStore.layerList)
      const layerData = getLayerItemModelById(id, rawLayerList)
      const rotateGroup = layerData.rotate || 0
      if (layerData.type === 'group') {
        const groupEle = getLayerItemDomById(id)
        const { left: leftCanvas, top: topCanvas } = getCanvasLeftTop()
        const { left: leftGroup, top: topGroup } = groupEle.getBoundingClientRect()
        const children = layerData.children
        removeLayerItemModelById(id, canvasStageStore.layerList)
        const layerIds = children.map((item) => item.id)
        const _children = []
        children.forEach((child) => {
          const { id, x, y, rotate = 0, ...rest } = child
          const _rotate = rotate + rotateGroup >= 360 ? rotate + rotateGroup - 360 : rotate + rotateGroup
          const layerEle = getLayerItemDomById(id)
          const { left, top } = layerEle.getBoundingClientRect()
          const data = {
            id,
            x: layerData.x + x,
            y: layerData.y + y,
            rotate: _rotate,
            ...rest,
          }
          _children.push(data)
        })
        canvasStageStore.layerList.push(..._children)
      }
    }
  }
  // 删除
  function layersRemove() {
    const rawSelectedLayerIds = toRaw(canvasStageStore.selectedLayerIds)
    const rawLayerList = toRaw(canvasStageStore.layerList)
    rawSelectedLayerIds.forEach((id) => {
      const index = rawLayerList.findIndex((item) => item.id === id)
      canvasStageStore.layerList.splice(index, 1)
    })
  }

  function getElementStyles(element: HTMLElement) {
    const list = ['fontWeight', 'fontStyle', 'textDecoration']
    list.forEach((el: string) => {
      if (element.style[el]) {
        Object.assign(styleOptions, { [el]: element.style[el] })
      } else {
        Object.assign(styleOptions, { [el]: styleDefault[el] })
      }
    })
  }

  function echoStyleBasedOnRange(range: Range) {
    let container = range.commonAncestorContainer as HTMLElement
    if (container.nodeType === 3) {
      container = container.parentNode! as HTMLElement
    }
    getElementStyles(container)
  }

  // 全选
  function layersSelectAll() {}
  // 选区变化事件
  const selectionchangeEvt = (e: Event) => {
    const selection = document.getSelection()
    if (selection!.rangeCount) {
      const range = selection?.getRangeAt(0)
      if (!range?.collapsed) {
        console.log(range)
        echoStyleBasedOnRange(range)
      }
    }
  }
  function getContainerBasedOnRange(range: Range) {
    const { startOffset, startContainer, endOffset, endContainer, commonAncestorContainer } = range
    if (startContainer === endContainer) {
      if (commonAncestorContainer.nodeType === 1) {
        if ((commonAncestorContainer as HTMLElement).innerText!.length === endOffset - startOffset) {
          return commonAncestorContainer
        }
      }
      if (commonAncestorContainer.nodeType === 3) {
        if (commonAncestorContainer.parentElement!.innerText!.length === endOffset - startOffset) {
          return commonAncestorContainer.parentElement
        }
      }
    }
    return null
  }

  // 加粗
  function fontWeigthClick() {
    const selection = document.getSelection()
    if (selection!.rangeCount) {
      const range = selection?.getRangeAt(0) as Range
      if (!range?.collapsed) {
        const fontWeight = styleOptions.fontWeight === 'normal' ? 'bold' : 'normal'
        const container = getContainerBasedOnRange(range)
        if (container) {
          Object.assign((container as HTMLElement).style, { fontWeight })
        } else {
          const textContent = range?.toString() || ''
          const span = document.createElement('span')
          span.innerText = textContent
          Object.assign(span.style, { fontWeight })
          range?.deleteContents()
          range?.insertNode(span)
        }
      }
    }
  }
  // 斜体
  function fontStyleClick() {
    const selection = document.getSelection()
    if (selection!.rangeCount) {
      const range = selection?.getRangeAt(0) as Range
      if (!range?.collapsed) {
        const fontStyle = styleOptions.fontStyle === 'normal' ? 'italic' : 'normal'
        const container = getContainerBasedOnRange(range)
        if (container) {
          Object.assign((container as HTMLElement).style, { fontStyle })
        } else {
          const textContent = range?.toString() || ''
          const span = document.createElement('span')
          span.innerText = textContent
          Object.assign(span.style, { fontStyle })
          range?.deleteContents()
          range?.insertNode(span)
        }
      }
    }
  }

  // 下划线
  function textDecorationClick() {
    const selection = document.getSelection()
    if (selection!.rangeCount) {
      const range = selection?.getRangeAt(0) as Range
      if (!range?.collapsed) {
        const textDecoration = styleOptions.textDecoration === 'none' ? 'underline' : 'none'
        const container = getContainerBasedOnRange(range)
        if (container) {
          Object.assign((container as HTMLElement).style, { textDecoration })
        } else {
          const textContent = range?.toString() || ''
          const span = document.createElement('span')
          span.innerText = textContent
          Object.assign(span.style, { textDecoration })
          range?.deleteContents()
          range?.insertNode(span)
        }
      }
    }
  }
  // 注册选区变化
  document.addEventListener('selectionchange', selectionchangeEvt, true)
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
    > span {
      font-weight: bold;
      color: black;
    }
  }
  .font-weight-normal {
    > span {
      font-weight: normal;
      color: inherit;
    }
  }
  .font-style-italic {
    > span {
      font-style: italic;
      color: black;
    }
  }

  .font-style-normal {
    > span {
      font-style: normal;
      color: inherit;
    }
  }
  .text-decoration-underline {
    > span {
      text-decoration: underline;
      color: black;
    }
  }

  .text-decoration-none {
    > span {
      text-decoration: none;
      color: inherit;
    }
  }
</style>
