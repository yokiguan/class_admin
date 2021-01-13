<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">选课规则</a></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="detailRule">

    </div>
    <a-modal
            :visible='editVisit'
            width="500px"
            :closable="false"
            on-ok="handleOk">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">
          保存
        </a-button>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
      </template>
      <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="editHandleSubmint" style="margin-left: 100px">
        <a-tree
                checkable
                :tree-data="treeData"
                :default-expanded-keys="['0-0-0', '0-0-1']"
                :default-selected-keys="['0-0-0', '0-0-1']"
                :default-checked-keys="['0-0-0', '0-0-1']"
                :replace-fields="replaceFields"
                @select="onSelect"
                @check="onCheck"
        />
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
      };
    },
  };
</script>

<style lang="less" scoped>
  .result{
    width: 100%;
    background-color: white;
    height:50px;
    margin: 20px 0px 10px 0px;
    padding-left: 25px;
    padding-top: 15px;
    vertical-align: top;
    border-radius: 5px;
  }

</style>
