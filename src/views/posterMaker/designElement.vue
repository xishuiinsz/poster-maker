<template>
  <div class="design-element">
    <el-form>
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
            @click="layersRemove"
            size="small"
            type="primary"
          >
            删除
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
        </el-button-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
  import { toRaw, nextTick } from 'vue'
  import { useCanvasStageStore, scaleStep, minScale, maxScale } from './useCanvasStage'
  import { wzoomModel, layerData } from './var.js'
  import { v4 as uuidv4 } from 'uuid'
  import { getActiveLayers, getCanvasLeftTop, getLayerItemDomById } from './utils.js'
  const canvasStageStore = useCanvasStageStore()
  const { layerList, scaleRate } = canvasStageStore
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
          const { id, x, y, ...rest } = item
          const { left: layerItemLeft, top: layerItemTop } = getLayerItemDomById(id).getBoundingClientRect()
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

  // 删除
  function layersRemove() {
    const rawSelectedLayerIds = toRaw(canvasStageStore.selectedLayerIds)
    const rawLayerList = toRaw(canvasStageStore.layerList)
    rawSelectedLayerIds.forEach((id) => {
      const index = rawLayerList.findIndex((item) => item.id === id)
      canvasStageStore.layerList.splice(index, 1)
    })
  }

  // 全选
  function layersSelectAll() {}
</script>
<style lang="scss">
  .design-element {
    width: 250px;
    background-color: #263445;
  }
</style>
