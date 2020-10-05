<template>
  <div>
    <a-modal v-model="visible"
             :title="title"
             @cancel="handleCancel">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          保存
        </a-button>
      </template>
        <slot name="content">

        </slot>
    </a-modal>
  </div>
</template>
<script>
export default {
    name : "CreateModal",
    props : ["title", "visible", "loading"],
    data() {
        return {
        };
    },
    methods: {
        showModal() {
            this.visible = true;
        },
        handleOk() {
            this.loading = true;
            this.$emit("modalSubmit");
        },
        handleCancel() {
            this.visible = false;
            this.$emit("modalClosed");
        },
    },
};
</script>
