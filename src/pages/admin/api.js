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
  logout () {
    return ajax('logout', 'get')
  },
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
  deleteUsers (id) {
    return ajax('admin/user', 'delete', {
      params: {
        id
      }
    })
  },
  updateContestVisible (id, visible) {
    let data = {
      visible
    }
    return ajax(`xcontest/${id}/`, 'patch', {data})
  },
  importUsers (users) {
    return ajax('admin/user', 'post', {
      data: {
        users
      }
    })
  },
  getUserGroupList () {
    return ajax('group/', 'get')
  },
  generateUser (data) {
    return ajax('admin/generate_user', 'post', {
      data
    })
  },
  getLanguages () {
    return ajax('languages', 'get')
  },
  getSMTPConfig () {
    return ajax('admin/smtp', 'get')
  },
  createSMTPConfig (data) {
    return ajax('admin/smtp', 'post', {
      data
    })
  },
  editSMTPConfig (data) {
    return ajax('admin/smtp', 'put', {
      data
    })
  },
  testSMTPConfig (email) {
    return ajax('admin/smtp_test', 'post', {
      data: {
        email
      }
    })
  },
  getWebsiteConfig () {
    return ajax('admin/website', 'get')
  },
  editWebsiteConfig (data) {
    return ajax('admin/website', 'post', {
      data
    })
  },
  getJudgeServer () {
    return ajax('admin/judge_server', 'get')
  },
  deleteJudgeServer (hostname) {
    return ajax('admin/judge_server', 'delete', {
      params: {
        hostname: hostname
      }
    })
  },
  updateJudgeServer (data) {
    return ajax('admin/judge_server', 'put', {
      data
    })
  },
  getInvalidTestCaseList () {
    return ajax('admin/prune_test_case', 'get')
  },
  deleteContest (contestID) {
    return ajax(`xcontest/${contestID}/`, 'delete')
  },
  createContest (data) {
    return ajax('xcontest/', 'post', {
      data
    })
  },
  getContest (id) {
    return ajax(`xcontest/${id}/`, 'get', {})
  },
  editContest (data) {
    return ajax(`xcontest/${data.id}/`, 'put', {
      data
    })
  },
  getContestList (offset, limit, keyword) {
    let params = {paging: true, offset, limit}
    if (keyword) {
      params.keyword = keyword
    }
    return ajax('admin/contest', 'get', {
      params: params
    })
  },
  getContestAnnouncementList (contestID) {
    return ajax('admin/contest/announcement', 'get', {
      params: {
        contest_id: contestID
      }
    })
  },
  createContestAnnouncement (data) {
    return ajax('admin/contest/announcement', 'post', {
      data
    })
  },
  deleteContestAnnouncement (id) {
    return ajax('admin/contest/announcement', 'delete', {
      params: {
        id
      }
    })
  },
  updateContestAnnouncement (data) {
    return ajax('admin/contest/announcement', 'put', {
      data
    })
  },
  getProblemTagList () {
    return ajax('problem/tags', 'get')
  },
  changeProblemDisplay (problemID, visible) {
    let data = {
      visible
    }
    return ajax(`xproblem/${problemID}/`, 'patch', {
      data
    })
  },
  changeProblemDisplayIDAndTitle (problemID, displayID, title) {
    let data = {
      title,
      '_id': displayID
    }
    return ajax(`xproblem/${problemID}/`, 'patch', {
      data
    })
  },
  compileSPJ (data) {
    return ajax('admin/compile_spj', 'post', {
      data
    })
  },
  createProblem (data) {
    return ajax('xproblem/', 'post', {
      data
    })
  },
  editProblem (data) {
    return ajax(`xproblem/${data.id}/`, 'put', {
      data
    })
  },
  deleteProblem (id) {
    return ajax(`xproblem/${id}/`, 'delete')
  },
  validateProblem (id) {
    return ajax(`xproblem/${id}/validate/`, 'put')
  },
  getProblem (id) {
    return ajax(`xproblem/${id}/`, 'get', {})
  },
  getProblemList (params) {
    params = utils.filterEmptyValue(params)
    return ajax('xproblem/', 'get', {
      params
    })
  },
  getEduProblemList (params) {
    params = utils.filterEmptyValue(params)
    return ajax('xproblem/', 'get', {params})
  },
  getUncheckProblemList (params) {
    params = utils.filterEmptyValue(params)
    return ajax('xproblem/', 'get', {params})
  },
  getContestProblemList (params) {
    params = utils.filterEmptyValue(params)
    return ajax('xproblem/', 'get', {
      params
    })
  },
  getContestProblem (id) {
    return ajax(`xproblem/${id}`, 'get')
  },
  createContestProblem (data) {
    return ajax('admin/contest/problem', 'post', {
      data
    })
  },
  editContestProblem (data) {
    return ajax(`xproblem/${data.id}/`, 'put', {
      data
    })
  },
  updateProblem (problemID, data) {
    return ajax(`xproblem/${problemID}/`, 'patch', {
      data
    })
  },
  deleteContestProblem (id) {
    return ajax('admin/contest/problem', 'delete', {
      params: {
        id
      }
    })
  },
  addCourse (data) {
    return ajax('course/', 'post', {
      data
    })
  },
  deleteCourse (id) {
    return ajax(`course/${id}/`, 'delete')
  },
  renCourse (id, data) {
    return ajax(`course/${id}/`, 'put', {
      data
    })
  },
  addCollection (data) {
    return ajax('collection/', 'post', {
      data
    })
  },
  deleteCollection (id) {
    return ajax(`collection/${id}/`, 'delete')
  },
  renCollection (id, data) {
    return ajax(`collection/${id}/`, 'put', {
      data
    })
  },
  makeContestProblemPublic (data) {
    return ajax('admin/contest_problem/make_public', 'post', {
      data
    })
  },
  addProblemFromEdu (data) {
    return ajax('admin/contest/add_problem_from_public', 'post', {
      data
    })
  },
  getDashboardInfo () {
    return ajax('admin/dashboard_info', 'get')
  },
  getSessions () {
    return ajax('sessions', 'get')
  },
  exportProblems (data) {
    return ajax('export_problem', 'post', {
      data
    })
  },
  addProblemCourse (courseID, data) {
    return ajax(`course/${courseID}/add_problems/`, 'post', {
      data
    })
  },
  removeProblemCourse (courseID, data) {
    return ajax(`course/${courseID}/remove_problems/`, 'post', {
      data
    })
  },
  getCollection () {
    return ajax('collection/', 'get')
  },
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
