// Imports

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "inventory.json");
let inventory = [];

// Functions

const checkFileExists = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log("File not found at: ", filePath);
  }
};
const readData = (filePath) => {
  try {
    const fileData = fs.readFileSync(filePath, "utf8"); // Read the file
    inventory = JSON.parse(fileData); // Convert into JSON
  } catch (error) {
    console.log("Error parsing json: ", error.message);
  }
};

const saveData = (data) => {
  try {
    // null, 2 adds spaces so the file remains readable
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString, "utf8");
    console.log("File updated successfully!");
  } catch (err) {
    console.error("Error saving file:", err);
  }
};

const handleCommand = (command, options) => {
  if (command === "add") {
    add(options);
  } else if (command === "destock") {
    destock(options);
  } else if (command === "restock") {
    restock(options);
  } else if (command === "edit") {
    edit(options);
  } else if (command === "delete") {
    remove(options[0]);
  } else if (command === "list") {
    list();
  } else if (command === "summary") {
    summary();
  }
};

const add = (options) => {
  const itemName = options.join(" ");

  let insertId;

  if (inventory.length === 0) {
    insertId = 1;
  } else {
    const maxId = Math.max(...inventory.map((item) => item.id));
    insertId = maxId + 1;
  }

  const newItem = {
    id: insertId,
    name: itemName,
    stock: 1,
    category: "General",
  };

  inventory.push(newItem);
  saveData(inventory);
  console.log(`Added ${itemName} with ID: ${insertId}`);
};

const isInvalidNumber = (val) => {
  const num = Number(val);
  return isNaN(num) || num < 0;
};

const validateIndex = (idx) => {
  const itemIndex = inventory.findIndex((p) => p.id === Number(idx));
  return itemIndex;
};

const destock = (options) => {
  const searchId = options[0];
  const destockValue = Number(options[1]);

  if (isInvalidNumber(searchId) || isInvalidNumber(destockValue)) {
    console.log(
      "Error: Please provide a valid positive number for ID and Quantity.",
    );
    return;
  }

  const itemIndex = validateIndex(searchId);

  if (itemIndex === -1) {
    console.log(`Item not found`);
    return;
  }

  const item = inventory[itemIndex];
  const itemStockBefore = item.stock;

  if (item.stock - destockValue < 0) {
    console.log(`Can't destock under zero. Available stock: ${item.stock}`);
  } else {
    item.stock -= destockValue;
    saveData(inventory);
    console.log(
      `Item ${item.name} destocked from ${itemStockBefore} to ${item.stock}`,
    );
  }
};

const restock = (options) => {
  const searchId = options[0];
  const restockValue = Number(options[1]);

  if (isInvalidNumber(searchId) || isInvalidNumber(restockValue)) {
    console.log(
      "Error: Please provide a valid positive number for ID and Quantity.",
    );
    return;
  }

  const itemIndex = validateIndex(searchId);

  if (itemIndex === -1) {
    console.log(`Item not found`);
    return;
  }

  const item = inventory[itemIndex];
  const itemStockBefore = item.stock;

  item.stock += restockValue;
  saveData(inventory);
  console.log(
    `Item ${item.name} restocked from ${itemStockBefore} to ${item.stock}`,
  );
};

const edit = (options) => {
  const searchId = options[0];
  const newName = options.slice(1).join(" ");

  if (isInvalidNumber(searchId)) {
    console.log(
      "Error: Please provide a valid positive number for ID and Quantity.",
    );
    return;
  }

  const itemIndex = validateIndex(searchId);

  if (itemIndex === -1) {
    console.log(`Item not found`);
  } else {
    const item = inventory[itemIndex];
    const itemNameBefore = item.name;
    item.name = newName;
    saveData(inventory);
    console.log(`Item name changed from ${itemNameBefore} to ${item.name}`);
  }
};

// O(2n) complexity
// const remove = (itemId) => {
//   const searchId = Number(itemId);

//   const itemIndex = validateIndex(searchId);

//   if (itemIndex === -1){
//     console.log(`Item not found`);
//     return;
//   }else {
//     const item = inventory[itemIndex];
//     inventory = inventory.filter(item => item.id !== searchId);
//     saveData(inventory);
//     console.log(`Item ${item.name} with ID ${item.id} successfully deleted`);
//   }
// };

// O(n) complexity

const remove = (itemId) => {
  if (isInvalidNumber(itemId)) {
    console.log("Error: Please provide a valid positive number for the ID.");
    return;
  }
  const searchId = Number(itemId);
  let found = false;
  let item;

  for (let i = 0; i < inventory.length; i++) {
    if (inventory[i].id === searchId) {
      item = inventory[i];
      found = true;

      for (let j = i; j < inventory.length - 1; j++) {
        inventory[j] = inventory[j + 1];
      }

      inventory.pop();
      break;
    }
  }

  if (found) {
    saveData(inventory);
    console.log(`Item ${item.name} with ID ${item.id} successfully deleted`);
  } else {
    console.log(`Item not found`);
  }
};

const list = () => {
  const displayList = inventory.map((item) => {
    let status =
      item.stock > 2
        ? "available"
        : item.stock > 0
          ? "low stock"
          : "out of stock";
    return { ...item, status };
  });

  console.table(displayList);
};

const summary = () => {
  let totalQuantity = 0;
  let availableCount = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  for (let i = 0; i < inventory.length; i++) {
    const item = inventory[i];
    totalQuantity += item.stock;

    if (item.stock > 2) {
      availableCount++;
    } else if (item.stock > 0) {
      lowStockCount++;
    } else {
      outOfStockCount++;
    }
  }

  const report = `
========== INVENTORY SUMMARY ==========
Total Unique Items:    ${inventory.length}
Total Units in Stock:  ${totalQuantity}
--------------------------------------
Available Items:       ${availableCount}
Low Stock Items:       ${lowStockCount}
Out of Stock Items:    ${outOfStockCount}
======================================
  `;

  console.log(report);
};

checkFileExists(filePath);
readData(filePath);

const args = process.argv.splice(2);

const [command, ...options] = args;

const validCommands = [
  "add",
  "destock",
  "restock",
  "edit",
  "delete",
  "list",
  "summary",
];

if (!validCommands.includes(command)) {
  console.log(
    "Incorrect Command, Use one of the following commands: ",
    validCommands.join(" "),
  );
} else {
  handleCommand(command, options);
}
