<template>
    <EasyScrollbar :barOption="myBarOption">
        <div id="wrapper" style="width: 600px">
            <div style="width: 1800px">
                <div class="result">
                    <a-breadcrumb>
                        <a-breadcrumb-item>首页</a-breadcrumb-item>
                        <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
                        <a-breadcrumb-item><a href="">教学场地排课规则</a></a-breadcrumb-item>
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
                            v-model="checkedBuildingKeys"
                            :selected-keys="selectBuildingKeys"
                            @select="selectBuilding"
                            style="font-size: 1.3em;"/>
                </div>
                <div class="right">
                    <LocationRegular v-if="showcomLocation"></LocationRegular>
                    <CurriculumRegular v-if="showcomCurriculum"></CurriculumRegular>
<!--                    <LocationRegular></LocationRegular>-->
<!--                    <CurriculumRegular></CurriculumRegular>-->
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
                // treeData,
                buildingsData:[],
                showcomLocation:false,
                showcomCirriculum:false,
                myBarOption:{
                    barColor:'block'
                },
                checkedBuildingKeys:[],
                selectBuildingKeys:[],
                disabled: false,
                replaceFields: {
                    children: 'child',
                    title: 'name',
                },
            };
        },
        created(){
            this.getData()
        },
        watch:{
          checkedBuildingKeys(val){
              console.log('onCheck',val);
          }
        },
        methods: {
            async getData () {
                console.log(this.$api.basic.building.fetchList())
                let {data} = await this.$api.basic.classroom.fetchRoomList();
                // this.buildingsData = data.result
                console.log(data.result)
                for(let i in data.result) {
                    // 第一层
                    let numberTree = {}
                    numberTree.title = data.result[i].building_name
                    numberTree.key = data.result[i].building_Id
                    if (data.result[i].floor_list.length) {
                    //    第二层
                        numberTree.children = []
                        for (let j = 0; j < data.result[i].floor_list.length; j++) {
                            let item = data.result[i].floor_list[j]
                            let childData = {}
                            childData.key = item.floor
                            childData.title = '第' + item.floor + '层'
                            if(item.classroom_list.length) {
                                childData.children = []
                                for (let k in item.classroom_list) {
                                    let dataThree = {}
                                    dataThree.key = item.classroom_list[k].room_id
                                    dataThree.title = item.classroom_list[k].classroom_name
                                }
                                childData.children.push(dataThree)
                            }
                            numberTree.children.push(childData)
                        }
                    }
                    this.buildingsData.push(numberTree)
                    console.log(data.result[i])
                }
                console.log(this.buildingsData)
            },
            onCheck(checkedKeys){
              this.selectBuildingKeys=checkedKeys;
              // this.$router.push('/basic/classroom/rule/location');
              this.showcomLocation=true;
            },
            selectBuilding(selectBuildingsKeys,info){
                this.selectBuildingKeys=selectBuildingsKeys;
                // this.$router.push('/basic/classroom/rule/location');
                this.showcomLocation=true;
            },
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

