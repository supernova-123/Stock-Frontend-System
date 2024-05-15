// 向后端请求用户注册
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    if (password !== confirmPassword) {
      document.getElementById("error").textContent = "前后输入的密码不一致，请检查您的密码";
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
          window.location.href = "../html/operation-success.html?type=register";
        } else {
          document.getElementById("error").textContent = "注册失败，用户已存在或出现其他错误";
        }
      })
      .catch((error) => {
        console.error(error);
        document.getElementById("error").textContent = "注册期间出现了错误，请稍候重试";
      });
  });
