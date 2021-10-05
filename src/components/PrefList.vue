<template>
  <div class="pref-list">
    <h2>都道府県</h2>
    <div class="pref-inputs">
      <ul>
        <li
          v-for="pref in prefList"
          :id="`pref-id-${pref.id}`"
          v-bind:key="pref.id"
        >
          <input
            type="checkbox"
            :id="`pref-input-${pref.id}`"
            v-model="pref.checked"
            @change="sendPrefDataToStore(pref.id)"
          />
          <label :for="`pref-input-${pref.id}`">{{ pref.name }}</label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "PrefList",
  data() {
    return {
      /**
       * 都道府県の一覧
       * @type {Array} プロパティ：id, name, checked
       */
      prefList: [],
    };
  },
  mounted() {
    // RESAS APIを用いて都道府県一覧を取得する
    const apiKey = require("../../apiKey");
    const requestURL = "https://opendata.resas-portal.go.jp/api/v1/prefectures";
    const headerName = apiKey.resas.name;
    const headerValue = apiKey.resas.value;

    fetch(requestURL, {
      method: "GET",
      headers: {
        [headerName]: headerValue,
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error("response.ok:", response.ok);
          console.error("response.status:", response.status);
          console.error("response.statusText:", response.statusText);
          throw new Error(response.statusText);
        }

        return response.json();
      })
      .then((data) => {
        data.result.forEach((el) => {
          let pref = {
            id: el.prefCode,
            name: el.prefName,
            checked: false,
          };
          this.prefList.push(pref);
        });
      })
      .catch((error) => {
        console.error("エラーが発生しました。", error);
      });
  },
  methods: {
    // vuex ストアにグラフで表示するための人口データを送信する
    sendPrefDataToStore(id) {
      const prefData = this.prefList.filter((pref) => pref.id === id)[0];

      // ストアにデータを送る
      if (prefData.checked) {
        const apiKey = require("../../apiKey");
        const requestURL =
          "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear";
        const headerName = apiKey.resas.name;
        const headerValue = apiKey.resas.value;
        const params = { prefCode: prefData.id, cityCode: "-" };
        const query = new URLSearchParams(params);

        // 総人口データを取得する
        fetch(`${requestURL}?${query}`, {
          method: "GET",
          headers: {
            [headerName]: headerValue,
          },
        })
          .then((response) => {
            if (!response.ok) {
              console.error("response.ok:", response.ok);
              console.error("response.status:", response.status);
              console.error("response.statusText:", response.statusText);
              throw new Error(response.statusText);
            }

            return response.json();
          })
          .then((data) => {
            // 実数値の年数上限
            const maxYear = data.result.boundaryYear;
            // 総人口かつ実数値のデータを抽出する
            const actualData = data.result.data
              .filter((el) => el.label === "総人口")[0]
              .data.filter((el) => el.year <= maxYear);

            this.$store.commit("insertPrefecture", {
              code: prefData.id,
              name: prefData.name,
              data: actualData,
            });
          })
          .catch((error) => {
            console.error("エラーが発生しました。", error);
          });
      }

      // ストアに存在しているデータを削除する
      else {
        this.$store.commit("deletePrefecture", prefData.id);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pref-list {
  h2 {
    font-size: 1.3rem;
    margin-left: 1rem;
  }

  .pref-inputs {
    ul {
      display: flex;
      flex-wrap: wrap;
      padding-left: 0;

      li {
        width: 7em;
        font-size: 1.1rem;
        margin: 3px 0;
        list-style: none;

        input {
          cursor: pointer;
        }

        label {
          padding: 5px;
          padding-left: 10px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
