const { UserInputError } = require('apollo-server');
const uploadFile = require('./uploadFile');

module.exports = async (_, args, { models }) => {
  try {
    const { name, description, price, photo } = args;
    const newProduct = new models.Product({
      name,
      description,
      price,
    });

    const createdProduct = await newProduct.save();

    const file = await uploadFile(photo);

    const newPhoto = new models.Photo({
      imageUrl: file.secure_url,
      product: createdProduct._id,
    });

    await newPhoto.save();

    const updatedProduct = models.Product.findByIdAndUpdate(
      createdProduct._id,
      { $addToSet: { photos: newPhoto._id } },
      { new: true }
    );

    return updatedProduct;
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args,
    });
  }
};
