import { shallowMount } from "@vue/test-utils";
import PopulationChart from "@/components/PopulationChart.vue";
import Chart from "chart.js";
jest.mock("chart.js");

describe("PopulationChart.vue", () => {
  const state = {
    prefectures: [
      {
        code: 1,
        name: "Hokkaido",
        data: [{ year: 2000, value: 1 }],
      },
    ],
  };

  const $store = {
    state: state,
    getters: {
      prefectures: state.prefectures,
    },
  };

  const wrapper = shallowMount(PopulationChart, {
    global: {
      mocks: {
        $store,
      },
    },
  });

  test("Chart.js呼ばれているか確認する", () => {
    // Chart.jsが呼ばれている場合、
    // ライフサイクルのmountedが実行されている
    expect(Chart).toHaveBeenCalled();
    expect(Chart).toHaveBeenCalledTimes(1);
  });

  describe("watchによって、Chart.jsのデータ変更がされるかのテスト", () => {
    beforeEach(() => {
      // Chartインスタンスの構成の初期化
      wrapper.vm.populationChart = {
        data: {
          labels: [],
          datasets: [],
        },
        update() {},
      };
    });

    test("ストアにデータが存在する場合", () => {
      // データの要素が0以上を確認
      expect(wrapper.vm.prefecturesData.length).toBeGreaterThan(0);

      // watchを直接実行させる
      wrapper.vm.$options.watch.prefecturesData.handler.call(wrapper.vm);

      // データが更新されているかのチェック
      expect(wrapper.vm.populationChart.data.labels.length > 0).toBe(true);
      expect(wrapper.vm.populationChart.data.datasets.length > 0).toBe(true);
    });

    test("ストアにデータが存在しない場合", () => {
      // ストアのデータを削除する
      wrapper.vm.$store.state.prefectures.splice(0);
      expect(wrapper.vm.prefecturesData.length).toBe(0);

      // watchを直接実行させる
      wrapper.vm.$options.watch.prefecturesData.handler.call(wrapper.vm);

      // データが入っていないことをチェック
      expect(wrapper.vm.populationChart.data.labels.length === 0).toBe(true);
      expect(wrapper.vm.populationChart.data.datasets.length === 0).toBe(true);
    });
  });
});
