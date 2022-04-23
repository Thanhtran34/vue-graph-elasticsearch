// Connect to elasticsearch
import elasticsearch from 'elasticsearch';

let uri
if(process.env.NODE === 'development') {
   uri = process.env.LOCAL
} else {
  uri = process.env.BASE_URL
}

export const client  = new elasticsearch.Client({
  host: uri,
  log: 'trace'
});


