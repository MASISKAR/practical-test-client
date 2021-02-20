<template>
  <div id="app">
    <router-view/>
    <notifications
        group="success"
        classes="success notification"
        position="bottom-left"
    />
    <notifications
        group="error"
        classes="error notification"
        position="bottom-left"
    />
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style lang="css">
.notification{
  padding: 10px;
  margin: 8px;
  border: 1px solid transparent;
  border-radius: 5px;
}
.success{
  color: #155724;
  background-color: #d4edda !important;
  border-color: #c3e6cb;
}
.error{
  color: #721c24;
  background-color: #f8d7da !important;
  border-color: #f5c6cb;
}
.vue-notification-group{
  left: 5px;
  bottom: 5px;
}
</style>
