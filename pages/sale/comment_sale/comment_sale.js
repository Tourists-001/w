// pages/sale/comment_sale/comment_sale.js
const {
    getSaleDetail,
    getComment,
    praiseSale,
    postComment,
    deleteComment
} = require('../../../api/sale')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        saleId: '',
        baseImageUrl: app.globalData.imageUrl,
        comments: [],
        liked: false,
        showCommentInput: false,
        value: '',
        notDataTips: false,
        showGeMoreLoadin: false,
        pageNumber: 1,
        comment_number: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            saleId: options.id
        })
        this.getList()
        this.getComment()
    },
    async getList() {
        const id = this.data.saleId
        const {
            data
        } = await getSaleDetail(id)
        this.setData({
            sale: data,
            liked: data.liked,
            comment_number: data.comment_number
        })
    },
    // 获取评论
    async getComment() {
        // console.log(res);
        const pageNumber = this.data.pageNumber
        const {
            data
        } = await getComment(this.data.saleId, pageNumber)
        const comments = this.data.comments
        if (data.length > 0) {
            // comments.push(data)
            data.map((item) => {
                comments.push(item)
            })
            this.setData({
                pageNumber: pageNumber + 1,
                comments,
                showGeMoreLoadin: false,
                notDataTips: false
            })
        } else {
            this.setData({
                showGeMoreLoadin: true,
                notDataTips: true
            });
            setTimeout(() => {
                this.setData({
                    notDataTips: false
                });
            }, 1000)
        }

    },
    async follow(e) {
        const id = this.data.saleId
        const res = await praiseSale(id)
        console.log(res);
        if (res.data) {
            this.setData({
                liked: res.data.like
            })
        }
    },
    showCommentInput() {
        this.setData({
            showCommentInput: true
        })
    },
    hiddenComment: function () {
        this.setData({
            showCommentInput: false
        });
    },
    getCommentContent(e) {
        //    console.log(e);
        const value = e.detail.value
        this.setData({
            value
        })
    },
    async postComment() {
        const obj = {
            post_id: this.data.saleId,
            content: this.data.value
        }
        console.log(obj);
        const res = await postComment(obj)
        // console.log(res);
        if (res.data) {
            const data = this.data.comments
            let comment_number = this.data.comment_number
            data.unshift(res.data)
            comment_number +=1
            this.setData({
                value: '',
                showCommentInput: false,
                comments: data,
                comment_number,
            })
        }
    },
    async deleteMainComment(e) {
        // console.log(e);
        const id = e.currentTarget.dataset.id
        const index = e.currentTarget.index
        console.log(index);
        // console.log(id);
        const res = await deleteComment(id)
        // console.log(res);
        if (res.code == 200) {
            const data = this.data.comments
            let comment_number = this.data.comment_number
            comment_number-=1
            data.splice(index, 1)
            this.setData({
                comments: data,
                comment_number
            })
        }
    },
    scrolltolower() {
         if(this.data.showGeMoreLoadin) return
         this.getComment()
    },
})