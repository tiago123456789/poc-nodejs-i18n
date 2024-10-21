const express = require("express");
const app = express();
const path = require("path");
const i18next = require("i18next");
const middleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");
const { MESSAGE_CODE } = require("./constant/MessageCode");
const yup = require("yup");

i18next
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

const PORT = 3000;

app.use(middleware.handle(i18next));

app.use((req, res, next) => {
  res.locals.lng = req.language;
  next();
});

// Set up views and view engine
app.get("/message", (req, res) => {
  console.log(req.t("title"));
  return res.json({
    title: req.t("title"),
  });
});

app.get("/change-language", (req, res) => {
  const { lng } = req.query; // Get the new language from query parameters
  res.cookie("i18next", lng); // Set the new language in a cookie

  // Use `Referrer` header or fallback to `/` if it's not set
  const redirectPath = req.get("Referrer") || "/";
  res.redirect(redirectPath); // Safely redirect back
});

app.get("/validation", async (req, res) => {
  const userSchema = yup.object().shape({
    username: yup
      .string()
      .required(req.t(MESSAGE_CODE.USERNAME_REQUIRED))
      .min(3, req.t(MESSAGE_CODE.USERNAME_NOT_LONG_ENOUGH, { min: 3 })),
    email: yup
      .string()
      .required(req.t(MESSAGE_CODE.EMAIL_REQUIRED))
      .email(req.t(MESSAGE_CODE.EMAIL_INVALID)),
    password: yup
      .string()
      .required(req.t(MESSAGE_CODE.PASSWORD_REQUIRED))
      .min(6, req.t(MESSAGE_CODE.PASSWORD_NO_LONG_ENOUGH, { min: 6 })),
  });

  try {
    // Validate request data
    const validatedData = await userSchema.validate(
      {
        password: "a",
        username: "a",
        email: "test@",
      },
      { abortEarly: false }
    );
    // If valid, proceed with registration logic (mocked here)
    res.status(201).json({ data: validatedData });
  } catch (error) {
    // Handle validation errors
    res.status(400).json({ errors: error.errors });
  }
});

app.get("/error", (req, res, next) => {
  try {
    throw new Error(MESSAGE_CODE.INTERNAL_SERVER_ERROR);
  } catch (error) {
    next(error);
  }
});

app.get("/", (req, res) => {
  res.json({
    message: req.t("message"),
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    message: req.t(MESSAGE_CODE.NOT_FOUND),
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: req.t(err.message),
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
