<template>
	<view class="semp-city">
		<view class="has-choose-box flex-row pad-left">
			<view class="has-choose" :class="index==showRank?'active':''" v-for="(item,index) in cityList" :key="index" @click="onRankClick(index)"
			 v-show="index<=showRank">
				{{item.name!='0'?item.name:'请选择'}}
			</view>
		</view>
		<view>
			<scroll-view class="city-item-box" scroll-y="true">
				<view class="city-item pad-left flex-row" :class="item.areaCode==valueObj[cityList[showRank].identify].value?'active':''"
				 v-for="(item,index) in cityList[showRank].showList" :key="index" @click="onChooseClick(item)">
					<view>{{item.areaName}}</view>
					<view v-if="item.areaCode==valueObj[cityList[showRank].identify].value">
						<!-- <semp-icon type="gou" color="#0faeff" size="26"></semp-icon> -->
					</view>
				</view>
				<view class="city-item pad-left flex-row" @click="onChooseClick(other)" v-if="showRank>1">
					<view>其它(如没有你的镇区，街道请在详细地址输入)</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'sempCity',
		data() {
			return {
				other: {
					label: "",
					value: '0'
				},
				showRank: 0,
				cityList: [{
						identify: 'province',
						name: '0',
						showList: this.cityData
					},
					{
						identify: 'city',
						name: '0',
						showList: []
					},
					{
						identify: 'county',
						name: '0',
						showList: []
					},
					{
						identify: 'town',
						name: '0',
						showList: []
					}
				],
				valueObj: {
					province: {
						label: '',
						value: '0'
					},
					city: {
						label: '',
						value: '0'
					},
					county: {
						label: '',
						value: '0'
					},
					town: {
						label: '',
						value: '0'
					},
				}
			};
		},
		props: {
			platform: String,
			cityData: Array

		},
		methods: {
			onChooseClick(item) {
				if (item.childList != '' && item.childList) {
					this.valueObj[this.cityList[this.showRank].identify].label = item.areaName;
					this.valueObj[this.cityList[this.showRank].identify].value = item.areaCode;
					this.cityList[this.showRank].name = item.areaName;
					this.showRank++;
					this.cityList[this.showRank].showList = item.childList;
				} else {
					this.valueObj.town.label = '';
					this.valueObj.town.value = '0';
					this.valueObj[this.cityList[this.showRank].identify].label = item.areaName;
					this.valueObj[this.cityList[this.showRank].identify].value = item.areaCode;
					this.$emit('confirm', this.valueObj);
				}
			},
			onRankClick(key) {
				this.showRank = key;
			},
		}
		 


	}
</script>

<style lang="scss">
	view {
		font-size: 28upx;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.pad-left {
		padding-left: 10upx;
	}

	.semp-city {}

	.has-choose-box {
		height: 60upx;
		line-height: 60upx;
		// box-shadow: 0 3upx 3upx #ccc;

	}

	.has-choose {
		margin-right: 50upx;
		padding: 0 5upx;


	}

	.has-choose.active {
		color: #4DA0E0;
		border-bottom: 2px solid #4DA0E0;
	}

	.city-item-box {
		height: 500upx;
	}

	.city-item {
		height: 80upx;
		// border-bottom: 1upx solid #fff;
		padding: 0 30upx;
	}

	.city-item view {
		justify-content: center;
	}

	.city-item.active {
		color: #4DA0E0;

	}
</style>
