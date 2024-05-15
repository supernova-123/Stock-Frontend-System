// url: trade.html?code=xxx&name=yyy
var username = sessionStorage.getItem("username");

// 获取查询参数的键值对
const queryUrl = window.location.href;
const queryString = queryUrl.substring(queryUrl.indexOf("?") + 1);
const params = {};

queryString.split("&").forEach((param) => {
  const [key, value] = param.split("=");
  params[key] = decodeURIComponent(value);
});

// 判断查询参数是否包含股票名和代码
if (typeof params.code == "undefined") {
  document.title = "交易";
} else {
  document.title = "交易 - " + params.name; // 修改标题
  document.getElementById("code").value = params.code;
}

codeInput = document.getElementById("code");
nameOutput = document.getElementById("name-output");
if (typeof params.code != "undefined") {
  nameOutput.textContent = "搜索到股票名称：" + stockDict[codeInput.value];
  getStockPrice();
  setInterval(getStockPrice, 5000);
}
else {
  nameOutput.textContent = "";
}
codeInput.addEventListener("input", function (event) {
  if (typeof stockDict[codeInput.value] != "undefined") {
    nameOutput.textContent = "搜索到股票名称：" + stockDict[codeInput.value];
    // 请求实时的股票数据
    getStockPrice();
    setInterval(getStockPrice, 5000);
  }
  else {
    nameOutput.textContent = "";
    document.getElementById("stock-price").textContent = "";
  }
});

document
  .getElementById("tradeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let code = document.getElementById("code").value;
    let direction =
      document.getElementById("transaction").value === "buy" ? "0" : "1";
    let price = document.getElementById("price").value;
    let amount = document.getElementById("amount").value;

    let url =
      "http://127.0.0.1:12345/trade?username=" +
      encodeURIComponent(username) +
      "&code=" +
      encodeURIComponent(code) +
      "&direction=" +
      encodeURIComponent(direction) +
      "&price=" +
      encodeURIComponent(price) +
      "&amount=" +
      encodeURIComponent(amount);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // 处理返回的结果
        console.log(data);
        // 错误 = 0, 委托成功 = 1, 交易成功 = 2, 废单 = 3, 账户余额不足 = 4, 持仓数量不足 = 5
        switch (data) {
          case 0:
            document.getElementById("error").textContent = "交易出现了错误，请检查用户或股票是否存在";
            break;
          case 1:
            window.location.href = "../html/operation-success.html?type=delegate";
            break;
          case 2:
            window.location.href = "../html/operation-success.html?type=trade";
            break;
          case 3:
            document.getElementById("error").textContent = "提交了废单";
            break;
          case 4:
            document.getElementById("error").textContent = "账户余额不足";
            break;
          case 5:
            document.getElementById("error").textContent = "持仓余额不足";
            break;
        }
        // window.location.href = document.referrer;
      })
      .catch((error) => {
        console.error(error);
        alert("交易期间出现了错误。");
      });
  });

function getStockPrice() {
  const url = "http://127.0.0.1:12345/getStockPrice?code=" + encodeURIComponent(codeInput.value);
  fetch(url)
    .then(response => response.json())
    .then(data => {
      document.getElementById("stock-price").textContent = "当前股票价格: " + data[data.length - 1];
    })
    .catch(error => {
      console.error("获取股票价格时错误", error);
    })
}