<template>
  <div class="ranktable">
    <el-card :gutter="10" class v-if="msg" id="zonglan">
      <div class="text item">面霸排行榜</div>
    </el-card>
    <el-row :gutter="20">
      <!-- <el-col :span="16" v-for="o in this.child" :key="o.displayRank">
        <el-card class="box-card" v-if="msg">
          <h3>{{ o.metadata.legend_name }}</h3>
          <div class="tuwen">
            <img :src="o.metadata.icon" class="image" />
            <div class="legend_card">
              <div>积分：{{ o.score }}</div>
              <div>排名：{{ o.displayRank }}</div>
              <div>超过{{ o.percentile }}%用户</div>
            </div>
          </div>
        </el-card>
      </el-col> -->
      <el-col :span="16" v-for="o in this.users" :key="o.id">
        <el-card class="box-card" v-if="msg">
          <h3>{{ o.nickname }}</h3>
          <div class="tuwen">
            <img :src="o.icon" class="image" />
            <div class="legend_card">
              <div>积分：{{ o.score }}</div>
              <div>排名：{{ o.displayRank }}</div>
              <div>超过{{ o.percentile }}%用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRequest } from "../../../utils/api";
export default {
  data() {
    return {
      websock: null,
      loading: true,
      errored: false,
      msg: null,
      child: null,
      users: []
    };
  },
  props: {},
  methods: {
    initRank() {
      this.msg = true;
      getRequest("/user/initUserRank").then(resp => {
        let datas = resp.data.data;
        // 将string类型的数据转为为对象
        this.handledata(datas);
      });
      this.loading = false;
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri = "ws://127.0.0.1:8081/getRank/Hello";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      let actions = { message: "WebsocketOnopen" };
      this.websocketsend(JSON.stringify(actions));
      console.log(actions);
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) {
      //数据接收
      let datas = e.data;
      // 将string类型的数据转为为对象
      this.handledata(datas);
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
      console.log(Data);
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
    },
    handledata(datas) {
      if (datas != "连接成功") {
        console.log(datas);
        const redatas = eval("(" + datas + ")");
        console.log(redatas);
        let key = 1;
        this.users = [];
        for (let redata of redatas) {
          console.log(redata);
          let user = {};
          user.id = redata.id;
          user.nickname = redata.nickname;
          user.icon =
            "data:image/jpg;base64,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";
          user.displayRank = key;
          user.percentile = 101 - key;
          user.score = 100000 - key;
          key++;
          this.users.push(user);
        }
      }
    }
  },
  mounted() {
    this.initWebSocket();
    this.initRank();
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ranktable /deep/ {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
}
#zonglan {
  margin: 1%;
}
.box-card /deep/ .el-card__body {
  width: 100%;
  display: flex;
  /* border-left: 1px dashed #999999; */
  justify-content: flex-start;
}

.el-col-16 /deep/ {
  width: 100%;
}
.image {
  width: 147.69px;
  height: 165.34px;
  display: block;
  justify-content: center;
}
h3 {
  margin: 4px 0 0 18px;
  font-family: 楷书;
  font-size: 20px;
  padding-right: 2%;
  color: #409eff;
  font-weight: bolder;
}
</style>
