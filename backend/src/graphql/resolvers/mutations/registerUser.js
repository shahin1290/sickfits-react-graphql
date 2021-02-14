const { UserInputError } = require('apollo-server');

module.exports = (root, args, { models }) => {
  const { name, email, password } = args;
  const user = new models.User({ name, email, password });

  return user.save().catch((error) => {
    throw new UserInputError(error.message, {
      invalidArgs: args,
    });
  });
};
