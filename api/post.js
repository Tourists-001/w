// 表白墙
const httpRequest = require("../utils/request")

// 分页获取表白墙
module.exports.getPostByPage = async function (page = 1, limit = 5, id) {
    return await httpRequest('GET', `/post?page=${page}&limit=${limit}`, {})
}
// 通过id获取表白墙
module.exports.getPostById = async function (id) {
    return await httpRequest('GET', `/post?id=${id}`, {})
}
// 收藏表白墙
module.exports.paraisePost = async function (id) {
    return await httpRequest('POST', `/post/like/${id}`, {})
}

// 删除表白墙
module.exports.deletePost = async function (id) {
    return await httpRequest('DELETE', `/post/delete/${id}`, {})
}

// 发布表白墙
module.exports.addPost = async function (data) {
    return await httpRequest('POST', '/post', data)
}

// 添加表白墙评论
module.exports.addPostComment = async function (data) {
    return await httpRequest("POST", '/post_comment', data)
}

// 删除表白墙评论
module.exports.deletePostComment = async function (id) {
    return await httpRequest("DELETE", `/post_comment/${id}`, {})
}

// 获取最热表白墙
module.exports.getHostPost = async function (page = 1, limit = 5, order = 'DESC', orderType = 'praise_number') {
    return await httpRequest('GET', `/post/hot_post?page=${page}&limit=${limit}&order=${order}&orderType=${orderType}`, {})
}

// 获取收藏表白墙
module.exports.getPraisePost = async function (page = 1, limit = 5) {
    return await httpRequest('GET', `/post/praise_post?page=${page}&limit=${limit}`, {})
}

// 搜索表白墙
module.exports.getSearchPost = async function (value, type) {
    return await httpRequest('GET', `/post/search_post?value=${value}&type=${type}`, {})
}

// 获取我的表白墙
module.exports.getMyPost = async function (id = 1, page = 1, limit = 5) {
    return await httpRequest("GET", `/post/my_post?page=${page}&limit=${limit}`, {})
}

// 通过用户id获取其他人的表白墙
module.exports.getOtherPost = async function (id, page = 1, limit = 5) {
    return await httpRequest('GET', `/post/user_post?page=${page}&limit=${limit}&id=${id}`)
}