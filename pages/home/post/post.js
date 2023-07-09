const {
    uploadImg
} = require('../../../api/topic')
const {
    addPost
} = require('../../../api/post')
Page({
    data: {
        fileList: [],
        textContent: '',
        name: "",
        showTabSearch: false,
		showIcon: true,
    },
    afterRead(event) {
        const newFileList = [...this.data.fileList];
        const {
            file
        } = event.detail;
        console.log(file);
        for (let i = 0; i < file.length; i++) {
            newFileList.push({
                url: file[i].url
            })
        }
        this.setData({
            fileList: newFileList
        })
    },
    // afterRead(event) {
    //     const newFileList = [...this.data.fileList]
    //     const {
    //         file
    //     } = event.detail;
    //     console.log(file);
    //     wx.showLoading({
    //         title: '上传中',
    //     })
    //     for (let i = 0; i < file.length; i++) {
    //         wx.uploadFile({
    //             url: 'http://127.0.0.1:3001/api/upload', // 仅为示例，非真实的接口地址
    //             filePath: file[i].url,
    //             name: 'img',
    //             success(res) {
    //                 console.log(JSON.parse(res.data), 'res');
    //             },
    //         });
    //         newFileList.push({
    //             url: file[i].url
    //         })
    //         if (i == file.length - 1) {
    //             // 上传完成
    //             this.setData({
    //                 fileList: newFileList
    //             })
    //             wx.hideLoading()
    //         }
    //     }

    // },
    deleteImg(e) {
        // console.log(e);
        const index = e.detail.index
        const fileList = this.data.fileList
        fileList.splice(index, 1)
        this.setData({
            fileList: fileList
        })
    },
    async post() {
        wx.showLoading({
            title: '上传中',
        })
        const prom = this.data.fileList.map(async (item) => {
            return await uploadImg(item)
        })
        const result = await Promise.all(prom)
        const arr = result.filter(i => i.data == 'null')
        if (arr.length === 0) {
            console.log(result);
            // 图片上传成功
            const pathArr = result.map(i => i.data)
            console.log(pathArr);
            const obj = {
                content: this.data.textContent,
                attachments: pathArr,
                topic: this.data.name
            }
            if(obj.content == '' || obj.topic == '') {
                wx.showToast({
                  title: '请输入内容',
                  icon: 'none'
                })
            }
            if(obj.topic.length>10) {
                wx.showToast({
                    title: '名字超出10个字符',
                    icon: 'none'
                  })
            }
            console.log(obj);
            const res = await addPost(obj)
            console.log(res);
            wx.hideLoading()
            wx.showToast({
              title: '发布成功',
              icon: 'none'
            })
            // wx.navigateBack()
        }
    },
    getTextContent: function (event) {
        let value = event.detail.value;
        this.setData({
            textContent: value
        });
    },
    getName: function (event) {
        let value = event.detail.value;
        if(value.length > 10) {
            wx.showToast({
                title: '名字超出10个字符',
                icon: 'none'
              })
        }
        this.setData({
            name: value
        });
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