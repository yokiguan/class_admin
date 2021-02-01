<template >
    <a-card class="class_content">
        <a-row style="height: 40px;width: 1300px;background-color:#6Db5a7;color: white;border-radius: 5px;border:1px solid black;margin-left: -35px;margin-top: -30px">
            <a-col>
                <span style="float: left;padding:7px">班级规则</span>
            </a-col>
        </a-row>
        <a-row style="float: left;margin-top: 10px">
            <h3>赵卫民老师：</h3>
        </a-row>
       <a-row>
           <a-form-model :form="form" :label-col="{span:4}" :wrapper-col="{span:5}" >
               <a-form-model-item label="选择授课年级/班级">
                   <a-tree-select v-model="form.modal"
                                  placeholder="请选择年级"
                                  style="width: 275px"
                                  :checkedKeys="checkedKeys"
                                  :tree-data="treeData"
                                  tree-checkable
                                  :show-checked-strategy="SHOW_PARENT">
                   </a-tree-select>
               </a-form-model-item>
           </a-form-model>
       </a-row>
    </a-card>
</template>
<script>
    import { TreeSelect } from 'ant-design-vue';
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    export default {
        data(){
            return{
                treeData:[],
                SHOW_PARENT,
                checkedKeys:[],
                form:{},
            }
        },
        created(){
            this.grade();
        },
        watch:{
            "form.modal"(){
                this.$emit("form-modal-change",this.form.modal);
            }
        },
        methods:{
            //获取年级班级信息
            async grade(){
                this.treeData = []
                let {data:{result,success}}=await this.$api.basic.grade.fetchList();
                console.log(result);
                for(let i in result){
                    //第一层（级部）
                    let adminData={};
                    adminData.title=result[i].adminName;
                    adminData.key=adminData.value=result[i].adminId;
                    if(result[i].adminGrades.length){
                        //第二层（年级）
                        adminData.children=[];
                        for(let j=0;j<result[i].adminGrades.length;j++){
                            let item=result[i].adminGrades[j];
                            let gradeData={};
                            gradeData.key=gradeData.value=item.gradeId;
                            gradeData.title=item.gradeName;
                            adminData.children.push(gradeData);
                        }
                    }
                    this.treeData.push(adminData);
                }
                console.log("this.treeData",this.treeData)
            },
        },
    }
</script>
<style lang="less"scoped>
    .class_content{
        height:150px;
        background-color: white;
        margin-top: 35px;
        border-radius: 5px;
        padding: 20px 25px;
        text-align: center;
        width: 100%;

    }
</style>
<style lang="stylus" scoped>

</style>
