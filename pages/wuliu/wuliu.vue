<template>
	<view class="content">
		<ali :state="alidata2.state" :datas="alidata2.Traces" :ways="alidata2.information"></ali>
	</view>
</template>

<script>
	import ali from '../../components/WuLiu-step.vue';
	export default {
		components: {
			ali
		},
		data() {
			return {
				alidata2: {
					state: 3,
					uptime: '2019-05-24 10:58:24',
					Traces: [  ],

					information: {
						no: '70939995911523',
						sName: 'HTKY',
						expName: '百世快递(原汇通)',
						url: 'http:www.htky365.com',
						tel: '021-62963636',
						img: 'https:oss-cn2.apistore.cnexpHTKY.png'
					}
				}
			};
		},
		onLoad() {
			this.init();
		},
		methods: {
			async init() {
				let res = await this.$req.ajax({
					path: 'zdapp/order/get_order_express',

					data: {
						co_order_id: "183",

					}
				});
				this.alidata2.Traces=res.data.Traces
				console.log(res.data.Traces);

			}
		}
	};
</script>

<style>
	.content {}
</style>
