const {
    getPrivateList,
    deletePrivateList,
    readAllMessage
} = require("../../../api/message")
const app = getApp()
// pages/personal/private_list/private_list.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        baseImageUrl: app.globalData.imageUrl,
        loading: true,
        userInfo:'',
        isShowNotify: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow(e) {
        console.log('show',e);
        this.subscribPrise(this.data.userInfo)
    },
    onLoad(options) {
        this.getList()
        const userInfo = wx.getStorageSync('userInfo')
        this.setData({
            userInfo,
        })
        // this.subscribPrise(userInfo)
    },
    async refresherrefresh() {
        await this.getList()
        setTimeout(() => {
            this.setData({
                loading: false
            })
        }, 1000)
    },
    // 获取列表数据
    async getList() {
        const list = await getPrivateList()
        console.log(list);
        this.setData({
            list: list.data,
        })
    },
    async goPrivateLetter(e) {
        const message_list_id = e.currentTarget.dataset.id
        const name = e.currentTarget.dataset.name
        const user_id = e.currentTarget.dataset.user_id
        // 进入页面之前设置消息数为0
        await readAllMessage(message_list_id)
        wx.redirectTo({
           url: `/pages/personal/private_letter/private_letter?message_list_id=${message_list_id}&name=${name}&user_id=${user_id}`,
        })
    },
    async deletePrivate(e) {
        const index = e.currentTarget.dataset.index
        const id = e.currentTarget.dataset.id
        const res = await deletePrivateList(id)
        const list = this.data.list
        list.splice(index, 1)
        this.setData({
            list,
        })

    },
    subscribPrise(userInfo) {
        const channel = userInfo.uuid
        const that = this
        wx.goEasy.pubsub.subscribe({
            channel, //替换为您自己的channel
            onMessage: async function (message) { //收到消息
                // console.log(message);
                // 获取新消息的数量
                const content = JSON.parse(message.content)
                console.log(content, 61);
                if (content.messageType) {
                    // await that.getMessageCount()
                } else if (content.content_type) {
                    // await that.getPrivateLetterMumFunc()
                    // 添加列表或者修改消息数量
                    that.newGetMessageList(content)
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
    newGetMessageList(list) {
        console.log(list);
        console.log(getCurrentPages(), 80);
        console.log(this.data.list);
        const messageList = this.data.list
        const filterArr = messageList.filter((item, index) => {
            return item.message_list_id == list.message_list_id
        })
        console.log(messageList);
        // console.log(filterArr);
        if(filterArr.length) {
            // 说当前消息列表存在这条消息，只需要删除原来的，然后添加到messageList上
            messageList.forEach((item, index) => {
               if(item.message_list_id == list.message_list_id) {
                const newObj = {
                    frist_letter: list.content,
                    message_list_id: list.message_list_id,
                    message_num: item.message_num += 1,
                    other_id: list.from_user_id,
                    time: list.time,
                    user: list.form_user
                }
                messageList.splice(index, 1)
                messageList.unshift(newObj)
                this.setData({
                    list: messageList
                })
               }
            })
        } else {
            const newObj = {
                frist_letter: list.content,
                message_list_id: list.message_list_id,
                message_num: 1,
                other_id: list.from_user_id,
                time: list.time,
                user: list.form_user
            }
            messageList.unshift(newObj)
            this.setData({
                list: messageList
            })
        }
    },
    onShow() {
		this.setData({
			isShowNotify: true
		})
	},
	onHide() {
		this.setData({
			isShowNotify: false
		})
	},
})