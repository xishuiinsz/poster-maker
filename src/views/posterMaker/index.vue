<template>
  <div class="online-design-general-container">
    <div class="operation-area">
      <el-input-number
        v-model="currentScale"
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
    <div class="design-workbench-container">
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
      </div>
    </div>
  </div>
</template>
<script src="./onlineDesign"></script>
<style src="./style.scss" lang="scss" scoped></style>
