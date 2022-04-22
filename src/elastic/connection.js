// Connect to elasticsearch
import { Client } from "@elastic/elasticsearch";

export const client = new Client({
  node: `${process.env.BASE_URL}`,

  auth: {
    username: "elastic",
    password: "YlaemlrrI+EwXn9h",
  },
});
