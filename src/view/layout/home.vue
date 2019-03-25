<template>
  <div class="bs-wp">
    <pl-count-index v-if="$store.getters.userType == $constant.portal"></pl-count-index>
    <mg-application-index v-if="$store.getters.userType == $constant.manage"></mg-application-index>
  </div>
</template>

<script>
  import mgApplicationIndex from "@/view/mgApplication/index";
  import plCountIndex from "@/view/plCount/index";

  export default {
    name: "home",
    components: {mgApplicationIndex, plCountIndex}
  }
</script>

<style scoped>

</style>
