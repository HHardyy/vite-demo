<template>
  <div>count：{{count}}</div>
  <button @click="handleClick">add</button>
</template>

<script>
import {reactive, toRefs} from 'vue';
export default {
  name: 'App',
  setup(){
    const state = reactive({count:0})
    const handleClick = () => {
      state.count++
    }    
    return {
      ...toRefs(state),
      handleClick
    }
  }
}
</script>
