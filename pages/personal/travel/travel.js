const QQMapWX = require('./../../../utils/qqmap-wx-jssdk');
const config = require("./../../../config.js");
const app = getApp()
const {
	getRundata,
	getTravelRank,
	getTravelLog
} = require('./../../../api/travel')
var qqmapsdk;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		show_auth: app.globalData.show_auth,
		qrCode: '',
		imageUrl: app.globalData.imageUrl,
		todayStep: 0,
		totalStep: 0,
		stepPageSize: 10,
		stepPageNumber: 1,
		initPageNumber: 1,
		steps: [],
		user: '',
		showGeMoreLoadin: false,
		select: 1,

		//旅行数据
		latitude: 0,
		longitude: 0,
		includePoints: [],
		markers: [],
		travelLogMarkers: [],
		notTravelLogMarkers: [],
		notLabelMarkers: [],
		labelMarkers: [],
		polyline: [{
			points: [],
			color: "#FF4500",
			width: 3,
			dottedLine: false
		}],
		logs: [],
		travelPageSize: 4,
		travelPageNumber: 1,
		initPageNumber: 1,
		plan: '',
		showPostPlan: false,
		avatar: '',
		showReport: false,
		showMap: true,
		showTravelLocation: true,
		showTravelLabel: true,
		report: '',
		mapView: 1,
		fullView: 'full-view',
		harfView: 'harf-view',
		showFinish: false,
		showGeMoreLoadin: false,
		showTips: false,
		randList: [],
		rankPageSize: 10,
		rankPageNumber: 1,
		myRankData: '',
		myRank: 0,
		windowHeight: app.globalData.windowHeight,
		bgUlr: "http://article.qiuhuiyi.cn/Group.png",
		showMore: true
	},
	onLoad(options) {
		this.loginForRunData()
	},

	loginForRunData: function () {
		let that = this;
		wx.login({
			success: (res) => {
				let code = res.code
				console.log(code);
				wx.request({
					url: 'http://127.0.0.1:3001/api/login',
					method: 'POST',
					data: {
						code: code
					},
					success: (res) => {
						console.log(res.data);
						const code = res.data.data
						wx.setStorage({
							key: 'token',
							data: code
						})
					},
					fail: (res) => {
						console.log(res);
					}
				})
			},
		})
		wx.getSetting({
			success: (res) => {
				if (res.authSetting['scope.werun']) {
					wx.getWeRunData({
						success(res) {
							const encryptedData = res.encryptedData;
							const iv = res.iv;
							that.postRunData(encryptedData, iv);
						}
					})
				} else {
					wx.authorize({
						scope: "scope.werun",
						success(res) {
							that.loginForRunData();
							that.getPersonalInfo();
						}
					})
				}
			}
		})
	},

	/**
	 * 收集用户步数
	 */
	postRunData: async function (encryptedData, iv) {
		const res = await getRundata({
			encryptedData,
			iv
		})
		if (res.code === 200) {
			this.setData({
				steps: res.data.stepInfoList,
				totalStep: res.data.totalStep,
				todayStep: res.data.stepInfoList[0].step
			})
			console.log(this.data.steps);
		}
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