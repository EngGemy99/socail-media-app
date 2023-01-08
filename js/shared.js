let baseUrl = "https://tarmeezacademy.com/api/v1";
// get theme value from local storage and add it to html tag
if (localStorage.getItem("theme")) {
  let html = document.documentElement;
  html.classList.toggle(localStorage.getItem("theme"));
}
// to control in menu list
let menu = document.querySelector(".menu");
let menuList = document.querySelector("#menuList");
menu.addEventListener("click", (e) => {
  e.stopPropagation();
  menuList.style.transform = "translateX(0)";
});
menuList.addEventListener("click", function (e) {
  e.stopPropagation();
});
// click anywhere outside and toggle button
document.addEventListener("click", (e) => {
  if (e.target !== menu && e.target !== menuList) {
    closeMenu();
  }
});

function closeMenu() {
  menuList.removeAttribute("style");
}

// to control on ui
function setUpUI() {
  let token = localStorage.getItem("token");
  let userInformation = document.querySelectorAll(".user-information");
  let addPostBtn = document.querySelectorAll(".addPostBtn");
  let addPostBtnList = document.querySelector(".addPostBtnList");
  let btns = document.querySelectorAll(".btns");
  if (token) {
    let user = JSON.parse(localStorage.getItem("user"));
    let { username, profile_image } = user;
    let userImages = document.querySelectorAll(".userImage");
    let userNames = document.querySelectorAll(".userName");
    for (const iterator of addPostBtn) {
      iterator.style.position = "fixed";
      iterator.classList.add("sm:block");
    }
    addPostBtnList.style.display = "inline-block";

    for (const iterator of userImages) {
      iterator.src = `${profile_image}`;
    }
    for (const iterator of userNames) {
      iterator.innerHTML = username;
    }
    for (const iterator of userInformation) {
      iterator.classList.add("flex");
      iterator.classList.remove("hidden");
    }
    for (const iterator of btns) {
      iterator.classList.add("hidden");
      iterator.classList.remove("flex");
    }
  } else {
    for (const iterator of addPostBtn) {
      iterator.style.display = "none";
    }
    addPostBtnList.style.display = "none";

    for (const iterator of userInformation) {
      console.log(iterator);
      iterator.classList.remove("flex");
      iterator.classList.add("hidden");
    }
    for (const iterator of btns) {
      console.log(iterator);
      iterator.classList.remove("hidden");
      iterator.classList.add("flex");
    }
  }
}
setUpUI();

function handelBtnLogin() {
  let userName = document.getElementById("userName");
  let password = document.getElementById("password");
  axios
    .post(`${baseUrl}/login`, {
      username: userName.value,
      password: password.value,
    })
    .then((res) => {
      console.log(res.data);
      //   Get Token and store it in local storage
      let { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      loginModalCloseBtn.click();
      setUpUI();
      iziToast.success({
        timeout: 2000,
        message: "Login Successfully",
      });
    })
    .catch((error) => {
      iziToast.warning({
        timeout: 2000,
        message: error.response.data.message,
      });
    });
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  setUpUI();
}

function handelAddPostBtn() {
  let hiddenInput = document.getElementById("hiddenInput").value;
  let postTitle = document.getElementById("post-title-input");
  let postImage = document.getElementById("postImage");
  let postBody = document.getElementById("postBody");
  let token = localStorage.getItem("token");
  let url = `${baseUrl}/posts`;
  let bodyParams = {
    title: postTitle.value,
    body: postBody.value,
    image: postImage.files[0],
  };

  let headers = {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };
  if (hiddenInput != "") {
    url = `${baseUrl}/posts/${hiddenInput}`;
    // this part from Laravel to send put request
    bodyParams["_method"] = "put";
  }
  let addPostBtn = document.getElementById("add-post-btn");
  addPostBtn.classList.add("flex");
  addPostBtn.classList.add("items-center");
  addPostBtn.innerHTML = `
   <div class="spinner-grow inline-block w-5 h-5 bg-current rounded-full opacity-0
    text-white" role="status">
  </div>
   <span>Loading...</span>
  `;
  axios
    .post(url, bodyParams, {
      headers,
    })
    .then((res) => {
      disPlayData();
      addPostModalCloseBtn.click();
      iziToast.success({
        timeout: 2000,
        message: "Post Add Successfully",
      });
    })
    .catch((error) => {
      iziToast.warning({
        timeout: 2000,
        message: error.response.data.message,
      });
      addPostBtn.innerHTML = `add post`;
      postBody.focus();
    });
}

// handel register btn
function handelBtnRegister() {
  let userNameRegister = document.getElementById("userNameRegister");
  let passwordRegister = document.getElementById("passwordRegister");
  let nameRegister = document.getElementById("nameRegister");
  let emailRegister = document.getElementById("emailRegister");
  let profileImage = document.getElementById("profileImage");
  let bodyFormData = new FormData();
  bodyFormData.append("username", userNameRegister.value);
  bodyFormData.append("name", nameRegister.value);
  bodyFormData.append("password", passwordRegister.value);
  bodyFormData.append("email", emailRegister.value);
  bodyFormData.append("image", profileImage.files[0]);
  axios({
    method: "post",
    url: `${baseUrl}/register`,
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((res) => {
      // Get Token and store it in local storage
      let { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      iziToast.success({
        timeout: 2000,
        message: "Register Successfully",
      });
      // when user login change ui for web site
      setUpUI();
      // window.location.reload();
      registerModalCloseBtn.click();
    })
    .catch((error) => {
      iziToast.warning({
        timeout: 2000,
        message: error.response.data.message,
      });
    });
}
// to toggle between mode
function switchMode() {
  let html = document.documentElement;
  html.classList.toggle("dark");
  if (html.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    return;
  }
  localStorage.setItem("theme", "light");
}

function openProfilePage(id) {
  location = `../profile.html?userid=${id}`;
}

// handel edit btn
function handelEditPostUI(id, title, body) {
  document.getElementById("hiddenInput").value = id;
  document.getElementById("model-post-title").innerHTML = "Edit Post";
  document.getElementById("add-post-btn").innerHTML = "Edit Post";
  document.getElementById("post-title-input").value = title;
  document.querySelector("#postBody").value = body;
}

function handelAddPostUI() {
  document.getElementById("hiddenInput").value = "";
  document.getElementById("model-post-title").innerHTML = "add Post";
  document.getElementById("add-post-btn").innerHTML = "add Post";
  document.getElementById("post-title-input").value = "";
  document.querySelector("#postBody").value = "";
}
// to handel delete a post
function handelPostDelete(postId) {
  let token = localStorage.getItem("token");
  axios
    .delete(`${baseUrl}/posts/${postId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      iziToast.success({
        timeout: 2000,
        message: "Post Remove Successfully",
      });
      disPlayData();
    })
    .catch((error) => {
      iziToast.warning({
        timeout: 2000,
        message: error.response.data.error_message,
      });
    });
}

// go to details page
function goToDetails(id) {
  location = `./detalisPage.html?postId=${id}`;
}
