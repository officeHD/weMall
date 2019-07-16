import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: true,
		openId: "",
		userInfo: {
			"id": "ff8080816a9b6057016aa05476660000", //社区用户uuid
			"phone_number": "", //手机号
			"headimgurl": '', //头像
			"nickname": "", //昵称
			"is_usable": 1, //状态 1可用 ；2 不可用
		},
		cityData: []
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({ //缓存用户登陆状态
				key: 'userInfo',
				data: provider
			})
			console.log(state.userInfo);
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({
				key: 'userInfo'
			})
		},
		setOpenId(state,code) {
			state.openId = code;
		},
		setCityData(state, data) {
			state.cityData = data
		}
	},
	actions: {

	}
})

export default store
