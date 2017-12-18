//index.js
//获取应用实例
const app = getApp()
// 引入高德地图微信小程序SDK
const amap = require('../../libs/amap-wx.js');
const config = require('../../libs/config.js');

const myAmap = new amap.AMapWX({ key: config.Config.key });
Page({
  data: {
    lon: '', // 当前位置纬度
    lat: '', // 当前位置经度
    textData: {
      name: '',
      desc: ''
    },
    markers: [],
    infos: [],
    polyline: [],
    rightMarker: {}, // 当前点击的marker
    actionSheetHidden: true, // 上拉菜单的显隐
    actionSheetItems: [
      // { bindtap: 'Menu1', txt: '显示线路' },
      { bindtap: 'Menu2', txt: '线路详情' },
      { bindtap: 'Menu3', txt: '使用本机地图导航' }
    ],
    menu: '' // 选择的菜单
  },
  onLoad: function () {
    let that = this;
    myAmap.getRegeo({
      success: function (data) {
        //成功回调
        console.log(data)
        that.setData({
          lon: data[0].longitude,
          lat: data[0].latitude
        })
        that.getMarkers();
        that.showMarkerInfo(that.data.markers[0]);
        that.setData({
          rightMarker: that.data.markers[0]
        })
        that.getRouterLine();
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },
  // 获取所有markers数据
  getMarkers: function () {
    let that = this;
    // 获取所有要显示的marker
    that.setData({
      markers: [{
        id: 0,
        latitude: 29.572226,
        longitude: 106.527207,
        title: '溪沟华福巷51号5单元5-1/17729881993/王先生',
        iconPath: '../../images/marker_checked.png',
        width: 20,
        height: 25
      }, {
        id: 1,
        latitude: 29.554317,
        longitude: 106.543382,
        title: '辣千骨冒菜/545454/王先生',
        iconPath: '../../images/marker.png',
        width: 20,
        height: 25
      }, {
        id: 2,
        latitude: 29.552656,
        longitude: 106.552627,
        title: '活力多蛋糕(两路口店)/545454/王先生',
        iconPath: '../../images/marker.png',
        width: 20,
        height: 25
      }]
    })
  },
  // marker点击
  markertap: function (e) {
    const that = this;
    that.setData({
      polyline: []
    })
    const markersArr = that.data.markers;
    let data = {};
    let i = 0;
    for (i; i < markersArr.length; i++) {
      if (markersArr[i].id == e.markerId) {
        markersArr[i].iconPath = '../../images/marker_checked.png';
        data = markersArr[i];
        that.data.rightMarker = markersArr[i];
      } else {
        markersArr[i].iconPath = '../../images/marker.png';
      }
    }
    // 改变点击icon的图标颜色
    that.setData({
      markers: markersArr
    })
    // debugger
    that.showMarkerInfo(data);

    that.getRouterLine();
  },
  // 显示相应点文本信息
  showMarkerInfo: function (data) {
    let that = this;
    let info = data.title.split('/');
    that.setData({
      textData: {
        address: info[0],
        phone: info[1],
        contanct: info[2]
      }
    })
  },
  // 打电话
  phoneCall: function (e) {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.textData.phone
    })
  },
  // 上拉菜单显隐
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  // 显示路线详情
  bindMenu2: function () {
    this.setData({
      menu: 2,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    this.checkDetail();
  },
  // 使用本机地图导航
  bindMenu3: function () {
    this.setData({
      menu: 3,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    this.useLocalMap();
  },
  // 获取线路
  getRouterLine: function () {
    let that = this;
    myAmap.getDrivingRoute({
      origin: that.data.lon + ',' + that.data.lat,
      destination: that.data.rightMarker.longitude.toString() + ',' + that.data.rightMarker.latitude.toString(),
      success: function (res) {
        console.log(res);
        let points = []; // 路线经过点的经纬度
        if (res.paths && res.paths[0] && res.paths[0].steps) {
          let steps = res.paths[0].steps;
          app.globalData.steps = steps;
          for (let i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';')
            for (let j = 0; j < poLen.length; j++) {
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
            color: "#0091ff",
            width: 4
          }]
        })
      },
      fail: function (info) {
        console.log('获取路线失败', info)
      }
    })
    console.log(that.data)
  },
  // 查看导航线路详情
  checkDetail: function () {
    wx.navigateTo({
      url: '../routeDetail/routeDetail',
    })
  },
  // 调用本机地图
  useLocalMap: function () {
    let that = this;
    wx.openLocation({
      latitude: Number(that.data.rightMarker.latitude),
      longitude: Number(that.data.rightMarker.longitude),
      name: that.data.rightMarker.title.split('/')[0],
      scale: 28
    })
  },
})
