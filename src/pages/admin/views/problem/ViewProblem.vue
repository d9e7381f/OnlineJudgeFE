<template>
  <div class="page">
        <div slot="title">{{problem.title}}</div>
        <div id="problem-content" class="markdown-body">
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
                <pre>{{sample.input}}</pre>
              </div>
              <div class="sample-output">
                <p class="title">输出例子 {{index + 1}}</p>
                <pre>{{sample.output}}</pre>
              </div>
            </div>
          </div>

          <div v-if="problem.hint">
            <p class="title">提示</p>
            <div class="content" v-html=problem.hint></div>
          </div>

          <div v-if="problem.source">
            <p class="title">来源</p>
            <p class="content">{{problem.source}}</p>
          </div>
        </div>
  </div>
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
<style scoped>
  .page {
    margin-top: 20px;
    text-align: left;
  }

</style>
