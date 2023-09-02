let widthSettingInput = document.querySelector("#widthSettingInput");
let heightSettingInput = document.querySelector("#heightSettingInput");

let textFontSizeInput = document.querySelector("#textSizeSettingInput");
let textColorSizeInput = document.querySelector("#textColorSettingInput");

let authorEnabledInput = document.querySelector("#authorEnabledSetting");
let authorQuoteOffsetInput = document.querySelector(
  "#authorQuoteOffsetSetting"
);

let authorFontInput = document.querySelector("#authorFontSetting");
let quoteFontInput = document.querySelector("#quoteFontSetting");

widthSettingInput.value = config["settings"]["wallpaper-size"]["width"];
heightSettingInput.value = config["settings"]["wallpaper-size"]["height"];

textFontSizeInput.value = config["settings"]["text"]["size"];
textColorSizeInput.value = config["settings"]["text"]["color"];
textColorSizeInput.style.color = `#${config["settings"]["text"]["color"]}`;

authorEnabledInput.value = config["settings"]["display-author"];
authorQuoteOffsetInput.value = config["settings"]["author-quote-offset"];

authorFontInput.value = config["settings"]["author-font"];
quoteFontInput.value = config["settings"]["quote-font"];

function updateSettings() {
  config = main.getConfig();

  widthSettingInput.value = config["settings"]["wallpaper-size"]["width"];
  heightSettingInput.value = config["settings"]["wallpaper-size"]["height"];

  textFontSizeInput.value = config["settings"]["text"]["size"];
  textColorSizeInput.value = config["settings"]["text"]["color"];
  textColorSizeInput.style.color = `#${config["settings"]["text"]["color"]}`;

  authorEnabledInput.value = config["settings"]["display-author"];
  authorQuoteOffsetInput.value = config["settings"]["author-quote-offset"];

  authorFontInput.value = config["settings"]["author-font"];
  quoteFontInput.value = config["settings"]["quote-font"];
}

function changeWidth(width, input) {
  if (width.toLowerCase() === "screen" || width.replace(/\s+/g, "") === "") {
    main.updateJsonValue("settings.wallpaper-size.width", "screen");

    updateSettings();
  } else {
    try {
      if (!isNumeric(width)) throw new Error("Not a valid width!");

      main.updateJsonValue("settings.wallpaper-size.width", width);
      updateSettings();
    } catch (err) {
      input.value = config["settings"]["wallpaper-size"]["width"];
      console.error(err);
    }
  }
}
function changeHeight(height, input) {
  if (height.toLowerCase() === "screen" || height.replace(/\s+/g, "") === "") {
    main.updateJsonValue("settings.wallpaper-size.height", "screen");

    updateSettings();
  } else {
    try {
      if (!isNumeric(height)) throw new Error("Not a valid height!");

      main.updateJsonValue("settings.wallpaper-size.height", height);
      updateSettings();
    } catch (err) {
      input.value = config["settings"]["wallpaper-size"]["height"];
      console.error(err);
    }
  }
}

function changeQuoteFontSize(size, input) {
  try {
    if (!isNumeric(size)) throw new Error("Not a valid font size!");

    main.updateJsonValue("settings.text.size", size);

    updateSettings();
  } catch (err) {
    input.value = config["settings"]["text"]["size"];
    console.error(err);
  }
}

function changeQuoteFontColor(color, input) {
  let minimumLength = color.includes("#") ? 7 : 6;
  let maximumLength = color.includes("#") ? 9 : 8;

  if (
    !(
      (color.length >= minimumLength && color.length <= maximumLength
        ? color.length == maximumLength
        : false) || color.length == minimumLength
    )
  ) {
    input.value = config["settings"]["text"]["color"];

    throw new Error("Invalid color code!");
  } else {
    main.updateJsonValue("settings.text.color", color.replace("#", ""));

    updateSettings();
  }
}

function changeAuthorQuoteOffset(offset, input) {
  try {
    if (!isNumeric(offset)) throw new Error("Not a valid offset!");

    main.updateJsonValue("settings.author-quote-offset", offset);

    updateSettings();
  } catch (err) {
    input.value = config["settings"]["author-quote-offset"];
    console.error(err);
  }
}
function changeAuthorEnabled(bool, input) {
  try {
    if (!isBool(bool)) throw new Error("Not a valid value!");

    let val = bool.toLowerCase() === "true";

    main.updateJsonValue("settings.display-author", val);

    updateSettings();
  } catch (err) {
    input.value = config["settings"]["display-author"];
    console.error(err);
  }
}

function changeAuthorFont(font, input) {
  main.updateJsonValue("settings.author-font", font);

  updateSettings();
}
function changeQuoteFont(font, input) {
  main.updateJsonValue("settings.quote-font", font);

  updateSettings();
}

function isNumeric(str) {
  return /^\d+(\.\d+)?$/.test(str);
}
function isBool(str) {
  return str.toLowerCase() === "true" || str.toLowerCase() === "false";
}

function updateWallpaper() {
  // TODO: Update wallpaper
}
