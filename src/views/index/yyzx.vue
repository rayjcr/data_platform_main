<template>
  <a-row :gutter="30">
    <a-col class="gutter-row" :span="15">
      <!-- 最近使用的应用 -->
      <div class="yyzx-item zjsy">
        <div class="title">最近使用的应用</div>
        <div class="list" v-if="list.lastClick">
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="3" v-for="(item,index) in list.lastClick" :key="index">
              <a
                class="list-item"
                :href="common.url + '/client/jumpIndex/' + item.clientId"
                target="_blank"
              >
                <img class="list-item-icon" :src="'/api/' + item.logo" alt />
                <label class="list-item-title">{{item.clientName}}</label>
              </a>
            </a-col>
          </a-row>
        </div>
      </div>
      <!-- 您可以使用以下更多应用 -->
      <div class="yyzx-item zjsy">
        <div class="title">您可以使用以下更多应用</div>
        <div class="list" v-if="list.mostClick">
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="3" v-for="(item,index) in list.mostClick" :key="index">
              <a
                class="list-item"
                :href="common.url +'/client/jumpIndex/' + item.clientId"
                target="_blank"
              >
                <img class="list-item-icon" :src="'/api/' + item.logo" alt />
                <label class="list-item-title">{{item.clientName}}</label>
              </a>
            </a-col>
          </a-row>
        </div>
      </div>
      <!-- 我接入的应用 -->
      <div class="yyzx-item zjsy" v-if="roleType == 1 || roleType == 2">
        <div class="title">
          <label>我接入的应用</label>
          <label class="more">更多</label>
        </div>
        <div class="list" v-if="list.myJoin">
          <a-row :gutter="30">
            <a-col class="gutter-row" :span="6" v-for="(item,index) in list.myJoin" :key="index">
              <div class="list-new-item" v-if="item.status == '0'">
                <div class="list-new-item-icon iconfont">&#xe61a;</div>
                <label class="list-new-item-title">{{item.clientName}}</label>
              </div>
              <div class="list-new-item zt" v-else>
                <img
                  class="list-new-item-status status1"
                  v-if="item.status == '2'"
                  :src="require('./img/ysj.png')"
                />
                <img
                  class="list-new-item-status status2"
                  v-if="item.status == '1'"
                  :src="require('./img/ddsh.png')"
                />
                <img
                  class="list-new-item-status status3"
                  v-if="item.status == '3'"
                  :src="require('./img/yxj.png')"
                />
                <!-- <div class="list-new-item-icon" :style="{backgroundImage: 'url('+ '/api/' + item.logo +')',backgroundSize:cover }"></div> -->
                <img class="list-new-item-icon" :src="'/api/' + item.logo" alt />
                <label class="list-new-item-title">{{item.clientName}}</label>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="9" :style="{paddingRight: '0'}">
      <!-- 最近上新的应用 -->
      <div class="yyzx-item zjsy">
        <div class="title">最近上新的应用</div>
        <div class="list" v-if="list.newClient">
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="6" v-for="(item,index) in list.newClient" :key="index">
              <a
                class="list-item"
                :href="common.url +'/client/jumpIndex/' + item.clientId"
                target="_blank"
              >
                <img class="list-item-icon" :src="'/api/' + item.logo" alt />
                <label class="list-item-title">{{item.clientName}}</label>
              </a>
            </a-col>
          </a-row>
        </div>
      </div>
      <!-- 第三方应用接入相关资源 -->
      <div class="yyzx-item zjsy" v-if="roleType == 1 || roleType == 2">
        <div class="title">第三方应用接入相关资源</div>
        <div class="list">
          <a-row :gutter="16">
            <a-col
              class="gutter-row"
              :span="12"
              v-for="(item,index) in dsfjr"
              :key="index"
              @click="jump(index)"
            >
              <div class="list-doc">
                <span class="list-doc-icon"></span>
                <label class="list-doc-title">{{item.mc}}</label>
              </div>
            </a-col>
          </a-row>
        </div>

        <a-modal
          :title="modal_title"
          :visible="visible"
          width="70%"
          style="min-width:500px"
          @cancel="visible = false"
          destroyOnClose
          :maskClosable="false"
          :keyboard="false"
          centered
        >
          <div style="height: 500px">
            <iframe ref="iframe" frameborder="0"></iframe>
          </div>
          <div slot="footer">
            <a-button @click="visible = false">关闭</a-button>
          </div>
        </a-modal>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import * as API from '@/api/data'

export default {
    props: {
        roleType: {
            default: 1,
        },
    },
    data() {
        return {
            dsfjr: [
                {
                    mc: 'cas client 接入',
                },
                {
                    mc: 'OAuth 接入',
                },
                {
                    mc: '第三方应用接入相关资源',
                },
                {
                    mc: '第三方应用接入相关资源',
                },
                {
                    mc: '第三方应用接入相关资源',
                },
                {
                    mc: '第三方应用接入相关资源',
                },
                {
                    mc: '第三方应用接入相关资源',
                },
            ], //第三方应用接入相关资源

            list: {}, // 个人中心我的应用
            visible: false,
            modal_title: '',
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.getMyClient()
        },
        // 个人中心我的应用
        getMyClient() {
            API.myClient().then((res) => {
                if (res.resultCode == 200) {
                    this.list = res.value
                }
            })
        },
        jump(key) {
            if(key > 1) return;

            this.visible = true
            this.$nextTick(() => {
                this.$refs.iframe.removeAttribute("src");
                this.$nextTick(() => {
                    if(key == 0) {
                        this.$refs.iframe.contentDocument.documentElement.innerHTML = require("./CAS.html");
                    } else {
                        this.$refs.iframe.contentDocument.documentElement.innerHTML = require("./OAuth.html");
                    }
                });
            });
        },
        // jumpIndex(id) {
        //     window.location.href = '/api/client/jumpIndex/' + id
        // }
    },
}
</script>

<style>
iframe {
    width: 100%;
    height: 100%;
}
</style>
