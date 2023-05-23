const httpRequest = require('../utils/request')

// 获取用户信息
module.exports.getUserInfo = function () {
	return httpRequest('GET', '/user', {})
}


module.exports.followAuthor = function (id) {
	return httpRequest('POST', `/user/prise/${id}`, {})
}


// 是否登录
module.exports.isLogin = function () {
	return httpRequest('GET', '/login/whoami', {})
}


// 修改用户
module.exports.changeUserInfo = function (data) {
	return httpRequest('POST', '/user', data)
}


// 获取用户关注列表
module.exports.getFollowList = function () {
	return httpRequest('GET', '/user/follow_list', {})
}

// 获取用户的粉丝列表
module.exports.getFanList = function () {
	return httpRequest('GET', '/user/fan_list', {})
}

// 通过id获取用户的部分信息
module.exports.getOtherUser = function (id) {
	return httpRequest('GET', `/user/${id}`, {})
}