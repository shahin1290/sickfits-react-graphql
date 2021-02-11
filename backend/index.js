require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const Product = require('./models/product');
const Photo = require('./models/photo');
const cloudinary = require('cloudinary');

const MONGODB_URI = process.env.DATABASE_URL;

console.log('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const uploadFile = async (file) => {
  // The Upload scalar return a a promise
  const { createReadStream } = await file;
  const fileStream = createReadStream();

  // Initiate Cloudinary with your credentials
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  // Return the Cloudinary object when it's all good
  return new Promise((resolve, reject) => {
    const cloudStream = cloudinary.v2.uploader.upload_stream(function (
      err,
      fileUploaded
    ) {
      // In case something hit the fan
      if (err) {
        rejet(err);
      }

      // All good :smile:
      resolve(fileUploaded);
    });

    fileStream.pipe(cloudStream);
  });
};

const typeDefs = gql`
  type Photo {
    imageUrl: String!
    id: ID!
    product: Product!
  }

  type Product {
    name: String!
    description: String!
    price: Int!
    photos: [Photo]
    id: ID!
  }

  enum Status {
    DRAFT
    AVAILABLE
    UNAVAILABLE
  }

  type Query {
    allProducts: [Product!]!
    allPhotos: [Photo]
    product(id: ID!): Product!
  }

  type Mutation {
    createProduct(
      name: String!
      description: String!
      price: Int!
      photos: Upload
    ): Product

    uploadPhoto(photo: Upload!): Photo!

    updateProduct(
      id: ID!
      name: String
      description: String
      price: Int
    ): Product
  }
`;

const resolvers = {
  Query: {
    allProducts: (root, args) => {
      return Product.find().populate('photos');
    },
    allPhotos: () => {
      return Photo.find({}).populate('product');
    },
    product: (root, args) => Product.findById(args.id).populate('photos'),
  },
  Mutation: {
    createProduct: async (root, args) => {
      const newProduct = new Product({
        name: args.name,
        description: args.description,
        price: args.price,
      });

      const createdProduct = await newProduct.save();

      const file = await uploadFile(args.photo);

      const newPhoto = new Photo({
        imageUrl: file.secure_url,
        product: createdProduct._id,
      });

      await newPhoto.save();

      const updatedProduct = Product.findByIdAndUpdate(
        createdProduct._id,
        { $addToSet: { photos: newPhoto._id } },
        { new: true }
      );

      return updatedProduct;
    },
    updateProduct: async (root, args) => {
      const { id, name, description, price } = args;

      const product = await Product.findById(id);
      product.name = name;
      product.description = description;
      product.price = price;

      try {
        await product.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return product;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
