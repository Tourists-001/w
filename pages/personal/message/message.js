// pages/personal/message/message.js
const {
    getMessageList,
    readMessagePost
} = require('../../../api/message.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        messageList: [],
        baseImageUrl: app.globalData.imageUrl,
        screenMinHeight: app.globalData.screenMinHeight
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(this.data.navTop);
        //    获取消息列表
        this.getMessageListFun()
    },
    async getMessageListFun() {
        const res = await getMessageList()
        console.log(res);
        this.setData({
            messageList: res.data.rows
        })
    },
    async opendDetail(e) {
        const id = e.currentTarget.dataset.id
        const type = e.currentTarget.dataset.type
        const messageId = e.currentTarget.dataset.message
        const index = e.currentTarget.dataset.index
        if (!this.data.messageList[index].is_use) {
            await this.readMessage(messageId, index)
        }
        if (id && (type == 'post_comment' || type == 'post_prise' || type == 'post_sub_comment')) {
            wx.navigateTo({
                url: '/pages/home/post_detail/post_detail?id=' + id
            })
        } else if (id && (type == 'sale_comment' || type == 'sale_prise')) {
            wx.navigateTo({
                url: '/pages/sale/comment_sale/comment_sale?id=' + id
            })
        }
    },
    // 已读消息
    async readMessage(id, index) {
        // 已读某条消息
        const res = await readMessagePost(id, index)
        if (res.code === 200) {
            this.setData({
                [`messageList[${index}].is_use`]: true
            })

        }
    },
    async readMessageAll() {
        const res = await readMessagePost()
        const list = this.data.messageList
        if (res.code == 200) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].is_use) return
                console.log(list[i].is_use);
                this.setData({
                    [`messageList[${i}].is_use`]: true
                })
            }
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