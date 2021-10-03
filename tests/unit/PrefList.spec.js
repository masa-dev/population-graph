import { shallowMount } from "@vue/test-utils";
import PrefList from "@/components/PrefList.vue";
import { flushPromises } from "@vue/test-utils";

const TITLE = "都道府県";

describe("正常の場合", () => {
  beforeEach(() => {
    // 正常の場合のfetchモック
    const testData = [{ prefCode: 1, prefName: "Hokkaido" }];
    const prefListMock = () =>
      new Promise((resolve) => {
        resolve({
          ok: true,
          status: 200,
          json: async () => ({ result: testData }),
        });
      });

    global.fetch = jest.fn().mockImplementation(prefListMock);
  });

  test("fetchで読み込んだ値が表示されているかを確認する", async () => {
    const wrapper = shallowMount(PrefList);
    expect(wrapper.text()).toBe(TITLE);

    // mounted内のPromiseが解決されるのを待つ
    await flushPromises();
    expect(wrapper.text()).toBe(TITLE + "Hokkaido");
  });
});

describe("異常の場合", () => {
  beforeEach(() => {
    // 異常の場合のfetchモック
    const prefListMock = () =>
      new Promise((resolve) => {
        resolve({
          ok: false,
          status: 500,
          statusText: "fetch Error",
          json: async () => ({}),
        });
      });

    global.fetch = jest.fn().mockImplementation(prefListMock);

    jest.spyOn(console, "error");
  });

  test("適切なエラーが出ているか確認する", async () => {
    const wrapper = shallowMount(PrefList);
    expect(wrapper.text()).toBe(TITLE);

    // DOMに変更がないことを確認する
    await flushPromises();
    expect(wrapper.text()).toBe(TITLE);

    // console.errorが実行されているかを確認する
    expect(console.error).toBeCalled();
    expect(console.error).toBeCalledTimes(4);
  });
});
