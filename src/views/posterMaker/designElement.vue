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
    </el-button-group>
  </div>
</template>
<script lang="ts" setup>
  import { useCanvasStageStore, scaleStep, minScale, maxScale } from './useCanvasStage'
  import { wzoomModel } from './var.js'
  const canvasStageStore = useCanvasStageStore()
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
</script>
<style lang="scss">
  .design-element {
    width: 250px;
    background-color: #263445;
  }
</style>
