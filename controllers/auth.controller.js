import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import gravatar from "gravatar";
import { v4 as uuid } from "uuid";
import sendEmail from "../helpers/mailer.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const secret = process.env.SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  user.token = token;
  await user.save();

  return res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User({ email });
    const verificationToken = uuid();

    newUser.setPassword(password);
    newUser.avatarURL = gravatar.url(email).slice(2);
    newUser.verificationToken = verificationToken;
    const result = await newUser.save();
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify/${verificationToken}`;
    sendEmail({
      to: newUser.email,
      link: verificationLink,
    });
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
        user: {
          email: result.email,
          subscription: result.subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await User.findOneAndUpdate({ _id: _id }, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    res.json({
      status: "Success",
      code: 200,
      data: {
        email: req.user.email,
        subscription: req.user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  signup,
  logout,
  current,
};
