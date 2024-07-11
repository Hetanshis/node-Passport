import bcrypt from "bcrypt";

// Password bcrypt
const bcryptPassword = async (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const pass = await bcrypt.hash(password, salt);
  return pass;
};

export default bcryptPassword;
