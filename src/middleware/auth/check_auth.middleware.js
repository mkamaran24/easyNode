module.exports = (req, res, next) => {
  const valid_user = true;
  if (valid_user) {
    next();
  } else {
    console.log("auth here");
    res.json({ message: "user is not valid" });
  }
};
