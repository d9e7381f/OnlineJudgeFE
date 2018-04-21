<template>
  <panel>
    <div slot="title">常见问题</div>
    <div class="content markdown-body">
      <ul>
        <li>输入和输出在哪里?
          <p>你的程序数据讲从 <code>stdin</code>('标准输入')读取 然后从 <code>stdout</code>('标准输出')输出
            例如,你可以使用 C语言的<code>scanf</code> 函数或者 使用C++的<code>cin</code> 从标准输入流输入,同理你可以使用C语言的 <code>printf</code> 和C++的<code>cout</code>  从标准输出流中输出。
            编写的程序不允许读写文件，否则将返回 <code>Runtime Error</code>.
          </p>
        </li>
        <li>提交执行时间的含义是什么?
        <p>oj系统会根据不同的输入测试文件多次测试你的代码。如果的代码在每个输入测试文件的时间限定内给出正确答案，那么显示的执行时间就算每个测试用例花费时间的最大值。
        </p>
        </li>
        <li>如何使用 C++ Int64?
          <p>你应该声明变量为 <code>long long</code> 和使用 <code>cin/cout</code> 或 <code>%lld</code>, 使用<code> __int64</code> 将会导致返回<code>Compile Error</code>.</p>
        </li>
        <li>Java代码规范?
          <p>所有的程序都必须以一个<code>Main</code>类中的静态main开始。不要使用公共类，以及<code>Main</code>必须是非public，以避免编译错误。使用缓冲I/O来避免由于过度刷新而引起的超时</p>
        </li>
      </ul>
    </div>
  </panel>
</template>

<script>
</script>

<style lang="less" scoped>
  .content {
    font-size: 16px;
    margin: 0 50px 40px 50px;
    > ul {
      list-style: disc;
      li {
        font-size: 16px;
        margin-top: 20px;
        &:first-child {
          margin-top: 0;
        }
        p {
          font-size: 14px;
          margin-top: 5px;
        }
      }
    }
  }
</style>
