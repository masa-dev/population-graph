import { shallowMount } from "@vue/test-utils";
import App from "@/App";
import Header from "@/components/Header";
import Main from "@/components/Main";
import Footer from "@/components/Footer";

test("App.vue", () => {
  const wrapper = shallowMount(App);

  // App.vue内で使用されているコンポーネントを取得
  const appHeader = wrapper.findComponent({ name: "Header" });
  const appMain = wrapper.findComponent({ name: "Main" });
  const appFooter = wrapper.findComponent({ name: "Footer" });

  // インポートされているか確認する
  expect(appHeader.vm.$options.name).toBe("Header");
  expect(appMain.vm.$options.name).toBe("Main");
  expect(appFooter.vm.$options.name).toBe("Footer");
});

test("Header", () => {
  const wrapper = shallowMount(Header);

  // テキストと一致する確認する
  expect(wrapper.text()).toMatch("都道府県の人口グラフ");
});

test("Main", () => {
  const wrapper = shallowMount(Main);

  // Main.vue内で使用されているコンポーネントを取得
  const PrefList = wrapper.findComponent({ name: "PrefList" });
  const PopulationChart = wrapper.findComponent({ name: "PopulationChart" });

  // インポートされているか確認する
  expect(PrefList.vm.$options.name).toBe("PrefList");
  expect(PopulationChart.vm.$options.name).toBe("PopulationChart");
});

test("Footer", () => {
  const wrapper = shallowMount(Footer);

  // テキストと一致する確認する
  expect(wrapper.text()).toMatch(
    "統計データ出典：RESAS（地域経済分析システム）"
  );
  expect(wrapper.text()).toMatch("コーディング課題");
});
