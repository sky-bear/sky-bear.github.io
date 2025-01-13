<template>
  <Image
    class="image"
    :src="src"
  />
</template>


<script lang="ts" setup>
 import { Image } from 'ant-design-vue';

 const prop = defineProps({
  src: {
    type: String,
    default: ''
  }
 })

</script>

<style lang="scss" scoped>
.image {
  width: 100%;
  max-height: 300px;
}
</style>