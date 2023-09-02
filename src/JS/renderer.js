
console.log("Renderer loaded!")

const quitButton = document.getElementsByClassName('exit-button')[0];

quitButton.addEventListener('click', () => {
    window.close();
});