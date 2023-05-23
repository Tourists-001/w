// components/search/search.js
const {
    debounce,
    throttle
} = require('../../utils/util')
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        scaleX: {
            type: String
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        goSearchPage() {
            wx.navigateTo({
                url: '/pages/home/search/search'
            })
        }
    }
})