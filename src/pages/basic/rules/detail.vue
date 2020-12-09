<template>
  <div>
    <div>
      <template v-for="(tag, index) in tags">
<!--      <template>-->
        <div :key="tag"  @close="() => handleClose(tag)"
             style="min-height: 250px;width: 200px;border-radius:10px;background: #fff;float: left;margin-left: 20px;">
          <div style="height: 50px;width: 100%;font-size: 17px;padding: 10px 0px 0px 15px;"><h1>{{form.classType}}</h1></div>
          <div style="min-height: 140px">{{chooseCourse}}</div>
          <div class="footer" style="height: 30px;margin-bottom: -20px">
            <a-divider style="background-color: black;"/>
            <div style="margin-top:-20px">
              <h1  @click="edit()" style="float:left;margin-left: 30px">编辑</h1>
              <h1 @click="Delete()" style="float: right;margin-right: 30px">删除</h1>
            </div>
          </div>
        </div>
      </template>
      <a-button  class="addButton"  @click="showInput"
                 style="height: 250px;width: 200px;border-radius:10px;background: #fff;
                            borderStyle: dashed;float:left;margin-left: 20px;font-size: 20px">
        <a-icon type="plus"/> 新增规则
      </a-button>
    </div>
    <a-modal :closable="false"
             :visible="addRegular">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <a-form-model :model="form" :label-col="{span:5}" :wrapper-col="{span:12}" style="margin-left: 50px">
        <a-form-model-item label="课程类型：" prop="classType" ref="classType">
          <a-input palceholder="请输入" v-model="form.classType"></a-input>
        </a-form-model-item>
        <a-form-model-item label="选择课程：">
          <a-tree
                  v-model="chooseCourse"
                  checkable
                  :tree-data="treeData"
                  :replace-fields="replaceFields"
                  @select="onSelect"
                  @check="onCheck"
                  @search="onSearch"
                  @change="onAddChange"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
            :visible='editVisit'
            width="500px"
            :closable="false">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOkChange">保存
        </a-button>
        <a-button key="back" @click="handleCancelChange">取消</a-button>
      </template>
      <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" style="margin-left: 100px">
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
  export default {
    data() {
      return {
       tags: [],
        // inputVisible: false,
        chooseCourse:[],
        addRegular:false,
        editVisit:false,
        loading:false,
        treeData,
        replaceFields: {
          children: 'child',
          title: 'name',
        },
        form:{
          classType:" ",
        },
      };
    },
    watch: {
      chooseCourse(val) {
        console.log('onCheck', val);
      },
    },
    methods: {
      handleClose(removedTag) {
        const tags = this.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.tags = tags;
      },
      edit(){
        this.editVisit=true
      },
      showInput() {
        this.addRegular=true;
        // this.$nextTick(function() {
        //     this.$refs.input.focus();
        // });
      },
      onSelect(selectedKeys, info) {
        console.log('selected', selectedKeys, info);
      },
      onCheck(checkedKeys, info) {
        console.log('onCheck', checkedKeys, info);
      },
      onAddChange(value){
        console.log(value);
        this.chooseCourse=value;
      },
      onSearch(){
        console.log(...arguments)
      },
      handleCancel(){
        this.addRegular=false;
      },
      handleCancelChange(){
        this.editVisit=false;
      },
      handleOkChange(){
        this.editVisit=false;
      },
      handleOk(){
        this.addRegular=false;
        const chooseValue = this.chooseCourse;
        let tags = this.tags;
        if (chooseValue && tags.indexOf(chooseValue) === -1) {
          tags = [...tags, chooseValue];
        }
        console.log(tags);
        Object.assign(this, {
          tags,
          addRegular: false,
          chooseCourse: '',
        });
      },
    },


  };
</script>
<style lang="less" scoped>
  ant-tag{
    margin-top: -100px;
  }

</style>
