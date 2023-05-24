const {
    getPrivateList,
    deletePrivateList
} = require("../../../api/message")
const app = getApp()
// pages/personal/private_list/private_list.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        baseImageUrl: app.globalData.imageUrl,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getList()
        const userInfo = wx.getStorageSync('userInfo')
        // this.subscribPrise(userInfo)
    },
    // 获取列表数据
    async getList() {
        const list = await getPrivateList()
        console.log(list);
        this.setData({
            list: list.data
        })
    },
    goPrivateLetter(e) {
        const message_list_id = e.currentTarget.dataset.id
        const name = e.currentTarget.dataset.name
        const user_id = e.currentTarget.dataset.user_id
        wx.navigateTo({
            url: `/pages/personal/private_letter/private_letter?message_list_id=${message_list_id}&name=${name}&user_id=${user_id}`,
        })
    },
    async deletePrivate(e) {
        const index = e.currentTarget.dataset.index
        const id = e.currentTarget.dataset.id
        const res = await deletePrivateList(id)
        const list = this.data.list
        list.splice(index, 1)
        this.setData({
            list,
        })

    },
    subscribPrise(userInfo) {
        const channel = userInfo.uuid
        const that = this
        // 监听表白墙的收藏
        wx.goEasy.pubsub.subscribe({
            channel, //替换为您自己的channel
            onMessage: async function (message) { //收到消息
                // console.log(message);
                // 获取新消息的数量
                console.log(message.content, 61);
                const content = JSON.parse(message.content)
                if (content.messageType) {
                    await that.getMessageCount()
                } else if (content.content_type) {
                    await that.getPrivateLetterMumFunc()
                }
            },
            onSuccess: function () {
                console.log("Channel订阅成功。",70);
            },
            onFailed: function (error) {
                console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
            }
        });
        // 监听表白墙的评论
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