<template>
  <v-header />
  <div class="bottom-content">
    <v-sidebar />
    <div class="content-box" :class="{ 'content-collapse': sidebar.collapse }">
      <router-view v-slot="{ Component }">
        <transition name="move" mode="out-in">
          <keep-alive :include="tags.nameList">
            <component :is="Component"></component>
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useSidebarStore } from '../store/sidebar'
import { useTagsStore } from '../store/tags'
import vHeader from '../components/header.vue'
import vSidebar from '@/views/posterMaker/designElement/designElement.vue'

const sidebar = useSidebarStore()
const tags = useTagsStore()
</script>
