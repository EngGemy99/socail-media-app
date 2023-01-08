let reg = /\d+/gi;
let id = location.search.match(reg).join("");

function getPost(id) {
  let postArea = document.querySelector(".postArea");
  let userId = JSON.parse(localStorage.getItem("user"));

  axios
    .get(`${baseUrl}/posts/${id}`)
    .then((response) => {
      let {
        image,
        body,
        title,
        comments_count,
        comments,
        author: { profile_image, username },
      } = response.data.data;
      let profileImage = document.getElementById("profileImage");
      profileImage.src = profile_image;
      let userName = document.getElementById("userName");
      userName.innerHTML = username;
      let imagePost = document.getElementById("image");
      imagePost.src = image;
      let titlePost = document.getElementById("title");
      titlePost.innerHTML = title;
      let bodyPost = document.getElementById("body");
      bodyPost.innerHTML = body;
      let commentsCount = document.getElementById("commentsCount");
      commentsCount.innerHTML = `(${comments_count})`;
      commentsContainer.innerHTML = "";
      if (comments.length > 0) {
        for (const comment of comments) {
          let {
            body,
            author: { username, profile_image },
          } = comment;
          commentsContainer.innerHTML += `
            <div class="p-4 bg-white dark:bg-slate-800">
            <div class="flex items-center">  
            <img
                src="${profile_image}"
                style="width: 40px; height: 40px"
                class="rounded-full"
                alt=""
              />
              <p class="ml-3 text-black dark:text-white">${username}</p>
            </div>
            
              <p class="p-3  text-black dark:text-white">${body}</p>
            </div>
            <hr />
        `;
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
getPost(id);

function handelAddComment() {
  let token = localStorage.getItem("token");
  axios
    .post(
      `${baseUrl}/posts/${id}/comments`,
      {
        body: commentValue.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      iziToast.success({
        timeout: 2000,
        message: "comment Added Successfully",
      });
      getPost(id);
      commentValue.value = "";
    })
    .catch((error) => {
      iziToast.warning({
        timeout: 2000,
        message: error.response.data.message,
      });
    });
}

setUpUI();
