// const app = getApp()
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
  onReady: function (e) {
    let that = this;
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap');
  },
  onLoad: function () {
    // debugger
    let that = this;
    if (!that.data.lon || !that.data.lat) {
      that.getLocation();
      that.getMarkers();
    } else {
      that.getMarkers();
    }
  },
  getLocation: function () {
    const that = this;
    // 获取用户当前位置
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        that.setData({
          lon: res.longitude,
          lat: res.latitude
        })
      },
    })
  },
  getMarkers: function () {
    let that = this;
    // 获取所有要显示的marker
    that.setData({
      markers: [{
        id: 0,
        latitude: 29.572226,
        longitude: 106.527207,
        title: '溪沟华福巷51号5单元5-1',
        iconPath: '../../images/marker.png',
        width: 20,
        height: 25,
        callout: {
          content: '安洁洗衣店\n联系电话：545454\n联系人：王先生',
          fonsize: 44,
          borderRadius: 8,
          bgColor: '#ffffff',
          padding: 10
        }
      }, {
        id: 1,
        latitude: 29.554317,
        longitude: 106.543382,
        title: '辣千骨冒菜',
        iconPath: '../../images/marker.png',
        width: 20,
        height: 25,
        callout: {
          content: '两路口桂花园路12号附1栋(血库上行100米)\n联系电话：545454\n联系人：王先生',
          fonsize: 44,
          borderRadius: 8,
          bgColor: '#ffffff',
          padding: 10
        }
      }, {
        id: 2,
        latitude: 29.552656,
        longitude: 106.552627,
        title: '活力多蛋糕(两路口店)',
        iconPath: '../../images/marker.png',
        width: 20,
        height: 25,
        callout: {
          content: '中山三路1号\n联系电话：545454\n联系人：王先生',
          fonsize: 44,
          borderRadius: 8,
          bgColor: '#ffffff',
          padding: 10
        }
      }]
    })
  },
  // marker点击
  markertap: function (e) {
    console.log(e);
    const that = this;
    const markersArr = that.data.markers;
    let data = {};
    let i = 0;
    for (i; i < markersArr.length; i++) {
      if (markersArr[i].id == e.markerId) {
        // markersArr[i].iconPath = '../../images/marker_checked.png';
        // data = markersArr[i];
        that.data.rightMarker = markersArr[i];
        that.data.markers[i].iconPath = '../../images/marker_checked.png';
      } else {
        // markersArr[i].iconPath = '../../images/marker.png';
        that.data.markers[i].iconPath = '../../images/marker.png';
      }
    }
    // 改变点击icon的图标颜色
    // that.setData({
    //   markers: markersArr
    // })
    // that.showMarkerInfo(data);

    // that.getRouterLine(data)
  },
  // callout气泡点击
  callouttap: function () {
    console.log(this.data.markers);
    const data = this.data.rightMarker;
    wx.openLocation({
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      name: data.title,
      address: data.callout.content
    })
    this.setData({
      markers: this.data.markers
    })
  },
})
