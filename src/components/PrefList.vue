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
