import Vue from 'vue'
import Router from 'vue-router'
import BlankView from '@/layouts/BlankView'
import TabsView from '@/layouts/TabsView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/basic',
      hidden:true,
      children: [
        // 基础设置
        {
          path: '/basic',
          component: BlankView,
          redirect: '/basic/template',
          name: '基础设置',
          meta: {
            icon: 'profile' },
          children: [
            {
              path: '/basic/template',
              name: '课表模板',
              component: BlankView,
              redirect: '/basic/template/admin',
              children: [
                  {
                  path: '/basic/template/admin',
                  name: '课表模板管理',
                component: () => import('@/pages/basic/templet/index'),
              },
                {
                  path: '/basic/template/detail',
                  hidden:true,
                  name: '课表模板新增',
                  component: () => import('@/pages/basic/templet/detail')
                }
              ]
            },
            {
              path: '/basic/building',
              name: '教学楼',
              component: () => import('@/pages/basic/building/index'),
            },
            {
              path: '/basic/classroom',
              name: '教室',
              component: BlankView,
              children: [{
                path: '/basic/classroom/admin',
                name: '教室管理',
                component:() => import('@/pages/basic/classroom/index')
              },
                {
                  path: '/basic/classroom/rule',
                  name: '教室时间规则',
                  hidden:true,
                  component:() => import('@/pages/basic/classroom/rule')
                }
              ]
            },
            {
              path: '/basic/subject',
              name: '课程',
              redirect:'/basic/subject/admin',
              component: BlankView,
              children: [{
                path: '/basic/subject/admin',
                name: '父课程管理',
                component: () => import('@/pages/basic/subject/subject'),
              },
                {
                  path: '/basic/subject/subsubject',
                  hidden:true,
                  name: '子课程管理',
                  component: () => import('@/pages/basic/subject/subsub'),
                }
              ]
            },
            {
              path: '/basic/grade',
              name: '年级',
              component:BlankView,
              redirect:'/basic/grade/admin',
              children: [{
                path: '/basic/grade/admin',
                name: '年级管理',
                component: () => import('@/pages/basic/grade/index'),
              },
                {
                  path: '/basic/grade/subject',
                  hidden:true,
                  name: '课程管理',
                  component: () => import('@/pages/basic/grade/subject'),
                }
              ]
            },
            // {
            //   path: '/basic/class',
            //   name: '行政班',
            //   component:BlankView,
            //   children: [{
            //     path: '/basic/class/admin',
            //     name: '行政班管理',
            //     component: () => import('@/pages/basic/class/index'),
            //   },
            //     {
            //       path: '/basic/class/member',
            //       name: '行政班人员管理',
            //       component: () => import('@/pages/basic/class/member'),
            //
            //     }
            //   ]
            // },
            // {
            //   path: '/basic/student',
            //   name: '学生',
            //   component: () => import('@/pages/basic/student/index'),
            // },
            {
              path: '/basic/teacher',
              name: '教师',
              component: BlankView,
              children: [{
                path: '/basic/teacher/admin',
                name: '教师管理',
                component:() => import('@/pages/basic/teacher/index')
              },
                {
                  path: '/basic/teacher/rule',
                  name: '教师规则',
                  component:() => import('@/pages/basic/teacher/rule/index')
                }
              ]
            }, {
              path: '/basic/rule',
              name: '选课规则',
              component: BlankView,
              children:[
              //     {
              //   path: '/basic/rule/admin',
              //   name: '规则管理',
              //   component:() => import('@/pages/basic/rules/index')
              // },
                {
                path: '/basic/rule/detail',
                name: '规则设计',
                component:() => import('@/pages/basic/rules/detail')
              }]
            }
          ]
        },
        // 排课计划
        {
          path: '/schedule',
          component: BlankView,
          redirect: '/schedule/template',
          name: '排课',
          meta: { icon: 'profile' },
          children: [
            {
              path: '/schedule/template',
              name: '排课计划',
              component: () => import('@/pages/schedule/board/index'),
            },
            {
              path: '/schedule/detail',
              name: '排课操作',
              component: BlankView,
              children: [
                { path: '/schedule/detail/index',
                  name: '排课详情',
                  component: () => import('@/pages/schedule/detail/index')},
                {
                  path: '/schedule/detail/setting',
                  name: '选课设置',
                  component: () => import('@/pages/schedule/detail/settings'),
                },
                {
                  name: '选课统计',
                  path: '/schedule/detail/statistics',
                  redirect : '/schedule/detail/statistics/index',
                  component: BlankView,
                  children: [
                    {
                      path: '/schedule/detail/statistics/index',
                      name: '统计结果',
                      component: () => import('@/pages/schedule/detail/statistics')
                    },
                    {
                      path: '/schedule/detail/statistics/edit',
                      name: '修改选课结果',
                      component: () => import('@/pages/schedule/detail/statistics/edit'),
                    }
                  ]
                },
                {
                  path: '/schedule/detail/sort_class',
                  name: '选择老师',
                  component: BlankView,
                  children: [
                    // {
                    //   path: '/schedule/detail/sort_class/admin',
                    //   name: '选课分班管理',
                    //   component: () => import('@/pages/schedule/detail/sort_class'),
                    // },
                    {
                      path: '/schedule/detail/sort_class/auto',
                      name: '自动分班',
                      component: () => import('@/pages/schedule/detail/sort_class/auto'),
                    },
                    // {
                    //   path: '/schedule/detail/sort_class/manual',
                    //   name: '手动分班',
                    //   component: () => import('@/pages/schedule/detail/sort_class/manual'),
                    // }
                  ]
                },
                {
                  path: '/schedule/detail/sort_course',
                  name: '选课排课',
                  component: BlankView,
                  children: [
                    {
                      path: '/schedule/detail/sort_course/index',
                      name: '课时设置',
                      component: () => import('@/pages/schedule/detail/sort_course/index'),
                    },
                    {
                      path: '/schedule/detail/sort_course/time',
                      name: '课节设置',
                      component: () => import('@/pages/schedule/detail/sort_course/time'),
                    }, {
                      path: '/schedule/detail/sort_course/place',
                      name: '教室设置',
                      component: () => import('@/pages/schedule/detail/sort_course/place'),
                    }, {
                      path: '/schedule/detail/sort_course/course',
                      name: '课程设置',
                      component: BlankView,
                      children:[
                        {
                          path: '/schedule/detail/sort_course/course/index',
                          name: '课程设置',
                          component: () => import('@/pages/schedule/detail/sort_course/course/index'),
                        },{
                          path:'/schedule/detail/sort_course/course/course',
                          name: '设置',
                          component:BlankView,
                          children:[{
                            path: '/schedule/detail/sort_course/course/course/contrast_setting',
                            name: '互斥设置',
                            component: () => import('@/pages/schedule/detail/sort_course/course/course/contrast_setting'),
                          },{
                            path:'/schedule/detail/sort_course/course/course/same_class',
                            name:'同时上课',
                            component:()=>import('@/pages/schedule/detail/sort_course/course/course/same_class'),
                          },{
                            path:'/schedule/detail/sort_course/course/course/banned_subject',
                            name:'禁止科目相邻',
                            component:()=>import('@/pages/schedule/detail/sort_course/course/course/banned_subject'),
                          }],
                        }]
                    }
                  ]
                },
                {
                  path: '/schedule/detail/class_admin',
                  name: '行政班排课',
                  component: BlankView,
                  children: [
                    {
                      path: '/schedule/detail/class_admin/index',
                      name: '课时设置',
                      component: () => import('@/pages/schedule/detail/class_admin/index'),
                    },{
                      path: '/schedule/detail/class_admin/time',
                      name: '课节设置',
                      component: () => import('@/pages/schedule/detail/class_admin/time'),
                    },{
                      path: '/schedule/detail/class_admin/course',
                      name: '学科设置',
                      component: () => import('@/pages/schedule/detail/class_admin/course'),
                    }, {
                      path: '/schedule/detail/class_admin/class',
                      name: '班级设置',
                      component: () => import('@/pages/schedule/detail/class_admin/class'),
                    }, {
                      path: '/schedule/detail/class_admin/rule',
                      name: '规则设置',
                      component: () => import('@/pages/schedule/detail/class_admin/rule'),
                    }]
                },
                {
                  path: '/schedule/detail/start_class',
                  name: '开始排课',
                  component: () => import('@/pages/schedule/detail/start_class/index'),
                } ,
                {
                  path: '/schedule/detail/task_mobile',
                  name: '走班排课任务',
                  component:BlankView,
                  children:[
                    {
                      path: '/schedule/detail/task_mobile/index',
                      name: '走班排课',
                      component:() => import('@/pages/schedule/detail/task_mobile/index'),
                    },{
                      path: '/schedule/detail/task_mobile/all',
                      name: '整体查看',
                      component:() => import('@/pages/schedule/detail/task_mobile/all'),
                    },
                    {
                      path: '/schedule/detail/task_mobile/teacher',
                      name: '按老师查看',
                      component:() => import('@/pages/schedule/detail/task_mobile/teacher'),
                    }, {
                      path: '/schedule/detail/task_mobile/room',
                      name: '按教室查看',
                      component:() => import('@/pages/schedule/detail/task_mobile/room'),
                    }, {
                      path: '/schedule/detail/task_mobile/course',
                      name: '按课程查看',
                      component:() => import('@/pages/schedule/detail/task_mobile/course'),
                    }, {
                      path: '/schedule/detail/task_mobile/change_student',
                      name: '学生调班',
                      component:() => import('@/pages/schedule/detail/task_mobile/change_student'),
                    }, {
                      path: '/schedule/detail/task_mobile/integrate',
                      name: '手动调课',
                      component:() => import('@/pages/schedule/detail/task_mobile/integrate'),
                    },
                  ]},
                {
                  path: '/schedule/detail/task_admin',
                  name: '行政班排课任务',
                  component:BlankView,
                  children:[
                    {
                      path: '/schedule/detail/task_admin/index',
                      name: '行政班排课任务',
                      component:() => import('@/pages/schedule/detail/task_admin/index'),
                    },
                    {
                      path: '/schedule/detail/task_admin/class',
                      name: '班级查看',
                      component:() => import('@/pages/schedule/detail/task_admin/class'),
                    },{
                      path: '/schedule/detail/task_admin/teacher',
                      name: '老师查看',
                      component:() => import('@/pages/schedule/detail/task_admin/teacher'),
                    },{
                      path: '/schedule/detail/task_admin/subject',
                      name: '科目查看',
                      component:() => import('@/pages/schedule/detail/task_admin/subject'),
                    },
                  ]
                },
                {
                  path: '/schedule/detail/curriculum',
                  name: '总课表',
                  component:BlankView,
                  children:[
                    {
                      path: '/schedule/detail/curriculum/index',
                      name: '总课表',
                      component:() => import('@/pages/schedule/detail/curriculum/index'),
                    },{
                      path: '/schedule/detail/curriculum/teacher',
                      name: '老师课表',
                      component:() => import('@/pages/schedule/detail/curriculum/teacher'),
                    },{
                      path: '/schedule/detail/curriculum/place',
                      name: '场地课表',
                      component:() => import('@/pages/schedule/detail/curriculum/place'),
                    },{
                      path: '/schedule/detail/curriculum/subject',
                      name: '科目课表',
                      component:() => import('@/pages/schedule/detail/curriculum/subject'),
                    },{
                      path: '/schedule/detail/curriculum/student',
                      name: '学生课表',
                      component:() => import('@/pages/schedule/detail/curriculum/student'),
                    }]
                },
              ]},
          ]
        },
          //数据字典
        // {
        //   path: '/data',
        //   component:BlankView,
        //   redirect: '/data/template',
        //   name: '数据字典',
        //   meta: { icon: 'profile' },
        //   children: [
        //     {
        //       path: '/data/subject/index',
        //       name: '科目类别',
        //       component: () => import('@/pages/data/subject/index')},
        //   {
        //       path: '/date/class',
        //       name: '教室类型',
        //       component: () => import('@/pages/data/class/index'),
        //     }
        //   ]
        // },
        {
          path: '/studentChooseClass',
          name: '学生选课',
          redirect: '/studentChooseClass',
          component: BlankView,
          meta: { icon: 'profile' },
          children:[
          //     {
          //   path: '/studentChooseClass/index',
          //   name: '我的课表',
          //   component: () => import('@/pages/studentChooseClass/index'),
          // },
            {
              path: '/studentChooseClass/startChooseClass',
              name: '开始选课',
              component: () => import('@/pages/studentChooseClass/startChooseClass/index'),
            },

          ]
        },
      ]
    },

  ]
})
