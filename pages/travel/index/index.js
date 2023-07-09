const QQMapWX = require('./../../../utils/qqmap-wx-jssdk');
const config = require("./../../../config.js");
const app = getApp()
const {
	getRundata,
	getTravelRank,
	getTravelLog,
	getStepData
} = require('./../../../api/travel')
var qqmapsdk;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		show_auth: app.globalData.show_auth,
		qrCode: '',
		imageUrl: app.globalData.imageUrl,
		todayStep: 0,
		totalStep: 0,
		stepPageSize: 10,
		stepPageNumber: 1,
		initPageNumber: 1,
		steps: [],
		user: '',
		showGeMoreLoadin: false,
		select: 1,

		//旅行数据
		latitude: 0,
		longitude: 0,
		includePoints: [],
		markers: [],
		travelLogMarkers: [],
		notTravelLogMarkers: [],
		notLabelMarkers: [],
		labelMarkers: [],
		polyline: [{
			points: [],
			color: "#FF4500",
			width: 3,
			dottedLine: false
		}],
		logs: [],
		travelPageSize: 4,
		travelPageNumber: 1,
		initPageNumber: 1,
		plan: '',
		showPostPlan: false,
		avatar: '',
		showReport: false,
		showMap: true,
		showTravelLocation: true,
		showTravelLabel: true,
		report: '',
		mapView: 1,
		fullView: 'full-view',
		harfView: 'harf-view',
		showFinish: false,
		showGeMoreLoadin: false,
		showTips: false,
		randList: [],
		rankPageSize: 10,
		rankPageNumber: 1,
		myRankData: '',
		myRank: 0,
		windowHeight: app.globalData.windowHeight,
		bgUlr: app.globalData.imageUrl + 'img/Group.png',
		showMore: true,
		step_bg:  app.globalData.imageUrl + '/img/step_bg.jpg'
	},
	/**
	 * 获取用户当前位置
	 */
	getLocation: function () {
		wx.getLocation({
			type: 'wgs84',
			success: res => {
				var latitude = res.latitude
				var longitude = res.longitude
				let includePoints = this.data.includePoints;
				includePoints.push({
					longitude: longitude,
					latitude: latitude
				})
				console.log(latitude, longitude);
				this.setData({
					latitude: latitude,
					longitude: longitude,
					includePoints: includePoints
				})
			},
			fail: res => {
				console.log(res);
			}
		})
	},
	// 制定旅游路线
	createTravel() {
		wx.navigateTo({
			url: '/pages/travel/create_travel/create_travel'
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		qqmapsdk = new QQMapWX({
			key: config.TX_MAP_KEY
		});

		this.getLocation()
		this.loginForRunData()
		this.getStepRunData()
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
		this.setData({
			includePoints: [],
			markers: [],
			travelLogMarkers: [],
			notTravelLogMarkers: [],
			notLabelMarkers: [],
			labelMarkers: [],
			polyline: [{
				points: [],
				color: "#FF4500",
				width: 3,
				dottedLine: false
			}],
			logs: [],
			pageSize: 4,
			pageNumber: 1,
			initPageNumber: 1,
			plan: '',
			showPostPlan: false,
			avatar: '',
			showReport: false,
			showMap: true,
			showTravelLocation: true,
			showTravelLabel: true,
			report: '',
			mapView: 1,
			fullView: 'full-view',
			harfView: 'harf-view',
			showFinish: false,
			travelPageNumber: 1,
			travelPageSize: 4
		})

		this.plan();
		this.travelLogs();
	},
	plan: async function () {
		const res = await getTravelRank()
		let resData = res.data;
		if (resData.length == 0) {
			this.setData({
				showPostPlan: true
			})
			return false;
		}

		if (res.code == 200) {
			let travelLogMarkers = this.data.travelLogMarkers;
			let polyline = this.data.polyline;
			let points = polyline[0].points;
			let planPoints = resData.plans;
			planPoints.map(item => {
				points.push({
					longitude: item.longitude,
					latitude: item.latitude
				});
			})

			let travelLogs = resData.travel_logs;
			let finishPoint = [];
			travelLogs.map((item, key) => {
				//标记坐标点
				if (key == travelLogs.length - 1) {
					if (item.name != null) {
						travelLogMarkers.push({
							id: key,
							iconPath: this.data.user.avatar,
							//iconPath: '/image/mylocation.png',
							latitude: item.latitude,
							longitude: item.longitude,
							width: 30,
							height: 30,
							alpha: 1,
							label: {
								content: item.name,
								fontSize: 8,
								bgColor: "#FF6347",
								color: "#FFFFFF",
								padding: 5,
								borderRadius: 10
							}
						});
					} else {
						travelLogMarkers.push({
							id: key,
							iconPath: this.data.user.avatar,
							alpha: 1,
							//iconPath: '/image/mylocation.png',
							latitude: item.latitude,
							longitude: item.longitude,
							width: 30,
							height: 30
						});
					}

				} else {
					travelLogMarkers.push({
						id: key,
						latitude: item.latitude,
						longitude: item.longitude,
						width: 30,
						height: 30
					});
				}

				finishPoint.push({
					latitude: item.latitude,
					longitude: item.longitude,
				});
			})

			let linePoint = resData.plans;
			let travelLogLength = travelLogs.lenght;
			let notTravelLogMarkers = this.data.notTravelLogMarkers;
			let notLabelMarkers = this.data.notLabelMarkers;
			linePoint.map((item, key) => {
				let icon = '';
				if (key == 0) {
					icon = '/image/start.png';
				} else {
					if (key == linePoint.length - 1) {
						icon = '/image/end.png';
					} else {
						icon = '/image/point.png';
					}
				}

				if (item.name != null) {
					travelLogMarkers.push({
						iconPath: icon,
						id: travelLogLength + key,
						alpha: 1,
						latitude: item.latitude,
						longitude: item.longitude,
						width: 30,
						height: 30,
						label: {
							content: item.name,
							fontSize: 8,
							bgColor: "#FF6347",
							color: "#FFFFFF",
							padding: 5,
							borderRadius: 10
						}
					});

					notTravelLogMarkers.push({
						iconPath: icon,
						id: notTravelLogMarkers.length + key,
						latitude: item.latitude,
						longitude: item.longitude,
						alpha: 1,
						width: 30,
						height: 30,
						label: {
							content: item.name,
							fontSize: 8,
							bgColor: "#FF6347",
							color: "#FFFFFF",
							padding: 5,
							borderRadius: 10
						}
					});
				} else {
					travelLogMarkers.push({
						iconPath: icon,
						id: travelLogLength + key,
						alpha: 1,
						latitude: item.latitude,
						longitude: item.longitude,
						width: 30,
						height: 30
					});

					notTravelLogMarkers.push({
						iconPath: icon,
						id: notTravelLogMarkers.length + key,
						alpha: 1,
						latitude: item.latitude,
						longitude: item.longitude,
						width: 30,
						height: 30
					});
				}

				notLabelMarkers.push({
					iconPath: icon,
					id: notTravelLogMarkers.length + key,
					latitude: item.latitude,
					longitude: item.longitude,
					alpha: 1,
					width: 30,
					height: 30
				})
			})
			if (travelLogs.length > 0) {
				//没有旅途点的标记
				notTravelLogMarkers.push({
					//iconPath: '/image/mylocation.png',
					iconPath: this.data.user.avatar,
					id: travelLogLength + 1,
					latitude: travelLogs[travelLogs.length - 1].latitude,
					longitude: travelLogs[travelLogs.length - 1].longitude,
					alpha: 1,
					width: 30,
					height: 30,
					label: {
						content: travelLogs[travelLogs.length - 1].name,
						fontSize: 8,
						bgColor: "#FF6347",
						color: "#FFFFFF",
						padding: 5,
						borderRadius: 10
					}
				});

				notLabelMarkers.push({
					//iconPath: '/image/mylocation.png',
					iconPath: this.data.user.avatar,
					alpha: 1,
					id: travelLogLength + 1,
					latitude: travelLogs[travelLogs.length - 1].latitude,
					longitude: travelLogs[travelLogs.length - 1].longitude,
					width: 30,
					height: 30
				})
			}

			let finishPolyline = {
				points: finishPoint,
				color: "#1296DB",
				width: 3,
				dottedLine: true,
				arrowLine: true
			};
			polyline.push(finishPolyline)

			//缩放地图
			let includePoints = this.data.includePoints;
			if (travelLogs.length > 0) {
				includePoints.push({
					longitude: travelLogs[travelLogs.length - 1].longitude,
					latitude: travelLogs[travelLogs.length - 1].latitude
				})
			} else {
				includePoints.push({
					longitude: points[points.length - 1].longitude,
					latitude: points[points.length - 1].latitude
				})
			}


			//画线
			polyline[0].points = points;
			let markers = travelLogMarkers;
			this.setData({
				polyline: polyline,
				latitude: planPoints[0].latitude,
				longitude: planPoints[0].longitude,
				includePoints: includePoints,
				//markers: notTravelLogMarkers,
				markers: notLabelMarkers,
				planId: resData.id,
				plan: resData,
				travelLogMarkers: travelLogMarkers,
				notTravelLogMarkers: notTravelLogMarkers,
				labelMarkers: notTravelLogMarkers,
				notLabelMarkers: notLabelMarkers,
				showFinish: resData.status == 3 ? true : false
			})
		}
	},
	travelLogs: async function () {
		const res = await getTravelLog(this.data.travelPageNumber, this.data.travelPageSize)
		//  console.log(res);
		const logData = res.data
		if (logData.length !== 0) {
			let logs = this.data.logs;
			logData.map(item => {
				logs.push(item);
			})
			this.setData({
				logs: logs,
				travelPageNumber: this.data.travelPageNumber + 1,
				showGeMoreLoadin: false
			})
		} else {
			console.log('sss');
			this.setData({
				showMore: false
			})
		}
	},
	getMoreTravelLogs: function () {
		this.setData({
			showGeMoreLoadin: true
		})
		switch (parseInt(this.data.select)) {
			case 1:
				this.travelLogs();
				break;
			case 2:
				this.steps();
				break;
			case 3:
				this.getRandList();
				break;
		}
	},
	selected(e) {
		let objType = e.currentTarget.dataset.type;
		console.log(objType);
		const bg = this.data.step_bg
		if (objType == 2 || objType== 3) {
			this.setData({
				bgUlr: bg
			})
		}
		this.setData({
			select: objType
		})
	},
	/**
	 * 登录获取微信步数
	 */
	loginForRunData: function () {
		let that = this;
		wx.login({
			success: (res) => {
				let code = res.code
				console.log(code);
				wx.request({
					url: 'http://127.0.0.1:3001/api/login',
					method: 'POST',
					data: {
						code: code
					},
					success: (res) => {
						console.log(res.data);
						const code = res.data.data
						wx.setStorage({
							key: 'token',
							data: code
						})
					},
					fail: (res) => {
						console.log(res);
					}
				})
			},
		})
		wx.getSetting({
			success: (res) => {
				if (res.authSetting['scope.werun']) {
					wx.getWeRunData({
						success(res) {
							const encryptedData = res.encryptedData;
							const iv = res.iv;
							that.postRunData(encryptedData, iv);
						}
					})
				} else {
					wx.authorize({
						scope: "scope.werun",
						success(res) {
							that.loginForRunData();
							that.getPersonalInfo();
						}
					})
				}
			}
		})
	},

	/**
	 * 收集用户步数
	 */
	postRunData: async function (encryptedData, iv) {
		const res = await getRundata({
			encryptedData,
			iv
		})
		if (res.code === 200) {
			this.setData({
				steps: res.data.stepInfoList,
				totalStep: res.data.totalStep,
				todayStep: res.data.stepInfoList[0].step
			})
			console.log(this.data.steps);
		}
	},
	// 获取校园版的排名
	async getStepRunData() {
	 const res = await getStepData()
	  console.log(res);
	  this.setData({
		randList: res.data.row,
		myRank: res.data.order
	  })
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