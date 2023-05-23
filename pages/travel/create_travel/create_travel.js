const app = getApp()
const distance = require('../../../utils/dist')
const QQMapWX = require('./../../../utils/qqmap-wx-jssdk');
const config = require("./../../../config.js");
const {
  addTravelRank,
  addTravelLog
} = require('../../../api/travel')
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canPost: true,
    latitude: 0,
    longitude: 0,
    plans: [],
    travelDistance: 0,
    includePoints: [],
    markers: [],
    polyline: [{
      points: [],
      color: "#FF4500",
      width: 3,
      dottedLine: true,
      arrowLine: true
    }],
    hotel: [],
    food: [],
    view: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    qqmapsdk = new QQMapWX({
      key: config.TX_MAP_KEY
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  chooseLocation: function () {
    let _this = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        let plans = _this.data.plans;
        let plan = {
          id: plans.length,
          name: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        };
        plans.unshift(plan);
        _this.setData({
          plans: plans
        })

        //画线
        let polyline = _this.data.polyline;
        let points = polyline[0].points;
        points.push({
          longitude: res.longitude,
          latitude: res.latitude
        })
        polyline[0].points = points;
        _this.setData({
          polyline: polyline
        })

        //视野缩放
        let includePoints = _this.data.includePoints;
        includePoints.push({
          longitude: res.longitude,
          latitude: res.latitude
        })

        //标记坐标点
        let markers = _this.data.markers;
        console.log("markers" + markers)
        markers.push({
          id: markers.length - 1,
          latitude: res.latitude,
          longitude: res.longitude,
          width: 50,
          height: 50,
          label: {
            content: res.name,
            fontSize: 8,
            bgColor: "#FF6347",
            color: "#FFFFFF",
            padding: 5,
            borderRadius: 10
          }
        });

        _this.setData({
          polyline: polyline,
          includePoints: includePoints,
          markers: markers
        })
      },
      fail: function (err) {
        console.log(err)
      },
      complete: function (res) {
        //console.log(res);
      }
    })
  },
  /**
   * 提交旅行计划
   */
  postData: function () {
    let _this = this;
    wx.showModal({
      title: '温馨提示',
      content: '你确定要提交旅游线路吗？',
      success: function (res) {
        if (res.confirm) {
          _this.sumDistance();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //  保存陆行日志
  saveTravelLog() {},
  /**
   * 计算距离
   */
  sumDistance: async function () {
    let plans = this.data.plans;
    let len = plans.length;
    let dist = 0;

    wx.showLoading({
      title: '提交中'
    });
    console.log(plans, 'plans');
    plans.map((item, key) => {
      if (key == (len - 1)) {
        return false;
      } else {
        console.log(key);
        let coords = [
          [item.latitude, item.longitude],
          [plans[key + 1].latitude, plans[key + 1].longitude]
        ];
        console.log(coords, 'coords');
        let lens = distance(coords);
        dist = dist + lens;
      }
    });
    console.log(dist, 'distance');
    const res = await addTravelRank({
      title: '',
      distance: dist,
      plans: plans
    })
    await this.addTravelLog(dist, plans, res.data)
    wx.hideLoading();
    // console.log(res);
    if (res.code == 200) {
      app.newTravelPlan = true;
      wx.showLoading({
        title: '新建成功！',
      });
      setTimeout(function () {
        wx.hideLoading();
        wx.navigateBack({
          comeBack: true
        });
      }, 1000)
    } else {
      wx.showLoading({
        title: res.data.msg,
      });
      setTimeout(function () {
        wx.hideLoading();
      }, 1500)
    }
  },
  async addTravelLog(dist, plans, data) {
    await this.getPoi(plans)
    // console.log(this.data.food);
    data.food = this.data.food
    data.hotel = this.data.hotel
    data.view = this.data.view
    data.distance = dist
    data.location = this.data.location
    const res = await addTravelLog(data)
  },
  /**
   * 获取附近的咨询
   */
  getPoi: async function (logs) {
    const item = logs[logs.length - 1]
    const hotel = await this.getPoiItem('酒店', '1', item.latitude, item.longitude);
    // console.log(hotel, '302');
    this.setData({
      hotel: hotel[0].title
    })
    const food = await this.getPoiItem('美食', '5', item.latitude, item.longitude);
    this.setData({
      food
    })
    const view = await this.getPoiItem('景点', '5', item.latitude, item.longitude);
    this.setData({
      view
    })
    // this.getPoiFood(item.id, item.latitude, item.longitude);
    // this.getPoiView(item.id, item.latitude, item.longitude);
    // const pro = await Promise.all(hotel)
    // console.log(this.data.view);
    const location = await this.getLocation(item.latitude, item.longitude)
    this.setData({
      location,
    })
    console.log(location);
  },

  getPoiItem: function (keyword, page_size, latitude, longitude) {
    return new Promise((resolve, reject) => {
      qqmapsdk.search({
        keyword,
        page_size,
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: (res) => {
          if (res.status == 0) {
            resolve(res.data)
          }
        },
        fail: function (res) {
          reject(res)
        }
      });
    })
  },
  // 获取当前位置
  getLocation: function (latitude, longitude) {
    return new Promise((resolve, reject) => {
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: (res) => {
          resolve(res.result.ad_info)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})