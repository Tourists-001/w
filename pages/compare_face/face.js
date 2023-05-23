// pages/compare_face/face.js
const app = getApp()
const {
  changeFace,
  getPic,
  postsimilarlyFace,
  uploadFaceImg
} = require('../../api/face')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImageUrl: app.globalData.imageUrl,
    showSelect: false,
    showBegin: true,
    showCancel: false,
    showReport: false,
    bindReport: false,
    showSubmit: false,
    tryAgant: false,
    imageLeft: '',
    imageRight: '',
    postImageLeft: '',
    postImageRight: '',
    rate: 0,
    face: '',
    conclusion: '',
    icon: {
      width: "170rpx",
      height: "170rpx",
      path: "http://image.qiuhuiyi.cn/face-select.png",
      showImage: true
    },
    anime_icon: {
      width: "500rpx",
      height: "700rpx",
      path: "/image/v2/anime-select.png",
      showImage: true
    },
    select: 1,
    animeUrl: "",
    base64Image: "",
    animeResult: "",
    showSelectAnime: true,
    fileList: [],
    photoUrl: '',
    isAuthSavePhoto: false,
    imageLeftList: [],
    imageRightList: [],
    leftUrl: '',
    rightUrl: '',
    simalInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  selected(e) {
    let objType = e.currentTarget.dataset.type;
    if (objType == 1) {
      this.setData({
        bgUlr: "http://article.qiuhuiyi.cn/Group.png"
      })
    } else {
      this.setData({
        bgUlr: "http://article.qiuhuiyi.cn/step-bg.png"
      })
    }
    this.setData({
      select: objType
    })
  },
  afterRead(event) {
    const newFileList = [...this.data.fileList];
    const {
      file
    } = event.detail;
    for (let i = 0; i < file.length; i++) {
      newFileList.push({
        url: file[i].url
      })
    }
    console.log(newFileList);
    this.setData({
      fileList: newFileList
    })
  },
  async getAnime() {
    wx.showLoading({
      title: '上传中',
    })
    const fileList = this.data.fileList
    if (fileList.length !== 0) {
      const res = await changeFace(fileList[0])
      if (res.code === 200) {
        wx.hideLoading()
        const baseImageUrl = this.data.baseImageUrl
        this.setData({
          animeResult: res.data,
          showSelectAnime: false,
          base64Image: res.data,
          newFileList: [],
          photoUrl: baseImageUrl + res.data
        });
      }
    } else {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
    }

  },
  getAnimeAgant() {
    this.setData({
      showSelectAnime: true,
      fileList: []
    })
  },
  deleteImg() {
    this.setData({
      fileList: []
    })
  },
  // 保存图片到手机
  downLoadAnime() {
    this.getSetting().then((res) => {
      // 判断用户是否授权了保存到本地的权限
      if (!res.authSetting['scope.writePhotosAlbum']) {
        this.authorize().then(() => {
          this.savedownloadFile(this.data.photoUrl)
          this.setData({
            isAuthSavePhoto: false
          })
        }).catch(() => {
          wx.showToast({
            title: '您拒绝了授权',
            icon: 'none',
            duration: 1500
          })
          this.setData({
            isAuthSavePhoto: true
          })
        })
      } else {
        this.savedownloadFile(this.data.photoUrl)
      }
    })
  },
  //打开设置，引导用户授权
  onOpenSetting() {
    wx.openSetting({
      success: (res) => {
        console.log(res.authSetting)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.showToast({
            title: '您未授权',
            icon: 'none',
            duration: 1500
          })
          this.setData({ // 拒绝授权
            isAuthSavePhoto: true
          })

        } else { // 接受授权
          this.setData({
            isAuthSavePhoto: false
          })
          this.onSaveToPhone() // 接受授权后保存图片

        }

      }
    })

  },
  // 获取用户已经授予了哪些权限
  getSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          resolve(res)
        }
      })
    })
  },
  // 发起首次授权请求
  authorize() {
    return new Promise((resolve, reject) => {
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success: () => {
          resolve()
        },
        fail: res => { //这里是用户拒绝授权后的回调
          console.log('拒绝授权')
          reject()
        }
      })
    })
  },
  savedownloadFile(img) {
    this.downLoadFile(img).then((res) => {
      return this.saveImageToPhotosAlbum(res.tempFilePath)
    }).then(() => {})
  },
  //单文件下载(下载文件资源到本地)，客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径。
  downLoadFile(img) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: img,
        success: (res) => {
          console.log('downloadfile', res)
          resolve(res)
        }
      })
    })
  },
  // 保存图片到系统相册
  saveImageToPhotosAlbum(saveUrl) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: saveUrl,
        success: (res) => {
          wx.showToast({
            title: '保存成功',
            duration: 1000,
          })
          resolve()
        }
      })
    })
  },
  // 弹出模态框提示用户是否要去设置页授权
  showModal() {
    wx.showModal({
      title: '检测到您没有打开保存到相册的权限，是否前往设置打开？',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.onOpenSetting() // 打开设置页面          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showSelect: function () {
    this.setData({
      showSelect: true,
      showBegin: false,
      showCancel: true
    });
  },
  async afterLeftList(event) {
    const newFileList = [...this.data.imageLeftList];
    const {
      file
    } = event.detail;
    // console.log(event);
    for (let i = 0; i < file.length; i++) {
      newFileList.push({
        url: file[i].url
      })
    }
    console.log(newFileList);
    this.setData({
      imageLeftList: newFileList
    })
    const res = await uploadFaceImg(...newFileList)
    // console.log(res);
    if (res.code === 200) {
      this.setData({
        leftUrl: res.data
      })
    } else {
      wx.showToast({
        title: '上传图片错误',
        iocn: 'none'
      })
    }
  },
  async afterRightList(event) {
    const newFileList = [...this.data.imageRightList];
    const {
      file
    } = event.detail;
    for (let i = 0; i < file.length; i++) {
      newFileList.push({
        url: file[i].url
      })
    }
    console.log(newFileList);
    this.setData({
      imageRightList: newFileList
    })
    const res = await uploadFaceImg(...newFileList)
    // console.log(res);
    if (res.code === 200) {
      this.setData({
        rightUrl: res.data
      })
    } else {
      wx.showToast({
        title: '上传图片错误',
        iocn: 'none'
      })
    }
  },
  async submit() {
    if (this.data.leftUrl == '') {
      // console.log('s');
      wx.showToast({
        title: '请上传左边图片',
        icon: 'none'
      })
      return
    } else if (this.data.rightUrl == '') {
      wx.showToast({
        title: '请上传右边图片',
        icon: 'none'
      })
      return
    }
    const list = {
      image1: this.data.leftUrl,
      image2: this.data.rightUrl
    }
    // console.log(list);
    wx.showLoading({
      title: '检测中',
    })
    const result = await postsimilarlyFace(list)
    console.log(result);
    wx.hideLoading()
    if (result.code != 200) {
      wx.showToast({
        title: result.msg,
        icon: 'none'
      })
    } else {
      const info = this.changeScore(result.data.score)
      // console.log(info);
      this.setData({
        simalInfo: info,
        showReport: true,
        bindReport: true,
        showSelect: false
      })
    }
  },
  changeScore(score) {
    console.log(score);
    const obj = {}
    if (score < 30) {
      obj.info = '很严肃的告诉你，你们血绿上没有半毛钱关系!'
    } else if (30 <= score < 90) {
      obj.info = '有那么一点关系'
    } else if (score >= 90) {
      obj.info = '别拿两张一样的照片给我'
    }
    obj.rate = Math.floor(score)
    return obj
  },
  hiddenReport:function() {
    this.setData({ showReport: false,showSelect:true })
    this.deleteImgLeft()
    this.deleteImgRight()
  },
  deleteImgLeft() {
    console.log('s');
    this.setData({
      imageLeftList: []
    })
  },
  deleteImgRight() {
    this.setData({
      imageRightList: []
    })
  }
})