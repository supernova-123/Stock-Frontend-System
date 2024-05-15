// 检查用户是否登录
function checkLogin() {
  // 向后端发送异步请求或检查会话信息
  var isLoggedIn = sessionStorage.getItem("loggedIn");

  if (isLoggedIn === "true") {
    // 如果已经登录，则路由到主页
    alert("您已经登录网站，如需重新登录，请先退出本账号");
    window.location.href = "../html/index.html";
  }
}

window.addEventListener("load", checkLogin);

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var url =
      "http://127.0.0.1:12345/login?username=" +
      encodeURIComponent(username) +
      "&pwd=" +
      encodeURIComponent(password);
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // 处理返回的结果
        if (data === true) {
          sessionStorage.setItem("loggedIn", true);
          sessionStorage.setItem("username", username);
          window.location.href = "../html/operation-success.html?type=loggin";
        } else {
          document.getElementById("error").textContent = "登录失败，请检查所输入用户名和密码";
        }
      })
      .catch((error) => {
        console.error(error);
        document.getElementById("error").textContent = "登录期间出现了错误，请稍后重试";
      });
  });
