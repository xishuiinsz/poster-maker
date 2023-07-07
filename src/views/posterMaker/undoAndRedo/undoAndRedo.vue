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
import { regKeyupCb, unregKeyupCb } from '../useKeyboardEvent.js'
import { initCanvasTransform } from '../utils/canvasTransform'
const canvasStageStore = useCanvasStageStore()
const { overrideAllLayers, layerList, clearSelectedLayers } = canvasStageStore
const clonedRawLayerList = structuredClone(toRaw(layerList))
const currentIndex = ref(0)
const recordList = [clonedRawLayerList]
const cacheData = {
    flagRecord: true
}
const maxSteps = 100
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

// 当检测时有画布尺寸变化时，重置画布形变。
const checkBgLayerChange = (lastLayerState, currentLayerState) => {
    const [lastBgData] = lastLayerState
    const [currentBgData] = currentLayerState
    if (lastBgData.width + lastBgData.height !== currentBgData.width + currentBgData.height) {
        initCanvasTransform()
    }
}

// 上一步 点击事件
const preStep = () => {
    clearSelectedLayers()
    Object.assign(cacheData, { flagRecord: false })
    currentIndex.value = currentIndex.value - 1
    const list = recordList[currentIndex.value]
    overrideAllLayers(structuredClone(list))
    checkBgLayerChange(recordList[currentIndex.value + 1], list)
}
// 下一步 点击事件
const nextStep = () => {
    clearSelectedLayers()
    Object.assign(cacheData, { flagRecord: false })
    currentIndex.value = currentIndex.value + 1
    const list = recordList[currentIndex.value]
    overrideAllLayers(structuredClone(list))
    checkBgLayerChange(recordList[currentIndex.value - 1], list)
}
// 改变时执行回调
const changeCb = (newList) => {
    if (cacheData.flagRecord) {
        recordList.splice(currentIndex.value + 1)
        recordList.push(newList)
        if (recordList.length > maxSteps) {
            recordList.shift()
        } else {
            currentIndex.value++
        }

    }
    Object.assign(cacheData, { flagRecord: true })
}

onMounted(() => {
    // 注册图层数据change回调
    registerChangeCb(changeCb)
    // 注册ctrl+z键盘事件
    regKeyupCb('ctrl_z', preStep)
    // 注册ctrl+z键盘事件
    regKeyupCb('ctrl_y', nextStep)

})
onUnmounted(() => {
    // 反注册图层数据change回调
    unregisterChangeCb(changeCb)
    // 注册ctrl+z键盘事件
    unregKeyupCb('ctrl_z')
    unregKeyupCb('ctrl_y')
})
</script>