import config from "./../config/config";
import app from "./express";
import mongoose from "mongoose";

import userRoutes from "./routes/user.routes";

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", () => {
  throw new Error(`unalbe to connect to database: ${config.mongoUri}`);
});

app.use("/", userRoutes);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      error: err.name + ": " + err.message,
    });
  } else if (err) {
    res.status(400).json({
      error: err.name + ": " + err.message,
    });

    console.log(err);
  }
});

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server started on port %s.", config.port);
});
