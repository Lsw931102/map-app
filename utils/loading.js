module.exports.perform = (title = '加载中', mask = true) => {
  wx.showNavigationBarLoading();
  wx.showLoading({
    title,
    mask
  });
}

module.exports.cancel = () => {
  wx.hideNavigationBarLoading();
  wx.hideToast();
}