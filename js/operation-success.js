// 获取查询参数的键值对
const queryUrl = window.location.href;
const queryString = queryUrl.substring(queryUrl.indexOf("?") + 1);
const params = {};

queryString.split("&").forEach((param) => {
  const [key, value] = param.split("=");
  params[key] = decodeURIComponent(value);
});

let url = "../html/index.html";
// 根据查询参数获取是何种操作成功
switch(params.type){
  case "loggin":
    document.querySelector("h1").textContent = "登录成功";
    document.querySelector("p").textContent = "您已成功登录，即将回到主界面";
    break;
  case "logout":
    document.querySelector("h1").textContent = "退出成功";
    document.querySelector("p").textContent = "您已成功退出登录，即将回到主界面";
    break;
  case "trade":
    document.querySelector("h1").textContent = "交易成功";
    document.querySelector("p").textContent = "您已成功进行交易，请查看持仓记录进行确认，即将回到主界面";
    break;
  case "delegate":
    document.querySelector("h1").textContent = "委托成功";
    document.querySelector("p").textContent = "您已成功进行委托，请查看交易记录进行确认，即将回到主界面";
    break;
  case "register":
    document.querySelector("h1").textContent = "注册成功";
    document.querySelector("p").textContent = "您已成功注册，即将回到登录页面";
    document.querySelector("button").textContent = "返回登录页面";
    url = "../html/login.html";
    break;
}
document.getElementById("home-button").addEventListener("click", function() {
  window.location.href = url;
});

setTimeout(function() {
  window.location.href = url;
}, 5000);