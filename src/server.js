//Create an express API with endpoint to query data from Elasticsearch
import express from "express";
import cors from "cors";
import { client } from "./elastic/connection.js";

// The main function of the application.
const main = async () => {
  const app = express();
  // To allow cross origin connections so that the webapp can connect to our server
  app.use(cors());

  // helper function to parse elasticsearch response
  const parseElasticResponse = (elasticResponse) => {
    const responseHits = elasticResponse.body.hits.hits;
    const result = responseHits.map((hit) => hit._source);
    return result;
  };

  // Search for country with specific year
  app.get("/search-country/:country/:year", async (req, res, next) => {
    try {
      const response = await client.search(
        {
          index: "search_countries",
          from: 0,
          body: {
            size: 100,
            query: {
              bool: {
                must: [
                  {
                    match: {
                      Country: { query: req.params.country },
                    },
                  },
                  {
                    match: {
                      Year: { query: req.params.year },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          ignore: [404],
          maxRetries: 3,
        }
      );
      res.json({
        message: "Searched Successfully",
        records: parseElasticResponse(response),
      });
    } catch (err) {
      next(err);
    }
  });

  // search for country name
  app.get("/search-country/:country", async (req, res, next) => {
    try {
      const response = await client.search(
        {
          index: "search_countries",
          from: 0,
          body: {
            size: 200,
            query: {
              "match_phrase": {
                "Country": { query: req.params.country}
              },
            },
          },
        },
        {
          ignore: [404],
          maxRetries: 3,
        }
      );
      res.json({
        message: "Searched Successfully",
        records: parseElasticResponse(response),
      });
    } catch (err) {
      next(err);
    }
  });

  app.listen(process.env.PORT, () => {
    console.log(`App is running at ${process.env.PORT}`);
    console.log("Press Ctrl-C to terminate...");
  });
};

main().catch(console.error);
