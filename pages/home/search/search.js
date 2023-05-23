const {
	getPostByPage,
	getHostPost,
	getPraisePost,
	getSearchPost
} = require('../../../api/post')
const {
	debounce,
	throttle
} = require('../../../utils/util')
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		allList: [],
		hotList: [],
		priseList: [],
		allpageNumber: 1,
		hotPageNumber: 1,
		prisePageNumber: 1,
		showIcon: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

	},

	getPostValue: debounce(async function (e) {
		this.setData({
			allList: [],
			hotList: [],
			priseList: [],
		})
		const value = e.detail.value
		const typeArr = ['all', 'hot', 'praise']
		if (value == '') return
		this.getSearchPostFunc(value, typeArr[0])
		this.getHostPostFUnc(value, typeArr[1])
		this.getPraisePostFunc(value, typeArr[2])
	}, 500),
	// 获取表白墙数据
	async getSearchPostFunc(value, type) {
		const res = await getSearchPost(value, type)
		console.log(res);
		this.setData({
			allList: res.data
		})
		console.log(this.data.allList);
	},
	async getHostPostFUnc(value, type) {
		const res = await getSearchPost(value, type)
		console.log(res);
		this.setData({
			hotList: res.data
		})
		console.log(this.data.allList);
	},
	async getPraisePostFunc(value, type) {
		const res = await getSearchPost(value, type)
		console.log(res);
		this.setData({
			priseList: res.data
		})
		console.log(this.data.allList);
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})