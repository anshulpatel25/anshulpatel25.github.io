// https://ruddra.com/add-search-functionality-hugo/

let url = "/index.json";
let posts = {};

function getIndexData(url, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      const status = xhr.status;
      if (status === 0 || (status >= 200 && status < 400)) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.log("ERROR: Error fetching data ....");
        callback({});
      }
    }
  };
  xhr.send();
}

function updatePosts(payload) {
  posts = payload;
}

getIndexData(url, updatePosts);

function buildIndex(posts) {
  return lunr(function () {
    this.ref("title");
    this.field("content");
    posts.forEach(function (doc) {
      this.add(doc);
    }, this);
  });
}

function showSearchResults() {
  let rawQuery = document.getElementById("search-input").value || "";
  let searchQuery = rawQuery.replace(/[^\w\s]/gi, "");
  let postsByTitle = posts.reduce((acc, curr) => {
    acc[curr.title] = curr;
    return acc;
  }, {});

  let index = buildIndex(posts);

  let listRelevantPost = document.getElementById("list");

  if (searchQuery && searchQuery != "") {
    let searchResults = index.search(searchQuery);
    let relevantPosts = [];
    searchResults.forEach((post) => {
      relevantPosts.push(postsByTitle[post.ref]);
    });

    if (relevantPosts.length > 0) {
      listRelevantPost.innerHTML = relevantPosts
        .map(function (post) {
          if (post != undefined) {
            return `<li><a href="${post.uri}">${post.title}</a></li>`;
            console.log(post);
          }
        })
        .join("");
    } else {
      listRelevantPost.innerHTML = `<br><h2 style="text-align:center">No search results found</h2>`;
    }
  } else {
    listRelevantPost.innerHTML = "";
  }
}
