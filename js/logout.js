function doLoggout() {
  if (sessionStorage.getItem("loggedIn") !== "true") {
    alert("您尚未登录，请登录后再试");
    window.location.href = "../html/login.html";
  }

  var username = sessionStorage.getItem("username");
  var url =
    "http://127.0.0.1:12345/logout?username=" + encodeURIComponent(username);
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data === true) {
        sessionStorage.setItem("loggedIn", false);
        sessionStorage.setItem("username", false);
        window.location.href = "../html/operation-success.html?type=logout";
      } else {
        alert("退出登录失败");
        window.location.href = "../html/index.html";
      }
    })
    .catch((error) => {
      console.error(error);
      alert("退出登录时出现了错误");
    });
}
// window.addEventListener("load", doLoggout);
doLoggout();