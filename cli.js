const path = require("path");
const i18next = require("i18next");
const middleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");
const { MESSAGE_CODE } = require("./constant/MessageCode");

async function start() {
  await i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
      backend: {
        loadPath: path.join(__dirname, "locales", "{{lng}}", "{{ns}}.json"),
      },
      detection: {
        order: ["header", "querystring"],
        lookupHeader: "accept-language",
      },
      fallbackLng: "pt",
      preload: ["en", "pt", "es"],
    });

  console.log(i18next.t(MESSAGE_CODE.EMAIL_INVALID, { lng: "pt" }));
  console.log(i18next.t(MESSAGE_CODE.EMAIL_INVALID, { lng: "en" }));
  console.log(i18next.t(MESSAGE_CODE.EMAIL_INVALID, { lng: "es" }));
}

start();
