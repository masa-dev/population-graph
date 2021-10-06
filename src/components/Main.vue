<template>
  <main class="main">
    <PrefList />
    <PopulationChart />
  </main>
</template>

<script>
import PrefList from "@/components/PrefList";
import PopulationChart from "@/components/PopulationChart";

export default {
  name: "Main",
  components: {
    PrefList,
    PopulationChart,
  },
};
</script>

<style scoped lang="scss"></style>
