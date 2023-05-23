
const {
  getTopicById,
  likedTopic,
  getCommentTopic,
  replyTopicComment
} = require('../../../api/topic')
const {
  getUserInfo
} = require('../../../api/user')
const app = getApp()
const emitter = app.globalData.emitter
const config = require('../../../config')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topic: '',
    id: '',
    liked: false,
    comments: [],
    showGeMoreLoadin: false,
    pageNumber: 1,
    isBottom: true,
    paraiseNumber: 0,
    showCommentInput: false,
    commentId: 0,
    baseImgUrl: config.imgUrl
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id,
    })
    // 获取评论
    this.getTopicCommentFunc(options.id)
  },
  onShow() {
    this.getTopic(this.data.id)
    this.getUserInfoFunc()
  },
  // 获取用户信息
  async getUserInfoFunc() {
    const id = this.data.id
    const {
      data
    } = await getUserInfo()
    const likedList = data.likedTopic
    for (let i = 0; i < likedList.length; i++) {
      if (likedList[i] === +id) {
        this.setData({
          liked: true,
        })
      }
    }
  },
  // 获取每日话题
  async getTopic(id) {
    const res = await getTopicById(id)
    let topic = res.data
    this.setData({
      topic: topic,
      paraiseNumber: topic.praise_number
    })
    wx.hideLoading()
  },
  // 是否喜欢这个每日话题
  async praiseTopic(e) {
    const id = this.data.id
    const like = this.data.liked
    const {
      data
    } = await likedTopic({
      id,
      liked: !like
    })
    wx.hideLoading()
    this.setData({
      liked: data.like,
      paraiseNumber: data.paraiseNumber
    })
    emitter.emit('changeLiked', data.like, data.paraiseNumber);
  },
  // 添加评论
  async openCommentTopic(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/home/topic_comment/topic_comment?id=' + id
    })
  },
  // 获取评论
  async getTopicCommentFunc(id,page = this.data.pageNumber ) {
    if(page == 1) {
      this.setData({
        isBottom: false,
      }) 
    }
    this.setData({
      isBottom: false,
      showGeMoreLoadin: false
    })
    const limit = 5
    let token = wx.getStorageSync('token')
    wx.request({
      url: `${config.domain}/topic_comments?id=${id}&page=${page}&limit=${limit}`,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token,
      },
      success: (res) => {
        const arr = this.data.comments
        if (res.data.data.rows.length > 0) {
          res.data.data.rows.map(item => {
            if (item !== undefined) {
              arr.push(item)
            }
          })
            this.setData({
              isBottom: false,
              showGeMoreLoadin: false
            })
          this.setData({
            comments: arr,
            pageNumber: this.data.pageNumber + 1,
          })
        } else {
          this.setData({
            isBottom: true,
            showGeMoreLoadin: true
          })
        }
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },
  scrollPage() {
    if(this.data.showGeMoreLoadin) {
      return
    }
    this.getTopicCommentFunc(this.data.id);
  },
  // 显示输入框
  showCommentInput(e) {
    // console.log(e);
    const id = e.currentTarget.dataset.objid
    const index = e.currentTarget.dataset.index
    console.log(index);
    this.setData({
      showCommentInput: true,
      commentId: id,
      index,
    })
  },
  async postComment() {
    const content = this.data.content
    const topic_id = this.data.id
    const commentId = this.data.commentId
    const index = this.data.index
    const res = await replyTopicComment({content,topic_id,commentId})
    console.log(res);
    wx.hideLoading()
    wx.showToast({
      title: res.msg,
      icon: 'none'
    })
    if(res.code == 200) {
      const comments = this.data.comments
      for(let i = 0; i< comments.length; i++) {
        if(index == i) {
          comments[i].sub_comments.push(res.data)
        }
      }
      this.setData({
        [`comments`] : comments
      })
    }
    this.setData({
      showCommentInput: false
    })
    // this.getTopicCommentFunc(this.data.id,this.pageNumber - 1);
  },
  // 获取评论内容
  getCommentContent(e) {
    let content = e.detail.value;
    this.setData({
      content: content
    })
  },
  hiddenComment() {
    console.log(11);
    this.setData({
      showCommentInput: false,
    })
  }
})