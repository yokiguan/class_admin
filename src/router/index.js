import Vue from 'vue'
import Router from 'vue-router'
import BlankView from '@/layouts/BlankView'
import TabsView from '@/layouts/TabsView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login/Login')
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        // 基础设置
        {
          path: '/basic',
          component: BlankView,
          redirect: '/basic/template',
          name: '基础设置',
          meta: { icon: 'profile' },
          children: [
            {
              path: '/basic/template',
              name: '课表模板管理',
              component: BlankView,
              redirect: '/basic/template/admin',
              children: [{
                path: '/basic/template/admin',
                name: '课表模板',
                component: () => import('@/pages/basic/templet/index'),
              },
              {
                path: '/basic/template/detail',
                name: '教室时间规则',
                component: () => import('@/pages/basic/templet/detail')
              }
              ]
            },
            {
              path: '/basic/classroom',
              name: '教室管理',
              component: () => import('@/pages/basic/classroom/index'),
              // children: [
              //   {
              //     path: '/basic/classroom/rule',
              //     name: '教室时间规则'
              //   }
              // ]
            },
            {
              path: '/basic/classboard',
              name: '班牌管理',
              component: () => import('@/pages/basic/classboard/index'),
            },
            {
              path: '/basic/building',
              name: '教学楼管理',
              component: () => import('@/pages/basic/building/index'),
            },
            {
              path: '/basic/subject',
              name: '课程管理',
              component: () => import('@/pages/basic/subject/subject'),
              // children: [
              //   {
              //     path: '/basic/subject/subsubject',
              //     name: '子课程管理',
              //   }
              // ]
            },
            {
              path: '/basic/grade',
              name: '年级管理',
              component: () => import('@/pages/basic/grade/index'),
              children: [
                {
                  path: '/basic/grade/subject',
                  name: '年级课程',
                }
              ]
            },
            {
              path: '/basic/class',
              name: '行政班管理',
              component: () => import('@/pages/basic/class/index'),
              // children: [
              //   {
              //     path: '/basic/class/admin',
              //     name: '行政班人员管理',
              //   }
              // ]
            },
            {
              path: '/basic/student',
              name: '学生管理',
              component: () => import('@/pages/basic/student/index'),
            },
            {
              path: '/basic/teacher',
              name: '教师管理',
              component: () => import('@/pages/basic/teacher/index'),
              children: [
                {
                  path: '/basic/teacher/rule',
                  name: '教师规则',
                }
              ]
            }, {
              path: '/basic/rule',
              name: '选课规则',
              component: () => import('@/pages/basic/rules/index')
            }
          ]
        },
        // 排课计划
        {
          path: '/schedule',
          component: BlankView,
          redirect: '/schedule/template',
          name: '排课计划',
          meta: { icon: 'profile' },
          children: [
            {
              path: '/schedule/template',
              name: '排课计划中心',
              component: () => import('@/pages/shedule/board/index'),
              children: [
                {
                  path: '/schedule/detail',
                  name: '详情设置',
                  component: () => import('@/pages/basic/templet/detail'),
                  children: []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
})
