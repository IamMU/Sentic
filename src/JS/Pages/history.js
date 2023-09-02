let updateHistoryInterval = null;
let history = main.getHistory();

let quotesContainer = document.querySelector(".quotes-container");

function updateHistory() {
    history = main.getHistory();

    if (updateHistoryInterval == null)
    {
        updateHistoryInterval = setInterval(() => {
            updateHistory();
        }, 1000);
        intervals.add(updateHistoryInterval);

        addFiles();
    }
}

function addFiles() {
    history.forEach(data => {
        let filePath = data[0];
        let fileName = data[1];
        let fileExtension = data[2];

        let quote = createQuoteElement(fileName, fileExtension, filePath);

        quotesContainer.appendChild(quote);
    });
}

function createQuoteElement(fileName, fileExtension, imageSource) {
    let quote = document.createElement("div");
    quote.classList.add("quote");

    let image = document.createElement("img");
    image.setAttribute("src", imageSource);
    image.classList.add("quote-image");
    image.onclick = imageClicked;

    quote.appendChild(image);

    let quoteFilesContainer = document.createElement("div");
    quoteFilesContainer.classList.add("quote-file-name-container");

    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "fileName" + fileName);
    input.setAttribute("placeholder", "File Name");
    input.setAttribute("fileExtension", fileExtension);
    input.value = fileName;
    input.onchange = fileNameChanged;
    input.classList.add("file-name-input");

    quoteFilesContainer.appendChild(input);

    quote.appendChild(quoteFilesContainer);

    return quote;
}

function fileNameChanged(event) {
    let target = event.target;
    let fileName = `${target.getAttribute("id").replace("fileName", "")}.${event.target.getAttribute("fileextension")}`;
    let filePath = main.getQuotesPath();

    let newFileName = `${target.value}.${event.target.getAttribute("fileextension")}`;

    main.renameFile(`${filePath}${fileName}`, `${filePath}${newFileName}`);

    event.target.setAttribute("id", "fileName" + newFileName.split(".")[0]);
    target.parentNode.parentNode.querySelector("img").setAttribute("src", `${filePath}${newFileName}`);

    updateHistory();
}
function imageClicked(event) {
    main.openImage(event.target.getAttribute("src"));
}

function resetHistory() {
    if (updateHistoryInterval != null) {
        console.log("Clearing history interval!");
        clearInterval(updateHistoryInterval);
        updateHistoryInterval = null;
    }
}