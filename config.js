const config = {
	dev: { //开发环境
		domain: "http://127.0.0.1:3001/api", //后台接口地址
		imgUrl: 'http://127.0.0.1:3001/', // 图片地址
	},
	prod: { //生产环境
		domain: "http://127.0.0.1:3001/api",
		qiniuDomain: "http://127.0.0.1:3001/"
	},
		nei: {
			domain: "http://192.168.0.103:3001/api", //后台接口地址
			imgUrl: 'http://192.168.0.103:3001/', // 图片地址
		}
}


// const domain = config.dev.domain;
// const imgUrl = config.dev.imgUrl

const domain = config.nei.domain;
const imgUrl = config.nei.imgUrl



const TX_MAP_KEY = 'SKOBZ-BMORI-TJRGT-UG67R-5XF2Q-5GB4K'
module.exports = {
	domain,
	imgUrl,
	TX_MAP_KEY
}