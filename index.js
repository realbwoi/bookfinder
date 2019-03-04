let searchBtn = document.querySelector("#searchBtn");

let lookup = function() {
  let message = document.querySelector(".message");
  let main = document.querySelector("#app");
  main.innerHTML = "";
  loading();

  function loading() {
    if (message.innerHTML == "") {
      message.innerHTML = `<h4 class="alertMessage">Loading...</h4>`;
    } else if (main.innerHTML != "") {
      message.innerHTML = "";
    }
  }

  let searchQuery = document.querySelector("#search").value;
  let noImage = "https://www.wildhareboca.com/wp-content/uploads/sites/310/2018/03/image-not-available.jpg";
  let noAuthor = `No author available`;
  let noPublish = `No publisher available`;

  if (searchQuery === "") {
    message.innerHTML = "";
    message.innerHTML += `<h4 class="alertMessage"><i>Your search was empty.<br>Please enter a search query.</i></h4>`;
  } else {
    let URL = "https://www.googleapis.com/books/v1/volumes?q=" + searchQuery + "&maxResults=20";

    fetch(URL)
      .then((res) => (res.json()))
      .then((data) => {
        if (data.totalItems === 0) {
          message.innerHTML = `<h4 class="alertMessage">Found <span class="red">0</span> results for '<span class="red">${searchQuery}</span>'.<br>Try another search.</h4>`;
        } else {
          message.innerHTML = "";
          let apiData = data;
          console.log(data);
          main.innerHTML = "";

          apiData.items.map((book) => {
            main.innerHTML +=
              `<div class="book-item">
                <div class="book-img-wrapper">
                  <img class="book-img" src="${book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : noImage}" alt="${book.volumeInfo.title}">
                </div>
                <div class="book-info">
                  <h3 class="book-title">${book.volumeInfo.title}</h3>
                  <p class="book-author">${book.volumeInfo.authors ? book.volumeInfo.authors : noAuthor}</p>
                  <p class="book-publish">Published by: ${book.volumeInfo.publisher ? book.volumeInfo.publisher : noPublish}</p>
                  <a href="${book.volumeInfo.infoLink}" target=”_blank”><button class="book-link">See This Book</button></a>
                </div>
              </div>`;
          })

        }
      })
      .catch(error => {
        console.log(error);
      })
  }
}

searchBtn.addEventListener("click", lookup);