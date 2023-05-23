// pages/personal/change_info/change_info.js
const {getUserInfo} = require('../../../api/user')
const { uploadImg } = require('../../../api/topic')
const { changeUserInfo } = require('../../../api/user')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatar: '',
        nickName: '',
        sign: '',
        baseImageUrl: app.globalData.imageUrl,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.getUserInfoFun()
    },
    async getUserInfoFun() {
        const res = await getUserInfo()
        const baseImageUrl = app.globalData.imageUrl
        if(res.code == 200) {
            this.setData({
                avatar: baseImageUrl + res.data.avatar,
                baseavatar:  res.data.avatar,
                nickName: res.data.nickName,
                sign: res.data.sign
            })
        }
    },
    async onChooseAvatar(e) {
		// console.log(e);
        const url = e.detail.avatarUrl
        this.setData({
            avatar: url
        })
        const file = {
            url,
        }
        const load = await uploadImg(file)
        console.log(load);
        this.setData({
            baseavatar: load.data
        })
    },
    getNickname(e) {
    //   console.log(e);
    this.setData({
        nickName: e.detail.value
    })
    },
    getTextContent(e) {
        console.log(e);
       this.setData({
           sign: e.detail.value
       })
    },
    async signatureSave() {
        console.log(this.data.sign, this.data.nickName, this.data.baseavatar);
        const data = {
            sign: this.data.sign,
            nickName: this.data.nickName,
            avatar: this.data.baseavatar
        }
        const res = await changeUserInfo(data)
        console.log(res);
        if(res.code == 200) {
            wx.showToast({
              title: '修改成功',
              icon: 'none'
            })
        }
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