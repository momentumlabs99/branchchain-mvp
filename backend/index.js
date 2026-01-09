const express = require("express");
const cors = require("cors");
const getContract = require("./fabric");

const app = express();
app.use(cors());
app.use(express.json());

// Get all assets
app.get("/assets", async (req, res) => {
  try {
    const contract = await getContract();
    const result = await contract.evaluateTransaction("GetAllAssets");
    res.json(JSON.parse(result.toString()));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Create asset
app.post("/assets", async (req, res) => {
  const { id, owner, value } = req.body;

  try {
    const contract = await getContract();
    await contract.submitTransaction("CreateAsset", id, owner, value.toString());
    res.send("Asset created");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.listen(4000, () =>
  console.log("Backend running on http://localhost:4000")
);