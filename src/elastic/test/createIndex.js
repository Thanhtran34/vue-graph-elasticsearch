// create an index in elasticsearch
import {client} from "../connection.js";

client.indices.create({  
  index: 'countries'
},function(err,resp,status) {
  if(err) {
    console.log(err);
  }
  else {
    console.log("Create index response: ",resp);
  }
});