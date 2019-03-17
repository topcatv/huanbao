<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="8" :xl="8" :style="{ marginBottom: '24px' }">
        <router-link to="/index/car">
          <chart-card :hoverable="true" :loading="loading" title="污染指标--车" :total="8846">
            <a-tooltip title="车辆" slot="action">
              <v-icon type="v-iconcar" style="color: #C47826; font-size: 22px"/>
            </a-tooltip>
            <div>
              <mini-area />
            </div>
            <template slot="footer">
              日最高<span> {{ '9849' | NumberFormat }}</span>
              <trend flag="down" style="margin-left: 16px; float: right">
                <span slot="term">同周比</span> 12%
              </trend>
              <trend flag="up" style="float: right">
                <span slot="term">日环比</span> 80%
              </trend>
            </template>
          </chart-card>
        </router-link>
      </a-col>
      <a-col :sm="24" :md="8" :xl="8" :style="{ marginBottom: '24px' }">
        <router-link to="/index/gas">
          <chart-card :hoverable="true" :loading="loading" title="污染指标--油" :total="3092">
            <a-tooltip title="加油站" slot="action">
              <v-icon type="v-icongas-pump" style="color: #C47826; font-size: 22px"/>
            </a-tooltip>
            <div>
              <mini-area />
            </div>
            <template slot="footer">
              日最高
              <span> {{ '8845' | NumberFormat }}</span>
              <trend flag="down" style="margin-left: 16px; float: right">
                <span slot="term">同周比</span> 8%
              </trend>
              <trend flag="up" style="float: right">
                <span slot="term">日环比</span> 18%
              </trend>
            </template>
          </chart-card>
        </router-link>
      </a-col>
      <a-col :sm="24" :md="8" :xl="8" :style="{ marginBottom: '24px' }">
        <router-link to="/index/road">
          <chart-card :hoverable="true" :loading="loading" title="污染指标--路" :total="5449">
            <a-tooltip title="路网" slot="action">
              <v-icon type="v-iconroad" style="color: #C47826; font-size: 22px"/>
            </a-tooltip>
            <div>
              <mini-area />
            </div>
            <template slot="footer">
              日最高
              <span> {{ '6948' | NumberFormat }}</span>
              <trend flag="down" style="margin-left: 16px; float: right">
                <span slot="term">同周比</span> 23%
              </trend>
              <trend flag="up" style="float: right">
                <span slot="term">日环比</span> 56%
              </trend>
            </template>
          </chart-card>
        </router-link>
      </a-col>
    </a-row>
    <a-row>
      <div id="container" class="h400"></div>
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
      heatmapData: []
    }
  },
  head: {
    script: [
      // { type: 'text/javascript', src: 'http://webapi.amap.com/maps?v=1.3&key=17fbe9e19c55b249fce7393f7b3340e1', async: true, body: false }, // Insert in body
      { type: 'text/javascript', src: 'http://webapi.amap.com/loca?v=1.2.1&key=17fbe9e19c55b249fce7393f7b3340e1', async: true, body: false }
    ]
  },
  created () {
    this.$on('okHead', () => {
      setTimeout(() => { this.initMap() }, 2000)
    })
  },
  mounted () {
    this.heatmapData = this.loadData()
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
    initMap () {
      const Loca = window.Loca
      this.loca = Loca.create('container', {
        mapStyle: 'amap://styles/midnight',
        center: [114.317785, 30.569854],
        zoom: 11,
        pitch: 35, // 地图俯仰角度，有效范围 0 度- 83 度
        viewMode: '3D' // 地图模式
      })
      const layer = Loca.visualLayer({
        container: this.loca,
        eventSupport: true,
        type: 'heatmap',
        // 基本热力图
        shape: 'normal'
      })
      const list = []
      let i = -1
      const length = this.heatmapData.length
      while (++i < length) {
        const item = this.heatmapData[i]
        list.push({
          coordinate: [item.lng, item.lat],
          count: item.count
        })
      }
      layer.setData(list, {
        lnglat: 'coordinate',
        value: 'count'
      })
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
      layer.render()
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
