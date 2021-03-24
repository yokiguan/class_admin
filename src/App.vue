<template>
  <a-config-provider :locale="zh_CN">
    <router-view/>
  </a-config-provider>
</template>

<script>
import enquireScreen from "./utils/device";
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

export default {
  name: "App",
  data() {
    return {
     zh_CN,
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
