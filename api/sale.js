
const httpRequest = require("../utils/request")

module.exports.getSaleByPage = async function (page = 1, limit = 11) {
	return await httpRequest('GET', `/sale_friends?limit=${limit}&page=${page}`, {})
}

module.exports.getHotSaleByPage = async function (page = 1, limit = 11, order = 'DESC') {
	return await httpRequest('GET', `/sale_friends?limit=${limit}&page=${page}&order=${order}`, {})
}

// 获取卖室友详情
module.exports.getSaleDetail = async function (id) {
	return await httpRequest('GET', `/sale_friends/${id}`, {})
}

// 获取评论
module.exports.getComment = async function (id, page = 1, limit = 5) {
	return await httpRequest('GET', `/sale_comment?page=${page}&limit=${limit}&id=${id}`)
}

// 收藏
module.exports.praiseSale = async function (id) {
	return await httpRequest('POST', `/sale_friends/praise_sale/${id}`, {})
}

// 发布评论
module.exports.postComment = async function (data) {
	return await httpRequest('POST', '/sale_comment', data)
}

// 删除评论
module.exports.deleteComment = async function (id) {
	return await httpRequest('DELETE', `/sale_comment/${id}`, {})
}

// 获取收藏
module.exports.getPraiseSale = async function (page = 1, limit = 5) {
	return await httpRequest('GET', `/sale_friends/praise_list?page=${page}&limit=${limit}`, {})
}

// 添加卖室友
module.exports.addSalePost = async function(data) {
	return await httpRequest('POST', '/sale_friends', data)
} 

// 搜索
module.exports.searchSale = async function(value, type) {
	return await httpRequest('GET', `/sale_friends/search_sale?value=${value}&type=${type}`, {})
}

// 获取我的卖室友
module.exports.getMySale = async function(page = 1, limit = 6) {
	return await httpRequest('GET', `/sale_friends/my_sale?page=${page}&limit=${limit}`, {})
}

// 获取其他用户的卖室友
module.exports.getOtherSale = async function(id, page = 1, limit = 6) {
	return await httpRequest('GET', `/sale_friends/user_sale?page=${page}&limit=${limit}&id=${id}`, {})
}