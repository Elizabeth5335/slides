const express = require("express");
const fs = require("fs/promises"); // Use the promises version of fs for async/await support



// app.get("/api", async (req, res) => {
//   try {
//     const dataFromFile = await fs.readFile("./client/src/slidesData.json", "utf-8");
//     const parsedData = JSON.parse(dataFromFile);
//     res.json({data: parsedData});
//   } catch (error) {
//     console.error("Error reading file:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });






const PORT = process.env.PORT || 3001;
const DATA_FILE_PATH = "./client/src/slidesData.json";

const app = express();

app.get("/api/:index", async (req, res) => {
  try {
    const { index } = req.params;
    const dataIndex = parseInt(index, 10); // Convert the index to an integer

    if (isNaN(dataIndex)) {
      return res.status(400).json({ error: "Invalid index parameter" });
    }

    // Read data from the file
    const dataFromFile = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsedData = JSON.parse(dataFromFile);

    // Check if the index is within the valid range
    if (dataIndex < 0 || dataIndex >= parsedData.length) {
      return res.status(404).json({ error: "Index out of bounds" });
    }

    // Get the specific element based on the index
    const selectedElement = parsedData[dataIndex];

    // Send the selected element as a JSON response
    res.json(selectedElement);
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

