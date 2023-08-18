const bodyParser = require("body-parser");
const restana = require("restana");

const service = restana();
service.use(bodyParser.json());

const products = require("./products.json");

service
  .get("/", async (req, res) => {
    res.send("Welcome to restana node.js --- Product service");
  })
  .get("/health", async (req, res) => {
    res.send("Welcome to restana node.js --- Product service");
  })
  .get("/list", async (req, res) => {
    res.send(products);
  })
  .get("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let product = products.find((pro) => pro.id === id);
    // console.log(typeof(product));
    if (product !== undefined) {
      res.send(product);
    } else {
      res.send("proudct not found");
    }
  })
  .post("/add", async (req, res) => {
    // console.log(req.body);
    // const {id,title,url} = req.body;
    products.push(req.body);
    let product = products.find((pro) => pro.id === req.body.id);
    res.send({ message: "product added successfully!", data: product });
  })
  .put("/update", async (req, res) => {
    const { id, title, url } = req.body;
    const index = products.findIndex((pro) => pro.id === id);
    products[index].title = title;
    products[index].url = url;
    res.send(`product updated successfully! - index: ${index}`);
  })
  .delete("/delete/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    products.splice({ id: id });
    res.send(`Product No ${id} deleted successfully`);
  });

const PORT = 3001;
service.start(PORT).then(() => {
  console.log(`Product service started on http://localhost:${PORT}`);
});
