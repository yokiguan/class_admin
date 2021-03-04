<template>
    <div>
        <div>
            <div class="result">
                <a-breadcrumb>
                    <a-breadcrumb-item>首页</a-breadcrumb-item>
                    <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                    <a-breadcrumb-item><a href="">选课排课</a></a-breadcrumb-item>
                    <a-breadcrumb-item><a href="">课程设置</a></a-breadcrumb-item>
                </a-breadcrumb>
            </div>
            <div class="header-item">
                <a-row>
                    <a-col :span="13"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                        <a-button style="background-color: #00ccff;
                                    color: white;
                                    height: 40px;
                                    border-radius: 5px;
                                    width: 100px" @click="contrastRegular">互斥规则</a-button>
                        <button style="background-color: #00ccff;margin-left: 50px;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 100px " @click="sameClass">同时上课</button>
                        <button style="background-color: #00ccff;margin-left: 50px;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 100px" @click="banned">禁止相邻</button>
                        <button style="background-color: blue;margin-left: 50px;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 100px" @click="back">返回</button>
                </a-row>
            </div>
            <a-card class="content">
                <a-row class="buttons">
                    <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting">课时设置</a-button></a-col>
                    <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                    <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="placeSetting">教室设置</a-button></a-col>
                    <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="courseSetting">课程设置</a-button></a-col>
                    <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
                </a-row>
                <div class="table-content">
                    <a-table :rowKey="'id'"
                            :columns="columns"
                            :data-source="tableData"
                            :pagination="false"
                            :bordered="true">
                        <a-input slot="add_times" slot-scope="timeText,timeRecord" v-model="timeText" @blur="changTimes(timeRecord.id,timeText)"/>
                        <a-input slot="add_datas" slot-scope="dayText,dayRecord" v-model="dayText" @blur="changDays(dayRecord.id,dayText)"/>
                        <a-button slot="adds_times" slot-scope="timesText,timesRecord" style="background-color: #00ccff;color:white;" @click="add_time(timesRecord.id,timesText)">添加时间段</a-button>
                        <a-button slot="adds_datas" slot-scope="daysText,daysRecord" style="background-color: #00ccff;color:white;" @click="add_class(daysRecord.id,daysText)">添加教室</a-button>
                        <template slot="action" slot-scope="text,record" style="color:blue">
                            <a-popconfirm
                                    v-if="tableData.length"
                                    title="确认删除?"
                                    @confirm="() => onDelete(record.id)">
                                <a href="javascript:;">删除</a>
                            </a-popconfirm>
                        </template>
                    </a-table>
                    <button style="background-color: #00ccff;
                border: none;color: white;
                float: right;
                height: 40px;
                border-radius: 5px;
                width: 150px;
                margin-right: 50px;
                margin-top:50px" @click="Next">  下一步</button>
                </div>
            </a-card>
        </div>
<!--            选择时间段-->
            <a-modal :visible='chooseTimeVisit'
                     width="600px"
                     title="选择时间段"
                     :closable="false">
                <template slot="footer">
                    <a-button key="Save" type="primary" :loading="loading" @click="handleOkTime">保存</a-button>
                    <a-button key="back" @click="handleCancelTime">取消</a-button>
                </template>
                <a-form-model style="margin-top: 30px" :form="form" :rules="rules" ref="ruleForm" :label-col="{ span:4}" :wrapper-col="{ span: 18}">
                    <a-form-model-item label="类型" ref="type" prop="type">
                        <a-select placeholder="不使用/优先使用/必须使用" v-model="form.type">
                            <a-select-option value="不使用">不使用</a-select-option>
                            <a-select-option value="优先使用">优先使用</a-select-option>
                            <a-select-option value="必须使用">必须使用</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择天" ref="day" prop="day">
                        <a-select placeholder="星期一" v-model="form.day">
                            <a-select-option value="one">星期一</a-select-option>
                            <a-select-option value="two">星期二</a-select-option>
                            <a-select-option value="three">星期三</a-select-option>
                            <a-select-option value="four">星期四</a-select-option>
                            <a-select-option value="five">星期五</a-select-option>
                            <a-select-option value="six">星期六</a-select-option>
                            <a-select-option value="seven">星期日</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择节">
                        <a-checkbox-group
                                v-model="form.checkValue"
                                name="checkboxgroup"
                                :options="options"
                                style="margin-left: 20px;padding-left: 20px;padding-bottom: 10px"/>
                    </a-form-model-item>
                </a-form-model>
            </a-modal>
