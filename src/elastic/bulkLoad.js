// Load data to elasticsearch
import { client } from "./connection.js";
import fs from "fs";
import uniqid from "uniqid";

async function run() {
  await client.indices.create(
    {
      index: "search_countries",
      body: {
        mappings: {
          properties: {
            Country: { type: "text" },
            Year: { type: "integer" },
            Age: { type: "text" },
            Male: { type: "integer" },
            Female: { type: "integer" },
            timestamp: {type: "text"}
          },
        },
      },
    },
    { ignore: [400] }
  );

  const jsonContent = fs.readFileSync("../data/output.json", "utf8");
  const dataset = JSON.parse(jsonContent);
  let indx;
  for(let i = 0; i < 72; i++) {
    indx = i 
  }

  const body = dataset.flatMap((doc) => [{ index: { _index: "search_countries" } }, { Country: doc.Country, Year: doc.Year, id: uniqid('CT-'), timeStamp: new Date(1950 + indx, 7, 1), Age: doc.Age, Male: doc.M, Female: doc.F }]);

  const bulkResponse = await client.bulk({ refresh: true, body });
  if (bulkResponse.errors) {
    const erroredDocuments = [];
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1],
        });
      }
    });
    console.log(erroredDocuments);
  }

}

run().catch(console.log);