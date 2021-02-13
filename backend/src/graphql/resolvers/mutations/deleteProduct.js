const { UserInputError } = require('apollo-server');

module.exports = async (_, args, { models }) => {
  try {
    const deletedProduct = await models.Product.findByIdAndDelete(args.id);
    //await models.Photo.findOneAndDelete({product._id === deletedProduct._id});
    return deletedProduct;
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args,
    });
  }
};
