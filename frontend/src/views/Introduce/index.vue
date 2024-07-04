<template>
  <div class="content">
    <div class="markdown-body">
      <MarkdownComponent />
    </div>
  </div>
</template>

<script>
// 引入 Markdown 文件
import MarkdownComponent from '@/assets/md/git.md'

export default {
  components: {
    MarkdownComponent
  }
};
</script>
