// Variables
let config = main.getConfig();

let lastChangeTime = new Date(config['time-data']['last-change']);
let frequency = parseInt(config['time-data']['change-frequency']);

let timeRemainingGraph = document.querySelector(".circular-progress-bar");
let frequencyText = document.querySelector(".time-data-holder > .frequency");
let currentQuoteText = document.querySelector(".current-quote");
let currentAuthorText = document.querySelector(".current-author");

let updateOverviewInterval = null;

// Functions
function updateOverview() {
    config = main.getConfig();
    lastChangeTime = new Date(config['time-data']['last-change']);
    frequency = parseInt(config['time-data']['change-frequency']);

    setGraphText();
    setFrequencyText();
    setQuoteText();

    if (updateOverviewInterval == null)
    {
        updateOverviewInterval = setInterval(() => {
            updateOverview();

            timeRemainingGraph.setProgress(getTimeElapasedPercentage() * 100);
            console.log(getTimeElapasedPercentage());
        }, 1000);
        intervals.add(updateOverviewInterval);
    }
}

function redrawGraph() {
    if (updateOverviewInterval != null) {
        console.log("Clearing update interval!");
        clearInterval(updateOverviewInterval);
        updateOverviewInterval = null;
    }

    timeRemainingGraph.setProgress(0);
    setTimeout(() => {
        timeRemainingGraph.setProgress(getTimeElapasedPercentage());
    }, 50);
}

function setGraphText() {
    if (getRemainingHours() >= 1) {
        timeRemainingGraph.setText(getRemainingHours() > 1 ? generateTimeText(getRemainingHours(), "hours") : generateTimeText(getRemainingHours(), "hour"));
    } else if (getRemainingMinutes() >= 1) {
        timeRemainingGraph.setText(getRemainingMinutes() > 1 ? generateTimeText(getRemainingMinutes(), "minutes") : generateTimeText(getRemainingMinutes(), "minute"));
    } else if (getRemainingSeconds() >= 1) {
        timeRemainingGraph.setText(getRemainingSeconds() > 1 ? generateTimeText(getRemainingSeconds(), "seconds") : generateTimeText(getRemainingSeconds(), "second"));
    }
}

function setFrequencyText() {
    frequencyText.innerText = "Changing every " + getFrequency(frequency);
}
function getFrequency(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    let formattedTime = "";
    
    if (hours > 0) {
        formattedTime += `${hours} hour${hours > 1 ? "s" : ""} `;
    }
    
    if (minutes > 0) {
        formattedTime += `${minutes} minute${minutes > 1 ? "s" : ""} `;
    }
    
    if (remainingSeconds > 0) {
        formattedTime += `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`;
    }
    
    return formattedTime.trim();
}

function setQuoteText() {
    currentQuoteText.textContent = `"${config["quote-data"]["quote"]}"`;
    currentAuthorText.textContent = `- ${config["quote-data"]["author"]}`;
}

function getRemainingTime() {
    let updateTimeMilliseconds = (lastChangeTime.getTime() + frequency * 1000);
    let updateTime = new Date(updateTimeMilliseconds);
    let currentTime = Date.now();

    let difference = updateTime - currentTime;

    return difference;
}
function getRemainingSeconds() {
    return Math.floor(getRemainingTime() / 1000);
}
function getRemainingMinutes() {
    return Math.floor(getRemainingSeconds() / 60);
}
function getRemainingHours() {
    return Math.floor(getRemainingMinutes() / 60);
}
function getTimeElapasedPercentage() {
    let updateTimeMilliseconds = (lastChangeTime.getTime() + frequency * 1000);
    let updateTime = new Date(updateTimeMilliseconds);
    let remainingTime = getRemainingTime();

    return (1 - (remainingTime/(updateTime - lastChangeTime)));
}

function generateTimeText(time, unit) {
    return "Next Quote in \n" + time + "\n" + unit;
}

redrawGraph();
updateOverview();