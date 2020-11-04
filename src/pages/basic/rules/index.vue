<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="gotoNew" type="primary">新建</a-button>
      </div>
      <a-table
              :rowKey="'key'"
              :columns="columns"
              :dataSource="dataSource"
      >
        <span slot='operation' slot-scope="text,value"><a @click="showModal(value)">编辑</a> | <a @click="gotoNew">查看</a> | <a @click="remove(value)">删除</a></span>
      </a-table>
    </div>
    <a-modal title="修改规则名字" :visible='visible' @ok='editSubmit' @cancel='cancelSubmit'>
      <a-input label='规则初始名' disabled placeholder="请输入" v-model='name'></a-input>
      <a-input label='规则修改名' placeholder="请输入" v-model='changeName'></a-input>
    </a-modal>
  </a-card>
</template>

<script>
  const columns = [
    {
      title: '序号',
      dataIndex: 'no'
    },
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '选课规则',
      dataIndex: 'text,value',
      scopedSlots: { customRender: 'operation' },
    }
  ]

  const dataSource = [{
    key:1,
    no:1,
    name:'6+3'
  },{
    key:2,
    no:2,
    name:'3+2+2',
  },{
    key:3,
    no:3,
    name:'高三选课规则（文）',
  }]

  export default {
    name: '选课规则',
    data () {
      return {
        columns,
        dataSource,
        visible:false,
        name:'',
        changeName:'',
        clickItem:null,
      }
    },
    methods: {
      remove (value) {
        this.dataSource = this.dataSource.filter(item => item.key==value.key)
      },
      gotoNew () {
        this.$router.push('/basic/rule/detail')
      },
      showModal(value){
        this.visible=true
        this.clickItem=value
        this.name=value.name
      },
      editSubmit(){
        this.dataSource.forEach(item=>{
          if(item.key==this.clickItem.key)
            item.name=this.changeName
        })
        this.visible=false
      },
      cancelSubmit(){
        this.changeName=''
        this.visible=false
      }
    }
  }
</script>

<style lang="less" scoped>
  .search{
    margin-bottom: 54px;
  }
  .fold{
    width: calc(100% - 216px);
    display: inline-block
  }
  .operator{
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
