<template>
  <template
    v-for="layer in props.layerList"
    :key="layer.id"
  >
    <component
      :layerData="layer"
      :is="layerCompMap[layer.type]"
    ></component>
  </template>
</template>
<script setup lang="ts" name="LayerRenderComp">
  import imgLayerComp from './imgLayerComp/index.vue'
  import svgLayerComp from './svgLayerComp/index.vue'
  import textLayerComp from './textLayerComp/index.vue'
  import groupLayerComp from './groupLayerComp/index.vue'

  const props = defineProps({
    layerList: Array,
    default: () => [],
  })
  const layerCompMap = {
    svg: svgLayerComp,
    text: textLayerComp,
    img: imgLayerComp,
    group: groupLayerComp,
  }
</script>
