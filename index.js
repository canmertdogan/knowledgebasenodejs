const express = require("express");
const app = express();
const http = require("http");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for session management
app.use(
  session({
    secret: "8802f25d05266fe0b1faecda0208ae433866948aa41823f1e290fbab9a9bae45", // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  // Disable caching for login and admin pages
  if (req.url === "/login" || req.url === "/admin") {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
  }
  next();
});

// Serve static files (css, images, js, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Root route, serving the login page
app.get("/", (req, res) => {
  fs.readFile("index.html", "utf-8", function (err, html) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });
});

app.get("/m", (req, res) => {
  fs.readFile("mobile.html", "utf-8", function (err, html) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });
});
// Login route handling form submission (POST)
app.use((req, res, next) => {
  if (req.url === "/users.json") {
    // Prevent direct access to users.json
    res.status(403).send("Access Forbidden");
  } else {
    next();
  }
});

app.post("/login", (req, res) => {
  const { email, password, verification } = req.body;

  const usersData = getUsersData();
  const user = usersData.users.find(u => u.email === email);

  if (user) {
    if (bcrypt.compareSync(password, user.passwordhash)) {
      if (bcrypt.compareSync(verification, user.verificationcodehash)) {
        req.session.authenticated = true;
        res.redirect("/admin");
      } else {
        res.send("Invalid verification code");
      }
    } else {
      res.send("Invalid email or password");
    }
  } else {
    res.send("User not found");
  }
});



 // Logic to read the users.json file and extract user data
// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Define the /user route
app.get("/user", (req, res) => {
  const usersData = getUsersData();
  res.render("user", { usersData });
});


function getUsersData() {
  const filePath = path.join(__dirname, "users.json");
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Hash the username
function hashUsername(username) {
  return bcrypt.hashSync(username, 10);
}


// Login route for serving the login page (GET)
app.get("/login", (req, res) => {
  fs.readFile("login.html", "utf-8", function (err, html) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });
});

app.get("/user", (req, res) => {
  if (req.session.authenticated) {
    fs.readFile("user.html", "utf-8", function (err, html) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
  } else {
    res.redirect("/login"); // Redirect to the login page if not authenticated
  }
});


// Read and parse JSON data
const okullarData = JSON.parse(fs.readFileSync('public/json/okullar.json', 'utf-8'));
const konsolosluklarData = JSON.parse(fs.readFileSync('public/json/konsolosluklar.json', 'utf-8'));
const universitelerData = JSON.parse(fs.readFileSync('public/json/universiteler.json', 'utf-8'));
const kulturmerkezleriData = JSON.parse(fs.readFileSync('public/json/kulturmerkezleri.json', 'utf-8'));
const derneklerData = JSON.parse(fs.readFileSync('public/json/dernekler.json', 'utf-8'));

// Combine data from different sources
const finalData = [
  ...okullarData.centers,
  ...konsolosluklarData.centers,
  ...universitelerData.centers,
  ...kulturmerkezleriData.centers,
  ...derneklerData.centers
];



app.post("/add-user", (req, res) => {
  const { username, password, verification } = req.body;

  // Hash the password and verification code using bcrypt
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ success: false, message: "Error hashing password" });
    }

    bcrypt.hash(verification, saltRounds, (err, hashedVerification) => {
      if (err) {
        console.error("Error hashing verification code:", err);
        return res.status(500).json({ success: false, message: "Error hashing verification code" });
      }

      // Logic to add the user to the users.json file
      const newUser = {
        email: username,
        passwordhash: hashedPassword,
        verificationcodehash: hashedVerification
      };

      // Read the existing data from users.json
      const filePath = path.join(__dirname, "./users.json");
      const data = fs.readFileSync(filePath, "utf8");
      const jsonData = JSON.parse(data);

      // Add the new user to the data array
      jsonData.users.push(newUser);

      // Write the updated data back to users.json
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");

      res.redirect("/user");
    });
  });
});


app.post("/remove-user", (req, res) => {
  const { email } = req.body;
  console.log("Received request to remove user with email:", email);
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    // Read the existing data from users.json
    const filePath = path.join(__dirname, "users.json");
    const data = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(data);

    // Find the index of the user with the provided email
    const userIndex = jsonData.users.findIndex(user => user.email === email);

    if (userIndex !== -1) {
      // Remove the user from the array
      jsonData.users.splice(userIndex, 1);

      // Write the updated data back to users.json
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");

      return res.redirect("/user");
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
});





// Admin route for serving the admin page (GET)
app.get("/admin", (req, res) => {
  if (req.session.authenticated) {
    fs.readFile("admin.html", "utf-8", function (err, html) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
  } else {
    res.redirect("/login"); // Redirect to the login page if not authenticated
  }
});

app.get("/add", (req, res) => {
  if (req.session.authenticated) {
    fs.readFile("add.html", "utf-8", function (err, html) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
  } else {
    res.redirect("/login"); // Redirect to the login page if not authenticated
  }
});

const cityDataFilePath = path.join(__dirname, 'public', 'json', 'citydata-turkey.json');
let cityData = [];

fs.readFile(cityDataFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error loading city data:', err);
    return;
  }

  try {
    cityData = JSON.parse(data).iller;
 
  } catch (parseError) {
    console.error('Error parsing city data:', parseError);
  }
});

app.post('/add-organization', (req, res) => {
  const { hizmet, city, address, title, email, phone, information } = req.body;

  if (!hizmet || !city || !title || !email  || !address || !phone || !information) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const hizmetOptions = {
    '1': 'dernekler.json',
    '2': 'kulturmerkezleri.json',
    '3': 'konsolosluklar.json',
    '4': 'okullar.json',
    '5': 'universiteler.json'
  };

  const jsonFileName = hizmetOptions[hizmet];
  if (!jsonFileName) {
    return res.status(400).json({ error: 'Invalid hizmet selection' });
  }

  const jsonFilePath = path.join(__dirname, 'public', 'json', jsonFileName);

  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).json({ error: 'Error reading JSON file' });
    }

    let jsonData = JSON.parse(data);
    
    const selectedCity = cityData.find(item => item.plaka_kodu === city);

    if (!selectedCity) {
      console.log('Received City:', city);
      return res.status(400).json({ error: 'Invalid city selection' });
      
    }

    const newEntry = {
      name: title,
      address: address,
      phone: phone,
      email: email,
      il_adi: city,
      plaka_kodu: selectedCity.plaka_kodu,
      aciklama: information,
    };

    jsonData.centers.push(newEntry);

    fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing to JSON file:', err);
        return res.status(500).json({ error: 'Error writing to JSON file' });
      }

      setTimeout(() => {
        return res.status(200).json({ message: 'Organization added successfully' });
      }, 3000);
    });
  });
});

