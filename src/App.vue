<template>
  <Header />
  <Main />
  <Footer />
</template>

<script>
import Header from "@/components/Header";
import Main from "@/components/Main";
import Footer from "@/components/Footer";

export default {
  name: "App",
  components: {
    Header,
    Main,
    Footer,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 900px;
  margin: 0 auto;
}
</style>
