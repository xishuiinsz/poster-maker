<template>
    <el-form class="poster-header-form" :inline="true">
        <el-form-item class="mb-0">
            <undoAndRedo />
        </el-form-item>
        <el-form-item class="mb-0" label="作品名称">
            <el-input @blur.prevent.stop="templateNameChange" v-model="posterTemplate.name" placeholder="输入作品名称" />
        </el-form-item>
        <el-form-item class="mb-0" label="作品尺寸">
            <el-select v-model="posterTemplate.size" placeholder="输入作品尺寸">
                <el-option label="600 x 800" value="600x800" />
                <el-option label="1920 x 1080" value="1920x1080" />
            </el-select>
        </el-form-item>
    </el-form>
</template>
  
<script setup>
import { reactive, onMounted, toRaw } from 'vue'
import undoAndRedo from './undoAndRedo/undoAndRedo.vue';
import { useCanvasStageStore } from '@/views/posterMaker/useCanvasStage.js'
const canvasStageStore = useCanvasStageStore()
const { layerList, updateLayerDataById } = canvasStageStore
const [modelData] = toRaw(layerList)
defineOptions({
    name: 'PosterHeader'
})

const posterTemplate = reactive({
    name: modelData.name,
    size: '600x800',
})

// 作品名称change事件
const templateNameChange = () => {
    const name = toRaw(posterTemplate.name)
    updateLayerDataById({ id: modelData.id, name })
}
</script>