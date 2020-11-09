const config = require("config");
const port = process.env.PORT || config.get("application.port");
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const error = require("../middlewares/error");
const user = require("../routes/user");
const auth = require("../routes/auth");
const organizer = require("../routes/organizer");
const admin = require("../routes/admin");
const event = require("../routes/event");
const corsOptions = {
  origin: "*",
  exposedHeaders: ["x-auth-token"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use(fileUpload());
app.use("/api/v1/admin", admin);
app.use("/api/v1/user", user);
app.use("/api/v1/auth", auth);
app.use("/api/v1/organizer", organizer);
app.use("/api/v1/event", event);
app.use(error);

//before you remove this, check indexjs in root folder
// app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
