<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="8" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card :hoverable="true" :loading="loading" title="污染指标--车" :total="8846 | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <v-icon type="v-iconcar" />
          </a-tooltip>
          <div>
            <mini-area />
          </div>
          <template slot="footer">
            日最高<span> {{ '1234' | NumberFormat }}</span>
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span>
              80%
            </trend>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="8" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card :hoverable="true" :loading="loading" title="污染指标--油" :total="8846 | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <v-icon type="v-icongas-pump" />
          </a-tooltip>
          <div>
            <mini-area />
          </div>
          <template slot="footer">
            日最高
            <span> {{ '1234' | NumberFormat }}</span>
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span> 12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span> 80%
            </trend>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="8" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card :hoverable="true" :loading="loading" title="污染指标--路" :total="8846 | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <v-icon type="v-iconroad" />
          </a-tooltip>
          <div>
            <mini-area />
          </div>
          <template slot="footer">
            日最高
            <span> {{ '1234' | NumberFormat }}</span>
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span> 12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span> 80%
            </trend>
          </template>
        </chart-card>
      </a-col>
    </a-row>
    <a-row>
      <div id="container" class="h400"></div>
      <!-- <div class="info" style="min-width: 350px; mex-width: 450px;">
        <h4>热力事件回调参数</h4>
        <p>当前热力值：<span id="val">{{ this.point.value }}</span></p>
        <p>当前包含的数据索引：<span id="indexes" style="display: block; overflow: scroll;">{{ this.point.indexes }}</span></p>
        <p>当前包含的数据数量：<span id="indexes-num">{{ this.point.length }}</span></p>
        <p>热力中心点坐标：<span id="lng-lat">{{ this.point.lnglat }}</span>
        </p>
      </div> -->
    </a-row>
  </div>
</template>

<script>
import ld from 'lodash'
import VIcon from '@/components/VIcon'
import ChartCard from '@/components/chart/ChartCard'
import ACol from 'ant-design-vue/es/grid/Col'
import ATooltip from 'ant-design-vue/es/tooltip/Tooltip'
import MiniArea from '@/components/chart/MiniArea'
import Trend from '@/components/Trend'
import MapLoader from '@/assets/js/AMap.js'
// import jsondata from '@/assets/data/data.json'

export default {
  name: 'HMonitor',
  components: {
    ATooltip,
    ACol,
    ChartCard,
    MiniArea,
    Trend,
    VIcon
  },
  data () {
    return {
      loading: true,
      heatmapData: [],
      point: {}
    }
  },
  created () {
  },
  mounted () {
    this.heatmapData = this.loadData()
    const that = this
    MapLoader().then(({
      AMap,
      Loca
    }) => {
      that.amap = new AMap.Map('container', {
        mapStyle: 'amap://styles/midnight',
        center: [114.317785, 30.569854],
        zoom: 12,
        pitch: 35, // 地图俯仰角度，有效范围 0 度- 83 度
        viewMode: '3D' // 地图模式
      })
      that.loca = Loca.create(that.amap)
      const layer = Loca.visualLayer({
        container: that.loca,
        eventSupport: true,
        type: 'heatmap',
        // 基本热力图
        shape: 'normal'
      })
      const list = []
      let i = -1
      const length = that.heatmapData.length
      while (++i < length) {
        const item = that.heatmapData[i]
        list.push({
          coordinate: [item.lng, item.lat],
          count: item.count
        })
      }
      layer.setData(list, {
        lnglat: 'coordinate',
        value: 'count'
      })
      // layer.setOptions({
      //   unit: 'meter',
      //   heightUnit: 'meter',
      //   style: {
      //     color: [
      //       '#2c7bb6',
      //       '#abd9e9',
      //       '#ffffbf',
      //       '#fdae61',
      //       '#d7191c'
      //     ],
      //     height: [0, 500],
      //     radius: 15,
      //     gap: 2,
      //     opacity: 0.85
      //   },
      //   selectStyle: {
      //     color: '#dbf21d',
      //     opacity: 0.9
      //   }
      // })
      layer.setOptions({
        style: {
          radius: 30,
          color: {
            0.5: '#2c7bb6',
            0.65: '#abd9e9',
            0.7: '#ffffbf',
            0.9: '#fde468',
            1.0: '#d7191c'
          }
        }
      })
      layer.on('mousemove', (ev) => {
        console.log(ev)
        that.updateInfo(ev)
      })
      layer.render()
    }, e => {
      console.log('地图加载失败', e)
    })
  },
  methods: {
    loadData () {
      this.loading = true
      const data = []
      let i = 0
      while (++i < 500) {
        data.push({
          'lng': ld.random(114.124066, 114.490048),
          'lat': ld.random(30.383518, 30.653252),
          'count': ld.random(1, 500)
        })
      }
      this.loading = false
      return data
    },
    updateInfo (ev) {
      this.point['value'] = ev.value
      this.point['indexes'] = ev.indexes.join(',')
      this.point['length'] = ev.indexes.length
      this.point['lnglat'] = ev.lngLat.valueOf()
    }
  }
}
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;
    .extra-item {
      display: inline-block;
      margin-right: 24px;
      a {
        margin-left: 24px;
      }
    }
  }
  .h400 {
    height: 600px;
  }
  .info {
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    border-radius: .25rem;
    position: absolute;
    top: 1rem;
    background-color: white;
    width: auto;
    min-width: 22rem;
    border-width: 0;
    right: 1rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
    span {
      min-width: 300px;
      max-width: 400px;
      color: #1b91ff;
    }
  }
</style>
