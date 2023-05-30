const {
    getOtherUser,
    followAuthor
} = require('../../../api/user')
const {
    getOtherPost
} = require('../../../api/post')
const {
    getOtherSale
} = require('../../../api/sale')
const {
    addMessageList
} = require('../../../api/message')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        user: {},
        baseImageUrl: app.globalData.imageUrl,
        bgImg: app.globalData.imageUrl + '/img/ing_bg.jpg',
        selectPoster: 1,
        allList: [],
        leftList: [],
        rightList: [],
        my_id: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options);
        const id = Math.floor(options.id)
        const userInfo = wx.getStorageSync('userInfo')
        this.setData({
            id,
            my_id: userInfo.id
        })
        this.getOtherUserFunc(id)
        this.getPost()
        this.getSale()
    },
    async getOtherUserFunc(id) {
        const user = await getOtherUser(id)
        this.setData({
            user: user.data
        })
    },
    select(e) {
        let objType = e.target.dataset.type;
        this.setData({
            selectPoster: objType
        })
    },
    async getPost() {
        const id = this.data.id
        const res = await getOtherPost(id)
        console.log(res);
        if (res.code == 200) {
            this.setData({
                allList: res.data
            })
        }
    },
    async getSale() {
        const id = this.data.id
        const res = await getOtherSale(id)
        const data = res.data
        if (res.data.length > 0) {
            let leftList = []
            let rightList = []
            data.forEach((item, i) => {
                if (i == data.length - 1) {
                    leftList.push(item)
                    this.setData({
                        leftList: leftList,
                        rightList: rightList,
                    })
                }
                if (i % 2 != 0) {
                    leftList.push(item);
                    // leftHeight += item.attachments[0]['height'];
                } else {
                    rightList.push(item)
                    // rightHeigt += item.attachments[0]['height'];
                }
            })
            console.log(this.data.leftList);
        }
    },
    async priseOtherUser(e) {
        // console.log(e);
        const isprise = e.currentTarget.dataset.type
        const id = this.data.id
        const res = await followAuthor(id)
        if (res.data.like) {
            // 设置关注
            this.setData({
                [`user.isPrise`]: true,
            })
            console.log(this.data.user.isPrise);
        } else {
            this.setData({
                [`user.isPrise`]: false,
            })

        }
    },
    async goMessagePage(e) {
        const name = e.currentTarget.dataset.name
        const user_id = e.currentTarget.dataset.user_id
        // 进入私信之前先创建消息列表
        const {
            id
        } = wx.getStorageSync('userInfo')
        console.log(id, user_id);
        if (id && user_id) {
            const data = {
                my_id: id,
                other_id: user_id
            }
            const res  = await addMessageList(data)
            const { message_list_id } = res.data
            wx.navigateTo({
                url: `/pages/personal/private_letter/private_letter?name=${name}&user_id=${user_id}&message_list_id=${message_list_id}`,
            })
        }

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})