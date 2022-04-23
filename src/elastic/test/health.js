// test health of elasticsearch connection
import {client} from "./connection.js";

/* Get the health status */

client.cluster.health({},function(err,resp,status) {  
    console.log("-- Client Health --",resp);
});
