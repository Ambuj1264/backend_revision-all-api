const Razorpay = require('razorpay');

 const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });
  
 const crypto=require("crypto")
 const Payment=require("../../model/payment")
  
   const checkout = async (req, res) => {
    try {
      let n = 5;
let string = "";
// External loop
for (let i = 1; i <= 6; i++) {

  for (let k = 1; k <= 11 ; k++) {
        k>=7-i&& k<=5+i ? string+="*":string+=" "
  }
  string += "\n";
}
console.log(string);
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
          };
          const order = await instance.orders.create(options);
        console.log(order,"order");
          res.status(200).json({
            success: true,
            order,
          });
    } catch (error) {
        console.log(error)
    }
 
  };

   const paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,name } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      // Database comes here
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        name
      });
  
      res.redirect(
        `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({
        success: false,
      });
    }
  };
  module.exports={checkout,paymentVerification}