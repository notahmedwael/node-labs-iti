import { getInventory, saveInventory } from "./fileHandler.js";

export const renderHomePage = (res) => {
  getInventory((products) => {
    let htmlContent = `
        <html>
          <head>
            <title>Inventory Lab 2</title>
            <link rel="stylesheet" href="style.css" />
          </head>
            <body>
            <h1>Products</h1>
            <ul>
        `;

        products.forEach(element => {
          htmlContent +=
          `<li>
              Name: ${element.name} - Stock: ${element.stock} - Category: ${element.category}
          </li>`
        });

        htmlContent +=
        `
        </ul>
        </body>
        </html>
        `

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlContent);
  });
};

export const addItemToList = (req, res) => {
  let jsonBody = '';

  req.on('data', (chunk) => {
    jsonBody += chunk.toString();
  });

  req.on('end', () => {
    try {
      const newItem = JSON.parse(jsonBody);

      getInventory((products) => {
        products.push(newItem);

        saveInventory(products, () => {
          res.writeHead(201, {'Content-type': 'application/json'});
          res.end(JSON.stringify({
            status: 'Success',
            message: 'Successfully added the item to the inventory list',
            extra: 'Go back to the homepage to see the updated list'
          }))
        })
      })

    } catch (err) {
      res.writeHead(400, {'Content-type': 'application/json'});
      res.end(JSON.stringify({error: `Invalid JSON Format`, 'errorMessage': err}));
    }
  })
}