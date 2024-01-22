const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const {items, users, orders} = require('./models');

var corsOptions = {
  origin: "http://localhost:1234"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({extended: true}));


// API
// Register
app.post("/register", async(req, res, next)=>{
  if (!req.body.username) {
    res.status(400).send({
      message: "Field Name is Required!"
    });
    return;
  }
  if (!req.body.email && !req.body.password) {
    res.status(400).send({
      message: "Email or User cannot be empty!"
    });
    return;
  }

  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  // Save User in the database
  users.create(user)
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      // console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the user."
      });
    });

});

// Login
app.post("/login", async(req, res, next)=>{
  try {
    const { email, password } = req.body;

      //find a user by their email
      const dataUser = await users.findOne({ where:{
        email: email
      }});

      // console.log(password)
      // console.log(dataUser.dataValues.password)
      //if user email is found, compare password
      if (dataUser != null) {
        const isSame = password == dataUser.dataValues.password;

        //if password is the same

        if (isSame) {
          //send dataUser.dataValues data
          return res.status(201).json({
            message: "Login Success!",
            response: dataUser.dataValues
          });
        } else {
          return res.status(401).json({
            message: "Email or password is wrong"
          });
        }
      } else {
        return res.status(401).json({
          message: "Email or password is wrong"
        });
      }
  } 
  catch (error) {
    console.log(error);
  }
});

// ITEMS API
// GET ALL Items
app.get("/items", (req, res) =>{
  items.findAll()
    .then(items => {
      res.status(200).json(items)
    })
});

// CREATE items
app.post("/create/items", async(req, res, next) =>{
  if (!req.body.item_name) {
    res.status(400).send({
      message: "Field item_name is Required!"
    });
    return;
  }
  if (!req.body.user_id) {
    res.status(400).send({
      message: "input your user ID"
    });
    return;
  }

  const item = {
    item_name: req.body.item_name,
    user_id: req.body.user_id,
  };

  const findUser = await users.findAll({
    raw: true,
    nest: true,
    where: {
      id: req.body.user_id
    }
  })
  
  if (findUser.length > 0) {
    // Save Items in the database
    items.create(item)
      .then(items => {
        res.json({
          status:200,
          message:'Items Created!',
          data:[
            items
          ]
      })
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Items."
        });
      });
  }else{
    res.status(500)
      res.json({
          message:'Input your user id to verify your account',
      })
  }
});

// UPDATE items
app.put("/update/items/:id", async(req, res, next)=>{
  const findUserinItems = await items.findAll({
    raw: true,
    nest: true,
    where: {
      user_id: req.body.user_id
    }
  })
  
  console.log(findUserinItems);

  if (findUserinItems.length > 0) {
    items.update({
      item_name: req.body.item_name,
      user_id: req.body.user_id,
    },
    {
      where: { id: req.params.id }
    })
    .then(() => {
      res.status(200).json("Order updated!")
    }).catch(() => {
      res.status(500).json("Order Can't be updated!")
    })
  }else{
    res.status(500)
      res.json({
          message:'You Are not authorized to update this items',
      })
  }
});
// DELETE items
app.delete("/delete/items/:id", async(req, res)=>{
  const id =  req.params.id;
  items.destroy({
    where:{
      id: id
    }
  }).then(items => {
    res.json({
      status:200,
      message:'Items Deleted!'
    })
  }).catch(err => {
    res.status(500).json("Can't delete Items")

  })
});

// ORDERS API
// GET Order
app.get("/order", (req, res) =>{
  orders.findAll()
  .then(items => {
    res.status(200).json(items)
  })
});
// CREATE Order
app.post("/order", async(req, res, next) =>{
  if (!req.body.item_id) {
    res.status(400).send({
      message: "Mohon isi Field barang!"
    });
    return;
  }

  const order = {
    user_id: req.body.user_id,
    item_id: req.body.item_id,
    status: req.body.status ? req.body.status : "SHIPPING",
  };

  const findUser = await users.findAll({
    raw: true,
    nest: true,
    where: {
      id: req.body.user_id
    }
  })

  await items.findAll({
    raw: true,
    nest: true,
    where: {
      id: req.body.item_id
    }
  }).then(resp => {
    if (findUser.length > 0) {
      if (resp.length > 0) { //check if item is exists by item_id
        orders.create(order)
        .then(resp => {
            res.json({
            status:200,
            message:'Order Successful',
            data:[
              resp
            ]
         })
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the order."
        });
      });
    }else{
      res.status(500)
      res.json({
          message:'Item not found',
      })
    }
    }else{
      res.status(500)
      res.json({
          message:'Input your user id to verify your account',
      })
    }    
  }).catch(err => {
    res.status(500).send({
      message: err.message 
    })
  })
});
// UPDATE Orders
app.put("/update/order/:id", async(req, res, next)=>{
  const findUser = await users.findAll({
    raw: true,
    nest: true,
    where: {
      id: req.body.user_id
    }
  })
  
  if (findUser.length > 0) { 
    orders.update({
      user_id: req.body.user_id,
      item_id: req.body.item_id,
      status: req.body.status ? req.body.status : "DONE",
    },
    {
      where: { id: req.params.id }
    })
    .then(() => {
      res.status(200).json("Order updated!")
    }).catch(() => {
      res.status(500).json("Order Can't be updated!")
    })
  }
  else{
    res.status(500).json({
        message:'Input your user id to verify your account',
    })
  }
});

const PORT = process.env.PORT || 1234;
app.listen(PORT, () =>{
  console.log(`Server running on port:`, PORT);
});