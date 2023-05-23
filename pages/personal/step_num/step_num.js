const { getStepData } = require('../../../api/travel')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl: app.globalData.imageUrl,
        myRankData: '',
        myRank: 0,
        randList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.getStepRunData()
    },
	// 获取校园版的排名
	async getStepRunData() {
        const res = await getStepData()
         console.log(res);
         this.setData({
           randList: res.data.row,
           myRank: res.data.order
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