// 获取表白墙点赞的消息
const httpRequest = require("../utils/request")
module.exports.getNewMessageCount = async function () {
	return await httpRequest('GET', '/socket_info/post_prise_num', {})
}

module.exports.getMessageList = async function (page = 1, limit = 10) {
	return await httpRequest('GET', `/socket_info/post_prise?page=${page}&limit=${limit}`, {})
}


// 设置消息已读
module.exports.readMessagePost = async function (id = 0) {
	console.log(`/socket_info/read_message/${id}`);
	return await httpRequest('POST', `/socket_info/read_message/${id}`)
}


// 获取私信列表
module.exports.getPrivateList = async function() {
	return await httpRequest('GET', `/message`,{})
}

// 删除私信
module.exports.deletePrivateList = async function(id) {
	return await httpRequest('DELETE', `/message/${id}`, {})
}

// 获取私信的具体内容
module.exports.getLetterList = async function(id, limit=5, page = 1) {
	return await httpRequest('GET', `/letter?id=${id}&limit=${limit}&page=${page}`)
}

// 发送消息
module.exports.sendMessageLetter = async function(data) {
	return await httpRequest('POST', '/letter', data)
}

// 创建消息列表
module.exports.addMessageList = async function(data) {
	return await httpRequest("POST", '/message', data)
}