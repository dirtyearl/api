const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const port = process.env.PORT || 4000;

const app = express();
const typeDefs = gql`
    type Mutation {
        newNote(content: String!): Note!
    }

    type Note {
        id: ID!
        content: String!
        author: String!
    }
    
    type Query { 
        hello: String
        notes: [Note!]!
        note(id: ID!): Note!
    }
    `;
const resolvers = { 
    Query: { 
        hello: () => 'Hello World!',
        notes: () => notes,
        note: (parent, args) => {
            return notes.find(note => note.id === args.id);
        }
    },
    Mutation: {
        newNote: (parent, args) => {
            let noteValue = {
                id: String(notes.length + 1),
                content: args.content,
                author: 'Adam Scott'
            };
        notes.push(noteValue);
        return noteValue;
        }
    }
};

let notes = [
    { id: '1', content: 'This is a note', author: 'Adam Scott' },
    { id: '2', content: 'This is another note', author: 'Harlow Everly' },
    { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison' }
];

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: '/api'});

app.listen({ port }, () =>
    console.log(
        `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    )
);
