// components/postItem/postItem.js
const app = getApp()
const {
  followAuthor
} = require('../../api/user')
const {
  paraisePost,
  deletePost,
  addPostComment,
  deletePostComment
} = require('../../api/post')
const {
  $on
} = require('../../utils/event')
// const emitter = app.globalData.emitter
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
    },
    index: {
      type: Number
    },
    isGoDetailt: {
      type: Boolean,
      value: false
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    baseImageUrl: app.globalData.imageUrl,
    showCommentInput: false,
    value: '',
    praisesInfo: [],
    id: app.globalData.id,
    commnetValue: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 关注作者
    async cancelFolllow(e) {
      const id = e.currentTarget.dataset.obj
      const adminId = this.data.item.adminId
      console.log(adminId);
      const res = await followAuthor(id)
      if (res.data.like) {
        // 设置关注
        this.setData({
          [`item.follow`]: true,
        })
        this.triggerEvent('cancelFollowCallBack', {
          id: adminId,
          like: true
        })
      } else {
        this.setData({
          [`item.follow`]: false,
        })
        this.triggerEvent('cancelFollowCallBack', {
          id: adminId,
          like: false
        })
      }
    },
    // 预览图片
    previewMoreImage(event) {
      // console.log(event);
      let images = event.currentTarget.dataset.obj.map(item => {
        return this.data.baseImageUrl + item;
      });
      console.log(images);
      let url = event.target.id;
      wx.previewImage({
        current: url,
        urls: images
      })
    },
    // 点赞话题
    async praisePost(e) {
      const id = e.currentTarget.dataset.obj
      let praise_number = this.data.item.praise_number
      const info = this.data.item.praisesInfo
      console.log(info);
      const {
        data
      } = await paraisePost(id)
      if (data.like) {
        // 设置关注
        praise_number++
        info.push(data.user)
        this.setData({
          [`item.isLike`]: true,
          [`item.praise_number`]: praise_number,
          [`item.praisesInfo`]: info
        })
      } else {
        praise_number--
        for (let i = 0; i < info.length; i++) {
          if (info[i].id == data.user.id) {
            // console.log(i);
            info.splice(i, 1)
          }
        }
        this.setData({
          [`item.isLike`]: false,
          [`item.praise_number`]: praise_number,
          [`item.praisesInfo`]: info
        })
      }
      wx.hideLoading()
    },
    // 评论
    async showCommentInput() {
      this.setData({
        isShowComment: true
      })
      if (!this.data.isGoDetailt) {
        wx.navigateTo({
          url: `/pages/home/post_detail/post_detail?id=${this.data.item.id}&type=${this.data.isShowComment}`
        })
      } else {
        this.triggerEvent('hiddenComment', {bool:true})
      }
    },
    // 进入详情页
    goPostDetail() {
      if (!this.data.isGoDetailt) {
        wx.navigateTo({
          url: '/pages/home/post_detail/post_detail?id=' + this.data.item.id
        })
      } else {
        console.log(false);
        this.triggerEvent('hiddenComment', {bool:false})
      }
    },
    hiddenComment() {
      this.setData({
        showCommentInput: false
      })
    },
    async deleteComment(e) {
      console.log(e);
      wx.showActionSheet({
        itemList: ['删除'],
        success: (res) => {
          // console.log(res.tapIndex)
          wx.showModal({
            title: '是否删除此评论',
            complete: async (res) => {
              if (res.confirm) {
                const comment_id = e.currentTarget.dataset.objid
                const index = e.currentTarget.dataset.index
                await deletePostComment(comment_id)
                const item = this.data.item
                const itemComment = this.data.item.comments
                itemComment.splice(index, 1)
                item.comment = itemComment
                console.log(item);
                this.setData({
                  item: item
                })
                wx.hideLoading()
                wx.showToast({
                  title: '删除成功',
                  icon: 'none'
                })
              }
            }
          })
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
      return
      console.log(e);

    },
    commentOtherComment(e) {
      console.log('点s击');
      const post_id = +this.data.item.id
      const ref_id = e.currentTarget.dataset.refid
      const comment_id = e.currentTarget.dataset.objid
      const sub_commentObj = {
        bool: true,
        post_id,
        ref_id,
        comment_id
      }
      this.triggerEvent('hiddenComment', sub_commentObj)
      // this.sendCommentFunc()
    },
    // 删除表白墙
    async deletePost(e) {
      // console.log(e);
      const index = this.data.index
      console.log(index);
      const id = e.currentTarget.id
      wx.showModal({
        title: '提示',
        content: '是否删除这条表白内容',
        success: async (res) => {
          if (res.confirm) {
            // console.log('用户点击确定')
            // await deletePost(id)
            wx.hideLoading()
            console.log(this.data.item);
            this.triggerEvent('deletePostItem', index)
            wx.showToast({
              title: '删除成功',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    openUserInfo(e) {
      // console.log(e);
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/personal/other_list/other_list?id=${id}`
      })
    }
  }
})