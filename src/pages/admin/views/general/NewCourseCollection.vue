<template>
  <Panel title="课程与分类">
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item of breadcrumb" :key="item.id" ><a @click="goTag(item.id)">{{item.name}}</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-select v-model="selectID" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="goforward()" round>进入</el-button>
    </div>
  </Panel>
</template>
<script>
export default {
  name: 'course',
  data () {
    return {
      selectID: '',
      breadcrumb: [
        {
          name: '课程与分类',
          id: 21
        }
      ],
      options: [
        {
          label: '课程',
          value: 0
        },
        {
          label: '分类',
          value: 1
        }
      ]
    }
  },
  methods: {
    goTag (id) {
      console.log('go:' + id)
    },
    goforward () {
      console.log('goforward:' + this.selectID)
    }
  }

}
</script>
