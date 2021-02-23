const searchBtn = document.querySelector("#searchBtn");
const message = document.querySelector(".message");
const main = document.querySelector("#app");
let total;
let items;

const lookup = function() {
  const searchQuery = document.querySelector("#search").value;
  let startIndex = 0;
  main.innerHTML = "";
  loading();

  const noImage = "https://www.wildhareboca.com/wp-content/uploads/sites/310/2018/03/image-not-available.jpg";
  const noAuthor = "No author available";
  const noPublish = "No publisher available";

  if (searchQuery === "") {
    message.innerHTML = "";
    message.innerHTML += `<span class="alertMessage red">Your search can not be empty.</span>`;
  } else {
    render();

    function render() {
      let URL = `https://www.googleapis.com/books/v1/volumes?q=" + ${searchQuery} + "&startIndex=${startIndex}&maxResults=10`;

      fetch(URL)
      .then((res) => (res.json()))
      .then((data) => {
        if (data.totalItems === 0) {
          message.innerHTML = `<span class="alertMessage">Found <span class="red">0</span> results for '<span class="red">${searchQuery}</span>'.<br>Try another search.</span>`;
        } else {
          message.innerHTML = "";

          const apiData = data;
          total = apiData.totalItems
          items = apiData.items;

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
          });

          renderPagination(total, startIndex)
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  function renderPagination(total, startIndex) {
    const pagination = document.querySelector('.pagination');
    if (startIndex === 0 && startIndex < 11 && total < 10 ) {
      pagination.innerHTML += ``;
    } else if (startIndex === 0 && total > 10) {
      pagination.innerHTML = "";
      pagination.innerHTML += `
        <button class="paginate-btns next">></button>
      `;
      let next = document.querySelector('.next');

      next.addEventListener('click', navigationHandler);
    } else if (items.length < 10) {
      pagination.innerHTML = "";
      pagination.innerHTML += `
        <button class="paginate-btns first"><<</button>
        <button class="paginate-btns prev"><</button>
      `;

      let first = document.querySelector('.first');
      let prev = document.querySelector('.prev');

      first.addEventListener('click', navigationHandler);
      prev.addEventListener('click', navigationHandler);
    } else if (startIndex > 0 && total - startIndex > 10) {
      pagination.innerHTML = "";
      pagination.innerHTML += `
        <button class="paginate-btns first"><<</button>
        <button class="paginate-btns prev"><</button>
        <button class="paginate-btns next">></button>
      `;

      let first = document.querySelector('.first');
      let prev = document.querySelector('.prev');
      let next = document.querySelector('.next');

      first.addEventListener('click', navigationHandler);
      prev.addEventListener('click', navigationHandler);
      next.addEventListener('click', navigationHandler);
    }
  }

  function navigationHandler(e) {
    console.log('total pages: ' + total);
    if (e.target.className.indexOf('first') > -1) {
      startIndex = 0;
      console.log(startIndex)
      render();
    }

    if (e.target.className.indexOf('prev') > -1) {
      startIndex = startIndex - 10;
      console.log(startIndex)
      render();
    }

    if (e.target.className.indexOf('next') > -1) {
      startIndex = startIndex + 10;
      render();
    }
  }

  function loading() {
    if (message.innerHTML === "") {
      message.innerHTML = `<span class="alertMessage">Searching...</span>`;
    } else if (main.innerHTML !== "") {
      message.innerHTML = "";
    }
  }
}

searchBtn.addEventListener("click", lookup);