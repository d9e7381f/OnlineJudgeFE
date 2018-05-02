const pieColorMap = {
  '正确': {color: '#19be6b'},
  '错误': {color: '#ed3f14'},
  '答案错误': {color: '#ed3f14'},
  '时间超出限制': {color: '#ff9300'},
  '内存超出限制': {color: '#f7de00'},
  '运行错误': {color: '#ff6104'},
  '编译错误': {color: '#80848f'},
  '部分通过': {color: '#2d8cf0'}
}

function getItemColor (obj) {
  return pieColorMap[obj.name].color
}

const pie = {
  legend: {
    left: 'center',
    top: '10',
    orient: 'horizontal',
    data: ['正确', '错误']
  },
  series: [
    {
      name: 'Summary',
      type: 'pie',
      radius: '80%',
      center: ['50%', '55%'],
      itemStyle: {
        normal: {color: getItemColor}
      },
      data: [
        {value: 0, name: '错误'},
        {value: 0, name: '正确'}
      ],
      label: {
        normal: {
          position: 'inner',
          show: true,
          formatter: '{b}: {c}\n {d}%',
          textStyle: {
            fontWeight: 'bold'
          }
        }
      }
    }
  ]
}

const largePie = {
  legend: {
    left: 'center',
    top:
      '10',
    orient:
      'horizontal',
    itemGap:
      20,
    data:
      ['正确', '运行错误', '错误', '时间超出限制', '部分通过', '内存超出限制']
  },
  series: [
    {
      name: 'Detail',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '55%'],
      itemStyle: {
        normal: {color: getItemColor}
      },
      data: [
        {value: 0, name: '运行错误'},
        {value: 0, name: '错误'},
        {value: 0, name: '时间超出限制'},
        {value: 0, name: '正确'},
        {value: 0, name: '内存超出限制'},
        {value: 0, name: '部分通过'}
      ],
      label: {
        normal: {
          formatter: '{b}: {c}\n {d}%'
        }
      },
      labelLine: {
        normal: {}
      }
    },
    {
      name: 'Summary',
      type: 'pie',
      radius: '30%',
      center: ['50%', '55%'],
      itemStyle: {
        normal: {color: getItemColor}
      },
      data: [
        {value: '0', name: '错误'},
        {value: 0, name: '正确', selected: true}
      ],
      label: {
        normal: {
          position: 'inner',
          formatter: '{b}: {c}\n {d}%'
        }
      }
    }
  ]
}

export { pie, largePie }
