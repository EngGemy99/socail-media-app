// main structure for post template

// display data
let currentPage = 1;
let lastPage = 1;

function disPlayData(reload = true, currentPage = 1) {
  axios.get(`${baseUrl}/posts?limit=5&page=${currentPage}`).then((response) => {
    lastPage = response.data.meta.last_page;
    let posts = document.querySelector(".posts");
    if (reload) {
      posts.innerHTML = "";
    }
    let userId = JSON.parse(localStorage.getItem("user"));
    for (const card of response.data.data) {
      posts.innerHTML += `
        <div class="post mb-3 border border-blue-300 shadow-md rounded-md">
            <div class="header border-b p-4 flex items-center">
                <div class="user-data flex items-center cursor-pointer mr-auto"
                onclick="openProfilePage(${card.author.id})"
                >
                <img src=${
                  !Object.keys(card.author.profile_image).length
                    ? "../images/avtar.jpg"
                    : card.author.profile_image
                } class="ring-2 w-6 h-6 rounded-full" />
                <p class="ml-3 text-black dark:text-white xs:hidden">${
                  card.author.username
                }</p>
                </div>
                  ${
                    userId && userId.id == card.author.id
                      ? `
                      <div class="options flex">
                        <svg
                          data-bs-toggle="modal"
                          data-bs-target="#addPostModal"
                         onclick="handelEditPostUI(
                              ${card.id}
                            ,'${card.title || ""}'
                            , '${card.body}'
                            ,'${card.image}'
                            )"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-5 h-5 text-cyan-600 cursor-pointer"
                        >
                            <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                        </svg>
                        <svg
                         onclick="handelPostDelete(${card.id})"

                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-5 h-5 text-red-700 cursor-pointer"
                        >
                            <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                        </svg>      
                      </div>
                      
                      `
                      : ""
                  }
              
            </div>
            <div class="body p-4 bg-white dark:bg-slate-800 cursor-pointer" 
            onclick="goToDetails(${card.id})">
                <img src=${
                  !Object.keys(card.image).length
                    ? "../images/bg.png"
                    : card.image
                } class="rounded-md w-full" />
                <p class="text-gray-400 text-sm">${card.created_at}</p>
                <h3 class="title mb-4 text-cyan-600">${card.title || ""}</h3>
                <p class="text-gray-500 border-b break-all border-gray-400 pb-2">
                    ${card.body}
                </p>
                <div class="comments mt-2">
                <p class="text-gray-400">(${card.comments_count}) comments</p>
                </div>
            </div>
        </div>
    `;
    }
  });
}
disPlayData();
//end display data

// displayData when scroll//
window.addEventListener("scroll", () => {
  let endOfPage =
    window.pageYOffset + window.innerHeight >= document.body.scrollHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage += 1;
    disPlayData(false, currentPage);
  }
});
