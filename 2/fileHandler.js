import fs from "fs";

export const serveFile = (dataPath, contentType, res) => {
  const stream = fs.createReadStream(dataPath);

  stream.on("open", () => {
    res.writeHead(200, { "Content-type": `${contentType}` });
    stream.pipe(res); // Push it back to the browser
  });

  stream.on("error", () => {
    res.writeHead(404, { "Content-type": `${contentType}` });
    res.write(`404 :p`);
  });
};

export const getInventory = (fun) => {
  const stream = fs.createReadStream("./inventory.json", "utf-8");
  let data = "";

  stream.on("data", (chunk) => (data += chunk));
  stream.on("end", () => {
    fun(JSON.parse(data)); // the callback will use the parsed data to remove the id
  });
};

export const saveInventory = (data, callback) => {
    const stream = fs.createWriteStream("./inventory.json");

    // Listen to finishing
    stream.on("finish", () =>{
            callback();
    });

    // Listen to errors
    stream.on("error", (err) => {
        console.error("Error occurred during stream: ", err);
    })

    // Write the file and then close the write stream
    stream.write(JSON.stringify(data, null, 2));
    stream.end();

}