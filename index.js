const config = require("config");
const port = process.env.PORT || config.get("application.port");
const mongoose = require('mongoose');

require("winston-mongodb");
require("./startup/aws");
require("./startup/logger");
// require("./startup/db");
const app = require("./startup/routes");

mongoose
  .connect(config.get("database.url"), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB...");
    app.listen(port, () =>
      console.error(`listening on http://localhost:${port}`)
    );

  })
  .catch((err) => console.error("Could not connect to MongoDB..."));

