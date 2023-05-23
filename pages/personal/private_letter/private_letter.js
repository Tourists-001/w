// pages/personal/private_letter/private_letter.js
const { getLetterList, sendMessageLetter } = require('../../../api/message')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topName: '',
    id: '',
    user_id: '',
    my_id: '',
    baseImageUrl: app.globalData.imageUrl,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      message_list_id,
      name,
      user_id
    } = options
    this.setData({
      topName: name,
      message_list_id,
      user_id
    })

    // 获取用户id
   const userInfo =wx.getStorageSync('userInfo')
   this.data.my_id = userInfo.id
    if(!message_list_id) {
      // 初次进入消息列表,无需加载消息
      console.log(options);
    } else {
      this.getLetterListFunc(message_list_id)
    }
  },
  // 获取消息
  async getLetterListFunc(id) {
    const res = await getLetterList(id)
    console.log(res);
    this.setData({
      list: res.data
    })
  },
  // 获取发送消息的内容
  getContent: function (event) {
    let content = event.detail.value;
    this.setData({
      content: content
    })
  },
  // 发送消息
  async sendMessage() {
      console.log(this.data.my_id, this.data.user_id);
      const from_user_id =Math.floor(this.data.my_id)
      const to_user_id = Math.floor(this.data.user_id)
      const message_list_id = Math.floor(this.data.message_list_id)
      const content = this.data.content
      const res = await sendMessageLetter({from_user_id, to_user_id, content, message_list_id})
      const list = this.data.list
      list.push(res.data)
      this.setData({
        list,
        content: ''
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})