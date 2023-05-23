const {
  domain
} = require('../config')
const httpRequest = require("../utils/request")
module.exports.changeFace = async function (file) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${domain}/compare_face`,
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

// 下载漫画后的图片
module.exports.getPic = async function (filename) {
  return await httpRequest('GET', `/downLoad/${filename}`, {})
}


// 相似脸
module.exports.postsimilarlyFace = async function (data) {
  return await httpRequest('POST', '/compare_face/similarly', data)
}

// 上传相似脸的图片
module.exports.uploadFaceImg = async function (file) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${domain}/compare_face/upload_face`,
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