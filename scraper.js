const axios = require("axios");
const cheerio = require("cheerio");
const router = require("express").Router();
const fetch = require("node-fetch");

const jumia = "https://www.jumia.co.ke/catalog/?q=";

const carrefour = "https://www.carrefour.ke/mafken/en/v4/search?keyword=";



// get items from Jumia
async function scrapeJumia(query) {
  const products = [];
  const { data } = await axios.get(jumia + query);

  

  const $ = cheerio.load(data);

  const item = $("div .prd");


  $(item)
    .find("a")
    .each((index, product) => {

      var product = {
        description: $(product).find("div.info > h3").text().trim(),
        // imageUrl: $(product).find("div.img-c").find("img").attr('src'),
        price: parseInt(
          $(product)
            .find("div.info > .prc")
            .text()
            .replace(/[KSh,]/g, "")
        ),
        img: $(product).find("div.img-c").find("img").attr("data-src"),
        link: "https://www.jumia.co.ke" + $(product).attr("href"),
      };
      if (product.description != "") {
        products.push(product);
      }
    });
  return products;
}

// get items frm Carrefour
async function scrapeCarrefour(query) {
  const products = [];
  const { data } = await axios.get(carrefour + query);

  const $ = cheerio.load(data);

  const item = $("div .css-b9nx4o");

  $(item)
    .find("div.css-yqd9tx")
    .each((index, item) => {
      var product = {
        description: $(item)
          .find("div.css-11qbfb")
          .find("div.css-1nhiovu")
          .text(),
        price:
          parseInt(
            $(item)
              .find("div.css-11qbfb")
              .find("div.css-17fvam3")
              .text()
              .trim()
              .replace(/[abcdeEfghijkKlmnopqrsStuvwxyz,.]/g, "")
              .split(" ")[1]
          ) / 100,
        img: $(item)
        .find("div.css-1fltn9q")
        .find("div.css-1itwyrf")
        .find("a")
        .find("img").attr("src"),
        link: 'https://www.carrefour.ke' + $(item)
        .find("div.css-1fltn9q")
        .find("div.css-1itwyrf")
        .find("a").attr("href"),
      };
      products.push(product);
    });
  return products;
}

router.get('/getFromJumia', async (req, res) => {
  try{
    const itemsArray = await scrapeJumia(req.query.q)
    res.status(200).send(itemsArray);
    
  }catch(err) {
    res.status(404).send("Page not found!")
  }
  
});

router.get('/getFromCarrefour', async (req, res) => {
  try{
    const itemsArray = await scrapeCarrefour(req.query.q)
    res.status(200).send(itemsArray);
  }catch(err) {
    res.status(404).send("Page not found!")
  }
  
});

module.exports = router;