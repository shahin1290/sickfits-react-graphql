const { gql } = require('apollo-server');

module.exports = gql`
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
    photo: Upload
  ): Product

  uploadPhoto(photo: Upload!): Photo!

  updateProduct(
    id: ID!
    name: String
    description: String
    price: Int
  ): Product

  deleteProduct(id: ID!): Product
}
`;
