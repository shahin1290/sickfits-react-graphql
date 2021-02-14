module.exports = {
  allProducts: async (_, {}, { models }) => {
    return await models.Product.find({}).populate('photos');
  },
  allPhotos: async (_, {}, { models }) => {
    return await models.Photo.find({}).populate('product');
  },
  product: async (_, { id }, { models }) =>
    await models.Product.findById(id).populate('photos'),
  me: (root, args, context) => {
    console.log(context);
    return context.currentUser;
  },
};
