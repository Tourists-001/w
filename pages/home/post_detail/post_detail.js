// pages/home/post_detail/post_detail.js
const {
	getPostById,
	addPostComment,
	deletePostComment
} = require('../../../api/post')
const {
	followAuthor
} = require('../../../api/user')
const app = getApp()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		posts: [],
		baseImageUrl: app.globalData.imageUrl,
		post_id: '',
		showCommentInput: false,
		commentContent: '',
		sub_commentObj: {},
		showTabSearch: false,
		showIcon: true,
		isGoDetailt: false,
		showComment: false,
		commenter: {},
		loading: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		console.log(options);
		if (options.type) {
			this.setData({
				showComment: true
			})
			console.log(this.data.showComment);
		}
		this.setData({
			post_id: options.id
		})
		const id = options.id
		this.getpostFun(id)
	},
	async getpostFun(id) {
		const res = await getPostById(id)
		console.log(res);
		if (res.code == 200) {
			wx.hideLoading()
			this.setData({
				posts: res.data
			})
		}
	},
	async sendComments(e) {
		const value = e.detail
		const postId = Math.floor(this.data.post_id)
		console.log(value, postId);
		if (value == '' || postId == '') {
			wx.showToast({
				title: '请输入评论内容',
				icon: 'none'
			})
			return
		}
		let obj = {}
		if (this.data.commenter.post_id) {
			console.log(this.data.commenter);
			 obj = {
				...this.data.commenter,
				content: value
			}
		} else {
			console.log(75);
			obj.content = value
			obj.post_id =  postId
		}
		const res = await addPostComment(obj)
		this.setData({
			[`posts[0].comments`]: res.data,
			showComment: false,
			commenter: {},
		})
	},
	// 预览图片
	previewMoreImage: function (event) {
		console.log(event);
		let images = event.currentTarget.dataset.obj.map(item => {
			return this.data.baseImageUrl + item;
		});
		let url = event.target.id;
		wx.previewImage({
			current: url,
			urls: images
		})
	},
	async deleteComment(e) {
		wx.showActionSheet({
			itemList: ['删除'],
			success: (res) => {
				// console.log(res.tapIndex)
				wx.showModal({
					title: '是否删除此评论',
					complete: async (res) => {
						if (res.confirm) {
							const comment_id = e.currentTarget.dataset.objid
							await deletePostComment(comment_id)
							this.getpostFun(this.data.post_id)
							wx.hideLoading()
							wx.showToast({
								title: '删除成功',
								icon: 'none'
							})
						}
					}
				})
			},
			fail(res) {
				console.log(res.errMsg)
			}
		})
		return
		console.log(e);

	},
	hiddenComment(e) {
		const {
			bool
		} = e.detail
		this.setData({
			showComment: bool
		})
		const obj = e.detail
		if (obj.post_id) {
			this.data.commenter = {
				comment_id: obj.comment_id,
				post_id: obj.post_id,
				ref_id: obj.ref_id,
			}
		}
	},
	// 关注作者
	async cancelFolllow(e) {
		console.log(e.currentTarget.dataset.obj);
		const index = e.currentTarget.dataset.index
		const id = e.currentTarget.dataset.obj
		const res = await followAuthor(id)
		if (res.data.like) {
			// 设置关注
			this.setData({
				[`posts[${index}].follow`]: true,
			})
			wx.showToast({
				title: '已关注',
				icon: 'none'
			})
		} else {
			this.setData({
				[`posts[${index}].follow`]: false,
			})
			wx.showToast({
				title: '已取消关注',
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