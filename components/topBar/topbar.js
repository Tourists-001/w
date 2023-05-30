const app = getApp()
Component({
    properties: {
        showTabSearch: {
            type: Boolean
        },
        showIcon: {
            type: Boolean,
            value: false
        },
        tabTitle: {
            type: String,
            value: '校园小情书'
        },
        url: {
            type: String,
            value: null
        }
    },
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuTop: app.globalData.menuTop,
        menuHeight: app.globalData.menuHeight,
        statusBarHeight: app.globalData.statusBarHeight
    },
    attached: function () {},
    methods: {
        goBack() {
            if(this.data.url) {
                wx.redirectTo({
                  url: this.data.url,
                })
            } else {
                wx.navigateBack()
            }
        },
        goSearchPage() {
            wx.navigateTo({
                url: '/pages/home/search/search'
            })
        }
    }
})