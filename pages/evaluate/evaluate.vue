<template>
	<view class="content">

		<uni-evaluate :list-data="evaluateData" :rate="rateData" />
		<view class="loading-text">{{ loadingText }}</view>
	</view>
</template>

<script>
	import uniEvaluate from '@/components/xiujun-evaluate/uni-evaluate.vue';

	import {
		mapState
	} from 'vuex';
	
	export default {
		components: {
			uniEvaluate 
		},
		data() {
			return {
				loadingText: "",
				evaluateData: [],
				rateData: 4.6,
				page: 1,
				total: "",
				id:""
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad(options) {
			this.id = options.id;
			this.loadData();
		},
		methods: {
			async loadData() {
				const evaluation = await this.$req.ajax({
					path: 'zdapp/evaluation/get_evaluation_list',
					title: '正在加载',
					data: {
						users_id: this.userInfo.id,
						goods_id: this.id,
						page: this.page,
						page_num: '10'
					}
				});
				if (evaluation.data.code == 200) {
					this.loadingText="";
					this.evaluateData = evaluation.data.data.list;
					this.total = evaluation.data.data.total;
				}

			}
		},
		onReachBottom() {
			// uni.showToast({
			// 	title: '触发上拉加载'
			// });
			let len = this.evaluateData.length;

			if (len == this.total || len < 10 || 10 * this.page == this.total) {
				this.loadingText = '到底了';
				return false;
			}
			this.page++;
			this.loadingText="正在加载...";
			this.loadData();
		}
	};
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.list-scroll-content {
		height: 100vh;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
