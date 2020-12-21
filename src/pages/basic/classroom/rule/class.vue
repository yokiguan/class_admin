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
           <a-form-model :form="form" :label-col="{span:4}" :wrapper-col="{span:7}" @submit="addClassHandleSubmint">
               <a-form-model-item label="选择授课年级/班级">
                   <a-select v-decorator="['选择课表模板',{ rules: [{ required: true, message: '请选择课表模板!' }] },]"
                             placeholder="请选择，可多选">
                       <a-select-option value="one">高一组课表模板</a-select-option>
                       <a-select-option value="two">高二组课表模板</a-select-option>
                       <a-select-option value="three">高三组课表模板</a-select-option>
                   </a-select>
               </a-form-model-item>
           </a-form-model>
       </a-row>
    </a-card>
</template>
<script>
    export default {
        data(){
            return{
                form:{},
            }
        },
        methods:{
            addClassHandleSubmint(){},
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
