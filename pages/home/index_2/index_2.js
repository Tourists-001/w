const {
	getPostByPage,
	getHostPost,
	getPraisePost,
	getSearchPost
} = require('../../../api/post')
const {
	getTopic,
	likedTopic
} = require('../../../api/topic')
const {
	getUserInfo
} = require('../../../api/user')
const {
	debounce,
	throttle
} = require('../../../utils/util')
import Notify from '@vant/weapp/notify/notify';
const app = getApp()
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
		showCommentInput: false,
		commnetValue: '',
		showSearch: true,
		showTabSearch: false,
		isLoading: false,
		loading: true,
		index: 0,
		isGoDetailt: true,
		currentIndex: 0,
		allcancel: true,
		hotcancel: true,
		prisecancel: true,
		baseImgUrl: app.globalData.imageUrl,
		notifyShow: false
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		// 获取每日话题
		this.getTopicFunc()
		// 获取表白墙
		this.getPraisePostFunc()
		this.getPostAllFunc()
		this.getHostPostFunc()
		this.data.newHeader = this.selectComponent('#Header')
		this.setData({
			loading: false
		})
		const userInfo = wx.getStorageSync('userInfo')
		this.subscribPrise(userInfo)
	},
	async getPostAllFunc() {
		const page = this.data.allpageNumber
		const res = await getPostByPage(page)
		let posts = this.data.allList;
		if (res.data) {
			if (res.data.length > 0) {
				res.data.map(item => {
					posts.push(item);
				});
				this.setData({
					allList: posts,
					allpageNumber: page + 1
				});
				setTimeout(() => {
					this.setData({
						isLoading: false
					})
				}, 1000)
				console.log(this.data.allList);
			} else {
				// 分页数据获取完成
				this.setData({
					allcancel: false
				})
				wx.showToast({
					title: '没有更多了',
					icon: 'none',
					duration: 1000
				})
			}
		}
	},
	async getHostPostFunc() {
		const page = this.data.hotPageNumber
		const res = await getHostPost(page)
		let posts = this.data.hotList;
		if (res.data) {
			if (res.data.length > 0) {
				res.data.map(item => {
					posts.push(item);
				});
				this.setData({
					hotList: posts,
					hotPageNumber: page + 1,
				});
				setTimeout(() => {
					this.setData({
						isLoading: false
					})
				}, 1000)
				// console.log(this.data.hotList);
			} else {
				this.setData({
					hotcancel: false
				});
				wx.showToast({
					title: '没有更多了',
					icon: 'none',
					duration: 1000
				})
			}
		}
	},
	async getPraisePostFunc() {
		const page = this.data.prisePageNumber
		const res = await getPraisePost(page)
		// console.log(res.data);
		let posts = this.data.priseList;
		// console.log(posts,'post');
		if (res.data) {
			if (res.data.length > 0) {
				res.data.map(item => {
					posts.push(item);
				});
				this.setData({
					priseList: posts,
					prisePageNumber: page + 1,
				});
				setTimeout(() => {
					this.setData({
						isLoading: false
					})
				}, 1000)
				// console.log(this.data.priseList);
			} else {
				this.setData({
					prisecancel: false
				})
				wx.showToast({
					title: '没有更多了',
					icon: 'none',
					duration: 1000
				})
			}
		}
	},
	// 获取每日话题
	async getTopicFunc() {
		if (this.data.index == 0) {
			const {
				data
			} = await getTopic()
			// wx.hideLoading()
			if (data.length !== 0) {
				this.setData({
					topic: data,
					id: data.id,
					showTopic: true,
					paraiseNumber: data.praise_number,

				})
			}
		}
		// 获取点赞信息
		this.getUserInfoFunc(this.data.topic?.id)
	},
	// 获取用户信息
	async getUserInfoFunc(id) {
		const {
			data
		} = await getUserInfo()
		wx.hideLoading()
		const likedList = data.likedTopic
		for (let i = 0; i < likedList.length; i++) {
			if (likedList[i] === +id) {
				this.setData({
					liked: true,
				})
			}
		}
	},
	async praiseTopic(e) {
		const id = e.currentTarget.dataset.id
		const like = this.data.liked
		const {
			data
		} = await likedTopic({
			id,
			liked: !like
		})
		wx.hideLoading()
		this.setData({
			liked: data.like,
			paraiseNumber: data.paraiseNumber
		})
	},
	// 进入今日话题详情
	openTopic(e) {
		const id = e.currentTarget.dataset.id
		wx.navigateTo({
			url: '/pages/home/topic_detail/topic_detail?id=' + id,
		})
	},
	post() {
		wx.navigateTo({
			url: '/pages/home/post/post'
		})
	},
	// 切换导航栏
	changeTabbar(e) {
		const index = e.detail
		const thisTime = e.timeStamp;
		const lastTime = this.data.lastTime;
		if (lastTime != 0) {
			if (thisTime - this.data.lastTime < 500) {
				console.log('双击');
				this.data.newHeader.scrolltoTop()
			}
		}
		this.setData({
			currentIndex: index,
			lastTime: thisTime
		})
	},
	cancelFollowCallBack(e) {
		const {
			id,
			like
		} = e.detail
		console.log(e.detail, this.data.allList);
		this.data.allList.forEach((item, index) => {
			if (item.adminId == id) {
				//  console.log(item);
				this.setData({
					[`allList[${index}].follow`]: like
				})

			}
		})
	},
	refresherrefreshList(e) {
		console.log(e);
		const {
			currentIndex
		} = e.detail
		const {
			name
		} = e.detail
		if (currentIndex === 0) {
			this.setData({
				allpageNumber: 1,
				allList: []
			})
			this.getPostAllFunc()
		} else if (currentIndex === 1) {
			this.setData({
				hotPageNumber: 1,
				hotList: []
			})
			this.getHostPostFunc()
		} else if (currentIndex === 2) {
			this.setData({
				prisePageNumber: 1,
				priseList: []
			})
			this.getPraisePostFunc()
		}
	},
	scrolltolowerList() {
		if (this.data.allcancel) {
			this.getPostAllFunc()
		}
		if (this.data.hotcancel) {
			this.getHostPostFunc()
		}
		if (this.data.prisecancel) {
			this.getPraisePostFunc()
		}
	},
	deletePostItemFunc(e) {
		const index = e.detail
		const currentIndex = this.data.currentIndex
		if (currentIndex == 0) {
			const oldList = this.data.allList
			oldList.splice(index, 1)
			this.setData({
				allList: oldList
			})
		} else if (currentIndex == 1) {
			const oldList = this.data.hotList
			oldList.splice(index, 1)
			this.setData({
				hotList: oldList
			})
		} else if (currentIndex == 2) {
			const oldList = this.data.priseList
			oldList.splice(index, 1)
			this.setData({
				priseList: oldList
			})
		}

	},
	subscribPrise(userInfo) {
		const channel = userInfo.uuid
		const that = this
		// 监听表白墙的收藏
		wx.goEasy.pubsub.subscribe({
			channel, //替换为您自己的channel
			onMessage: async function (message) { //收到消息
				const content = JSON.parse(message.content)
				if (content.content) {
					that.notifyInfo(content)
				} else {
					console.log('动态');
				}
			},
			onSuccess: function () {
				console.log("Channel订阅成功。", 70);
			},
			onFailed: function (error) {
				console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
			}
		});
	},
	notifyInfo(content) {
		const list = {
			content: content.content,
			content_type: content.content_type,
			form_user: content.form_user,
			time: content.time,
			message_list_id: content.message_list_id
		}
		console.log(list);
		this.setData({
			notifyList: list,
			notifyShow: true
		})
		// setTimeout(() => {
		// 	this.setData({
		// 		notifyShow: false,
		// 		notifyList: []
		// 	})
		// }, 2000)
	},

})