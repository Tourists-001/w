const {
    isLogin,
    getUserInfo
} = require('./api/user')
const {
    imgUrl
} = require('./config')
let SCREEN_WIDTH = 750
let RATE = wx.getSystemInfoSync().windowHeight / wx.getSystemInfoSync().windowWidth
const EventEmitter2 = require('eventemitter2');
const emitter = new EventEmitter2();
const {
	$on,
    $emit,
    $remove
  } = require('./utils/event')
require('./utils/socket')
import GoEasy from 'goeasy'

App({
    globalData: {
        likedTopic: [],
        appId: null,
        userInfo: null,
        apiUrl: null,
        color: '0aecc3',
        imageUrl: '',
        bgImage: '',
        changeSchoolPost: false,
        changeSchoolSale: false,
        changeSchoolMatch: false,
        postHelp: false,
        reloadSale: false,
        reloadHome: false,
        param: false,
        authStatus: false,
        windowHeight: SCREEN_WIDTH * RATE,
        navBarHeight: 0, // 导航栏高度
        menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
        menuTop: 0, // 胶囊距底部间距（保持底部间距一致）
        menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
        emitter: emitter,
        id: '',
        navTop: 0
    },
    onLaunch: function (options) {
        // 判断是否登录
        this.getLoginInfo()
        this.globalData.reloadSale = false;
        this.globalData.reloadHome = false;
        this.globalData.param = false;
        this.globalData.authStatus = false;
        this.globalData.imageUrl = imgUrl;
        const that = this;
        // 获取系统信息
        const systemInfo = wx.getSystemInfoSync();
        // console.log(systemInfo, 53);
        // 胶囊按钮位置信息
        const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
        // 导航栏高度 = 状态栏高度 + 44
        that.globalData.navBarHeight = systemInfo.statusBarHeight + 10;
        that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
        that.globalData.statusBarHeight = menuButtonInfo.bottom + menuButtonInfo.top - systemInfo.statusBarHeight;
        that.globalData.menuTop = menuButtonInfo.top;
        that.globalData.menuHeight = menuButtonInfo.height;
        that.globalData.navTop = (systemInfo.statusBarHeight + 10) + menuButtonInfo.top
        that.globalData.screenHeight = systemInfo.screenHeight
        that.globalData.screenMinHeight = that.globalData.screenHeight - that.globalData.navTop
        // console.log(that.globalData.screenHeight ,  that.globalData.navTop);
        wx.emitter = emitter
        wx.$emit = $emit
        wx.$on = $on
        wx.$remove = $remove
        // console.log(screenMinHeight, 65);
        wx.goEasy = GoEasy.getInstance({
            host: 'hangzhou.goeasy.io', //新加坡host：singapore.goeasy.io
            appkey: 'BC-710900c258584db3961aa37e0e4bade2', //替换为您的应用appkey
            modules: ['pubsub']
        });
        wx.goEasy.connect({
            onSuccess: function () { //连接成功
                console.log("GoEasy connect successfully.") //连接成功
            },
            onFailed: function (error) { //连接失败
                console.log("Failed to connect GoEasy, code:" + error.code + ",error:" + error.content);
            }
        });
        // const channel = this.globalData.id
    },

    async getLoginInfo() {
        const res = await isLogin()
        if (res.code == 200 && res.data.id) {
            const userInfo = await getUserInfo()
            if (userInfo.code == 200) {
                wx.setStorageSync('userInfo', userInfo.data)
                wx.switchTab({
                    url: '/pages/home/index_2/index_2'
                })
            }
        } else {
            wx.navigateTo({
                url: '/pages/login/login',
            })
        }
    },
})