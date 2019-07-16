<template>
	<view class="lazy-image">
		<image class="real-image" @load="onLoaded" :src="realSrc" @error="loadError" mode="aspectFill"></image>
		<view :class="loaded?'loaded':''">
			<image v-if="error" :src="errorImage" mode="aspectFill"></image>
			<image v-else  :src="placeholdSrc" mode="aspectFill"></image>

		</view>
	</view>
</template>

<script>
	export default {
		props: {
			placeholdSrc: {
				type: String,
				default: ""
			},
			realSrc: {
				type: String,
				default: ""
			},
			errorImage: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				loaded: false,
				error: false,
			}
		},
		created() {
			 if(!this.realSrc){
				 this.error = true;
			 }
		},
		methods: {
			loadError() { 
				this.error = true;
			},
			onLoaded() {
				 
				this.loaded = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lazy-image {
		height: 100%;
		width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;

		image {
			width: 100%;
		}

		view {
			// background-color: #eee;
			position: absolute;
			z-index: 2;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			transition: opacity 0.4s linear;

			image {
				width: 100%;
			}
		}

		.loaded {
			opacity: 0;
		}
	}
</style>
