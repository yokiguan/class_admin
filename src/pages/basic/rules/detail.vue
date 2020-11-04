<template>
  <div class="card-list">
    <a-list :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}" :dataSource="dataSource">
      <a-list-item slot="renderItem" slot-scope="item">
        <template v-if="item.add">
          <a-button class="new-btn" type="dashed">
            <a-icon type="plus" />新增规则
          </a-button>
        </template>
        <template v-else>
          <a-card :hoverable="true">
            <a-card-meta>
              <div style="margin-bottom: 3px" slot="title">{{item.title}}</div>
              <div class="meta-content" slot="description" v-html="item.content"></div>
            </a-card-meta>
            <a slot="actions">编辑</a>
            <a slot="actions">删除</a>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
  let dataSource = [
    {
      title: "必选课程",
      content: "高一语文<br/>高一数学<br/>",
    },
    {
      title: "必选外语课",
      content: "高一英语<br/>高一日语<br/>高一法语<br/>",
    }
  ];
  dataSource.push({
    add: true,
  });
  export default {
    name: "CardList",
    data() {
      return {
        dataSource,
      };
    },
  };
</script>

<style lang="less" scoped>
  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }
  .new-btn {
    border-radius: 2px;
    width: 100%;
    height: 187px;
  }
  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>
