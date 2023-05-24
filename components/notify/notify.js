// components/notify/notify.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
       show: {
           type: Boolean,
           value: false,
           observer(val) {
            console.log(val, 12);
         }
       },
       item: {
           type: Object,
       }
    },

    /**
     * 组件的初始数据
     */
    data: {
        baseImgUrl: app.globalData.imageUrl,
    },
    /**
     * 组件的方法列表
     */
    methods: {
        goPrivateLetter(e) {
            const message_list_id = e.currentTarget.dataset.id
            const name = e.currentTarget.dataset.name
            const user_id = e.currentTarget.dataset.user_id
            wx.navigateTo({
                url: `/pages/personal/private_letter/private_letter?message_list_id=${message_list_id}&name=${name}&user_id=${user_id}`,
            })
        },
    }
})
