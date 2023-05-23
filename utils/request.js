const config = require('./../config.js')
const app = getApp()

// 接口封装
const httpRequest = function (_methods, _url, _data) {
	let token = wx.getStorageSync('token')
	return new Promise((resolve, reject) => {
		// wx.showLoading({
		// 	title: '加载中',
		// })
		wx.request({
			url: config.domain + _url,
			header: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + token,
			},
			method: _methods,
			data: _data,
			success: (res) => {
				if (res.data.code !== 200) {
					wx.showToast({
						title: '网络错误',
						icon: 'none',
					})
					wx.hideLoading()
					reject(res)
				}
				if (res.data.code === 200) {
					resolve(res.data)
				}
			},
			fail: (res) => {
				console.log(res)
				reject(res)
			},
		})
	})
}

module.exports = httpRequest