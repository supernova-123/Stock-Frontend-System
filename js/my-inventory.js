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

// 根据查询参数得到用户名
const queryUrl = window.location.href;
const queryString = queryUrl.substring(queryUrl.indexOf("?") + 1);
const params = {};

queryString.split("&").forEach((param) => {
  const [key, value] = param.split("=");
  params[key] = decodeURIComponent(value);
});

var username = params.username;
if (sessionStorage.getItem("username") != username) {
  alert("无法查看该用户的持仓");
  window.location.href = document.referrer; // 返回先前的页面
}

var inventory_url =
  "http://127.0.0.1:12345/getInventory?username=" +
  encodeURIComponent(username);
var inventory;

var countDown = 5;
document.getElementById("count-down").textContent = "数据刷新倒计时: " + countDown + " 秒";;
countDown--;
fetch(inventory_url)
  .then((response) => response.json())
  .then((data) => {
    inventory = data;
    initInventoryDatatable(data); // 初始化持仓表格
    updateInventoryDatatable(data); // 后续更新持仓
    setInterval(() => {
      document.getElementById("count-down").textContent = "数据刷新倒计时: " + countDown + " 秒";;
      countDown--;
      if(countDown === 0){
        countDown = 5;
      }
    }, 1000);
    setInterval(() => updateInventoryDatatable(data), 5000);
  })
  .catch((error) => {
    console.error("获取持仓时发生错误：", error);
  });

function initInventoryDatatable(data){
  data.forEach(element => {
    element["Name"] = stockDict[element["Code"]]
    element["Total_Cost"] = element["Total_Cost"].toFixed(2);
    element["AVG_Cost"] = element["AVG_Cost"].toFixed(2);    
    element["Price"] = "-";
    element["Profit_Loss"] = "-";
  });
  $(document).ready(function() {
    $("#inventory-table").DataTable({
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
        "sEmptyTable": "暂无持仓记录",
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
        { title: '股票代码', data: 'Code' },
        { title: '股票名称', data: 'Name' },
        { title: '持仓数量', data: 'Amount' },
        { title: '总成本', data: 'Total_Cost' },
        { title: '持仓平均成本', data: 'AVG_Cost' },
        { title: '实时价格', data: 'Price' },
        { title: '盈亏', data: 'Profit_Loss' }
      ]
    })
  })
}

// 定时获取最新价格
function updateInventoryDatatable(inventoryData){
  // 通过获取大盘价格来得到每支股票的最新价格
  const url = "http://127.0.0.1:12345/getMarketPrice";
  fetch(url)
    .then(response => response.json())
    .then(data => {
      var table = $(`#inventory-table`).DataTable();
      // 更新datatable
      for(var i = 0;i < inventoryData.length;i++){
        for(var j = 0;j < data.length;j++){
          if(inventoryData[i].Code === data[j].Code){
            table.cell(i, 5).data(data[j].Price).draw();
            table.cell(i, 6).data((data[j].Price-inventoryData[i].AVG_Cost).toFixed(2)).draw();
          }
        }
      }
    })
    .catch(error => {
      console.error("获取实时价格时发生了错误");
    })
}