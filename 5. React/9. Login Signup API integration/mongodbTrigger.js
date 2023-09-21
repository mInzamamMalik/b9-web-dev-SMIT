exports = async function (changeEvent) {
    try {

        const clusterName = "Cluster0";
        const dbName = "cruddb";
        const collectionName = "posts"

        const doc = changeEvent.fullDocument;
        const docId = changeEvent.documentKey._id;

        const url = 'https://api.openai.com/v1/embeddings';
        const openai_key = context.values.get("OPENAI_API_KEY");

        console.log(`Processing document with id: ${doc._id}`);


        if (changeEvent.operationType === "delete") {
            // if you want to do something only on delete

        } else if (
            changeEvent.operationType === "insert"
            || changeEvent.operationType === "update"
            || changeEvent.operationType === "replace"
        ) {

            let response = await context.http.post({
                url: url,
                headers: {
                    'Authorization': [`Bearer ${openai_key}`],
                    'Content-Type': ['application/json']
                },
                body: JSON.stringify({
                    // The field inside your document that contains the data to embed, here it is the "plot" field from the sample movie data.
                    input: `${doc.title} ${doc.text}`,
                    model: "text-embedding-ada-002"
                })
            });

            // Parse the JSON response
            let responseData = EJSON.parse(response.body.text());

            // Check the response status.
            if (response.statusCode === 200) {
                console.log("Successfully received embedding.");

                const embedding = responseData.data[0].embedding;

                // Use the name of your MongoDB Atlas Cluster
                const collection = context.services.get(clusterName).db(dbName).collection(collectionName);

                // Update the document in MongoDB.
                const result = await collection.updateOne(
                    { _id: doc._id },
                    // The name of the new field you'd like to contain your embeddings.
                    { $set: { plot_embedding: embedding } }
                );

                if (result.modifiedCount === 1) {
                    console.log("Successfully updated the document.");
                } else {
                    console.log("Failed to update the document.");
                }
            } else {
                console.log(`Failed to receive embedding. Status code: ${response.statusCode}`);
            }


        }
    } catch (err) {
        console.error(err);
    }
};
