const {
	uploadImg
} = require('../../../api/topic')
const {
	addSalePost
} = require('../../../api/sale')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		introduce: '',
		name: '',
		expectation: '',
		gender: 1,
		fileList: []
	},
	getName: function (e) {
		let value = e.detail.value;
		this.setData({
			name: value
		});
	},
	getLike: function (e) {
		let value = e.detail.value;
		this.setData({
			expectation: value
		});
	},

	getContent: function (e) {
		let value = e.detail.value;
		this.setData({
			introduce: value
		});
	},
	selectGender: function (e) {
		let gender = e.target.dataset.gender;
		this.setData({
			gender: gender
		})
	},
	async post() {
		wx.showLoading({
			title: '上传中',
		})
		const prom = this.data.fileList.map(async (item) => {
			return await uploadImg(item)
		})
		const result = await Promise.all(prom)
		console.log(result, 'res');
		const arr = result.filter(i => i.data == 'null')
		console.log(result, 'undefa');
		if (arr.length === 0) {
			console.log(result);
			// 图片上传成功
			const pathArr = result.map(i => i.data)
			console.log(pathArr);
			const obj = {
				introduce: this.data.introduce,
				attachments: pathArr,
				name: this.data.name,
				descption: this.data.expectation,
				sex: +this.data.gender
			}
			console.log(obj);
			const res = await addSalePost(obj)
			// console.log(res);
			if (res.code !== 200) {
				wx.showToast({
					title: res.msg,
					icon: 'none'
				})
				return
			}
			wx.hideLoading()
			wx.navigateBack()
		}
	},
	afterRead(event) {
		const newFileList = [...this.data.fileList];
		const {
			file
		} = event.detail;
		console.log(file);
		for (let i = 0; i < file.length; i++) {
			newFileList.push({
				url: file[i].url
			})
		}
		this.setData({
			fileList: newFileList
		})
	},
	deleteImg(e) {
		// console.log(e);
		const index = e.detail.index
		const fileList = this.data.fileList
		fileList.splice(index, 1)
		this.setData({
			fileList: fileList
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {},

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