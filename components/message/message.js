// components/message/message.js
const {
    getNewMessageCount
} = require('../../api/message.js')
Component({
    /**
     * 组件的属性列表
     */
    properties: {},
    created() {
        const userInfo = wx.getStorageSync('userInfo')
        console.log(userInfo, 18);
        if (!userInfo) return
        // 订阅消息
        this.getMessageCount()
        this.subscribPrise(userInfo)
    },
    /**
     * 组件的初始数据
     */
    data: {
        showMessage: false,
        newMessageNumber: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        subscribPrise(userInfo) {
            const channel = userInfo.uuid
            console.log(channel);
            const that = this
            // 监听表白墙的收藏
            wx.goEasy.pubsub.subscribe({
                channel, //替换为您自己的channel
                onMessage: async function (message) { //收到消息
                    console.log(38,message);
                    // 获取新消息的数量
                    await that.getMessageCount()
                    
                },
                onSuccess: function () {
                    console.log("Channel订阅成功。");
                },
                onFailed: function (error) {
                    console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
                }
            });
            // 监听表白墙的评论
        },
        // 获取新消息的数量
        async getMessageCount() {
            const count = await getNewMessageCount()
            if(count.code == 200) {
                this.setData({
                    newMessageNumber: count.data,
                    showMessage: true,
                })
            }
        },
        openMessage() {
            wx.navigateTo({
              url: '/pages/personal/message/message',
            })
        }
    }
})