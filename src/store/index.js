import { createStore } from "vuex";

export default createStore({
  state: {
    // 入力された都道府県の総人口等のデータを持つ
    prefectures: [],
  },
  mutations: {
    /**
     * RESAS API で取得したデータを挿入する
     * @param {Object} state Vuex ステート
     * @param {{code: Number, name: String, data: Array}} pref
     * { code: 都道府県コード, name: 都道府県名, population: 人口構成データ }
     */
    insertPrefecture(state, pref) {
      state.prefectures.push({
        code: pref.code,
        name: pref.name,
        data: pref.data,
      });
    },
    /**
     * 指定したcodeを持つ要素を削除する
     * @param {Object} state Vuex ステート
     * @param {Number} code 都道府県コード
     */
    deletePrefecture(state, code) {
      let length = state.prefectures.length;
      for (let i = 0; i < length; i++) {
        if (state.prefectures[i].code === code) {
          state.prefectures.splice(i, 1);
        }
      }
    },
  },
  actions: {},
  modules: {},
});
