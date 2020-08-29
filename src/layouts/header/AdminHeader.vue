<template>
  <a-layout-header :class="[headerTheme, 'admin-header']">
    <div :class="['admin-header-wide', layout]">
      <router-link
        v-if="isMobile || layout === 'head'"
        to="/"
        :class="['logo', isMobile ? null : 'pc', headerTheme]"
      >
        <img width="32" src="@/assets/img/logo.png" />
        <h1 v-if="!isMobile">{{systemName}}</h1>
      </router-link>
      <a-divider v-if="isMobile" type="vertical" />
      <a-icon
        v-if="layout === 'side'"
        class="trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="toggleCollapse"
      />
      <div v-if="layout == 'head' && !isMobile" class="admin-header-menu">
        <i-menu
          class="head-menu"
          style="height: 64px; line-height: 64px;box-shadow: none"
          @i18nComplete="setRoutesI18n"
          :i18n="menuI18n"
          :theme="headerTheme"
          mode="horizontal"
          :options="menuData"
          @select="onSelect"
        />
      </div>
      <div :class="['admin-header-right', headerTheme]">
        <header-search class="header-item" />
        <a-tooltip class="header-item" title="帮助文档" placement="bottom">
          <a>
            <a-icon type="question-circle-o" />
          </a>
        </a-tooltip>
        <header-avatar class="header-item" />
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import HeaderSearch from "./HeaderSearch";
import HeaderAvatar from "./HeaderlAvatar";
import IMenu from "@/components/menu/menu";
import { mapState, mapMutations } from "vuex";

export default {
  name: "AdminHeader",
  components: { IMenu, HeaderAvatar, HeaderSearch },
  props: ["collapsed", "menuData"],
  inject: ["menuI18n"],
  data() {
    return {};
  },
  computed: {
    ...mapState("setting", [
      "theme",
      "isMobile",
      "layout",
      "systemName",
      "lang",
    ]),
    headerTheme() {
      if (
        this.layout == "side" &&
        this.theme.mode == "dark" &&
        !this.isMobile
      ) {
        return "light";
      }
      return this.theme.mode;
    },
  },
  methods: {
    toggleCollapse() {
      this.$emit("toggleCollapse");
    },
    onSelect(obj) {
      this.$emit("menuSelect", obj);
    },
    ...mapMutations("setting", ["setLang", "setRoutesI18n"]),
  },
};
</script>

<style lang="less" scoped>
@import "index";
</style>
