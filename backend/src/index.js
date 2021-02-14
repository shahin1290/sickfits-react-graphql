const { ApolloServer } = require('apollo-server');
const connectDb = require('./config/db');
const typeDefs = require('./graphql/types');
const resolvers = require('./graphql/resolvers');
const models = require('./models');
const authContext = require('./graphql/context');

connectDb();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    currentUser: authContext(req),
    models,
  }),
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
