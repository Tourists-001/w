// pages/login/login.js
const {
    isLogin,
    getUserInfo
} = require('../../api/user')
const config = require('../../config')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        islaoding: false,
        loginInfo: '登陆'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    bindGetUserInfo(e) {
        this.setData({
            loginInfo: '登陆中...',
            islaoding: true,
        })
        // 登录逻辑
        wx.login({
            success: (res) => {
                let code = res.code
                console.log(code);
                wx.request({
                    url: `${config.domain}/login`,
                    method: 'POST',
                    data: {
                        code: code
                    },
                    success: async (res) => {
                        const code = res.data.data
                        wx.setStorageSync('token', code)
                        const userInfo = await getUserInfo()
                        wx.setStorageSync('userInfo', userInfo.data)

                        wx.switchTab({
                            url: '/pages/home/index_2/index_2'
                        })
                    },
                    fail: (res) => {
                        console.log(res);
                    }
                })
            },
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