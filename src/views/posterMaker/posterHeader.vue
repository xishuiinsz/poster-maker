<template>
    <el-form class="poster-header-form" :inline="true">
        <el-form-item class="mb-0">
            <undoAndRedo />
        </el-form-item>
        <el-form-item class="mb-0" label="作品名称">
            <el-input @blur.prevent.stop="templateNameChange" v-model="posterTemplate.name" placeholder="输入作品名称" />
        </el-form-item>
        <el-form-item class="mb-0" label="作品尺寸">
            <el-select @change="sizeChange" v-model="posterTemplate.size" placeholder="输入作品尺寸">
                <el-option label="800 x 600" value="800x600" />
                <el-option label="1920 x 1080" value="1920x1080" />
            </el-select>
        </el-form-item>
    </el-form>
</template>
  
<script setup>
import { reactive, onMounted, toRaw } from 'vue'
import undoAndRedo from './undoAndRedo/undoAndRedo.vue';
import { useCanvasStageStore } from '@/views/posterMaker/useCanvasStage.js'
import { callbackStart } from './useLayerListChange.js'
import { initCanvasTransform } from './utils/canvasTransform'
const canvasStageStore = useCanvasStageStore()
const { layerList, updateLayerDataById, silentUpdateLayerDataById, bgLayerData } = canvasStageStore
const sizeSeparator = 'x'
defineOptions({
    name: 'PosterHeader'
})
const { width, height } = bgLayerData
const posterTemplate = reactive({
    name: bgLayerData.name,
    size: `${width}x${height}`,
})

// 作品名称change事件
const templateNameChange = () => {
    const name = toRaw(posterTemplate.name)
    silentUpdateLayerDataById({ id: bgLayerData.id, name })
    const rawLayerList = toRaw(canvasStageStore.layerList)
    callbackStart(rawLayerList)
}

const sizeChange = size => {
    const [width, height] = size.split(sizeSeparator).map(Number)
    updateLayerDataById({ id: bgLayerData.id, width, height })
    initCanvasTransform()
}
</script>