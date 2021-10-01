<template>
  <main class="main">
    <h2>都道府県</h2>
    <PrefList />
  </main>
</template>

<script>
import PrefList from "@/components/PrefList";

export default {
  name: "Main",
  components: {
    PrefList,
  },
};
</script>

<style scoped lang="scss"></style>
