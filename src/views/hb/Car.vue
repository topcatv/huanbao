<template>
  <div class="page-header-index-wide">
    <a-row style="margin-bottom: 5px">
      <router-link to="/index/HMonitor">
        <a-button type="primary" icon="left">返回</a-button>
      </router-link>
    </a-row>
    <a-row>
      <div id="container" class="h400"></div>
    </a-row>
    <a-drawer
      title="车辆监控信息"
      placement="right"
      width="450"
      :closable="false"
      @close="onClose"
      :visible="visible"
    >
      <p class="groupTitle"><v-icon type="v-iconcar" style="color: #C47826; font-size: 22px"/> 车辆信息</p>
      <a-row>
        <a-col :span="12">
          <div class="description">
            <p class="title">车牌号：</p>{{ car.carNo }}
          </div>
        </a-col>
        <a-col :span="12">
          <div class="description">
            <p class="title">使用者：</p>{{ car.user }}
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <div class="description">
            <p class="title">制造商：</p>福特
          </div>
        </a-col>
        <a-col :span="12">
          <div class="description">
            <p class="title">出厂时间：</p>{{ car.create }}
          </div>
        </a-col>
      </a-row>
      <a-divider />
      <p class="groupTitle"><a-icon type="video-camera" style="color: #4DABF7; font-size: 22px"/> 设备信息</p>
      <a-row>
        <a-col :span="12">
          <div class="description">
            <p class="title">排烟温度：</p>{{ car.temp }}℃
          </div>
        </a-col>
        <a-col :span="12">
          <div class="description">
            <p class="title">SCR前温度：</p>{{ car.scrBefore }}℃
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <div class="description">
            <p class="title">SCR后温度：</p>{{ car.scrAfter }}℃
          </div>
        </a-col>
        <a-col :span="12">
          <div class="description">
            <p class="title">SCR前NO：</p>{{ car.scrN0Before }}℃
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <div class="description">
            <p class="title">SCR后NO：</p>{{ car.scrN0After }}℃
          </div>
        </a-col>
        <a-col :span="12">
          <div class="description">
            <p class="title">超标时间：</p>{{ car.scrN0AfterTime }}
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <div class="description">
            <p class="title">处理装置差压：</p>无
          </div>
        </a-col>
        <a-col :span="12">
          <div class="description">
            <p class="title">超标时间：</p>{{ car.create }}
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div class="description">
            <p class="title">清洗时间：</p>{{ car.create }}
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <div class="description">
            <p class="title">排烟NH3：</p>无
          </div>
        </a-col>
        <a-col :span="12">
          <div class="description">
            <p class="title">超标时间：</p>{{ car.create }}
          </div>
        </a-col>
      </a-row>
    </a-drawer>
  </div>
</template>

<script>
import ACol from 'ant-design-vue/es/grid/Col'
import VIcon from '@/components/VIcon'
import carData from '@/assets/data/car.json'

export default {
  name: 'HCar',
  components: {
    ACol,
    VIcon
  },
  data () {
    return {
      loading: true,
      heatmapData: [],
      car: {},
      visible: false
    }
  },
  head: {
    script: [
      { type: 'text/javascript', src: 'http://webapi.amap.com/maps?v=1.3&key=17fbe9e19c55b249fce7393f7b3340e1', async: true, body: false }, // Insert in body
      { type: 'text/javascript', src: 'http://webapi.amap.com/ui/1.0/main.js', async: true, body: false }
    ]
  },
  created () {
    this.$on('okHead', () => {
      setTimeout(() => { this.initMap() }, 1000)
    })
  },
  mounted () {
    // this.initMap()
  },
  methods: {
    // 实例化地图
    initMap () {
      const AMap = window.AMap
      const AMapUI = window.AMapUI
      this.amap = new AMap.Map('container', {
        mapStyle: 'amap://styles/dark',
        center: [114.317785, 30.569854],
        zoom: 12
      })
      // 同时引入工具条插件，比例尺插件和鹰眼插件
      AMap.plugin(['AMap.ToolBar', 'AMap.MapType'], () => {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        this.amap.addControl(new AMap.ToolBar())
        // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
        this.amap.addControl(new AMap.MapType())
      })
      // const iconStyles = ['red', 'orange']
      // this.iconIdx = 0
      AMapUI.loadUI(['overlay/AwesomeMarker', 'overlay/SimpleInfoWindow'], (AwesomeMarker, SimpleInfoWindow) => {
        // icon的取值请见  http://fontawesome.io/icons/
        var awIcons = [
          'truck'
        ]
        carData.forEach((item, index) => {
          const marker = new AwesomeMarker({
            // 设置awesomeIcon
            awesomeIcon: awIcons[0],
            iconLabel: {
              style: {
                color: '#333', // 字体颜色
                fontSize: '18px' // 字号
              }
            },
            // 图标
            iconStyle: index === 1 ? 'red' : 'green',
            map: this.amap,
            position: item.lnglat
          })
          // if (index === 1) {
          //   this.interval = setInterval(() => {
          //     this.iconIdx = (++this.iconIdx) % iconStyles.length
          //     marker.setIconStyle(iconStyles[this.iconIdx])
          //   }, 500)
          // }
          const body = `<a herf="javascript:void(0)" class="detail">查看详细</a>`
          const infoWindow = new SimpleInfoWindow({
            infoTitle: `<strong>${item.carNo}</strong>`,
            infoBody: body,
            offset: new AMap.Pixel(0, -31)
          })
          infoWindow.get$InfoBody().on('click', '.detail', (event) => {
            event.stopPropagation()
            this.car = item
            this.showDrawer()
            infoWindow.close()
          })
          AMap.event.addListener(marker, 'mouseover', () => {
            infoWindow.open(this.amap, marker.getPosition())
          })
        })
      })
    },
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.h400 {
  height: 760px;
}
.description {
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 7px;
  color: #9198db;
  .title {
    color: #333;
    display: inline-block;
    margin-right: 8px;
  }
}
.groupTitle {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
    display: block;
    margin-bottom: 16px;
}
</style>
