const {
	getSaleByPage,
	getHotSaleByPage,
	getPraiseSale,
	searchSale
} = require('../../../api/sale')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		leftList: [],
		rightList: [],
		baseImageUrl: app.globalData.imageUrl,
		showGeMoreLoadin: true,
		pageNumber: 1,
		index: 1,
		isRefresh: false,
		value: '',
		loading: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.getList()
		this.setData({
			loading: false                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
		})
	},
	async getList() {
		let pageNumber = this.data.pageNumber
		const res = await getSaleByPage(pageNumber)
		console.log(res);
		const data = res.data
		let leftList = this.data.leftList;
		let rightList = this.data.rightList;
		if (data.length > 0) {
			data.map((item, i) => {
				if (i == data.length - 1) {
					rightList.push(item)
					this.setData({
						leftList: leftList,
						rightList: rightList,
					})
				}
				if (i % 2 == 0) {
					leftList.push(item);
					// leftHeight += item.attachments[0]['height'];
				} else {
					rightList.push(item)
					// rightHeigt += item.attachments[0]['height'];
				}

			})
			this.setData({
				pageNumber: pageNumber + 1
			})
		} else {
			this.setData({
				notDataTips: true,
				showGeMoreLoadin: false
			});
		}
	},
	async getHotList() {
		let pageNumber = this.data.pageNumber
		const res = await getHotSaleByPage(pageNumber)
		const data = res.data
		let leftList = this.data.leftList;
		let rightList = this.data.rightList;
		if (data.length > 0) {
			data.map((item, i) => {
				if (i == data.length - 1) {
					rightList.push(item)
					this.setData({
						leftList: leftList,
						rightList: rightList,
					})
				}
				if (i % 2 == 0) {
					leftList.push(item);
					// leftHeight += item.attachments[0]['height'];
				} else {
					rightList.push(item)
					// rightHeigt += item.attachments[0]['height'];
				}

			})
			this.setData({
				pageNumber: pageNumber + 1
			})
		} else {
			this.setData({
				notDataTips: true,
				showGeMoreLoadin: false
			});
		}
	},
	// 进入详情
	comment: function (e) {
		let id = e.currentTarget.dataset.objid;
		wx.navigateTo({
			url: '/pages/sale/comment_sale/comment_sale?id=' + id
		})
	},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */

	/**
	 * 页面上拉触底事件的处理函数
	 */
	scrollView(e) {
		console.log(1);
		if (this.data.notDataTips) return
		// console.log(e);
		this.getList()
	},
	selectBar(e) {
		this.setData({
			index: e.detail,
			showGeMoreLoadin: true,
			pageNumber: 1,
			leftList: [],
			rightList: []
		})
		if (e.detail === 1) {
			this.getList()
		} else if (e.detail === 2) {
			this.getHotList()
		} else if (e.detail === 3) {
			this.getPraise()
		}
	},
	async getPraise() {
		let pageNumber = this.data.pageNumber
		const res = await getPraiseSale(pageNumber)
		const data = res.data
		console.log(data);
		let leftList = this.data.leftList;
		let rightList = this.data.rightList;
		if (data.length > 0) {
			data.map((item, i) => {
				if (i == data.length - 1) {
					rightList.push(item)
					this.setData({
						leftList: leftList,
						rightList: rightList,
					})
				}
				if (i % 2 == 0) {
					leftList.push(item);
					// leftHeight += item.attachments[0]['height'];
				} else {
					rightList.push(item)
					// rightHeigt += item.attachments[0]['height'];
				}

			})
			this.setData({
				pageNumber: pageNumber + 1
			})
		} else {
			this.setData({
				notDataTips: true,
				showGeMoreLoadin: false
			});
		}
	},
	refresherpulling() {
				//   console.log(e);
				this.setData({
					leftList: [],
					rightList: [],
					showGeMoreLoadin: true,
					pageNumber: 1,
				})
				const index = this.data.index
				if (index === 1) {
					this.getList()
				} else if (index === 2) {
					this.getHotList()
				} else if (index === 3) {
					this.getPraise()
				}
				setTimeout(() => {
					this.setData({
						isRefresh: false
					})
				}, 1000)
	},
	post: function () {
		wx.navigateTo({
			url: '/pages/sale/post_sale/post_sale'
		})
	},
	async searchPost() {
		const value = this.data.value
		const typeArr = ['all', 'hot', 'praise']
		const type = typeArr[this.data.index]
		if(value == '') return
		const res = await searchSale(value, type)
		// console.log(res);
		const data = res.data
		if(res.data.length > 0) {
			let leftList = []
			let rightList = []
               data.forEach((item, i) => {
				if (i == data.length - 1) {
					leftList.push(item)
					this.setData({
						leftList: leftList,
						rightList: rightList,
					})
                 console.log(this.data.leftList);
				}
				if (i % 2 == 0) {
					leftList.push(item);
					// leftHeight += item.attachments[0]['height'];
				} else {
					rightList.push(item)
					// rightHeigt += item.attachments[0]['height'];
				}
			   })
		}
	},
	getFilterValue(e) {
		//  console.log(e);
		const value = e.detail
		this.setData({
			value,
		})
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})