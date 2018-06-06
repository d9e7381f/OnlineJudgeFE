import Vue from 'vue'
import router from './router'
import axios from 'axios'
import utils from '@/utils/utils'

Vue.prototype.$http = axios
axios.defaults.baseURL = '/api'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

export default {
  // 登录
  login (username, password) {
    return ajax('xlogin/', 'post', {
      data: {
        username,
        password
      }
    })
  },
  // 登出
  logout () {
    return ajax('logout', 'get')
  },
  // 获得用户信息集
  getProfile () {
    return ajax('profile', 'get')
  },
  // 获取公告列表
  getAnnouncementList (offset, limit) {
    return ajax('admin/announcement', 'get', {
      params: {
        paging: true,
        offset,
        limit
      }
    })
  },
  // 删除公告
  deleteAnnouncement (id) {
    return ajax('admin/announcement', 'delete', {
      params: {
        id
      }
    })
  },
  // 修改公告
  updateAnnouncement (data) {
    return ajax('admin/announcement', 'put', {
      data
    })
  },
  // 添加公告
  createAnnouncement (data) {
    return ajax('admin/announcement', 'post', {
      data
    })
  },
  // 获取用户列表
  getUserList (offset, limit, keyword) {
    let params = {paging: true, offset, limit}
    if (keyword) {
      params.keyword = keyword
    }
    return ajax('admin/user', 'get', {
      params: params
    })
  },
  // 获取单个用户信息
  getUser (id) {
    return ajax('admin/user', 'get', {
      params: {
        id
      }
    })
  },
  // 编辑用户
  editUser (data) {
    return ajax('admin/user', 'put', {
      data
    })
  },
  // 删除用户 disabled
  deleteUsers (id) {
    return ajax('admin/user', 'delete', {
      params: {
        id
      }
    })
  },
  // 设置竞赛是否可见
  updateContestVisible (id, visible) {
    let data = {
      visible
    }
    return ajax(`xcontest/${id}/`, 'patch', {data})
  },
  // 导入用户 disabled
  importUsers (users) {
    return ajax('admin/user', 'post', {
      data: {
        users
      }
    })
  },
  // 获得班级列表
  getUserGroupList () {
    return ajax('group/', 'get')
  },
  generateUser (data) {
    return ajax('admin/generate_user', 'post', {
      data
    })
  },
  // 获得系统编程语言支持及配置
  getLanguages () {
    return ajax('languages', 'get')
  },
  // 获得网站配置
  getWebsiteConfig () {
    return ajax('admin/website', 'get')
  },
  // 更新网站配置
  editWebsiteConfig (data) {
    return ajax('admin/website', 'post', {
      data
    })
  },
  // 获得判题服务器列表
  getJudgeServer () {
    return ajax('admin/judge_server', 'get')
  },
  // 删除判题服务器
  deleteJudgeServer (hostname) {
    return ajax('admin/judge_server', 'delete', {
      params: {
        hostname: hostname
      }
    })
  },
  // 更新判题服务器
  updateJudgeServer (data) {
    return ajax('admin/judge_server', 'put', {
      data
    })
  },
  // 获得无用测试用例
  getInvalidTestCaseList () {
    return ajax('admin/prune_test_case', 'get')
  },
  // 删除竞赛
  deleteContest (contestID) {
    return ajax(`xcontest/${contestID}/`, 'delete')
  },
  // 创建竞赛
  createContest (data) {
    return ajax('xcontest/', 'post', {
      data
    })
  },
  // 获得竞赛详细信息
  getContest (id) {
    return ajax(`xcontest/${id}/`, 'get', {})
  },
  // 编辑竞赛
  editContest (data) {
    return ajax(`xcontest/${data.id}/`, 'put', {
      data
    })
  },
  // 获得竞赛列表
  getContestList (offset, limit, keyword) {
    let params = {paging: true, offset, limit}
    if (keyword) {
      params.keyword = keyword
    }
    return ajax('admin/contest', 'get', {
      params: params
    })
  },
  // 获得竞赛公告列表
  getContestAnnouncementList (contestID) {
    return ajax('admin/contest/announcement', 'get', {
      params: {
        contest_id: contestID
      }
    })
  },
  // 创建竞赛公告
  createContestAnnouncement (data) {
    return ajax('admin/contest/announcement', 'post', {
      data
    })
  },
  // 删除竞赛公告
  deleteContestAnnouncement (id) {
    return ajax('admin/contest/announcement', 'delete', {
      params: {
        id
      }
    })
  },
  // 更新竞赛公告
  updateContestAnnouncement (data) {
    return ajax('admin/contest/announcement', 'put', {
      data
    })
  },
  // 获得用户支持的课程创建题目
  getCourseChoice () {
    return ajax('/delegation/course_choice/', 'get')
  },
  // 创建任务委派
  createDelegation (data) {
    return ajax('delegation/', 'post', {
      data
    })
  },
  // 创建任务列表
  getDelegationList (params) {
    return ajax('delegation/', 'get', {
      params: params
    })
  },
  // 获得题目tag列表
  getProblemTagList () {
    return ajax('problem/tags', 'get')
  },
  // 更新题目的可视
  changeProblemDisplay (problemID, visible) {
    let data = {
      visible
    }
    return ajax(`xproblem/${problemID}/`, 'patch', {
      data
    })
  },
  // 更新题目的displayid和题目
  changeProblemTitle (problemID, title) {
    return ajax(`xproblem/${problemID}/`, 'patch', {
      data: {
        title
      }
    })
  },
  // 编译spj代码
  compileSPJ (data) {
    return ajax('admin/compile_spj', 'post', {
      data
    })
  },
  // 获得用户列表通过班级
  getUserListByClass (params) {
    return ajax('user/', 'get', {
      params: params
    })
  },
  // 创建题目
  createProblem (data) {
    return ajax('xproblem/', 'post', {
      data
    })
  },
  // 编辑题目
  editProblem (data) {
    return ajax(`xproblem/${data.id}/`, 'put', {
      data
    })
  },
  // 删除题目
  deleteProblem (id) {
    return ajax(`xproblem/${id}/`, 'delete')
  },
  // 审核题目
  validateProblem (id) {
    return ajax(`xproblem/${id}/validate/`, 'put')
  },
  // 获得题目详细或竞赛题目详细
  getProblem (id) {
    return ajax(`xproblem/${id}/`, 'get')
  },
  // 获得题目列表或竞赛题目列表
  getProblemList (params) {
    params = utils.filterEmptyValue(params)
    return ajax('xproblem/', 'get', {
      params
    })
  },
  // 更新题目
  updateProblem (problemID, data) {
    return ajax(`xproblem/${problemID}/`, 'patch', {
      data
    })
  },
  // 将目标题目设置目标分类
  makePublicProblem (problemID, collectionID) {
    return ajax(`xproblem/${problemID}/move_public/`, 'post', {
      data: {
        'collection': collectionID
      }
    })
  },
  // 将目标课程的题目转化为目标分类
  makeBatchContestProblemPublic (courseID, collectionID) {
    return ajax('xproblem/batch_move_public/', 'post', {
      data: {
        'collection': collectionID,
        'course': courseID
      }
    })
  },
  // 添加课程
  addCourse (data) {
    return ajax('course/', 'post', {
      data
    })
  },
  // 删除课程
  deleteCourse (id, data) {
    return ajax(`course/${id}/`, 'delete', {
      data: data
    })
  },
  // 重命名课程
  renCourse (id, data) {
    return ajax(`course/${id}/`, 'put', {
      data
    })
  },
  // 添加分类
  addCollection (data) {
    return ajax('collection/', 'post', {
      data
    })
  },
  // 删除分类
  deleteCollection (id) {
    return ajax(`collection/${id}/`, 'delete')
  },
  // 重命名分类
  renCollection (id, data) {
    return ajax(`collection/${id}/`, 'put', {
      data
    })
  },
  // 将课程设置为公开
  makeContestProblemPublic (data) {
    return ajax('admin/contest_problem/make_public', 'post', {
      data
    })
  },
  // 添加教学题目于竞赛
  addContestProblemFromEdu (data) {
    return ajax('admin/contest/add_problem_from_public', 'post', {
      data
    })
  },
  // 获得指示板信息
  getDashboardInfo () {
    return ajax('admin/dashboard_info', 'get')
  },
  // 获得创建题目权限
  canCreateProblem () {
    return ajax('/xproblem/can_create/', 'get')
  },
  // 获得当前会话
  getSessions () {
    return ajax('sessions', 'get')
  },
  // 到处题目
  exportProblems (data) {
    return ajax('export_problem', 'post', {
      data
    })
  },
  // 为题目添加课程
  addProblemCourse (courseID, data) {
    return ajax(`course/${courseID}/add_problems/`, 'post', {
      data
    })
  },
  // 为题目移除课程
  removeProblemCourse (courseID, data) {
    return ajax(`course/${courseID}/remove_problems/`, 'post', {
      data
    })
  },
  // 获得分类列表
  getCollection () {
    return ajax('collection/', 'get')
  },
  // 获得课程列表
  getCourse () {
    return ajax('course/', 'get')
  }
}

/**
 * @param url
 * @param method get|post|put|delete...
 * @param params like queryString. if a url is index?a=1&b=2, params = {a: '1', b: '2'}
 * @param data post data, use for method put|post
 * @returns {Promise}
 */
function ajax (url, method, options) {
  if (options !== undefined) {
    var {params = {}, data = {}} = options
  } else {
    params = data = {}
  }
  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      params,
      data
    }).then(res => {
      // API正常返回(status=20x), 是否错误通过有无error判断
      console.log(res.data.error)
      if (res.data.error !== null) {
        Vue.prototype.$error(res.data.data)
        reject(res)
        // // 若后端返回为登录，则为session失效，应退出当前登录用户
        console.log(res.data.data)
        if (res.data.data.startsWith('Please login')) {
          router.push({name: 'login'})
        }
      } else {
        resolve(res)
        if (method !== 'get') {
          Vue.prototype.$success('Succeeded')
        }
      }
    }, res => {
      // API请求异常，一般为Server error 或 network error
      reject(res)
      Vue.prototype.$error(res.data.data)
    })
  })
}
