const app = getApp()
let emitter = app.globalData.emitter
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    myValue: String
  },
  data: {
    index: '',
    isShow: false,
  },
  created() {
    wx.$on({
      name: 'showComment',
      tg: this,
      success: (res) => {
        console.log(res);
        this.setData({
          isShow: res
        })
      }
    })
  },
  methods: {
    update: function () {
      // 更新 myValue
      this.setData({
        myValue: 'leaf'
      })
    },
    // 获取输入框的内容
    sendComment() {
      const data = this.data.myValue
      if (data === '') return
      this.triggerEvent('sendComment', data)
      this.setData({
        myValue: ''
      })
    }
  }
})