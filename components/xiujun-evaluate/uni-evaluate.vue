<!-- components/evaluate-components/index.wxml -->
<template>
	<view class="evaluateBox">
		<view class="evaluate-header">
			<view class="title">
				<!-- <text v-if="isShowIcon" class="iconfont" style="color:#999">&#xe640;</text> -->
				<text v-if="isShowTotal" style="margin-left: 10upx;">全部评价
					<!-- ({{ listData.length }}) --></text>
			</view>
			<view class="total">
				<!-- <view class="stars">
					<view class="stars-normal">
						<view class="box">
							<block v-for="i in [1, 2, 3, 4, 5]" :key="i"><text class="iconfont">&#xe870;</text></block>
						</view>
					</view>
					<view class="stars-selected" :style="{ width: (rate / 5) * 100 + '%' }">
						<view class="box">
							<block v-for="j in [1, 2, 3, 4, 5]" :key="j"><text class="iconfont">&#xe870;</text></block>
						</view>
					</view>
				</view>
				<text>{{ rate }}{{ (rate * 10) % 10 == 0 ? '.0' : '' }}</text> -->
			</view>
		</view>

		<view class="lists" v-if="listData.length > 0">
			<block v-for="(item, index_) in listData" :key="index_">
				<view class="item">
					<view class="icon">
						<image :src="item.headimgurl" mode="widthFix" style="width:100%" />
					</view>
					<view class="info">
						<view class="name-time">
							<text class="name">{{ item.nickname }}</text>
							<text class="time">{{ item.create_time }}</text>
						</view>
						<!-- <view class="stars">
							<view class="stars-normal">
								<view class="box">
									<block v-for="i_ in [1, 2, 3, 4, 5]" :key="i_"><text class="iconfont">&#xe870;</text></block>
								</view>
							</view>
							<view class="stars-selected" :style="{ width: (item.rate / 5) * 100 + '%' }">
								<view class="box">
									<block v-for="j_ in [1, 2, 3, 4, 5]" :key="j_"><text class="iconfont">&#xe870;</text></block>
								</view>
							</view>
						</view> -->
						<view class="evaluate-content bb">
							
							<text>{{ item.message || '用户暂未评价' }}</text>
							<view class="imgs" v-if="item.file">
								<block v-for="(imgurl, index) in item.file" :key="index">
									<view class="imgs-box">
										<image :src="imgurl.file_url" mode="aspectFill" style="width: 100%;" @click="previewImg(imgurl.file_url,item.file)">
										</image>
									</view>
								</block>
							</view>
						</view>
						<view>
							<view v-for="(replay,index2) in item.list" class="info" :key="index2">
								<view class="name-time">
									<text class="name">追加评论</text>
									<text class="time">{{ replay.create_time }}</text>
								</view> 
								<view class="evaluate-content ">
									<text>{{ item.replay || '用户暂未评价' }}</text>
									<view class="imgs" v-if="replay.file">
										<block v-for="(imgurl, index) in replay.file" :key="index">
											<view class="imgs-box">
												<image :src="imgurl.file_url" mode="aspectFill" style="width: 100%;" @click="previewImg(imgurl.file_url,replay.file)">
												</image>
											</view>
										</block>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<view class="no-lists" v-else>暂无评论</view>
	</view>
</template>

<script>
	//数据模拟
	// import data from './list.js';
	export default {
		props: {
			//评价列表数据
			listData: {
				type: Array
			},
			//是否显示总评价数量
			isShowTotal: {
				type: Boolean,
				default: true
			},
			//是否显示评价前面的图标
			isShowIcon: {
				type: Boolean,
				default: true
			},
			//总评分
			rate: {
				type: Number,
				default: 4.6
			}
		},
		data() {
			return {}
		},
		methods: {

			previewImg(src, urls) {
				let imgArr = urls.map((item => item.file_url))
				uni.previewImage({
					current: src,
					imgArr
				})
			}
		}
	};
</script>
<style scoped>
	@import './iconfont.css';

	.evaluateBox {
		width: 100%;
		margin-bottom: 120upx;
	}

	.evaluate-header {
		width: 100%;
		height: 80upx;
		display: flex;
		justify-content: space-between;
		padding: 20upx;
		align-items: center;
		margin-bottom: 12upx;
		box-sizing: border-box;
		/* border-bottom: 1upx solid #e5e5e5; */
		background-color: #F5F5F5;
	}

	.evaluateBox .title {
		display: flex;
		align-items: center;
		color: #666;
		font-size: 28upx;
	}
	.bb{
		border-bottom: 1upx solid #e6e6e6;
		padding-bottom: 10upx;
		margin-bottom: 10upx;
	}
	.total {
		/* flex: 1; */
		height: 100%;
		font-size: 30upx;
		color: #d76d9d;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.stars {
		width: 180upx;
		height: 36upx;
		position: relative;
	}

	.stars .box {
		width: 180upx;
	}

	.stars-normal {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		color: #ccc;
	}

	.stars-selected {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		color: #fde16d;
		overflow: hidden;
	}

	.stars-selected .iconfont,
	.stars-normal .iconfont {
		font-size: 36upx;
	}

	.lists .item {
		padding: 20upx;
		display: flex;
		/* height: auto; */
		/* align-items: center; */
		font-size: 22upx;
		color: #999;
		border-bottom: 1upx solid #E9E9E9;
	}

	.lists .item .icon {
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 26upx;
		/* align-self: flex-start; */
	}

	.lists .item .info {
		flex: 1;
		font-size: 26upx;
		color: #666;
	}

	.info .name-time {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 6upx;
	}

	.lists .info .stars {
		width: 140upx;
	}

	.info .stars-normal .iconfont,
	.info .stars-selected .iconfont {
		font-size: 28upx;
	}

	.info .stars .box {
		width: 140upx;
	}

	.lists .info .evaluate-content {
		color: #000;
		font-size: 28upx;
		text-align: left;
		padding-top: 6upx;
	}

	.info .evaluate-content .imgs {
		display: flex;
		flex-wrap: wrap;
		padding-top: 6upx;
	}

	.evaluate-content .imgs .imgs-box {
		width: 25%;
		padding-right: 10upx;
		box-sizing: border-box;
border-radius: 10upx;
	}

	.evaluate-content .imgs .imgs-box image {
		width: 25%;
		height: 20vw;
		border-radius: 10upx;

	}

	/* .evaluate-content .imgs .imgs-box:nth-child(4n+1){
	padding-left: 0;
}
.evaluate-content .imgs .imgs-box:nth-child(4n){
	padding-right: 0;
} */
	.no-lists {
		padding: 20upx 0;
		text-align: center;
		font-size: 24upx;
		color: #666;
	}
</style>
