// 获取个人信息，包括用户名、余额、持仓和交易记录
window.addEventListener("load", function () {
  // 获取用户名
  var username = sessionStorage.getItem("username");
  document.getElementById("username").textContent = username;

  // 获取余额
  var balance_url =
    "http://127.0.0.1:12345/getBalance?username=" +
    encodeURIComponent(username);
  var balance = -1;
  fetch(balance_url)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      balance = data;
      document.getElementById("balance").textContent = balance;
    })
    .catch((error) => {
      console.error("获取余额时发生错误：", error);
    });

  // 设置跳转链接，获取持仓
  document.getElementById("inventory").href = "../html/my-inventory.html?username=" + encodeURIComponent(username);

  // 设置跳转链接，获取交易记录
  document.getElementById("trade-record").href = "../html/my-trade-record.html?username=" + encodeURIComponent(username);
});
