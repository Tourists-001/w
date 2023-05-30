// components/notify/notify.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // show: {
        //     type: Boolean,
        //     value: false,
        //     observer(val) {
        //         console.log(val, 12);
        //     }
        // },
        // item: {
        //     type: Object,
        //     observer(val) {
        //         console.log(val, 12);
        //     }
        // }
    },

    /**
     * 组件的初始数据
     */
    data: {
        baseImgUrl: app.globalData.imageUrl,
        notifyShow: false,
        item: []
    },
    created() {
        const userInfo = wx.getStorageSync('userInfo')
        this.subscribPrise(userInfo)
    },
    /**
     * 组件的方法列表
     */
    methods: {
        subscribPrise(userInfo) {
            const channel = userInfo.uuid
            const that = this
            const page = getCurrentPages()
            console.log(page);
            wx.goEasy.pubsub.subscribe({
                channel, //替换为您自己的channel
                onMessage: async function (message) { //收到消息
                    const content = JSON.parse(message.content)
                    if (content.content) {
                        that.notifyInfo(content)
                    } else {
                        console.log('动态');
                    }
                },
                onSuccess: function () {
                    console.log("Channel订阅成功。", 70);
                },
                onFailed: function (error) {
                    console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
                }
            });
        },
        notifyInfo(content) {
            
            console.log(getCurrentPages());
            const list = {
                content: content.content,
                content_type: content.content_type,
                form_user: content.form_user,
                time: content.time,
                message_list_id: content.message_list_id
            }
            console.log(list);
            const pages = getCurrentPages();
            console.log(pages);
            this.setData({
                item: list,
                notifyShow: true
            })
            setTimeout(() => {
                this.setData({
                    notifyShow: false,
                })
            }, 2000)
        },
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