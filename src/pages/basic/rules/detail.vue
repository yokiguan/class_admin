<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">选课规则</a></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="card-list">
      <a-list :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}" :dataSource="dataSource">
        <a-list-item slot="renderItem" slot-scope="item">
          <template v-if="item.add" >
            <div @click="addNew">
              <a-button class="new-btn" type="dashed">
                <a-icon type="plus" />新增规则
              </a-button>
            </div>
          </template>
          <template v-else>
            <a-card :hoverable="true">
              <a-card-meta>
                <div style="margin-bottom: 3px" slot="title">{{item.title}}</div>
                <div class="meta-content" slot="description" v-html="item.content"></div>
              </a-card-meta>
              <span slot="actions" @click="edit">编辑</span>
              <span slot="actions" @click="Delete">删除</span>
            </a-card>
          </template>
        </a-list-item>
      </a-list>
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
    <a-modal
            :visible='addVisit'
            width="500px"
            :closable="false"
            on-ok="handleOk">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="editHandleSubmint" style="margin-left: 50px">
        <a-form-item label="课程名称：">
          <a-input palceholder="请输入"></a-input>
        </a-form-item>
        <a-form-item label="选择课程：">
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
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  const treeData = [
    {
      name: '高一',
      key: '0-0',
      child: [
        {
          name: '物理',
          key: '0-0-0',
        },
        {
          name: '语文',
          key: '0-0-1',
        },{
          name:'外语',
          key:'0-0-2',
          child: [
            { name: '英语', key: '0-0-0-0'},
            { name: '日语', key: '0-0-0-1' },
          ],
        }
      ],
    },{
      name: '高二',
      key: '0-1',
      child:[{
        name: '语文',
        key:'0-1-0',
      },{
        name: '数学',
        key:'0-1-1',
      },{
        name: '政治',
        key:'0-1-2',
      }]
    }
  ];
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
        treeData,
        editVisit: false,
        addVisit:false,
        loading:false,
        replaceFields: {
          children: 'child',
          title: 'name',
        },
      };
    },
    methods: {
      onSelect(selectedKeys, info) {
        console.log('selected', selectedKeys, info);
      },
      onCheck(checkedKeys, info) {
        console.log('onCheck', checkedKeys, info);
      },
      edit(){
        this.editVisit = true;
      },
      addNew(){
        this.addVisit=true
      },
      Delete(){
      },
      handleOk() {
        this.loading = true;
        setTimeout(() => {
          this.dataSource.push(
                  {
                    title: "必选外语课",
                    content: "高一英语<br/>高一日语<br/>高一法语<br/>",
                  }
          ),
          this.editVisit = false;
          this.addVisit=false;
          this.loading = false;
        }, 2000);
      },
      handleCancel() {
        this.editVisit = false;
        this.addVisit=false;
      },
      editHandleSubmint(){},
      addHandleSubmint(){},
      form(){},
      submit(){},
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
