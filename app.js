const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "src")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dashboardRouter = require("./routers/dashboardRoute");
app.use("/", dashboardRouter);

const mongoDb =
  "mongodb+srv://peshang:Pp230072@cluster0.hhqpcvv.mongodb.net/Patient-Management-System?retryWrites=true&w=majority&appName=Cluster0";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDb);
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

