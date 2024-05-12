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
  // TODO: 根据code找到对应的name，写到html中
  document.title = "交易 - " + params.name; // 修改标题
  document.getElementById("code").value = params.code;
  // document.getElementById("code").disabled = true;
  // 查询code对应的股票
}

codeInput = document.getElementById("code");
nameOutput = document.getElementById("name-output");
nameOutput.textContent = typeof stockDict[codeInput.value] != "undefined" ? "搜索到股票名称：" + stockDict[codeInput.value] : "";
codeInput.addEventListener("input", function(event){
  nameOutput.textContent = typeof stockDict[codeInput.value] != "undefined" ? "搜索到股票名称：" + stockDict[codeInput.value] : "";
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
        switch(data){
          case 0:
            alert("交易出现了错误，请检查用户或股票是否存在");
            break;
          case 1:
            alert("委托成功，相关信息请在交易记录查看");
            break;
          case 2:
            alert("交易成功，相关信息请在交易记录及持仓列表查看");
            break;
          case 3:
            alert("提交了废单");
            break;
          case 4:
            alert("账户余额不足");
            break;
          case 5:
            alert("持仓余额不足");
            break;
        }
        window.location.href = document.referrer;
      })
      .catch((error) => {
        console.error(error);
        alert("交易期间出现了错误。");
      });
  });
