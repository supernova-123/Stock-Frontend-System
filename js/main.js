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
  if (countDown === 0) {
    countDown = 5;
  }
  document.getElementById("count-down").textContent = "数据刷新倒计时: " + countDown + " 秒";
  if (countDown !== 5) {
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
    var dailyPercentageChange = oldData.hasOwnProperty(i) ? (data[i].Price - oldData[i].Price).toFixed(2) : "-";
    // 通过上涨还是下跌决定使用的标志：上箭头和下箭头，同时修改当日涨跌价的数字颜色，同时涨价时数字前加上一个加号
    if (dailyPercentageChange !== "-" && parseFloat(dailyPercentageChange) >= 0) {
      subData[subData.length - 1]["Name"] = "<img src='../images/red_up.svg' alt='SVG Image' width='14'>" + subData[subData.length - 1]["Name"];
      dailyPercentageChange = "+" + dailyPercentageChange;
      dailyPercentageChange = "<div style='color: red;'>" + dailyPercentageChange + "</div>";
    }
    else if (dailyPercentageChange !== "-") {
      subData[subData.length - 1]["Name"] = "<img src='../images/green_down.svg' alt='SVG Image' width='14'>" + subData[subData.length - 1]["Name"];
      dailyPercentageChange = "<div style='color: green;'>" + dailyPercentageChange + "</div>";
    }
    subData[subData.length - 1]["Daily_Price_Change"] = dailyPercentageChange;
    subData[subData.length - 1]["Stock_Url"] = "../html/single-stock.html?code=" + encodeURIComponent(data[i].Code) + "&name=" + encodeURIComponent(data[i].Name);
    subData[subData.length - 1]["Trade_Url"] = "../html/trade.html?code=" + encodeURIComponent(data[i].Code) + "&name=" + encodeURIComponent(data[i].Name);
  }
  setMarketDatatable(subData, type);
}

// 绘制初始表格与倒计时
function setMarketDatatable(data, tableId) {
  if (!hasInit[tableId]) {
    // 如果没有初始化，则进行图标初始化
    var table = $(`#${tableId}`).DataTable({
      lengthChange: false,
      language: {
        "sProcessing": "处理中...",
        "sLengthMenu": "显示 _MENU_ 项结果",
        "sZeroRecords": "没有匹配结果",
        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "搜索:",
        "sUrl": "",
        "sEmptyTable": "表中数据为空",
        "sLoadingRecords": "载入中...",
        "sInfoThousands": ",",
        "oPaginate": {
          "sFirst": "首页",
          "sPrevious": "上页",
          "sNext": "下页",
          "sLast": "末页"
        },
        "oAria": {
          "sSortAscending": ": 以升序排列此列",
          "sSortDescending": ": 以降序排列此列"
        }
      },
      data: data,
      columns: [
        { title: "股票代码", data: "Code" },
        {
          title: "股票名称", data: "Name", render: function (data, type, row, meta) {
            return data;
          }
        },
        { title: "当前价格", data: "Price" },
        { title: "当日涨跌幅", data: "Daily_Percentage_Change" },
        {
          title: "当日涨跌价", data: "Daily_Price_Change", render: function (data, type, row, meta) {
            return data;
          }
        },
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
    if (tableId !== "SSE") {
      $(`#${tableId + "-div"}`).removeClass("active");
    }
    hasInit[tableId] = true;
  } else {
    var table = $(`#${tableId}`).DataTable();
    // 更新时仅修改名称、价格、涨跌幅、涨跌价
    // 改名
    for (var i = 0; i < data.length; i++) {
      table.cell(i, 1).data(data[i]["Name"]).draw();
    }
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
// JavaScript 切换选项卡

$(".tab-menu li").click(function () {
  var tabId = $(this).data("tab");

  $(".tab-menu li").removeClass("active");
  $(this).addClass("active");

  $(".tab-content .tab-pane").removeClass("active");
  $("#" + tabId).addClass("active");
});
