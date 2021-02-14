const { UserInputError } = require('apollo-server');
const jwt = require('jsonwebtoken');

module.exports = async (root, args, { models }) => {
  const user = await models.User.findOne({ email: args.email });

  if (!user || !(await user.matchPassword(args.password, user.password))) {
    throw new UserInputError('wrong credentials');
  }

  const userForToken = {
    name: user.name,
    id: user._id,
  };

  return {
    value: jwt.sign(userForToken, process.env.JWT_SECRET, {
      expiresIn: '30d',
    }),
  };
};