// Define an array to hold the data from all JSON files
let allCenters = [];

const jsonFiles = ['./public/json/okullar.json', './public/json/konsolosluklar.json', './public/json/universiteler.json', './public/json/kulturmerkezleri.json', './public/json/dernekler.json'];
jsonFiles.forEach((filePath) => {
  const data = require(filePath);
  allCenters = allCenters.concat(data.centers);
});

app.get('/remove', (req, res) => {
  res.render('remove', { data: allCenters });
});

app.post('/remove/:centerName', (req, res) => {
  const centerNameToRemove = req.params.centerName;
  
  // Find the index of the center to remove
  const indexToRemove = allCenters.findIndex(center => center.name === centerNameToRemove);
  
  if (indexToRemove !== -1) {
    // Determine the source JSON file and remove the entry
    const sourceJsonFile = jsonFiles.find((filePath) => {
      const data = require(filePath);
      return data.centers.some((center) => center.name === centerNameToRemove);
    });

    if (sourceJsonFile) {
      const sourceData = require(sourceJsonFile);
      const updatedCenters = sourceData.centers.filter(center => center.name !== centerNameToRemove);
      
      fs.writeFileSync(sourceJsonFile, JSON.stringify({ centers: updatedCenters }, null, 2));
      
  
      allCenters.splice(indexToRemove, 1);
    }
  }

  if (centerNameToRemove) {
    const indexToRemove = finalData.findIndex(center => center.name === centerNameToRemove);
    if (indexToRemove !== -1) {
      finalData.splice(indexToRemove, 1);
    }
  }
  
  res.redirect('/remove');
});





app.get("/tools", (req, res) => {
  if (req.session.authenticated) {
    fs.readFile("tools.html", "utf-8", function (err, html) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
  } else {
    res.redirect("/login");
  }
});


app.get("/logout", (req, res) => {
  req.session.authenticated = false;
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/");
  });
});













app.get("/citydata", (req, res) => {
  var filePath = path.join(__dirname, "public", "json", "citydata-turkey.json");
  fs.readFile(filePath, "utf-8", function (error, content) {
    if (error) {
      console.error("Error reading the file:", error);
      res.status(500).send("Error reading the file");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(content);
    }
  });
});
app.get("/ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb", (req, res) => {
  var filePath = path.join(__dirname, "public", "json", "dernekler.json");
  fs.readFile(filePath, "utf-8", function (error, content) {
    if (error) {
      console.error("Error reading the file:", error);
      res.status(500).send("Error reading the file");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(content);
    }
  });
});
app.get("/3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d", (req, res) => {
  var filePath = path.join(__dirname, "public", "json", "kulturmerkezleri.json");
  fs.readFile(filePath, "utf-8", function (error, content) {
    if (error) {
      console.error("Error reading the file:", error);
      res.status(500).send("Error reading the file");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(content);
    }
  });
});
app.get("/2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6", (req, res) => {
  var filePath = path.join(__dirname, "public", "json", "konsolosluklar.json");
  fs.readFile(filePath, "utf-8", function (error, content) {
    if (error) {
      console.error("Error reading the file:", error);
      res.status(500).send("Error reading the file");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(content);
    }
  });
});
app.get("/18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4", (req, res) => {
  var filePath = path.join(__dirname, "public", "json", "okullar.json");
  fs.readFile(filePath, "utf-8", function (error, content) {
    if (error) {
      console.error("Error reading the file:", error);
      res.status(500).send("Error reading the file");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(content);
    }
  });
});
app.get("/3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea", (req, res) => {
  var filePath = path.join(__dirname, "public", "json", "universiteler.json");
  fs.readFile(filePath, "utf-8", function (error, content) {
    if (error) {
      console.error("Error reading the file:", error);
      res.status(500).send("Error reading the file");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(content);
    }
  });
});
// Start the server
const PORT = 1337;
app.listen(PORT, () => {
  console.log(`WebApp is active at: http://127.0.0.1:${PORT}`);
});



