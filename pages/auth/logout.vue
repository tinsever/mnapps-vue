<script setup lang="ts">
const supabase = useSupabaseClient()

onMounted(async () => {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.log(error)
  }
  
  await navigateTo('/')
})
</script>

<template>
  <div>
    <p>Logging out...</p>
  </div>
</template>