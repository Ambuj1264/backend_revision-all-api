const registration = require("../../model/Register");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const validate= require("../../utility/validation/index")
const constants= require("../../static/index");
const Registration = {
  registration: async (req, res) => {
    try {
      const { name, email, password, mobile ,role} = req.body;
      validate.nullOrBlankAll(req,res,"name","email","password" );
      if(res.headersSent){
          return false
      }
      if (!(name && email && password && mobile)) {
        return res.status(400).send({
          success: false,
          message: "all credential not found",
          result: [],
        });
      } else {
        const findRegisterAccount = await registration.findOne({
          email: email,
        });
        console.log(findRegisterAccount, "findRegisterAccount");
        if (findRegisterAccount) {
          res.status(400).send({
            success: false,
            message: "something went wrong",
            result: findRegisterAccount,
          });
        } else {
          const hassedPassword = await bcrypt.hash(password, 10);

          const userRegistration = new registration({
            name,
            email: email.toLowerCase(),
            password: hassedPassword,
            mobile,
            role,
          });

          userRegistration
            .save()
            .then((response) => {
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "pratik1264675@gmail.com",
                  pass: "ijsawgdnwvgknpib",
                },
              });
              const mailOptions = {
                from: '"pratik1264675@email.com"',
                to: response.email,
                subject: "Registration",
                html: `
                    <h1>thank for Registrasion us</h1>
                    <p><span><b>Name : </b></span> ${response.name}</p>
                    <br/>
                    <p><span><b>your address : </b></sapn> ${response.address}
                    <br/>
                    <p><span><b>your email : </b></sapn> ${response.email}
                    <br/>
                    <p><span><b>your password : </b></sapn> ${response.password}
                    </br>
                    <p><span><b>your mobile no. : </b></sapn> ${response.mobile}
                    `,
              };
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                  res.send("There was an error sending the email");
                } else {
                  console.log("Email sent: " + info.response);
                  res.status(200).send({
                    success: true,
                    message: "data added successfully",
                    result: response,
                  });
                }
              });
            })
            .catch((err) => {
              res.status(400).send({
                success: false,
                message: "something went wrong",
                result: err.message,
              });
            });
        }
      }
    } catch (Err) {
      console.log(Err.stack);
      res.send({
        success: false,
        message: "something went wrong",
        result: Err.message,
      });
    }
  },
};
const Login = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        return res.status(400).send({
          success: false,
          message: "all credential not found",
          result: [],
        });
      } else {
        const findRegisterAccount = await registration.findOne({
          email: email,
        });
        if (!findRegisterAccount) {
          return res.status(400).send({
            success: false,
            message: "email not found",
            result: [],
          });
        } else {
          const verifyPassword = await bcrypt.compare(
            password,
            findRegisterAccount.password
          );

          if (!verifyPassword) {
            return res.status(400).send({
              success: false,
              message: "password not matched",
              result: [],
            });
          } else {
            const token = await jwt.sign({ findRegisterAccount }, "ambuj1264", {
              expiresIn: "24h",
            });
            if (!token) {
              return res.status(400).send({
                success: false,
                message: "email OR password not matched",
                result: [],
              });
            } else {
              res.status(200).send({
                success: true,
                message: "login successfull",
                result: {
                  userInfo: findRegisterAccount,
                  token: token,
                },
              });
            }
          }
        }
      }
    } catch (error) {
      console.log(error.stack);
      res.send({
        success: false,
        message: "something went wrong",
        result: error.message,
      });
    }
  },
};

module.exports = { Registration, Login };
