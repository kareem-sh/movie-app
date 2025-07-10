import {Client, Query, ID, Databases} from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const ENDPOINT_URL =  import.meta.env.VITE_APPWRITE_ENDPOINT;

const  client = new Client()
    .setEndpoint(ENDPOINT_URL)
    .setProject(PROJECT_ID);

const database = new Databases(client)

export const updateSearchCount =async (searchTerm, movie) => {
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID,
            [Query.equal('searchTerm', searchTerm)]);
        if (result.documents.length > 0) {
            const doc = result.documents[0];
        // update movie counts if exists
            await database.updateDocument(DATABASE_ID,COLLECTION_ID, doc.$id,{
                count: doc.count + 1,
            });
            // create new movie in the database if it is not exists
        }else{
            await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
                searchTerm: searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            })
        }
    }catch (error) {
        console.log(error);
    }
}

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
        ]);
        return result.documents;
    }catch (error) {
        console.log(error);
    }

}