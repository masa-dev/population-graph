<template>
  <footer class="footer">
    <hr />
    <div class="footer-text-wrapper">
      <p class="footer-text">
        統計データ出典：<a href="https://opendata.resas-portal.go.jp/"
          >RESAS（地域経済分析システム）</a
        >
      </p>
      <p class="footer-text">コーディング課題</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped lang="scss">
@import "../styles/variables";

footer {
  .footer-text-wrapper {
    font-size: $smallFontSize;
    margin: 10px 0;

    p.footer-text {
      margin: 0;
      text-align: center;
    }
  }
}
</style>
