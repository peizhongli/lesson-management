<template>
  <div>
    <img :src="user.avatar" alt="">
    <p>{{user.name}}</p>
  </div>
</template>
<script>

export default {
  name: 'userInfo',
  components: {},
  computed: {
    user (){
      return this.$store.getters.user;
    }
  },
}
</script>
