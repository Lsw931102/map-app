//index.js
//获取应用实例
const app = getApp()
// 引入高德地图微信小程序SDK
const amap = require('../../libs/amap-wx.js');
const myAmap = new amap.AMapWX({ key: 'bac3e5b0f9171b77417a8ccf11fd451c' });
Page({
  data: {
    lon: '', // 当前位置纬度
    lat: '', // 当前位置经度
    desLon: '', // 目标位置纬度
    desLat: '', // 目标位置经度
    distance: '', // 到目标点的距离 
    taxiCost: '', // 到目标点的打车费用
    markers: [],
    textData: {},
    polyline: [],
    controls: []
  },
  onLoad: function() {
    let that = this;
    // 获取用户当前位置
    myAmap.getRegeo({
      success: function (data) {
        //成功回调
      }
    })
    // 获取所有要显示的marker
    myAmap.getPoiAround({
      iconPathSelected: '../../images/marker_checked.png',
      iconPath: '../../images/marker.png',
      success: function(data) {
        console.log(data);
        that.setData({
          markers: data.markers
        })
      }
    })
  },
  markertap: function(e) {
    console.log(e);
    const that = this;
    const markersArr = that.data.markers;
    let data = {};
    let i = 0;
    for (i; i < markersArr.length; i++) {
      if (markersArr[i].id == e.markerId) {
        data = markersArr[i];
      }
    }
    that.showMarkerInfo(data);
    that.getRouterLine(data)
  },
  // 显示相应点文本信息
  showMarkerInfo: function (data) {
    var that = this;
    that.setData({
      textData: {
        name: data.name,
        desc: data.address
      }
    })
  },
  // 获取线路
  getRouterLine: function(data) {
    let that = this;
    myAmap.getDrivingRoute({
      origin: that.data.lon + ',' + that.data.lat,
      destination: data.longitude.toString() + ',' + data.latitude.toString(),
      success: function(res) {
        console.log(res);
        let points = []; // 路线经过点的经纬度
        if(res.paths&&res.paths.length&&res.paths[0].steps) {
          let steps = res.paths[0].steps;
          let i = 0;
          let j = 0;
          for(i; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';')
            for (j; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            } 
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#F57527",
            width: 4
          }],
          distance: (res.paths[0].distance / 1000).toFixed(1),
          taxiCost: parseInt(res.taxi_cost)
        })
      }
    })
    console.log(that.data)
  }
})
