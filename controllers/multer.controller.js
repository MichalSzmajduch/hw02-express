import path from "path";
import gravatar from "gravatar";
import { promises as fsPromises } from "fs";
import Jimp from "jimp";
import User from "../models/user.model.js";

const tmpDir = path.join(process.cwd(), "/public/tmp");
const avatarsDir = path.join(process.cwd(), "/public/avatars");

console.log(tmpDir);
console.log(avatarsDir);

fsPromises.access(tmpDir).catch(() => fsPromises.mkdir(tmpDir));

const getFilenameWithSuffix = (originalname) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e3);
  return uniqueSuffix + "-" + originalname;
};

const resizeAvatar = async (fileName, avatarName) => {
  const test = await Jimp.read(fileName);
  test.resize(250, 250).quality(100).write(path.join(avatarsDir, avatarName));
};

const removeTmpFile = async (fileName) => {
  try {
    await fsPromises.unlink(fileName);
  } catch (err) {
    console.error(err);
  }
};

const updateAvatar = async (req, _, next, avatarName) => {
  try {
    const avatarURL =
      req.protocol +
      "://" +
      req.get("host").replace("localhost:3000", "") +
      "/avatars/" +
      avatarName;
    const { email } = req.user;
    const user = await User.findOne({ email });
    user.avatarURL = avatarURL;
    await user.save();
    return avatarURL;
  } catch (err) {
    next(err);
  }
};
const generateAvatarFromEmail = (email) => {
  return gravatar.url(email, { s: "250", d: "retro" }, true);
};

const uploadAvatar = async (req, res, next) => {
  const { description } = req.body;
  const { path: tempPathName, originalname, filename, mimetype } = req.file;

  const fileName = path.join(tmpDir, filename);
  try {
    let avatarName;

    if (mimetype === "image/png" || mimetype === "image/jpg") {
      await fsPromises.rename(tempPathName, fileName);
      avatarName = getFilenameWithSuffix(originalname);
      await resizeAvatar(fileName, avatarName);
      await removeTmpFile(fileName);
    } else {
      avatarName = generateAvatarFromEmail(req.user.email);
    }

    const avatarURL = await updateAvatar(req, res, next, avatarName);

    res.json({
      description,
      status: 200,
      data: {
        message: "File uploaded successfully",
        avatarURL: avatarURL,
      },
    });
  } catch (err) {
    await removeTmpFile(tempPathName);
    next(err);
  }
};

export default uploadAvatar;
