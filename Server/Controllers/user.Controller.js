import { User } from "../model/user.js";

export const userLogin = async (req, res) => {
  res.status(200).json({ user: req.user });
};

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.userID).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: `internal server error ${error}` });
  }
};
