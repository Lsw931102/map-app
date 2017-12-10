Page({
  data: {
    lon: '', // 当前位置纬度
    lat: '', // 当前位置经度
    desLon: '', // 目标位置纬度
    desLat: '', // 目标位置经度
    distance: '', // 到目标点的距离 
    taxiCost: '', // 到目标点的打车费用
    markers: [{
      iconPath: "../../images/marker_checked.png",
      id: 0,
      latitude: 29.572911,
      longitude: 106.549682,
      width: 20,
      height: 20
    }],
    textData: {},
    polyline: [],
    controls: []
  },
  onReady: function (e) {
    let that = this;
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap');
    wx.getLocation({
      success: function(res) {
        that.setData({
          lon: res.longitude,
          lat: res.latitude
        })
      },
    })
  },
  markertap: function(e) {
    console.log(e)
    let that = this;
    that.setData({
      desLon: 106.549682, // 目标位置纬度
      desLat: 29.572911, // 目标位置经度
    })
    wx.openLocation({
      latitude: Number(that.data.desLat),
      longitude: Number(that.data.desLon),
      name: '测试',
      scale: 28
    })
  },
  getPoly: function() {
    
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 0,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  }
})
