<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script>
import enquireScreen from "./utils/device";

export default {
  name: "App",
  data() {
    return {
      locale: {},
    };
  },
  created() {
    let _this = this;
    enquireScreen((isMobile) => {
      _this.$store.commit("setting/setDevice", isMobile);
    });
  },
  mounted() {},
  methods: {},
};
</script>
