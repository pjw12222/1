<!--
 * @Author: your name
 * @Date: 2020-03-13 16:55:03
 * @LastEditTime: 2020-04-26 11:00:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-smartresume-master\src\components\DataCharts.vue
 -->
<template>
  <div
    id="main"
    style="display: flex;height: 500px;width: 100%;align-items: center;justify-content: center;"
  ></div>
</template>

<style></style>
<script>
import { getRequest } from "../../utils/api";
import echarts from "echarts";
export default {
  name: "",
  data() {
    return {
      charts: "",
      opinion: [],
      opinionData: [],
      //opinion: ["腾讯","华为","阿里巴巴"],
      //opinionData: [{"name":"腾讯","value":5},{"name":"华为","value":4},{"name":"阿里巴巴","value":5}],
    };
  },
  methods: {
    drawPie(id) {
      this.charts = echarts.init(document.getElementById(id));
    },
    initData() {
      getRequest("/community/getReportHead").then((resp) => {
        this.opinion = resp.data.titles;
        let datas = [];
        for (let data of resp.data.data) {
          let o = {};
          o.value = data.nums;
          o.name = data.content;
          datas.push(o);
        }
        this.opinionData = datas;
        console.log(this.opinionData);
        this.charts.setOption({
          title: {
            text: "简历攻略分类统计图",
            left: "center",
          },
          tooltip: {
            trigger: "item",
            formatter: "{a}<br/>{b}:{c} ({d}%)",
          },
          legend: {
            orient: "vertical",
            x: "left",
            data: this.opinion,
          },
          series: [
            {
              name: "帖子分类",
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center",
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "30",
                    fontWeight: "blod",
                  },
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
              data: this.opinionData,
            },
          ],
        });
      });
    },
  },
  //调用
  mounted() {
    this.initData();
    this.drawPie("main");
  },
};
</script>
