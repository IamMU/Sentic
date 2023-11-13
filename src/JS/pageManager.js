const pages = document.getElementsByClassName("page");
let intervals = new Set();

function changePage(button) {
  let pageName = button.innerHTML.toLowerCase();

  previousPage = pageName;

  disableAllPages();

  let page = document.getElementsByClassName(pageName)[0];
  page.classList.remove("disabled");

  intervals.forEach((interval) => {
    clearInterval(interval);
  });

  console.log("Changing to " + pageName);
}

function disableAllPages() {
  Array.from(pages).forEach((element) => {
    if (!element.classList.contains("disabled")) {
      element.classList.add("disabled");
    }
  });
}

// TODO: Make
function checkUpdateWallpaper() {}
