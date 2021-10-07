<template>
  <div class="population-chart">
    <h2>都道府県の総人口の推移グラフ</h2>
    <div class="chart-wrapper">
      <canvas id="population-line-chart"></canvas>
    </div>
  </div>
</template>

<script>
// vue-chartjsはVue3に対応していないため、素のChart.jsを使う
import Chart from "chart.js";
import "chartjs-plugin-colorschemes";

export default {
  name: "PopulationChart",
  data() {
    return {
      populationChart: {},
    };
  },
  methods: {
    changeData() {
      // X軸のラベル名
      let xLabels = [];
      // Chart.jsのdatasetsにそのまま代入するデータ
      let datasets = [];

      // ストアにデータが存在する場合はグラフ用のデータを作成する
      if (this.prefecturesData.length > 0) {
        // X軸のラベル
        for (const data of this.prefecturesData[0].data) {
          xLabels.push(data.year);
        }

        // 人口データ
        for (const pref of this.prefecturesData) {
          let values = [];
          for (const data of pref.data) {
            values.push(data.value);
          }

          datasets.push({
            label: pref.name,
            data: values,
            borderWidth: 3,
            lineTension: 0,
            fill: false,
          });
        }
      }

      if (window.innerWidth < 600) {
        const baseAspectRatio = 1.35;
        // 10個データ数が変化するごとに比率を変更する
        let multipleOfTen = Math.floor(this.prefecturesData.length / 10);
        // 調整用の値（幅が大きくなるごとに値も大きくなる）
        let adjustmentValue = (8 * window.innerWidth) / 450;

        this.populationChart.aspectRatio =
          baseAspectRatio - multipleOfTen / adjustmentValue;
      } else {
        this.populationChart.aspectRatio = 1.35;
      }

      // グラフのデータを更新する
      this.populationChart.data.labels = xLabels;
      this.populationChart.data.datasets = datasets;
      this.populationChart.resize();
      this.populationChart.update();
    },
    drawLineChart() {
      const ctx = document.getElementById("population-line-chart");

      // グラフの作成及び設定を指定する
      this.populationChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: [],
          datasets: [],
        },
        options: {
          title: {
            display: true,
            text: "都道府県の総人口",
          },
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "人口",
                  fontsize: 10,
                },
                ticks: {
                  beginAtZero: true,
                  autoSkip: true,
                },
              },
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "年度",
                  fontsize: 10,
                },
                ticks: {
                  beginAtZero: true,
                  autoSkip: true,
                },
              },
            ],
          },
          plugins: {
            colorschemes: {
              scheme: "brewer.DarkTwo8",
            },
          },
          legend: {
            position: "top",
            labels: {
              boxWidth: 20,
              fontSize: 11,
            },
          },
          aspectRatio: 1.35,
        },
      });
    },
  },
  computed: {
    prefecturesData() {
      return this.$store.getters.prefectures;
    },
  },
  watch: {
    // 配列の要素のため、ディープウォッチャーにして監視する
    prefecturesData: {
      handler() {
        this.changeData();
      },
      deep: true,
    },
  },
  mounted() {
    // すべてのコンポーネントがマウントされるのを待つ
    this.$nextTick(function () {
      // グラフの作成
      this.drawLineChart();
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables";
@import "../styles/mixin";

.population-chart {
  h2 {
    @include subTitle();
  }

  .chart-wrapper {
    padding: 0 30px;
  }
}

@media (max-width: $responsiveMainWidth) {
  .population-chart {
    .chart-wrapper {
      padding: 0;
    }
  }
}
</style>
