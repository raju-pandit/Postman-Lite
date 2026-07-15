const express = require("express");
const cors = require("cors");
const path = require("path"); 
const proxyRoute = require("./routes/proxy");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../frontend"))); // ← fix

app.use("/proxy", proxyRoute); 

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
