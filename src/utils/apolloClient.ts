import ApolloClient, { InMemoryCache } from 'apollo-boost'

export const client = new ApolloClient({
  uri: 'http://localhost:2537/graphql',
  cache: new InMemoryCache({
    addTypename: true
  })
})
