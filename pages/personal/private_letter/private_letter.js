// pages/personal/private_letter/private_letter.js
const {
  getLetterList,
  sendMessageLetter
} = require('../../../api/message')
const {
  uploadImg
} = require('../../../api/topic')
const app = getApp()
let inputHeight = 50; //输入框的高度
let windowHeight = wx.getSystemInfoSync().windowHeight;
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
    list: [],
    scrollTop: 0,
    inputHeight: 0,
    toView: '',
    marheight: 0,
    scrollHeight: windowHeight - inputHeight - 85,
    inputBottom: 0,
    fileList: [],
    attachments: [],
    islaodingMessage: true,
    page: 2,
    isenbaled: true
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
      user_id,
    })
    // 获取用户id
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo,
    })
    this.subscribPrise(userInfo)
    this.data.my_id = userInfo.id
    if (!message_list_id) {
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
      list: res.data,
      toView: 'msg-' + (res.data.length - 1)
    })
  },
  // 获取发送消息的内容
  getContent: function (event) {
    let content = event.detail.value;
    this.setData({
      content: content
    })
  },
  bindfocus(e) {
    console.log(e);
    const height = e.detail.height
    const list = this.data.list
    // if(height > 0 ) {
    this.setData({
      inputHeight: e.detail.height,
      scrollHeight: (windowHeight - height - inputHeight - 85),
    })
    this.setData({
      toView: 'msg-' + (list.length - 1),
    })
    console.log(windowHeight, height, inputHeight, this.data.scrollHeight, this.data.toView);
    // }
  },
  inputBlur(e) {
    this.setData({
      inputHeight: 0,
      scrollHeight: windowHeight - inputHeight - 85,
      // inputBottom: 0+ 'px',
      // toView: 'msg-' + (this.data.list.length - 1)
    })
    console.log(this.data.scrollHeight);
  },
  // 发送消息
  async sendMessage() {
    wx.showLoading({
      title: '发送中',
    })
    const from_user_id = Math.floor(this.data.my_id)
    const to_user_id = Math.floor(this.data.user_id)
    const message_list_id = Math.floor(this.data.message_list_id)
    const content = this.data.content
    const attachments = this.data.attachments
    if (content) {
      const res = await sendMessageLetter({
        from_user_id,
        to_user_id,
        content,
        message_list_id
      })
      const list = this.data.list
      list.push(res.data)
      this.setData({
        list,
        content: '',
        attachments: [],
        toView: 'msg-' + (list.length - 1)
      })
      wx.hideLoading()
    } else if (attachments.length != 0) {
      // 发送的是图片
      const res = await sendMessageLetter({
        from_user_id,
        to_user_id,
        attachments,
        message_list_id
      })
      const list = this.data.list
      list.push(res.data)
      this.setData({
        list,
        content: '',
        attachments: [],
        toView: 'msg-' + (list.length - 1)
      })
      wx.hideLoading()

    } else {
      wx.showToast({
        title: '请输入发送内容',
        icon: 'none'
      })
    }

  },
  subscribPrise(userInfo) {
    const channel = userInfo.uuid
    const that = this
    wx.goEasy.pubsub.subscribe({
      channel, //替换为您自己的channel
      onMessage: async function (message) { //收到消息
        // console.log(message);
        // 获取新消息的数量
        const content = JSON.parse(message.content)
        console.log(content, 119);
        if (content.messageType) {
          // await that.getMessageCount()
        } else if (content.content_type) {
          // await that.getPrivateLetterMumFunc()
          // 添加列表或者修改消息数量
          that.newGetMessageList(content)
        }
      },
      onSuccess: function () {
        console.log("Channel订阅成功。", 70);
      },
      onFailed: function (error) {
        console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
      }
    });
  },
  newGetMessageList(list) {
    console.log(list);
    const message = this.data.list
    message.push(list)
    this.setData({
      list: message
    })
    // 滚动条滚动
    this.setData({
      toView: 'msg-' + (this.data.list.length - 1),
    })
  },
  async afterRead(event) {
    const newFileList = [...this.data.fileList];
    const {
      file
    } = event.detail;
    console.log(file);
    for (let i = 0; i < file.length; i++) {
      newFileList.push({
        url: file[i].url
      })
    }
    if (newFileList.length != 0) {
      wx.showLoading({
        title: '上传中',
      })
      const prom = newFileList.map(async (item) => {
        return await uploadImg(item)
      })
      const result = await Promise.all(prom)
      console.log(result);
      const list = result.map(item => item.data)
      console.log(list);
      this.data.attachments = list
      this.sendMessage()
      wx.hideLoading()
    }
  },
  async refresherrefresh() {
    console.log('push');
    const page = this.data.page
    const {data} = await getLetterList(this.data.message_list_id, page)
    // console.log(data);
    if(data.length > 0) {
      this.data.islaodingMessage = true
      const list = this.data.list
      list.unshift(...data)

      this.setData({
        list,
        islaodingMessage: false
      })
      this.setData({
        toView: 'msg-' + list.length - 10
     })
      this.data.page += 1

      console.log(list);
    } else {
      this.setData({
        isenbaled: false
      })
    }
  },
  goOtherPerson(e) {
    console.log(e);
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/personal/other_list/other_list?id=${id}`
    })
  }
})