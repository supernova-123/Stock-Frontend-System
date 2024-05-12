// 判断用户是否登录
var hasLoggIn = sessionStorage.getItem("loggedIn");
if (hasLoggIn !== "true") {
  alert("您尚未登录，请登录后再进行操作");
  window.location.href = "../html/login.html";
}
