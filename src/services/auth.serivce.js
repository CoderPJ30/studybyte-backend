import User from "../models/user.model.js";

const register = async ({ fullName, email, password }) => {
  const user = await User.findOne({ user_email: email });
  if (user)
    throw { type: "ALREADY_EXISTS", customMessage: "User with this email already exists." };

  const newUser = await User.create({
    user_fullname: fullName,
    user_email: email,
    user_password: password
  })

  if (!newUser)
    throw { type: "SOMETHING_WENT_WRONG" };

  const accessToken = await newUser.generateAccessToken();

  const userData = {
    user_fullname: newUser.user_fullname,
    user_email: newUser.user_email,
    user_role: newUser.user_role
  };

  return { data: userData, token: accessToken };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ user_email: email });
  if (!user)
    throw { type: "INVALID_CREDENTIALS" };

  const isPasswordVerified = await user.verifyPassword(password);
  if (!isPasswordVerified)
    throw { type: "INVALID_CREDENTIALS" };

  const accessToken = await user.generateAccessToken();

  const userData = {
    user_fullname: user.user_fullname,
    user_email: user.user_email,
    user_role: user.user_role
  };

  return { data: userData, token: accessToken };
};

export default { register, login };