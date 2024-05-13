// url: single-stock.html?code=xxx&name=yyy
// 加载导航栏
window.addEventListener("load", function () {
  let nav = document.getElementsByClassName("top-navigator")[0];

  var loggout = nav.querySelector("li#loggout");
  var loggIn = nav.querySelector("li#loggin");
  var user_info = nav.querySelector("li#user-info");

  // 判断用户属于哪种状态：未登录、已登录
  var hasLoggIn = sessionStorage.getItem("loggedIn");
  if (hasLoggIn !== "true") {
    loggIn.style.display = "block";
  } else {
    loggout.style.display = "block";
    user_info.style.display = "block";
  }
});
// 获取查询参数的键值对
const queryUrl = window.location.href;
const queryString = queryUrl.substring(queryUrl.indexOf("?") + 1);
const params = {};

queryString.split("&").forEach((param) => {
  const [key, value] = param.split("=");
  params[key] = decodeURIComponent(value);
});

// 获取股票名
const stockName = params.name;
document.title = stockName; // 修改标题

// 获取个股走势
const stockCode = params.code;
if (typeof stockCode == "undefined") {
  alert("请求股票出错，请检查是否选择了存在于名单的股票");
  window.location.href = "../html/index.html";
}

var priceHistory = [];
function getPriceHistory() {
  let xmlhttp = new XMLHttpRequest();
  const url =
    "http://127.0.0.1:12345/getStockPrice?code=" +
    encodeURIComponent(stockCode);

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      // console.log(xmlhttp.responseText);
      priceHistory = JSON.parse(xmlhttp.responseText);
      addTimeHistory(); // 给涨跌幅增加时间信息
      drawStockCurve(); // 绘制曲线图
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

// 由于history没有时间，所以要根据当前时间手动添加（最新的时间保证为执行此代码的时间，因此有5s的误差）
function addTimeHistory() {
  const timeInterval = 5000;
  const UTC8 = 8 * 60 * 60 * 1000;

  let currentTime = new Date();
  currentTime = new Date(currentTime.getTime() + UTC8);

  let timeLen = priceHistory.length;
  priceHistory = priceHistory.map((price, index) => {
    // 价格是正序的，要倒推时间，公式如下
    const timestamp =
      currentTime.getTime() - (timeLen - index - 1) * timeInterval;
    return [timestamp, price];
  });
}

// 绘制股票走势图
let chart;
function drawStockCurve() {
  chart = Highcharts.stockChart("chart-container", {
    rangeSelector: {
      enabled: false,
    },
    title: {
      text: ` ${stockName} 价格走势`,
    },
    series: [
      {
        type: "spline",
        name: "价格",
        data: priceHistory,
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
  });
}

getPriceHistory();
var countDown = 6;
// 每5秒追加坐标点
setInterval(() => {
  // 倒计时到0才能刷新
  countDown--;
  if(countDown === 0){
    countDown = 5;
  }
  document.getElementById("count-down").textContent = "数据刷新倒计时: " + countDown + " 秒";
  if(countDown !== 5){
    return;
  }
  // 获取最新股票数据
  const url = "http://127.0.0.1:12345/getStockPrice?code=" + encodeURIComponent(stockCode);
  fetch(url)
    .then(response => response.json())
    .then(data => {
      let newdata = data[data.length-1];
      let currentTime = new Date();
      const UTC8 = 8 * 60 * 60 * 1000;
      currentTime = new Date(currentTime.getTime() + UTC8);
      
      newdata = [currentTime.getTime(), newdata];
      chart.series[0].addPoint(newdata, true, true)
    })
}, 1000);