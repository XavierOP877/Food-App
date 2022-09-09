const stripe = require('stripe')('sk_test_51Lg2R5SDL2xx39EIFio1iMHpRGWQnhAPYZMRnWoOETdF6uHshlFyGpc3tnS65OgMHpYDPCAiBfRTs5MNyT8WOPyc003MbgeKsA');

const YOUR_DOMAIN = 'http://localhost:3000';

async function createSession(req, res){
    try{
  const session = await stripe.checkout.sessions.create({
    line_items: [
        {
          price: 'price_1Lg5vFSDL2xx39EIhlLGZiq0',
          quantity: 1,
        },
      ],
      mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });
  res.json(200).json({
    status:"success",
    session
  })}catch(err){
    res.status(500).json({
        err:err.message
    })
  }
}
 
module.exports = {createSession}