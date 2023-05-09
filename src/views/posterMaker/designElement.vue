<template>
  <div class="design-element">
    <el-input-number
      v-model="canvasStageStore.scaleRate"
      :precision="2"
      @change="scaleChange"
      :step="scaleStep"
      :max="maxScale"
      :min="minScale"
    ></el-input-number>
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
    <el-button-group>
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
      <el-button
        @click="layersGroup"
        size="small"
        type="primary"
      >
        组合
      </el-button>
    </el-button-group>
  </div>
</template>
<script lang="ts" setup>
  import { toRaw } from 'vue'
  import { useCanvasStageStore, scaleStep, minScale, maxScale } from './useCanvasStage'
  import { wzoomModel, layerData } from './var.js'
  import { getActiveLayers, getCanvasLeftTop } from './utils.js'
  const canvasStageStore = useCanvasStageStore()
  const { layerList: rawLayerList } = canvasStageStore
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

  function layersGroup() {
    const rawSelectedLayerIds = toRaw(canvasStageStore.selectedLayerIds)
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
      layerData.forEach((item) => {
        if (rawSelectedLayerIds.includes(item.id)) {
          const { x, y, ...rest } = item
          const data = {
            x: x - xGroup,
            y: y - yGroup,
            ...rest,
          }
          children.push(data)
        }
      })
      const groupLayer = {
        id: '10',
        type: 'group',
        x: xGroup,
        y: yGroup,
        width,
        height,
        children,
      }
      rawSelectedLayerIds.forEach((id) => {
        const index = rawLayerList.findIndex((item) => item.id === id)
        canvasStageStore.layerList.splice(index, 1)
        canvasStageStore.layerList.push(groupLayer)
      })
    }
  }
</script>
<style lang="scss">
  .design-element {
    width: 250px;
    background-color: #263445;
  }
</style>
