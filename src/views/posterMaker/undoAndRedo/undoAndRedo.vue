<template>
    <el-button-group>
        <el-button :disabled="disabledPreStep" @click="preStep" type="primary" :icon="ArrowLeft">上一步</el-button>
        <el-button :disabled="disabledNextStep" @click="nextStep" type="primary">
            下一步<el-icon class="el-icon--right">
                <ArrowRight />
            </el-icon>
        </el-button>
    </el-button-group>
</template>
<script setup>
import { onMounted, ref, reactive, computed } from 'vue'
import {
    ArrowLeft,
    ArrowRight,
    Delete,
    Edit,
    Share,
} from '@element-plus/icons-vue'
import { layerListChangeCb } from '../useLayerListChange.js'
import { useCanvasStageStore } from '@/views/posterMaker/useCanvasStage.js'
const canvasStageStore = useCanvasStageStore()
const { updateOverallLayer } = canvasStageStore
const currentIndex = ref(0)
const recordList = reactive([])
const disabledPreStep = computed(() => {
    let flag = true
    if (recordList[currentIndex.value - 1]) {
        flag = false
    }
    return flag
})
const disabledNextStep = computed(() => {
    let flag = true
    if (recordList[currentIndex.value + 1]) {
        flag = false
    }
    return flag
})

// 上一步
const preStep = () => {
    currentIndex.value = currentIndex.value - 1
    const list = recordList[currentIndex.value]
    updateOverallLayer(list)
}
// 下一步
const nextStep = () => {
    console.log('下一步')
}
// 改变时回调
const changeCb = (newList) => {
    recordList.push(newList)
    currentIndex.value++
}
onMounted(() => {
    const index = layerListChangeCb.findIndex(fun => fun === changeCb)
    if (index > -1) {
        layerListChangeCb.splice(index, 1)
    } else {
        layerListChangeCb.push(changeCb)
    }
})
</script>