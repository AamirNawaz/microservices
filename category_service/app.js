const bodyParser = require("body-parser");
const restana = require("restana");

const service = restana();
service.use(bodyParser.json());

const categories = require("./categories.json");

service
  .get("/health", async (req, res) => {
    res.send("Welcome to restana node.js --- Category service");
  })
  .get("/list", async (req, res) => {
    res.send(categories);
  })
  .get("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let category = categories.find((pro) => pro.id === id);
    // console.log(typeof(category));
    if (category !== undefined) {
      res.send(category);
    } else {
      res.send("category not found");
    }
  })
  .post("/add", async (req, res) => {
    categories.push(req.body);
    let category = categories.find((pro) => pro.id === req.body.id);
    res.send({ message: "category added successfully!", data: category });
  })
  .put("/update", async (req, res) => {
    const { id, category_name, status } = req.body;
    const index = categories.findIndex((pro) => pro.id === id);
    categories[index].category_name = category_name;
    categories[index].status = status;
    res.send(`category updated successfully! - index: ${index}`);
  })
  .delete("/delete/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let result = categories.splice({ id: id });
    let isCatExist = result.includes(id);
    if (isCatExist) {
      res.send(`category No ${id} deleted successfully`);
    } else {
      res.send("No record found");
    }
  });

const PORT = 3002;
service.start(PORT).then(() => {
  console.log(`Category service started on http://localhost:${PORT}`);
});
