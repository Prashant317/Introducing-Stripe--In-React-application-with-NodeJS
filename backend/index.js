const cors = require("cors");
const express = require("express");

// TODO add a stripe key
const stripe = require("stripe")("sk_test_UH8CV6YkC1N9f3GFnXlo3HdI0009oQIYnu");
const uuid = require("uuid/v4");

const app = express();

//middleware
app.use(express.json())
app.use(cors())


//routes
app.get("/", (req,res) => {
    res.send("Its Working");
});

app.post("/payment", (req,res) => {
    const {product, token} = req.body;
    console.log("PRODUCT",product);
    console.log("PRICE",product.price);
    const idempontencyKey = uuid()

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency : 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of product.name`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        }, {idempontencyKey})
    }).then(result => res.status(200).json(result))
    .ctach(err => console.log(err) )
})

//listen
app.listen(8282, () => console.log("Listening at port 8282"));