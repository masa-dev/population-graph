import store from "@/store/index.js";

describe("mutations", () => {
  // ダミーデータ
  const pref = {
    code: 1,
    name: "Dummy Name",
    data: [
      { year: 1000, value: 1000 },
      { year: 2000, value: 9000 },
    ],
  };

  describe("insertPrefecture メソッド", () => {
    test("データの挿入と照合", () => {
      store.commit("insertPrefecture", pref);

      // それぞれの入力値を確認する
      expect(store.state.prefectures[0].code).toBe(pref.code);
      expect(store.state.prefectures[0].name).toBe(pref.name);
      for (let i = 0; i < pref.data.length; i++) {
        expect(store.state.prefectures[0].data[i].year).toBe(pref.data[i].year);
        expect(store.state.prefectures[0].data[i].value).toBe(
          pref.data[i].value
        );
      }
    });
  });

  describe("deletePrefecture メソッド", () => {
    test("削除する対象が存在する場合", () => {
      // データはすでに挿入されているためそのまま実行する
      store.commit("deletePrefecture", pref.code);

      // 削除されているか確認する
      expect(store.state.prefectures.length).toBe(0);
    });

    test("削除する対象が存在しない場合", () => {
      store.commit("insertPrefecture", pref);
      // 存在しない数値を入力する
      store.commit("deletePrefecture", 9999);

      // 残っていることを確認する
      expect(store.state.prefectures.length).toBe(1);

      // 削除しておく
      store.commit("deletePrefecture", pref.code);
      expect(store.state.prefectures.length).toBe(0);
    });
  });
});

describe("getters", () => {
  describe("prefecturesゲッター", () => {
    test("格納されたデータがゲッターで引き渡されるか確認する", () => {
      // 要素をゼロかを確認する
      expect(store.state.prefectures.length).toBe(0);

      // データを代入する
      const pref = {
        code: 1,
        name: "Dummy Name",
        data: [{ prop: 1 }],
      };
      store.commit("insertPrefecture", pref);

      // ゲッターで取得する
      const gotPref = store.getters.prefectures;

      // 配列を返しているか
      expect(Array.isArray(gotPref)).toBeTruthy();
      expect(gotPref.length).toBe(1);
      expect(gotPref[0].code).toBe(pref.code);
      expect(gotPref[0].name).toBe(pref.name);
      expect(gotPref[0].data[0].prop).toBe(pref.data[0].prop);
    });
  });
});
