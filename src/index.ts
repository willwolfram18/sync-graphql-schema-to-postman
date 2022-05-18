import { print } from 'graphql';
import { printSchemaWithDirectives, AsyncExecutor } from '@graphql-tools/utils';
import { introspectSchema } from '@graphql-tools/wrap';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const schemaFetcher: AsyncExecutor = async ({ document, variables }) => {
    const introspectionQuery = print(document);
    const introspectionResponse = await axios.post(process.env.GRAPHQL_API, {
        query: introspectionQuery,
        variables
    }, {
        headers: {
            'content-type': 'application/json'
        }
    });

    console.log("The API response is ", introspectionResponse.data, "\n\n");

    return introspectionResponse.data;
};

async function main() {
    const schema = await introspectSchema(schemaFetcher);
    const schemaText = printSchemaWithDirectives(schema);

    console.log('Retrieved the following schema: ', schemaText);

    await updatePostmanApiSchema(schemaText);
}

async function updatePostmanApiSchema(schema: string) {
    const postmanAddress = `https://api.postman.com/apis/${process.env.POSTMAN_API_ID}/versions/${process.env.POSTMAN_API_VERSION_ID}/schemas/${process.env.POSTMAN_API_SCHEMA_ID}`;
    const response = await axios.put(postmanAddress, {
        schema: {
            language: 'graphql',
            schema,
            type: 'graphql'
        }
    }, {
        headers: {
            'X-API-KEY': process.env.POSTMAN_API_KEY,
            'content-type': 'application/json'
        }
    });

    if (response.status >= 200 && response.status < 300) {
        console.log("Successfully updated schema!");
    } else {
        console.error("Failed to update schema: ", response.status, response.data);
    }
}

main().then(() => console.log("*** Done! ***"))

// const users = [
//     {
//         id: "1",
//         email: "billy.wolfram@test.com"
//     },
//     {
//         id: "2",
//         email: "crwolfram@test.com"
//     },
//     {
//         id: "3",
//         email: "tali@test.com"
//     }
// ];

// const posts = (() => {
//     let x: { id: string, message: string, authorId: string }[] = [];

//     for (let i = 1; i < 12; i++) {
//         x.push({
//             id: i.toString(),
//             message: `Message value ${i}`,
//             authorId: users[i % users.length].id
//         })
//     }

//     return x;
// })();

// let postsSchema = makeExecutableSchema({
//     typeDefs: gql`
//         type Post {
//             id: ID!
//             message: String!
//             author: User!
//         }

//         input PostsFilterInput {
//             ids: [ID!]
//         }

//         type User {
//             id: ID!
//             posts: [Post!]!
//         }

//         type Query {
//             posts(where: PostsFilterInput): [Post!]!
//             post(id: ID!): Post
//             user(id: ID!): User
//         }
//     `,
//     resolvers: {
//         Query: {
//             posts: (_, args: { where?: { ids?: string[] } }, context, info: GraphQLResolveInfo) => {
//                 if (args.where?.ids?.length) {
//                     console.log("Resolving posts with ids ", args.where.ids);

//                     return posts.filter(p => args.where.ids.includes(p.id));
//                 }

//                 return posts;
//             },
//             post: (_, { id }: { id: string}, context: any, info: GraphQLResolveInfo) => {
//                 console.log("Resolving post with id ", id);

//                 return posts.find(x => x.id == id);
//             },
//             user: (_, { id }: { id: string}, context: any, info: GraphQLResolveInfo) => {
//                 return { id };
//             }
//         },
//         Post: {
//             author(post: { authorId: string }) {
//                 console.log("resolving author for ", post);
//                 return { id: post.authorId };
//             }
//         },
//         User: {
//             posts(user: { id: string }) {
//                 return posts.filter(p => p.authorId == user.id);
//             }
//         }
//     }
// });
// let usersSchema = makeExecutableSchema({
//     typeDefs: gql`
//         type User {
//             id: ID!
//             email: String!
//         }

//         input UsersFilterInput {
//             ids: [ID!]
//         }

//         type Query {
//             users(where: UsersFilterInput): [User!]!
//             user(id: ID!): User
//         }`,
//     resolvers: {
//         Query: {
//             users: (_, args: { where?: { ids?: string[] } }, context, info: GraphQLResolveInfo) => {
//                 if (args.where?.ids?.length) {
//                     console.log("Resolving users with ids ", args.where.ids);

//                     return users.filter(u => args.where.ids.includes(u.id));
//                 }

//                 return users;
//             },
//             user: (_, { id }: { id: string}, context: any, info: GraphQLResolveInfo) => {
//                 return users.find(u => u.id == id);
//             }
//         }
//     }
// });

// const gateway = stitchSchemas({
//     subschemas: [
//         {
//             schema: postsSchema,
//             merge: {
//                 User: {
//                     fieldName: "user",
//                     selectionSet: '{ id }',
//                     key: ({ id }) => id,
//                     argsFromKeys: keys => ({ where: { ids: keys } })
//                 }
//             }
//         },
//         {
//             schema: usersSchema,
//             merge: {
//                 User: {
//                     fieldName: "user",
//                     selectionSet: '{ id }',
//                     args: originalObj => {
//                         return { id: originalObj.id };
//                     }
//                 }
//             }
//         }
//     ],
//     mergeTypes: true
// });

// const server = new ApolloServer({
//     schema: gateway
// });

// server.listen().then(({ url }) => {
//     console.log(`🚀 Server ready at ${url}`);
// });