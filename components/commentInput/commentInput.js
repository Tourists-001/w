const app = getApp()
let inputHeight = 50; //输入框的高度
let windowHeight = wx.getSystemInfoSync().windowHeight;
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
    inputHeight: 0,
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
    },
    focus(e) {
      // console.log(e);
      const height = e.detail.height
      this.setData({
        inputHeight: height
      })
      const scrollHeight = (windowHeight - height - inputHeight - 85)
      this.triggerEvent('commentfocus', scrollHeight)
    },
    blur(e) {
      this.setData({
        inputHeight: 0
      })
      this.triggerEvent('commentfocus', windowHeight - 85 )
    }
  }
})