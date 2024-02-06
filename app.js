import mongoose from "mongoose";
import express from "express";
import passport from "./config/passport.js";
import { router as authRoutes } from "./routes/api/auth.routes.js";
import { router as contactRoutes } from "./routes/api/contacts.routes.js";
import path from "path";
import createFolderIfNotExist from "./helpers/multer.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

const __dirname = path.resolve();
const publicDir = path.join(__dirname, "public");
const uploadDir = path.join(__dirname, "public/tmp");
const storeImage = path.join(__dirname, "public/avatars");

const connection = mongoose.connect(process.env.DB_URL, {
  dbName: "db-contacts",
});

app.use(express.json());
app.use(express.static("public"));
app.use(passport.initialize());
app.use("/api", contactRoutes);
app.use("/api/auth", authRoutes);

connection
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      createFolderIfNotExist(publicDir);
      createFolderIfNotExist(uploadDir);
      createFolderIfNotExist(storeImage);
      console.log(`App listens on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error while establishing connection: [${error}]`);
    process.exit(1);
  });
