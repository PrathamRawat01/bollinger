const fs = require("fs");
const path = require("path");

const csvFilePath = path.join(__dirname, "tsla.csv"); // <-- put your csv file name here
const jsonFilePath = path.join(__dirname, "tsla.json");

fs.readFile(csvFilePath, "utf8", (err, data) => {
    if (err) {
        console.error("Error reading CSV file:", err);
        return;
    }

    const lines = data.split("\n").filter((line) => line.trim() !== "");
    const headers = lines[0].split(",");

    const jsonData = lines.slice(1).map((line) => {
        const values = line.split(",");
        const obj = {};
        headers.forEach((header, index) => {
            let val = values[index];

            // try to convert to number if possible
            if (!isNaN(val) && val !== "") {
                val = Number(val);
            } else if (val === "") {
                val = "";
            }
            obj[header.trim()] = val;
        });
        return obj;
    });

    fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error("Error writing JSON file:", err);
        } else {
            console.log("✅ Conversion complete! JSON saved at", jsonFilePath);
        }
    });
});
