import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入 view 组件
import { Announcement, Conf, Contest, ContestList, Home, JudgeServer, Login,
  Problem, ProblemList, Dashboard, CourseCollection, Delegation, DelegationList, NewCourseCollection } from './views'
Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: '/admin/',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          component: Dashboard
        },
        {
          path: '/announcement',
          name: 'announcement',
          component: Announcement
        },
        {
          path: '/conf',
          name: 'conf',
          component: Conf
        },
        {
          path: '/judge-server',
          name: 'judge-server',
          component: JudgeServer
        },
        {
          path: '/course-collection',
          name: 'course-collection',
          component: CourseCollection
        },
        {
          path: '/n-course',
          name: 'new-course',
          component: NewCourseCollection
        },
        {
          path: 'delegation',
          name: 'delegation',
          component: Delegation
        },
        {
          path: 'delegation-list',
          name: 'delegation-list',
          component: DelegationList
        },
        {
          path: '/problems',
          name: 'problem-list',
          component: ProblemList
        },
        {
          path: '/problem/create',
          name: 'create-problem',
          component: Problem
        },
        {
          path: '/problem/create/edu',
          name: 'create-edu-problem',
          component: Problem
        },
        {
          path: '/problem/edit/:problemId',
          name: 'edit-problem',
          component: Problem
        },
        {
          path: '/problem/edit/edu/:problemId',
          name: 'edit-edu-problem',
          component: Problem
        },
        {
          path: '/contest/create',
          name: 'create-contest',
          component: Contest
        },
        {
          path: '/contest',
          name: 'contest-list',
          component: ContestList
        },
        {
          path: '/contest/:contestId/edit',
          name: 'edit-contest',
          component: Contest
        },
        {
          path: '/contest/:contestId/announcement',
          name: 'contest-announcement',
          component: Announcement
        },
        {
          path: '/contest/:contestId/problems',
          name: 'contest-problem-list',
          component: ProblemList
        },
        {
          path: '/contest/:contestId/problem/create',
          name: 'create-contest-problem',
          component: Problem
        },
        {
          path: '/contest/:contestId/problem/:problemId/edit',
          name: 'edit-contest-problem',
          component: Problem
        },
        {
          path: '/problems/edus',
          name: 'edu-problem-list',
          component: ProblemList
        },
        {
          path: '/problems/uncheck',
          name: 'uncheck-problem-list',
          component: ProblemList
        }
      ]
    },
    {
      path: '*', redirect: '/login'
    }
  ]
})
