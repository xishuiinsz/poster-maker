<template>
    <el-button-group>
        <el-button class="step-item-btn pre-step-btn" :disabled="disabledPreStep" @click="preStep" type="primary"
            :icon="ArrowLeft">上一步</el-button>
        <el-button class="step-item-btn next-step-btn" :disabled="disabledNextStep" @click="nextStep" type="primary">
            下一步<el-icon class="el-icon--right">
                <ArrowRight />
            </el-icon>
        </el-button>
    </el-button-group>
</template>
<script setup>
import { ref, reactive, computed, toRaw, onMounted, onUnmounted } from 'vue'
import {
    ArrowLeft,
    ArrowRight,
    Delete,
    Edit,
    Share,
} from '@element-plus/icons-vue'
import { layerListChangeCb, registerChangeCb, unregisterChangeCb } from '../useLayerListChange.js'
import { useCanvasStageStore } from '@/views/posterMaker/useCanvasStage.js'
const canvasStageStore = useCanvasStageStore()
const { updateOverallLayer, layerList } = canvasStageStore
const clonedRawLayerList = structuredClone(toRaw(layerList))
const currentIndex = ref(0)
const recordList = [clonedRawLayerList]
const cacheData = {
    flagRecord: true
}
// 上一步 是否禁用
const disabledPreStep = computed(() => {
    let flag = true
    if (recordList[currentIndex.value - 1]) {
        flag = false
    }
    return flag
})

// 下一步 是否禁用
const disabledNextStep = computed(() => {
    let flag = true
    if (recordList[currentIndex.value + 1]) {
        flag = false
    }
    return flag
})

// 上一步 点击事件
const preStep = () => {
    Object.assign(cacheData, { flagRecord: false })
    currentIndex.value = currentIndex.value - 1
    const list = recordList[currentIndex.value]
    updateOverallLayer(structuredClone(list))
}
// 下一步 点击事件
const nextStep = () => {
    Object.assign(cacheData, { flagRecord: false })
    currentIndex.value = currentIndex.value + 1
    const list = recordList[currentIndex.value]
    updateOverallLayer(structuredClone(list))
}
// 改变时执行回调
const changeCb = (newList) => {
    if (cacheData.flagRecord) {
        recordList.splice(currentIndex.value + 1)
        recordList.push(newList)
        currentIndex.value++
    }
    Object.assign(cacheData, { flagRecord: true })
}

onMounted(() => {
    // 注册图层数据change回调
    registerChangeCb(changeCb)
})
onUnmounted(() => {
    // 反注册图层数据change回调
    unregisterChangeCb(changeCb)
})
</script>