<template>
  <div id="header">
    <Menu theme="light" mode="horizontal" @on-select="handleRoute" :active-name="activeMenu" class="oj-menu">
      <div class="logo"><span>{{website.website_name}}</span></div>
      <Menu-item name="/">
        <Icon type="home"></Icon>
        主页
      </Menu-item>
      <Menu-item name="/problems">
        <Icon type="ios-keypad"></Icon>
        题目
      </Menu-item>
      <Menu-item name="/contests">
        <Icon type="trophy"></Icon>
        竞赛
      </Menu-item>
      <Submenu name="">
        <template slot="title">
          <Icon type="ios-flag"></Icon>
          贡献榜
        </template>
        <Menu-item name="/contribution-problem">
          题目贡献
        </Menu-item>
        <Menu-item name="/contribution-assess">
          题目好评
        </Menu-item>
      </Submenu>
      <Menu-item name="/status">
        <Icon type="ios-pulse-strong"></Icon>
        提交
      </Menu-item>
      <Submenu name="">
        <template slot="title">
          <Icon type="podium"></Icon>
          排名
        </template>
        <Menu-item name="/acm-rank">
          ACM排名
        </Menu-item>
        <Menu-item name="/oi-rank">
          OI排名
        </Menu-item>
      </Submenu>
      <Submenu name="">
        <template slot="title">
          <Icon type="information-circled"></Icon>
          关于
        </template>
        <Menu-item name="/about">
          判断机制
        </Menu-item>
        <Menu-item name="/FAQ">
          常见问题解答
        </Menu-item>
      </Submenu>
      <template v-if="!isAuthenticated">
        <div class="btn-menu">
          <Button type="ghost"
                  ref="loginBtn"
                  shape="circle"
                  @click="handleBtnClick('login')">登录
          </Button>
          <Button v-if="website.allow_register"
                  type="ghost"
                  shape="circle"
                  @click="handleBtnClick('register')"
                  style="margin-left: 5px;">注册
          </Button>
        </div>
      </template>
      <template v-else>
        <Dropdown class="drop-menu" @on-click="handleRoute" placement="bottom" trigger="click">
          <Button type="text" class="drop-menu-title">{{ profile.real_name }}
            <Icon type="arrow-down-b"></Icon>
          </Button>
          <Dropdown-menu slot="list">
            <Dropdown-item name="/user-home">个人主页</Dropdown-item>
            <Dropdown-item name="/status?myself=1">提交历史</Dropdown-item>
            <Dropdown-item name="/setting/profile">个性设置</Dropdown-item>
            <Dropdown-item name="/admin">后台管理</Dropdown-item>
            <Dropdown-item divided name="/logout">退出</Dropdown-item>
          </Dropdown-menu>
        </Dropdown>
      </template>
    </Menu>
    <Modal v-model="modalVisible" :width="400">
      <div slot="header" class="modal-title">欢迎访问 {{website.website_name_shortcut}}</div>
      <component :is="modalStatus.mode" v-if="modalVisible"></component>
      <div slot="footer" style="display: none"></div>
    </Modal>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import login from '@oj/views/user/Login'
  import register from '@oj/views/user/Register'
  import api from '@oj/api.js'
  export default {
    components: {
      login,
      register
    },
    mounted () {
      this.getProfile()
    },
    methods: {
      ...mapActions(['getProfile', 'changeModalStatus']),
      handleRoute (route) {
        if (route && route.indexOf('admin') < 0) {
          this.$router.push(route)
        } else {
          api.getUserInfo().then(res => {
            if (res.data.data.user.admin_type === 'Regular User') {
              window.open('/admin/problems')
            } else {
              window.open('/admin/')
            }
          }).catch(() => {})
        }
      },
      handleBtnClick (mode) {
        this.changeModalStatus({
          visible: true,
          mode: mode
        })
      }
    },
    computed: {
      ...mapGetters(['website', 'modalStatus', 'user', 'isAuthenticated', 'isAdminRole', 'profile']),
      // 跟随路由变化
      activeMenu () {
        return '/' + this.$route.path.split('/')[1]
      },
      modalVisible: {
        get () {
          return this.modalStatus.visible
        },
        set (value) {
          this.changeModalStatus({visible: value})
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  #header {
    position: inherit;
    top: 0;
    left: 0;
    height: 60px;
    width: 100%;
    z-index: 1000;
    background-color: #fff;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    .oj-menu {
      
      background: #fdfdfd;
    }

    .logo {
      margin-left: 2%;
      margin-right: 2%;
      font-size: 20px;
      float: left;
      line-height: 60px;
    }

    .drop-menu {
      float: right;
      margin-right: 40px;
      &-title {
        font-size: 18px;
      }
    }
    .btn-menu {
      font-size: 16px;
      float: right;
      margin-right: 10px;
    }
  }

  .modal {
    &-title {
      font-size: 18px;
      font-weight: 600;
    }
  }
  
</style>
