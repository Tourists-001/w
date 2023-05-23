// pages/personal/index_2/personal.js
const app = getApp();
const {
	getNewMessageCount
} = require('../../../api/message.js')
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const {
	getUserInfo
} = require('../../../api/user')
const {
	getMyPost
} = require('../../../api/post')
const {
	getMySale
} = require('../../../api/sale')

let id;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		user: {},
		newLetterNumber: 0,
		serviceId: '',
		param: app.globalData.param,
		showLoginButton: app.globalData.authStatus,
		selectPoster: 1,
		sinageture: "",
		todayStep: 0,
		myRank: 0,
		posts: [],
		pageSize: 10,
		pageNumber: 1,
		baseImageUrl: app.globalData.imageUrl,
		initPageNumber: 1,
		showCommentInput: false,
		commentContent: '',
		commentObjId: '',
		commentType: '',
		refcommentId: '',
		commentValue: '',
		showSubmit: false,
		canComment: true,
		leftList: [],
		rightList: [],
		leftHeight: 0,
		rightHeigt: 1,
		avatarUrl: defaultAvatarUrl,
		nickname: "",
		hidden: true,
		allList: [],
		rightList: [],
		leftList: [],
		isGoDetailt: true,
		isRefresh: true,
		showMessage: false,
		newMessageNumber: 0,
		bgImg: app.globalData.imageUrl + '/img/ing_bg.jpg',
		newLetterNumber: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const userInfo = wx.getStorageSync('userInfo')
		console.log(userInfo, 18);
		if (!userInfo) return
		// 订阅消息
		this.getMessageCount()
		this.subscribPrise(userInfo)
		// 请求用户信息
		this.getUserInfoFunc()
		// 获取我的表白墙
		this.getPost()
		this.getSale()
	},
	onShow() {
		//  请求用户信息
		this.getUserInfoFunc()
	},
	async getUserInfoFunc() {
		const info = await getUserInfo()
		if (info.code == 200) {
			id = info.data.id
			this.setData({
				user: info.data,
			})
			setTimeout(() => {
				this.setData({
					isRefresh: false
				})
			}, 1000)
		}
	},
	async getPost() {
		const res = await getMyPost(id)
		console.log(res);
		if (res.code == 200) {
			this.setData({
				allList: res.data
			})
		}
	},
	async getSale() {
		const res = await getMySale()
		const data = res.data
		if (res.data.length > 0) {
			let leftList = []
			let rightList = []
			data.forEach((item, i) => {
				if (i == data.length - 1) {
					leftList.push(item)
					this.setData({
						leftList: leftList,
						rightList: rightList,
					})
				}
				if (i % 2 != 0) {
					leftList.push(item);
					// leftHeight += item.attachments[0]['height'];
				} else {
					rightList.push(item)
					// rightHeigt += item.attachments[0]['height'];
				}
			})
		}
	},
	select(e) {
		let objType = e.target.dataset.type;
		this.setData({
			selectPoster: objType
		})
	},
	gochangeInfo() {
		wx.navigateTo({
			url: '/pages/personal/change_info/change_info',
		})
	},
	refresherpulling(e) {
		this.getUserInfoFunc()
	},
	subscribPrise(userInfo) {
		const channel = userInfo.uuid
		console.log(channel);
		const that = this
		// 监听表白墙的收藏
		wx.goEasy.pubsub.subscribe({
			channel, //替换为您自己的channel
			onMessage: async function (message) { //收到消息
				console.log(message);
				// 获取新消息的数量
				await that.getMessageCount()
			},
			onSuccess: function () {
				console.log("Channel订阅成功。");
			},
			onFailed: function (error) {
				console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
			}
		});
		// 监听表白墙的评论
	},
	// 获取新消息的数量
	async getMessageCount() {
		const count = await getNewMessageCount()
		if (count.code == 200) {
			this.setData({
				newMessageNumber: count.data,
				showMessage: true,
			})
		}
	},
	openPrivateList() {
		wx.navigateTo({
			url: '/pages/personal/private_list/private_list',
		})
	},
	deletePostItemFunc(e) {
		// console.log(e);
		const index = e.detail
		const oldList = this.data.allList
		oldList.splice(index, 1)
		this.setData({
			allList: oldList
		})
	},
	goToday() {
		wx.navigateTo({
			url: '/pages/personal/travel/travel',
		})
	},
	openStepNum() {
		wx.navigateTo({
		  url: '/pages/personal/step_num/step_num',
		})
	},
	openFollowList(e) {
		const type = e.currentTarget.dataset.type
		console.log(type);
		wx.navigateTo({
		  url: `/pages/personal/personal_list/personal_list?type=${type}`
		})
	},
	openMessage() {
		wx.navigateTo({
		  url: '/pages/personal/message/message',
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

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