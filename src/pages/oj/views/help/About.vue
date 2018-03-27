<template>
  <div>
    <panel class="container">
      <div slot="title">使用编译器版本</div>
      <div class="content markdown-body">
        <ul>
          <li v-for="lang in languages">{{lang.name}} ( {{lang.description}} )
            <pre>{{lang.config.compile.compile_command}}</pre>
          </li>
        </ul>
      </div>
    </panel>

    <panel :padding="15" class="container">
      <div slot="title">题目结果解释</div>
      <div class="content">
        <ul>
          <li><b>Pending & Juding</b> :你的答案将在稍后进行判断，请稍等结果</li>
          <li><b>Compile Error</b> :	编译错误，请点击相关链接查看错误原因
      </li>
          <li><b>Accepted</b> :	你的答案是正确的</li>
          <li><b>Wrong Answer</b> :	你的答案输出与判断服务器的答案不一致</li>
          <li>
            <b>Runtime Error</b>
            :	运行时错误，请检查你的代码的健壮性
          </li>
          <li><b>Time Limit Exceeded</b>
            :	您的程序使用的CPU时间超过了限制。Java有三倍的时间限制
          </li>
          <li><b>Memory Limit Exceeded</b> :	您的程序实际使用的内存超过了限制</li>
          <li><b>System Error</b> :	哎呀，判断服务器出了问题。请将此报告给管理员。
          </li>
        </ul>
      </div>
    </panel>

  </div>
</template>

<script>
  import utils from '@/utils/utils'

  export default {
    data () {
      return {
        languages: []
      }
    },
    beforeRouteEnter (to, from, next) {
      utils.getLanguages().then(languages => {
        next(vm => {
          vm.languages = languages
        })
      })
    }
  }
</script>

<style scoped lang="less">
  .container {
    margin-bottom: 20px;

    .content {
      font-size: 16px;
      margin: 0 50px 20px 50px;
      > ul {
        list-style: disc;
        li {
          line-height: 2;
          .title {
            font-weight: 500;
          }
        }
      }
    }
  }
</style>
