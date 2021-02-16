<template>
    <EasyScrollbar :barOption="myBarOption">
        <div id="wrapper" style="width: 600px">
            <div style="width: 1800px">
                <div class="result">
                    <a-breadcrumb>
                        <a-breadcrumb-item>首页</a-breadcrumb-item>
                        <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
                        <a-breadcrumb-item><a href="">教师排课规则</a></a-breadcrumb-item>
                    </a-breadcrumb>
                </div>
                <div class="left">
                    <a-row class="left_title">
                        <a-col :span="3"><a-icon type="reload" style="font-size: 1.5em;
                    font-weight: bold"/></a-col>
                        <a-col :span="12"><span style="font-size: 1.2em">刷新菜单</span></a-col>
                        <a-col><span style="font-size: 1.2em">全部展开</span></a-col>
                    </a-row>
                    <div style="width: 100%; height: 1px;
            margin-top: 10px;
            border-top: solid black 1px;"></div>
                    <a-tree
                            :tree-data="treeData"
                            checkable
                            v-model="checkedKeys"
                            :checkedKeys="checkedKeys"
                            @check="onCheck"
                            style="font-size: 1.3em;"/>
                </div>
                <div class="right">
                    <ClassRegular v-if="showcomClass" :teacherName="name" @form-modal-change="changeEvent"/>
                    <LocationRegular v-if="showcomLocation" :templateId ="templateId"/>
                    <CurriculumRegular v-if="showcomCurriculum" />
                </div>
            </div>
        </div>
    </EasyScrollbar>
</template>
<script>
    import ClassRegular from './class'
    import LocationRegular from './location'
    import CurriculumRegular from "./curriculum"
    export default {
        name:'teacherRule',
        components: {ClassRegular,LocationRegular,CurriculumRegular},
        data() {
            return {
                treeData:[],
                myBarOption:{
                    barColor:'block'
                },
                disabled: false,
                showcomClass:false,
                showcomCurriculum: false,
                showcomLocation:false,
                checkedBuildingKeys:[],
                checkedKeys:[],
                name:"",
            };
        },
        created() {
            this.getData();
        },
        watch:{
            checkedKeys(val){
                console.log('watchDataOfKeys',val);
            }
        },
        methods: {
            //获取数据
            async getData(){
                let {data:{result,success}}=await this.$api.basic.teacher.AdminGradeSubTec();
                console.log(result);
                for(let i=0;i<result.length;i++){
                    //第一层(级部）
                    let adminTree={};
                    adminTree.title=result[i].adminName;
                    adminTree.key=result[i].adminId;
                    if(result[i].adminGrades.length){
                        //第二层(年级）
                        adminTree.children=[];
                        for(let j=0;j<result[i].adminGrades.length;j++){
                            let gradeItem=result[i].adminGrades[j];
                            let childData={}
                            childData.key=gradeItem.gradeId;
                            childData.title=gradeItem.gradeName;
                            if(gradeItem.subSubjectDtos.length){
                                //第三层(主课程)
                                childData.children=[];
                                for(let k in gradeItem.subSubjectDtos){
                                    let mainCourseItem=gradeItem.subSubjectDtos[k];
                                    let mainCourse={};
                                    mainCourse.key=mainCourseItem.subId;
                                    mainCourse.title=mainCourseItem.subName;
                                    if(mainCourseItem.teacherDtos){
                                        //第四层（教师）
                                        mainCourse.children=[];
                                        for (let l in mainCourseItem.teacherDtos){
                                            let teacher={};
                                            teacher.key=result[i].adminId+gradeItem.gradeId+mainCourseItem.subId+mainCourseItem.teacherDtos[l].teacherId;
                                            teacher.title=mainCourseItem.teacherDtos[l].teacherName;
                                            mainCourse.children.push(teacher)
                                        }
                                    }
                                    childData.children.push(mainCourse)
                                }
                            }
                            adminTree.children.push(childData);
                        }
                    }
                    this.treeData.push(adminTree);
                    console.log(this.treeData);
                }
            },
            onCheck(e){
                console.log(this.checkedKeys);
                console.log('onCheck',e);

                this.showcomClass=true;
            },
            changeEvent (modal) {
                console.log('modal',modal)
                this.templateId = modal
                modal ? this.showcomLocation = true : showcomLocation = false
            }
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
    .left{
        width: 300px;
        height: 1410px;
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 10px;
    }
    .right{
        border-radius: 5px;
        margin-top: -1445px;
        margin-left: 320px;
        height:700px;
    }
    .title{
        width: 100%;
        background-color: #fff;
        height: 170px;
        padding: 20px 25px;
        border-radius: 10px;
        margin-bottom: 50px;
    }
    /*.table-bg1{*/
    /*    background-color: white;*/
    /*    margin-top: 35px;*/
    /*    padding: 20px 25px;*/
    /*    border-radius: 10px;*/
    /*    text-align: center;*/
    /*    width: 100%;*/
    /*    height: 440px;*/
    /*}*/
    /*.table-bg2{*/
    /*    background-color: white;*/
    /*    margin-top: 10px;*/
    /*    padding: 20px 25px;*/
    /*    border-radius: 10px;*/
    /*    text-align: center;*/
    /*    width: 100%;*/
    /*    height: 800px;*/
    /*}*/
</style>

