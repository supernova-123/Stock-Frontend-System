// 向后端请求用户注册
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    if (password !== confirmPassword) {
      alert("前后输入的密码不一致，请检查您的密码");
      return;
    }
    // 构建请求url
    var url =
      "http://127.0.0.1:12345/regist?username=" +
      encodeURIComponent(username) +
      "&pwd=" +
      encodeURIComponent(password);
    console.log(url);
    // 发起http请求
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // 处理返回的结果
        if (data === true) {
          alert("注册成功！");
          window.location.href = "../html/login.html";
        } else {
          alert("注册失败");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("注册期间出现了错误。");
      });
  });
