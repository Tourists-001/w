const {
    debounce,
    throttle
} = require('../../utils/util')
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        list: {
            type: Array,
            value: [{
                type: '全部',
                name: 'all',

            }, {
                type: '最热',
                name: 'hot',

            }, {
                type: '收藏',
                name: 'prise',

            }]
        },
        isLoading: {
            type: Boolean,
            value: false
        }
    },
    data: {
        selectIndex: 0,
        oldScrollTop: 0,
        scrollTop: 0
    },
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的初始数据
     */

    /**
     * 组件的方法列表
     */
    methods: {
        selected(e) {
            const index = e.currentTarget.dataset.type
            this.setData({
                selectIndex: index
            })
            this.triggerEvent('changeTabbar', index)
        },
        swiperchange(e) {
            this.setData({
                selectIndex: e.detail.current
            })
        },
        refresherrefresh(e) {
            // console.log(e);
            const currentIndex = this.data.selectIndex
            const name = this.data.list[currentIndex].name
            this.triggerEvent('refresherrefreshList', {
                currentIndex,
                name
            })
        },
        scrolltolower(e) {
            this.triggerEvent('scrolltolowerList')
        },
        scrolltoTop() {
            this.setData({
                scrollTop: 0
            })
        }
    }
})