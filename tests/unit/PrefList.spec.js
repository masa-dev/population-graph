import { shallowMount, flushPromises } from "@vue/test-utils";
import PrefList from "@/components/PrefList.vue";

const TITLE = "都道府県";

describe("都道府県一覧データの読み込み", () => {
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
    const spyError = jest.spyOn(console, "error");

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
      spyError.mockReset();
      spyError.mockRestore();
    });
  });
});

describe("人口データを送信するクリックイベント", () => {
  describe("ストアにデータが存在せず、データをストアに挿入する場合", () => {
    describe("正常の場合", () => {
      beforeEach(() => {
        // APIの返り値
        const returnJson = {
          boundaryYear: 2000,
          data: [
            {
              label: "総人口",
              data: [
                { year: 1500, value: 100 },
                { year: 3000, value: 200 },
              ],
            },
          ],
        };
        // 正常の場合のfetchモック
        const fetchPopulationMock = (e) =>
          new Promise((resolve) => {
            //
            if (e.match("api/v1/population/composition/perYear")) {
              resolve({
                ok: true,
                status: 200,
                json: async () => ({ result: returnJson }),
              });
            }
            // 起動時のfetchの動作
            else {
              resolve({
                ok: true,
                status: 200,
                json: async () => ({ result: [] }),
              });
            }
          });

        global.fetch = jest.fn().mockImplementation(fetchPopulationMock);
      });

      test("store.commit が実行されているかテストする", async () => {
        // Vuex ストアのモック
        const $store = {
          commit: jest.fn(),
        };
        // Vuex ストアのモックを指定してマウントする
        const wrapper = shallowMount(PrefList, {
          global: {
            mocks: {
              $store,
            },
          },
        });

        // データの配列を空にする
        wrapper.vm.prefList.splice(0);
        expect(wrapper.vm.prefList.length).toBe(0);
        wrapper.vm.prefList.push({
          id: 1,
          name: "北海道",
          checked: true,
        });

        wrapper.vm.sendPrefDataToStore(1);

        await flushPromises();
        expect($store.commit).toBeCalled();
        expect($store.commit).toBeCalledTimes(1);
        // 引数チェック
        expect($store.commit.mock.calls[0][0]).toBe("insertPrefecture");
      });
    });

    describe("異常の場合", () => {
      beforeEach(() => {
        // 異常の場合のfetchモック
        const fetchPopulationMock = (e) =>
          new Promise((resolve) => {
            //
            if (e.match("api/v1/population/composition/perYear")) {
              resolve({
                ok: false,
                status: 500,
                json: async () => ({}),
              });
            }
            // 起動時のfetchの動作
            else {
              resolve({
                ok: true,
                status: 200,
                json: async () => ({ result: [] }),
              });
            }
          });

        global.fetch = jest.fn().mockImplementation(fetchPopulationMock);
      });

      test("適切なエラーが出ているか確認する", async () => {
        // Vuex ストアのモック
        const $store = {
          commit: jest.fn(),
        };
        // Vuex ストアのモックを指定してマウントする
        const wrapper = shallowMount(PrefList, {
          global: {
            mocks: {
              $store,
            },
          },
        });

        const spyError = jest.spyOn(console, "error");

        // データの配列が空にする
        wrapper.vm.prefList.splice(0);
        expect(wrapper.vm.prefList.length).toBe(0);
        wrapper.vm.prefList.push({
          id: 1,
          name: "北海道",
          checked: true,
        });

        wrapper.vm.sendPrefDataToStore(1);

        await flushPromises();
        // console.errorが実行されているかを確認する
        expect(console.error).toBeCalled();
        expect(console.error).toBeCalledTimes(4);
        spyError.mockReset();
        spyError.mockRestore();
      });
    });
  });

  describe("ストアにデータが存在し、データをストアから削除する場合", () => {
    beforeEach(() => {
      // 正常の場合のfetchモック
      const fetchPopulationMock = (e) =>
        new Promise((resolve) => {
          //
          if (e.match("api/v1/population/composition/perYear")) {
            resolve({
              ok: false,
              status: 500,
              json: async () => ({}),
            });
          }
          // 起動時のfetchの動作
          else {
            resolve({
              ok: true,
              status: 200,
              json: async () => ({ result: [] }),
            });
          }
        });

      global.fetch = jest.fn().mockImplementation(fetchPopulationMock);
    });
    test("削除のstore.commitが実行されているか確認する", async () => {
      // Vuex ストアのモック
      const $store = {
        commit: jest.fn(),
      };
      // Vuex ストアのモックを指定してマウントする
      const wrapper = shallowMount(PrefList, {
        global: {
          mocks: {
            $store,
          },
        },
      });

      // データの配列が空にする
      wrapper.vm.prefList.splice(0);
      expect(wrapper.vm.prefList.length).toBe(0);
      wrapper.vm.prefList.push({
        id: 1,
        name: "北海道",
        checked: false,
      });

      wrapper.vm.sendPrefDataToStore(1);

      await flushPromises();
      expect($store.commit).toBeCalled();
      expect($store.commit).toBeCalledTimes(1);
      // 引数チェック
      expect($store.commit.mock.calls[0][0]).toBe("deletePrefecture");
    });
  });
});
