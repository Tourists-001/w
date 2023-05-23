// components/headerbar/headerbar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        list: {
            type: Array,
            value: [{
                type: '全部',
                id: 1
            }, {
                type: '最热',
                id: 2
            }, {
                type: '收藏',
                id: 3
            }]
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        select: '1', // 激活索引
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 切换导航栏的样式
        selected(e) {
            if (typeof e === 'number') {
                this.setData({
                    select: e
                })
                this.triggerEvent('selectBar', e)
                return
            } else {
                const currentSelect = e.target.dataset.type
                // console.log(currentSelect);
                this.setData({
                    select: currentSelect,
                })
                this.triggerEvent('selectBar', currentSelect)
                return
            }
        },
        // 获取输入框数据的样式
        getFilter(e) {
            let content = e.detail.value;
            this.triggerEvent('getFilter', content)
        },
        search() {
            this.triggerEvent('search')
        },
    }
})