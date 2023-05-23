const httpRequest = require('../utils/request')

// 获取每日话题(通过时间戳获取)
module.exports.getTopic = function () {
	return httpRequest('GET', '/topic', {})
}

// 获取每日话题(通过id获取)
module.exports.getTopicById = function (id) {
	return httpRequest('GET', `/topic/${id}`, {})
}

// 点赞每日话题
module.exports.likedTopic = function (data) {
	return httpRequest('POST', '/topic/like', data)
}

// 评论每日话题
module.exports.commentTopic = function (data) {
	return httpRequest('POST', '/topic_comments', data)
}

// 获取每日话题的评论
module.exports.getCommentTopic = function (id, page = 1, limit = 5) {
	return httpRequest('GET', `/topic_comments?id=${id}&page=${page}&limit=${limit}`, {})
}

// 回复每日话题的评论
module.exports.replyTopicComment = function (data) {
	return httpRequest('POST', '/topic_comments/reply', data)
}

const {
	domain
} = require('../config')
// 上传图片
module.exports.uploadImg = function (file) {
	return new Promise((resolve, reject) => {
		wx.uploadFile({
			url: `${domain}/upload`, // 仅为示例，非真实的接口地址
			filePath: file.url,
			name: 'img',
			success(res) {
				resolve(JSON.parse(res.data))
			},
			fail(err) {
				reject(err)
			}
		});
	})
}