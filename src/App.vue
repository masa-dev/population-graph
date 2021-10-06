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
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap");
@import "styles/variables";

body {
  margin: 0;
}

#app {
  font-family: "Noto Sans JP", sans-serif;
  width: $responsiveMainWidth;
  margin: 0 auto;
}

@media (max-width: $responsiveMainWidth) {
  #app {
    width: 100%;
  }
}
</style>
