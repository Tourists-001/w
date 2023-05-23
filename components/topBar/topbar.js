const app = getApp()
Component({
    properties: {
        // defaultData（父页面传递的数据-就是引用组件的页面）
        // defaultData: {
        //     type: Object,
        //     value: {
        //         title: "我是默认标题"
        //     },
        //     observer: function (newVal, oldVal) {}
        // },
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
            wx.navigateBack()
        },
        goSearchPage() {
            wx.navigateTo({
                url: '/pages/home/search/search'
            })
        }
    }
})