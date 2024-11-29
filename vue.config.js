const { defineConfig } = require('@vue/cli-service')
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue_grade_table/'  // 리포지토리 이름을 /뒤에 추가
    : '/'
}

