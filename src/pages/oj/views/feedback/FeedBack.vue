<template>
    <Card>
      <Form :label-width="110">
        <FormItem label="问题主题">
           <Row>
            <Col span="10">
              <Input placeholder="请输入系统问题主题" v-model="feedback.title"></Input>          
            </Col>
          </Row>
        </FormItem>
        <FormItem label="问题详细描述">
          <Row>
            <Col span="24">
              <Simditor v-model="feedback.description"></Simditor>  
            </Col>
          </Row>
        </FormItem>

        <FormItem>
          <Row>
            <Button type="primary">提交</Button>
          </Row>
        </FormItem>
      </Form>
    </Card>
</template>
<script>
  import Simditor from '../../components/Simditor'

  export default {
    name: 'feedback',
    components: {
      Simditor
    },
    data () {
      return {
        username: '',
        feedback: {
          title: '',
          description: ''
        },
        profile: {},
        problems: []
      }
    },
    mounted () {
      console.log('feedBack')
    },
    methods: {
    },
    computed: {
    }
  }
</script>