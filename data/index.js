// Convert csv file to json file
import csv from "csvtojson";
import fs from "fs";

const csvFilePath = "./population.csv"
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    fs.writeFileSync("../elastic/data/output.json", JSON.stringify(jsonObj), "utf-8", (err) => {
      if(err) {
        console.log(err)
      }
    })
})