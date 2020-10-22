<template>
    <div>
        <!-- result -->
        <div class="result">
            <a-row>
                <a-col :span="12">
                    <a-space>
                        <span style="font-size:1.5em">高一2019-2020第一学期选课结果</span>
                        <br>
                        <span class="link-font-color" style="margin-left:2em">选课时间：2020/03/01 ——2020/03/15</span>
                        <span class="link-font-color" style="margin-left:2em">选课中</span>
                    </a-space>
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-col :span="6"><a-button type="primary"><router-link to="/schedule/detail/sort_class/auto">修改选课时间</router-link></a-button></a-col>
                        <a-col :span="6"><a-button type="primary">修改选课结果</a-button></a-col>
                        <a-col :span="6"><a-button type="danger">清空</a-button></a-col>
                        <a-col :span="6"><a-button>返回</a-button></a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <div class="info link-font-color">已有900人选课 （共1000人）<font style="color:red">100人未选</font></div>
        <!-- /result -->
        <div class="table-bg">
            <!-- statistics -->
            <!-- table -->
            <a-table
                    :columns="columns"
                    :data-source="classData"
                    :bordered = "true"
                    :pagination = "false"
            >
            </a-table>
            <!-- table -->
            <!-- statistics -->
        </div>
    </div>
</template>
<script>
    // import echarts from 'echarts'
    import Templet from "../../../basic/templet/index";
    const columns = [
        {
            title: '课程',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '已选人数',
            key: 'key',
            dataIndex: 'count'
        },
        {
            title: '课程组合',
            dataIndex: 'group',
            key: 'group',
        },
        {
            title: '操作',
            dataIndex: 'add',
            key: 'add',
        },
    ]

    const classData = [
        {
            name: '政治学修',
            count: 600,
            group:`周翔 X  张敏钰 X  张凌玮 X  许家锘 X  徐弘达 X  徐鼎钦 X  肖若渝 X  吴静希 X  翁柳琪 X  王永畅 X
    王鑫 X  汪宗远 X  唐翊轩 X  石达媛 X  刘善茹 X  刘铭 X  刘骞 X  廖俪淇 X  李敬轩 X  黄梓晴 X  黄奕钧 X  黄乐贤 X
    // 黄凯莹 X  黄河清 X  杜蔚婷 X  池绮欣 X  池菲杨 X  蔡莹璎 X  蔡昊霖 X  钟锶琪 X  郑英东 X  郑阳 X  詹妍琦 X  詹钧豪 X
    杨榕 X  冼君浩 X  危滨莎 X  王子琳X  万靖雯 X  陶鑫 X  邱伟杰 X  彭瀛浩 X  潘浩焯 X  莫昊阳 X  罗铭泽 X  刘企峰 X  刘曼丹 X
    林梓墉 X  林青云 X  梁嘉琪 X  李泉德 X  李朗鸣 X  李凯熙 X`,
            add:'添加'
        },
        {
            name: '政治选修',
            count: 200,
            group:`周翔 X  张敏钰 X  张凌玮 X  许家锘 X  徐弘达 X  徐鼎钦 X  肖若渝 X  吴静希 X  翁柳琪 X  王永畅 X
    王鑫 X  汪宗远 X  唐翊轩 X  石达媛 X  刘善茹 X  刘铭 X  刘骞 X  廖俪淇 X  李敬轩 X  黄梓晴 X  黄奕钧 X  黄乐贤 X
    黄凯莹 X  黄河清 X  杜蔚婷 X  池绮欣 X  池菲杨 X  蔡莹璎 X  蔡昊霖 X  钟锶琪 X  郑英东 X  郑阳 X  詹妍琦 X  詹钧豪 X
    杨榕 X  冼君浩 X  危滨莎 X  王子琳 X  万靖雯 X  陶鑫 X  邱伟杰 X  彭瀛浩 X  潘浩焯 X  莫昊阳 X  罗铭泽 X  刘企峰 X  刘曼丹 X
    林梓墉 X  林青云 X  梁嘉琪 X  李泉德 X  李朗鸣 X  李凯熙 X`,
            add:'添加'
        },
        {
            name: '物理学修',
            count: 100,
            group:`周翔 X  张敏钰 X  张凌玮 X  许家锘 X  徐弘达 X  徐鼎钦 X  肖若渝 X  吴静希 X  翁柳琪 X  王永畅 X
    王鑫 X  汪宗远 X  唐翊轩 X  石达媛 X  刘善茹 X  刘铭 X  刘骞 X  廖俪淇 X  李敬轩 X  黄梓晴 X  黄奕钧 X  黄乐贤 X
    黄凯莹 X  黄河清 X  杜蔚婷 X  池绮欣 X  池菲杨 X  蔡莹璎 X  蔡昊霖 X  钟锶琪 X  郑英东 X  郑阳 X  詹妍琦 X  詹钧豪 X
    杨榕 X  冼君浩 X  危滨莎 X  王子琳 X  万靖雯 X  陶鑫 X  邱伟杰 X  彭瀛浩 X  潘浩焯 X  莫昊阳 X  罗铭泽 X  刘企峰 X  刘曼丹 X
    林梓墉 X  林青云 X  梁嘉琪 X  李泉德 X  李朗鸣 X  李凯熙 X`,
            add:'添加'
        },
    ];

    export default {
        // eslint-disable-next-line vue/no-unused-components
        components: {Templet},
        data() {
            return {
                classData,
                columns,
            };
        },

    };
</script>

<style lang="less" scoped>
    .result{
        width: 100%;
        height: 300px;
        background-color: white;
        height: 100px;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        vertical-align: top;
        border-radius: 5px;
    }
    .result-left{
        width: 50%;
    }
    .link-font-color{
        color: #0000ff;
    }
    .info{
        height: 50px;
        width: 100%;
        margin: 0px 0px 10px 0px;
        padding: 10px 5px;
        background-color: white;
        border-radius: 5px;
    }

    .table-bg{
        background-color: white;
        margin: 0px 0px 20px 3px;
        padding: 20px 25px;
        border-radius: 5px;
    }
</style>
