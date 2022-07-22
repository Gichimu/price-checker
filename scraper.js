const axios = require("axios");
const cheerio = require("cheerio");
const router = require("express").Router();

const jumia = "https://www.jumia.co.ke/catalog/?q=";

// const carrefour = "https://www.carrefour.ke/mafken/en/v4/search?keyword=fridge"


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
        link: "https://www.jumia.co.ke" + $(product).attr("href"),
      };
      if (product.description != "") {
        products.push(product);
      }
    });
  return products;
}



router.get('/products', async (req, res) => {
  try{
    const itemsArray = await scrapeJumia(req.query.q)
    res.status(200).send(itemsArray);
    
  }catch(err) {
    res.status(404).send("Page not found!")
  }
  
});

// module.exports = router;