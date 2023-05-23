// components/sale/sale.js
const config = require('../../config')

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        List: {
            type: Array,
            value: []
        },
        height: {
            type: Number,
            value: 516
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        baseImageUrl: config.imgUrl
    },

    /**
     * 组件的方法列表
     */
    methods: {
        comment(e) {
                let id = e.currentTarget.dataset.objid;
                wx.navigateTo({
                    url: '/pages/sale/comment_sale/comment_sale?id=' + id
                })
        },
    }
})
