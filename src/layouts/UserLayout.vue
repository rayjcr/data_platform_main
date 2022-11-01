<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <div class="top">
        <!-- <div class="header">
          <a href="/">
            <img src="~@/assets/logo.svg" class="logo" alt="logo">
            <span class="title">Ant Design</span>
          </a>
        </div>
        <div class="desc">
          Ant Design 是西湖区最具影响力的 Web 设计规范
        </div> -->
        <div class="title">教育生态评价平台</div>
      </div>

      <route-view></route-view>

      <!-- <div class="footer">
        <div class="links">
          <a href="_self">帮助</a>
          <a href="_self">隐私</a>
          <a href="_self">条款</a>
        </div>
        <div class="copyright">
          Copyright &copy; 2018 白鹭学园技术组出品
        </div>
      </div> -->
      <div class="footer">
        <div class="copyright">
          Copyright@ 2013  杭州天音计算机系统工程有限公司 All Rights Reserved  备案/许可证号：浙B2-20080204
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import RouteView from './RouteView'
  import {
    mixinDevice
  } from '@/utils/mixin'

  export default {
    name: 'UserLayout',
    components: {
      RouteView
    },
    mixins: [mixinDevice],
    data() {
      return {}
    },
    mounted() {
      document.body.classList.add('userLayout')
    },
    beforeDestroy() {
      document.body.classList.remove('userLayout')
    }
  }
</script>

<style lang="less" scoped>
  #userLayout.user-layout-wrapper {
    height: 100%;

    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }

    @keyframes opacity{
		0%{
			opacity: 0.5;
		}
		50%{opacity: 0.7;}
		100%{opacity: 1;}
	}
	@-moz-keyframes opacity{
		0%{
			opacity: 0.5;
		}
		50%{opacity: 0.7;}
		100%{opacity: 1;}
	}
	@-ms-keyframes opacity{
		0%{
			opacity: 0.5;
		}
		50%{opacity: 0.7;}
		100%{opacity: 1;}
	}
	@-webkit-keyframes opacity{
		0%{
			opacity: 0.5;
		}
		50%{opacity: 0.7;}
		100%{opacity: 1;}
	}

    .container {
      width: 100%;
      min-height: 100%;
      background: transparent url(~@/assets/login_bg.png) no-repeat 50%;
      background-size: cover;
      padding-top: 0.4rem;
    //   padding: 110px 0 144px;
      position: relative;

      a {
        text-decoration: none;
      }

      .top {

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, .85);
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }

        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }

        .title {
            line-height: 0.49rem;
            font-size: 0.3rem;
            font-weight: 600;
            color: #ffffff;
            margin-left: 2.5rem;
            padding-left: 0.64rem;
            background: transparent url(~@/assets/login_logo.png) no-repeat left center;
            background-size: 0.5rem auto;
            animation: opacity 1s;
        }
      }

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }

      .footer {
        position: absolute;
        bottom: 0.65rem;
        z-index: 101;
        width: 100%;
        padding: 0 16px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;

          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;

            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }

        .copyright {
          color:rgba(255,255,255,0.5);
          font-size: 14px;
        }
      }
    }
  }
</style>
