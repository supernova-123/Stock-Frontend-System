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
  alert("无法查看该用户的交易记录");
  window.location.href = document.referrer; // 返回先前的页面
}

var trade_record_url =
  "http://127.0.0.1:12345/getTradeRecord?username=" +
  encodeURIComponent(username);
var trade_record;

fetch(trade_record_url)
  .then((response) => response.json())
  .then((data) => {
    trade_record = data;
    console.log(data);
    setTradeRecordDatatable(data);
  })
  .catch((error) => {
    console.error("获取持仓时发生错误：", error);
  });

function setTradeRecordDatatable(data){
  data.forEach(element => {
    element["Name"] = stockDict[element["Code"]];
    element["Direction"] = element["Direction"] === 0 ? "买入" : "卖出";
    element["KnockPrice"] = element["KnockPrice"].toFixed(2);
    switch(element["State"]){
      case 0:
        element["State"] = "其他错误";
        break;
      case 1:
        element["State"] = "委托成功";
        break;
      case 2:
        element["State"] = "交易成功";
        break;
      case 3:
        element["State"] = "废单";
        break;
      case 4:
        element["State"] = "账户余额不足";
        break;
      case 5:
        element["State"] = "持仓余额不足";
        break;
      default:
        element["State"] = "未知错误";
        console.error("交易记录出现未知错误");
    }
  });
  $(document).ready(function() {
    $("#trade-record-table").DataTable({
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
        "sEmptyTable": "暂无交易记录",
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
        { title: '交易方向', data: 'Direction' },
        { title: '挂单价格(元/股)', data: 'Price' },
        { title: '成交价格(元/股)', data: 'KnockPrice' },
        { title: '数量(股)', data: 'Amount' },
        { title: '状态', data: 'State' },
        { title: '时间', data: 'TradeTime' },
        { title: '单号', data: 'No' },
      ],
      order: [[7, 'desc']],
    })
  })
}