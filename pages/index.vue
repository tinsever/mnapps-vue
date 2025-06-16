<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
  <div>
    <h1>Home Page</h1>
    <div v-if="user">   
      <p>Welcome back, {{ user.email }}!</p>
      <p>Your User ID is: {{ user.id }}</p>
    </div>
    <div v-else>
      <p>You are not logged in.</p>
    </div>
  </div>
</template>