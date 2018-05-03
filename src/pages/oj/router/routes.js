// all routes here.
import {
  About,
  ACMRank,
  Announcements,
  ApplyResetPassword,
  FAQ,
  Home,
  Logout,
  NotFound,
  AssessContribution,
  ProblemContribution,
  OIRank,
  Problem,
  ProblemList,
  ResetPassword,
  SubmissionDetails,
  SubmissionList,
  UserHome
} from '../views'

import * as Contest from '@oj/views/contest'
import * as Setting from '@oj/views/setting'

export default [
  {
    name: 'home',
    path: '/',
    meta: {title: '主页'},
    component: Home
  },
  {
    name: 'logout',
    path: '/logout',
    meta: {title: '注销'},
    component: Logout
  },
  {
    name: 'apply-reset-password',
    path: '/apply-reset-password',
    meta: {title: '执行重置密码'},
    component: ApplyResetPassword
  },
  {
    name: 'reset-password',
    path: '/reset-password/:token',
    meta: {title: '重置密码'},
    component: ResetPassword
  },
  {
    name: 'problem-list',
    path: '/problems',
    meta: {title: '题目列表'},
    component: ProblemList
  },
  {
    name: 'problem-details',
    path: '/problem/:problemID',
    meta: {title: '题目详情'},
    component: Problem
  },
  {
    name: 'submission-list',
    path: '/status',
    meta: {title: '提交列表'},
    component: SubmissionList
  },
  {
    name: 'submission-details',
    path: '/status/:id/',
    meta: {title: '提交详情'},
    component: SubmissionDetails
  },
  {
    name: 'contest-list',
    path: '/contests',
    meta: {title: '竞赛列表'},
    component: Contest.ContestList
  },
  {
    name: 'contest-details',
    path: '/contest/:contestID/',
    component: Contest.ContestDetails,
    meta: {title: '竞赛详情'},
    children: [
      {
        name: 'contest-submission-list',
        path: 'submissions',
        component: SubmissionList
      },
      {
        name: 'contest-problem-list',
        path: 'problems',
        component: Contest.ContestProblemList
      },
      {
        name: 'contest-problem-details',
        path: 'problem/:problemID/',
        component: Problem
      },
      {
        name: 'contest-announcement-list',
        path: 'announcements',
        component: Announcements
      },
      {
        name: 'contest-rank',
        path: 'rank',
        component: Contest.ContestRank
      },
      {
        name: 'acm-helper',
        path: 'helper',
        component: Contest.ACMContestHelper
      }
    ]
  },
  {
    name: 'ProblemContribution',
    path: '/contribution-problem',
    meta: {title: '贡献榜'},
    component: ProblemContribution
  },
  {
    name: 'AssessContribution',
    path: '/contribution-assess',
    meta: {title: '贡献榜'},
    component: AssessContribution
  },
  {
    name: 'acm-rank',
    path: '/acm-rank',
    meta: {title: 'ACM排名'},
    component: ACMRank
  },
  {
    name: 'oi-rank',
    path: '/oi-rank',
    meta: {title: 'OI排名'},
    component: OIRank
  },
  {
    name: 'user-home',
    path: '/user-home',
    component: UserHome,
    meta: {requiresAuth: true, title: '用户主页'}
  },
  {
    path: '/setting',
    component: Setting.Settings,
    children: [
      {
        name: 'default-setting',
        path: '',
        meta: {requiresAuth: true, title: '默认设置'},
        component: Setting.ProfileSetting
      },
      {
        name: 'profile-setting',
        path: 'profile',
        meta: {requiresAuth: true, title: '个人信息设置'},
        component: Setting.ProfileSetting
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    meta: {title: '关于'},
    component: About
  },
  {
    path: '/faq',
    name: 'faq',
    meta: {title: '常见问题'},
    component: FAQ
  },
  {
    path: '*',
    meta: {title: '404'},
    component: NotFound
  }
]
