<template>
    <!--problem main-->
    <el-card style="margin-top: -20px;">
      <div id="problem-content" class="markdown-body">
          <p class="title">标题</p>
          <p class="content" v-html=problem.title></p>

          <p class="title">问题描述</p>
          <p class="content" v-html=problem.description></p>

          <p class="title">输入</p>
          <p class="content" v-html=problem.input_description></p>

          <p class="title">输出</p>
          <p class="content" v-html=problem.output_description></p>

          <div v-for="sample, index in problem.samples">
            <div class="flex-container sample">
              <div class="sample-input">
                <p class="title">输出例子 {{index + 1}}
                </p>
                <el-card dis-hover>
                  <div class="content">{{sample.input}}</div>
                </el-card>
              </div>

              <div class="sample-output">
                <p class="title">输出例子 {{index + 1}}</p>
                <el-card dis-hover>
                  <div class="content">{{sample.output}}</div>
                </el-card>
              </div>
            </div>
          </div>

          <div v-if="problem.hint">
            <p class="title">提示</p>
            <el-card dis-hover>
              <div class="content" v-html=problem.hint></div>
            </el-card>
          </div>

          <div v-if="problem.source">
            <p class="title">来源</p>
            <p class="content">{{problem.source}}</p>
          </div>
        </div>
    </el-card>
</template>
<script>
  import api from '@admin/api'

  export default {
    name: 'view-problem',
    props: ['problemId'],
    data () {
      return {
        loading: false,
        problem: {}
      }
    },
    mounted () {
      this.getProblem(this.problemId)
    },
    watch: {
      'problemId' () {
        this.getProblem(this.problemId)
      }
    },
    methods: {
      getProblem (params) {
        console.log('method getProblem ')
        api.getProblem(this.problemId).then(problemRes => {
          this.problem = problemRes.data.data
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .page {
    margin-top: 20px;
    text-align: left;
  }
 
   .card-title {
    margin-left: 8px;
  }

  #problem-content {
    margin-top: -10px;
    .title {
      font-size: 20px;
      font-weight: 400;
      margin: 25px 0 8px 0;
      color: #3091f2;
      .copy {
        padding-left: 8px;
      }
    }
    p.content {
      margin-left: 25px;
      margin-right: 20px;
      font-size: 15px
    }
    .sample {
      align-items: stretch;
      &-input, &-output {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        margin-right: 5%;
      }
      pre {
        flex: 1 1 auto;
        align-self: stretch;
        border-style: solid;
        background: transparent;
      }
    }
  }

</style>
