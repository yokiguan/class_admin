<template>
    <EasyScrollbar :barOption="myBarOption">
        <div id="wrapper" style="width: 600px">
            <div style="width: 1800px">
                <div class="result">
                    <a-breadcrumb>
                        <a-breadcrumb-item>首页</a-breadcrumb-item>
                        <a-breadcrumb-item>基础数据</a-breadcrumb-item>
                        <a-breadcrumb-item>教学场地排课规则</a-breadcrumb-item>
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
                            :tree-data="buildingsData"
                            checkable
                            v-model="checkedKeys"
                            :checkedKeys="checkedKeys"
                            @check="onCheck"
                            style="font-size: 1.3em;"/>
                </div>
                <div class="right">
                    <LocationRegular v-if="showcomLocation" @form-modal-change="changeEvent"></LocationRegular>
                    <CurriculumRegular :classRoomId="selectRoomIds" v-if="showcomCurriculum" :templateId ="templateId"></CurriculumRegular>
                </div>
            </div>
        </div>
    </EasyScrollbar>

</template>
<script>
    import LocationRegular from './location'
    import CurriculumRegular from "./curriculum"
    export default {
        name:'teacherRule',
        components: {LocationRegular,CurriculumRegular},
        data() {
            return {
                showcomCurriculum: false,
                buildingsData:[],
                checkedKeys:[],
                showcomLocation:false,
                showcomCirriculum:false,
                myBarOption:{
                    barColor:'block'
                },
                templateId:'',
                adminClass:"",
                classRoomIds:[],
                selectRoomIds:[],

            };
        },
        created(){
            this.getData();
        },
        watch:{
            checkedKeys(val){
                console.log('watchDataOfKeys',val);
                this.selectRoomIds = []
                this.checkedKeys.forEach(item=>{
                    if(this.classRoomIds.indexOf(item) >= 0){
                        this.selectRoomIds.push(item)
                    }
                })
            }
        },
        methods: {
            //查看信息树
            async getData () {
                let {data} = await this.$api.basic.classroom.fetchRoomList();
                console.log(data.result)
                for(let i in data.result) {
                    // 第一层
                    let numberTree = {}
                    numberTree.title = data.result[i].building_name
                    numberTree.key = data.result[i].building_Id
                    // console.log(data.result[i].floor_list)
                    if (data.result[i].floor_list.length) {
                        //    第二层
                        numberTree.children = []
                        for (let j = 0; j < data.result[i].floor_list.length; j++) {
                            let item = data.result[i].floor_list[j]
                            let childData = {}
                            childData.key = data.result[i].building_Id + item.floor
                            childData.title = '第' + item.floor + '层'
                            // console.log(item.classroom_list);
                            if(item.classroom_list.length) {
                                childData.children = []
                                //第三层
                                for (let k in item.classroom_list) {
                                    let dataThree = {}
                                    dataThree.key = item.classroom_list[k].room_id;
                                    this.classRoomIds.push(item.classroom_list[k].room_id)
                                    dataThree.title = item.classroom_list[k].classroom_name;
                                    childData.children.push(dataThree)
                                }
                            }
                            numberTree.children.push(childData)
                        }
                    }
                    this.buildingsData.push(numberTree)
                    // console.log(data.result[i])
                }
                // console.log(this.buildingsData)
            },
            //监控选择的数
            onCheck(e){
                console.log(this.checkedKeys);
                console.log('onCheck',e);
                this.showcomLocation=true;
                let classroomId=[];
                this.checkedKeys.forEach((item,index)=>{
                    console.log(item);
                    console.log(index);
                    let parentNode=this.buildingsData.filter(child=>child.key===item)
                    console.log(parentNode);
                    if(parentNode.length>0&& Object.prototype.hasOwnProperty.call(parentNode[0],'children')){
                        parentNode[0].children.forEach(chr=>{
                            console.log(chr.key);
                            classroomId.push(chr.key);
                        });
                    }else{
                        console.log(item);
                        classroomId.push(item)
                    }
                })
                this.checkedKeys=classroomId;
                console.log(this.checkedKeys);
            },
            changeEvent (modal) {
                console.log('modal',modal)
                this.templateId = modal
                modal ? this.showcomCurriculum = true : this.showcomCurriculum = false
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
        margin-top: -1425px;
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
