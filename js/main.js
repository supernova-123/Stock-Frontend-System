// 加载导航栏
// window.addEventListener("load", function () {
//   let nav = document.getElementsByClassName("top-navigator")[0];

//   var loggout = nav.querySelector("li#loggout");
//   var loggIn = nav.querySelector("li#loggin");
//   var user_info = nav.querySelector("li#user-info");

//   // 判断用户属于哪种状态：未登录、已登录
//   var hasLoggIn = sessionStorage.getItem("loggedIn");
//   if (hasLoggIn !== "true") {
//     loggIn.style.display = "block";
//   } else {
//     loggout.style.display = "block";
//     user_info.style.display = "block";
//   }
// });

// 大盘实时行情
let data = [];
let oldData = []; // 昨日（5s前）的数据
let hasInit = {
  "SSE": false,
  "SZSE": false,
  "GEM": false,
}; // 是否已经初始化了
var countDown = 6;
function getMarketPrice() {
  countDown--;
  if(countDown === 0){
    countDown = 5;
  }
  document.getElementById("count-down").textContent = "数据刷新倒计时: " + countDown + " 秒";
  if(countDown !== 5){
    return;
  }
  let xmlhttp = new XMLHttpRequest();
  const url = "http://127.0.0.1:12345/getMarketPrice";

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      renderTable(xmlhttp);
      // countDown = 5;
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  // 解除表格的隐藏和隐藏加载文字
  document.getElementById("loading").style.display = "none";
  document.getElementById("main-table").style.display = "block";
}

// 分别生成三个版
function renderTable(_xmlhttp) {
  oldData = data;
  data = JSON.parse(_xmlhttp.responseText);
  renderSubTable("SSE", "6");
  renderSubTable("SZSE", "3");
  renderSubTable("GEM", "0");
}

// 生成table元素
function renderSubTable(type, code) {
  let subData = [];

  for (var i = 0; i < data.length; i++) {
    if (data[i].Code[0] !== code) continue;
    subData.push(data[i]);
    subData[subData.length - 1]["Daily_Percentage_Change"] = oldData.hasOwnProperty(i) ? (((data[i].Price - oldData[i].Price) / oldData[i].Price) * 100).toFixed(2) + "%" : "-";
    subData[subData.length - 1]["Daily_Price_Change"] = oldData.hasOwnProperty(i) ? (data[i].Price - oldData[i].Price).toFixed(2) : "-";
    subData[subData.length - 1]["Stock_Url"] = "../html/single-stock.html?code=" + encodeURIComponent(data[i].Code) + "&name=" + encodeURIComponent(data[i].Name);
    subData[subData.length - 1]["Trade_Url"] = "../html/trade.html?code=" + encodeURIComponent(data[i].Code) + "&name=" + encodeURIComponent(data[i].Name);
  }
  setMarketDatatable(subData, type);
}

// 绘制初始表格与倒计时
function setMarketDatatable(data, tableId) {
  if (!hasInit[tableId]) {
    // 如果没有初始化，则进行图标初始化
    $(document).ready(function () {
      $(`#${tableId}`).DataTable({
        data: data,
        columns: [
          { title: "股票代码", data: "Code" },
          { title: "股票名称", data: "Name" },
          { title: "当前价格", data: "Price" },
          { title: "当日涨跌幅", data: "Daily_Percentage_Change" },
          { title: "当日涨跌价", data: "Daily_Price_Change" },
          {
            title: "个股走势", data: "Stock_Url", render: function (data, type, row, meta) {
              return "<a href='" + data + "'>" + "<img src='../images/stock.svg' alt='SVG Image' width='30'>" + "</a>";
            }
          },
          {
            title: "交易", data: "Trade_Url", render: function (data, type, row, meta) {
              return "<a href='" + data + "'>" + "<img src='../images/trade.svg' alt='SVG Image' width='30'>" + "</a>";
            }
          }
        ],
      });
      hasInit[tableId] = true;
    });
  } else {
    var table = $(`#${tableId}`).DataTable();
    // 更新时仅修改价格、涨跌幅、涨跌价
    for (var j = 2; j < 5; j++) {
      var colName;
      if (j === 2) {
        colName = "Price";
      } else if (j === 3) {
        colName = "Daily_Percentage_Change";
      } else if (j === 4) {
        colName = "Daily_Price_Change";
      }
      for (var i = 0; i < data.length; i++) {
        table.cell(i, j).data(data[i][colName]).draw();
      }
    }
  }
}

// 初始先展示当前股市
getMarketPrice();
// 每 5s 刷新一次股市
setInterval(getMarketPrice, 1000);
