/**
 * Home controller
 */
import { client } from "../elastic/connection.js";
/**
 * Encapsulates a home controller.
 */
export class HomeController {
  // helper function to parse elasticsearch response
  parseElasticResponse(elasticResponse) {
    const responseHits = elasticResponse.body.hits.hits;
    const result = responseHits.map((hit) => hit._source);
    return result;
  }

  // Search for country with specific year
  async searchForCountryWithYear(req, res, next) {
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
        records: this.parseElasticResponse(response),
      });
    } catch (err) {
      next(err);
    }
  }

  // search for country name
  async searchForCountry(req, res, next) {
    try {
      const response = await client.search(
        {
          index: "search_countries",
          from: 0,
          body: {
            size: 200,
            query: {
              match_phrase: {
                Country: { query: req.params.country },
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
        records: this.parseElasticResponse(response),
      });
    } catch (err) {
      next(err);
    }
  }
}