<!--            添加教室-->
            <a-modal :visible='addClassroomVisit'
                     width="600px"
                     title="选择教室"
                     :closable="false">
                <template slot="footer">
                    <a-button key="Save" type="primary" :loading="loading" @click="handleOkClass">保存</a-button>
                    <a-button key="back" @click="handleCancelClass">取消</a-button>
                </template>
                <a-form-model style="margin-top: 30px" :form="form" :rules="rules" ref="ruleForm" :label-col="{ span:4}" :wrapper-col="{ span: 18}">
                    <a-form-model-item label="类型" ref="classroomType" prop="classroomType">
                        <a-select placeholder="不使用/优先使用/必须使用" v-model="form.classroomType">
                            <a-select-option value="不使用">不使用</a-select-option>
                            <a-select-option value="优先使用">优先使用</a-select-option>
                            <a-select-option value="必须使用">必须使用</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择教学楼" ref="building" prop="building">
                        <a-select v-model="form.building" :default-value="buildings[0].name" placeholder="请选择教学楼" @change="changeBuilding">
                            <a-select-option v-for="(building,index) in this.buildings" :key="index" :value="building.name">
                                {{ building.name}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择教室">
                        <a-checkbox-group
                                v-model="form.checkValue"
                                name="checkboxgroup"
                                :options="classOptions"
                                style="margin-left: 20px;padding-left: 20px;padding-bottom: 10px"/>
                    </a-form-model-item>
                </a-form-model>
            </a-modal>
    </div>
</template>
<script>
    const columns=[
        {
          title:'',
          dataIndex:'id',
          align:'center',
          customRender: function(t, r, index) {
              return parseInt(index) + 1
            }
        },
        {
            title: '课程名称',
            dataIndex: 'className',
            align:'center',
        },{
            title:'老师',
            dataIndex:'userName',
            align:'center',
        },{
            title:'每周课时',
            dataIndex:'lessonNum',
            align:'center',
            scopedSlots: { customRender: 'add_times' }
        },{
            title:'最小上课天数',
            dataIndex:'minNum',
            align:'center',
            scopedSlots: { customRender: 'add_datas' }
        },{
            title:'时间设置',
            dataIndex:'setting_time',
            key:'setting_time',
            align:'center',
            scopedSlots: { customRender: 'adds_times' }
        },{
            title:'教室设置',
            dataIndex:'setting_class',
            key:'setting_class',
            align:'center',
            scopedSlots: { customRender: 'adds_datas'}
        },{
            title:'操作',
            dataIndex:'opt',
            key:'opt',
            align:'center',
            scopedSlots: { customRender: 'action' }
        }];
    const activity = [
        { name: '上午',options:[0,1,2,3,4], value: 'morning' },
        { name: '中午',options:[0,1,2], value: 'noon' },
        { name: '下午',options:[0,1,2,3,4], value: 'afternoon' },
    ];
    export default {
        data() {
            return {
                columns,
                activity,
                options:[],
                classOptions:[],
                tableData:[],
                loading:false,
                chooseTimeVisit: false,
                addClassroomVisit:false,
                planData:"",
                deleteText:-1,
                buildings: [{buildingId:"",name:""}],
                currId:"",
                form:{},
                rules:{},
                timesValue:"",
                timesIndex:"",
                daysValue:"",
                daysIndex:"",
            }
        },
        async created() {
            let queryString = (window.location.hash || " ").split('?')[1]
            let planId = (queryString || " ").split('=')[1]
            this.planId = planId;
            if (planId) {
                //获取单个选课计划的信息
                let {data: {result, success}} = await this.$api.schedule.plan.schedulegetInfo({planId})
                this.planData = result.name
            }
            this.courseLookInfo();
        },
        methods:{
            //课程设置信息查看
            async courseLookInfo(){
                let {data}=await this.$api.schedule.arrangeClass.getList({planId:this.planId})
                this.tableData=data.rows;
                // console.log(this.tableData);
                for(let i=0;i<this.tableData.length;i++){
                    this.tableData[i].timesSetting=[{
                        timeType:null,
                        weekday:"",
                        period:null
                    }];
                    this.tableData[i].classroomSetting=[{
                        classroomType: null,
                        buildingId:"",
                        classroomId:"",
                    }];
                }
                console.log(this.tableData);
                this.currId=this.tableData[0].currId;
                // console.log(this.currId);
            },
            //获取教室和教学楼相关信息
            async classroomAndBuilding(){
                let {data:buildings}=await this.$api.basic.building.fetchList();
                this.buildings =buildings.rows
            },
            //选择时间段
            add_time(index,value) {
                this.chooseTimeVisit=true;
                this.modalInfo();
                this.timesIndex=index;
                this.timesValue=value;
            },
            //添加教室
            add_class(){
                this.addClassroomVisit=true;
                this.classroomAndBuilding();
            },
            //获取节次时间
            async modalInfo() {
                let {data} = await this.$api.basic.template.fetchTemplate({id: this.currId});
                // console.log(data);
                let activities=[];
                let list=[...this.activity];
                list.forEach(item=>{
                    for(let i=1;i<=data.result[item.value];i++){
                        activities.push({
                            label: item.name+i,
                            value:item.value+i,
                        });
                    }
                });
                this.options=activities;
                // console.log(this.options);
                // console.log(list);
            },
            //选择教室
            async changeBuilding(){
                console.log(this.form.building);
                let {data} = await this.$api.basic.classroom.fetchRoomList();
                console.log(data.result);
                for(let i=0;i<data.result.length;i++){
                    if(this.form.building==data.result[i].building_name){
                        let floorData=data.result[i].floor_list;
                        console.log(floorData);
                        for(let j=0;j<floorData.length;j++){
                            let classData=floorData[j].classroom_list
                            console.log(classData);
                            for(let k=0;k<classData.length;k++){
                                let pushData={
                                    label:classData[k].classroom_name,
                                    value:classData[k].classroom_name,
                                }
                                this.classOptions.push(pushData);
                            }
                        }
                    }
                }
                console.log(this.classOptions);
            },
            //保存时间段
            handleOkTime(){
              this.chooseTimeVisit=false;
                this.tableData.map(item=>{
                    console.log(item);
                //     if(item.id === this.timesIndex){
                //         let addData={
                //             item.timeSetting[0].peroid:
                //         }
                //
                //          return item.timeSetting
                //     }
                })
                // console.log(this.tableData);
            },
            //取消选择时间段
            handleCancelTime(){
                this.chooseTimeVisit=false;
            },
            //保存教室
            handleOkClass(){
              this.addClassroomVisit=false;
            },
            //取消选择教室
            handleCancelClass(){
                this.addClassroomVisit=false;
            },
            //互斥规则
            contrastRegular(){
                this.$router.push(`/schedule/detail/sort_course/course/course/contrast_setting?planId=${this.planId}`)
            },
            //同时上课
            sameClass(){
                this.$router.push(`/schedule/detail/sort_course/course/course/same_class?planId=${this.planId}`)
            },
            //禁止相邻
            banned(){
                this.$router.push(`/schedule/detail/sort_course/course/course/banned_subject?planId=${this.planId}`)
            },
            //课时设置
            timesSetting(){
                this.$router.push(`/schedule/detail/sort_course/index?planId=${this.planId}`)
            },
            //课节设置
            oncesSetting(){
                this.$router.push(`/schedule/detail/sort_course/time?planId=${this.planId}`)
            },
            //教室设置
            placeSetting(){
                this.$router.push(`/schedule/detail/sort_course/place?planId=${this.planId}`)
            },
            //课程设置
            courseSetting(){
                this.$router.push(`/schedule/detail/sort_course/course/index?planId=${this.planId}`)
            },
            //开始排课
            startArray(){
                this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`)
            },
            //每周课时
            changTimes(index,value){
                this.tableData.map(item=>{
                    if(item.id === index){
                        return item.lessonNum = value
                    }
                })
                console.log(this.tableData);
                // console.log('编辑每周课时行',index);
                // console.log('编辑每周课时值',value);
            },
            //最小上课天数
            changDays(index,value){
                this.tableData.map(item=>{
                    if(item.id === index){
                        return item.minNum = value
                    }
                })
                console.log(this.tableData);
                // console.log('编辑最小上课天数行',index);
                // console.log('编辑最小上课天数值',value);
            },
            //下一步
            Next(){
              this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`);
              this.saveCourse();
            },
            async saveCourse(){
                let pushData=[];
                for(let i=0;i<this.tableData.length;i++){
                    pushData[i]={
                        id:this.tableData[i].id,
                        planId:this.planId,
                        lessonWeekly:this.tableData[i].lessonNum,
                        lessonMin:this.tableData[i].minNum,
                        timesSetting:[{
                            // timeType:
                            // weekday:
                            // period:
                        }],
                        classroomSetting:{
                            // classroomType:
                            // buildingId:
                            // classroomId:
                        },
                    }
                }

            },
            //删除教室
            onDelete(deleId){
                this.deleteText=this.tableData.findIndex(item=>item.id===deleId);
                console.log(this.deleteText);
                this.tableData.splice(this.deleteText,1);
                console.log(this.tableData);
            },
            //返回
            back(){
                this.$router.go(-1)
            },
        },
    }
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
    .header-item{
        height: 300px;
        background-color: white;
        height: 100px;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        vertical-align: top;
        border-radius: 5px;
    }
    .header-item span{
        font-size:1.5em
    }
    .buttons{
       padding-left: 50px;
        padding-top: 30px;
        background-color: white;
    }
    .buttons button{
        background-color:#e4e4e4;
        color:black;
    }
    .table-content{
        background-color: white;
        padding: 20px 25px;
        border-radius: 5px;
        height: 500px;
    }
</style>
