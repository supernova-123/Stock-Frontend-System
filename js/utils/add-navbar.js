let nav = document.getElementsByClassName("top-navigator")[0];
nav.innerHTML =
  `<link rel="stylesheet" href="../css/navigator.css" />
    <ul>
      <li id="index" style="display: block">
        <a href="../html/index.html">主页</a>
      </li>
      <li id="loggout" style="display: none">
        <a href="../html/logout.html">退出登录</a>
      </li>
      <li id="loggin" style="display: none">
        <a href="../html/login.html">登录/注册</a>
      </li>
      <li id="trade" style="display: block">
        <a href="../html/trade.html">交易</a>
      </li>
      <li id="user-info" style="display: none">
        <a href="../html/user-info.html">我的</a>
      </li>
      <li id="count-down""></li>
    </ul>`;
initNavbar();

function initNavbar() {
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
}