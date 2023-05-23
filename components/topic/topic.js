// components/topic/topic.js
const {
	likedTopic,
	getCommentTopic
} = require('../../api/topic')
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		detail: {
			type: Boolean,
			value: false,
		},
		topicData: {
			type: Object,
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		topic: {},
		showTopic: false,
		liked: false,
	},
	attached() {
		const id = this.properties.topicData?.id
		console.log(this.properties.topicData);
		if (id) {
			this.getPraiseTopicInfo(id)
			this.setData({
				topic: this.properties.topicData,
				showTopic: true
			})
		} else {
			this.setData({
				showTopic: false,
			})
		}
	},

	methods: {
		// 进入今日话题详情
		openTopic(e) {
			const id = e.currentTarget.dataset.id
			wx.navigateTo({
				url: '/pages/home/topic_detail/topic_detail?id=' + id,
			})
		},
		// 点赞
		async praiseTopic(e) {
			const id = e.currentTarget.dataset.id
			const like = this.data.liked
			await likedTopic({
				id,
				liked: !like
			})
			wx.hideLoading()
			this.setData({
				liked: !like,
			})
		},
		// 获取点赞信息
		getPraiseTopicInfo(id) {
			const likedList = app.globalData.likedTopic
			if (!id) return
			for (let i = 0; i < likedList.length; i++) {
				if (likedList[i] === +id) {
					this.setData({
						liked: true,
					})
				}
			}
			console.log(this.data.liked);
		},
		// 获取评论
		async getCommentTopicFunc(id, page, limit) {
			const res = await getCommentTopic(id, page, limit)
			console.log(res);
		}
	},
})