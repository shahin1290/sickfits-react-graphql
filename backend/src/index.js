const { ApolloServer, gql, UserInputError } = require('apollo-server');
const connectDb = require('./config/db');
const typeDefs = require('./graphql/types');
const resolvers = require('./graphql/resolvers');
const models = require('./models');

connectDb();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
