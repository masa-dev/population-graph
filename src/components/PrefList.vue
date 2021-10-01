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
       * @type {Array}
       */
      prefList: [],
    };
  },
  mounted() {
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
      .then((response) => response.json())
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
        console.log(error);
      });
  },
};
</script>
