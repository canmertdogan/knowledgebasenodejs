const express = require("express");
const app = express();
const http = require("http");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

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

// Login route handling form submission (POST)
app.post("/login", (req, res) => {
  const { username, password, verification } = req.body;

  // Check if the username and password are correct
  if (username === 'admin' && password === 'password' && verification === '222444') {
    // Set the user as authenticated in the session
    req.session.authenticated = true;
    res.redirect('/admin'); // Redirect to the admin page after successful login
  } else {
    res.send('Invalid username or password');
  }
});

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

// Route to handle the removal of JSON entry by ID
app.delete("/remove-entry/:json/:id", (req, res) => {
  const jsonFile = req.params.json;
  const idToRemove = req.params.id;
  var filePath = path.join(__dirname, "public", "json", `${jsonFile}.json`);

  fs.readFile(filePath, "utf-8", function (error, content) {
    if (error) {
      console.error("Error reading the file:", error);
      res.status(500).send("Error reading the file");
    } else {
      try {
        const data = JSON.parse(content);
        const newData = data.centers.filter((entry) => entry.id !== idToRemove);
        const updatedJSON = JSON.stringify({ centers: newData });

        fs.writeFile(filePath, updatedJSON, "utf-8", function (error) {
          if (error) {
            console.error("Error writing to the file:", error);
            res.status(500).send("Error writing to the file");
          } else {
            res.status(200).send("Entry removed successfully");
          }
        });
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        res.status(500).send("Error parsing JSON");
      }
    }
  });
});

// Read the JavaScript code for "remove.html" from the server-side
fs.readFile("public/js/remove.js", "utf-8", function (err, jsContent) {
  if (err) {
    console.error("Error reading the JS file:", err);
  } else {
    // Append the JavaScript code to the "/remove" route
    app.get("/remove", (req, res) => {
      const htmlContent = `
      <div class="CountContainer">
        <h1 style="margin-left: 16px;color:white; text-shadow: 2px 2px 5px #222; float:left; margin-top:16px; margin-bottom: 1px;font-size: 24px; margin-left: 30px;">
          Data Stats:</h1>

        <br><br><br>
        <div id="data-table" class="tabContainer">
          <table class="table table-striped table-dark" style="width: 1075px;">
            <thead>
              <tr>
                <th scope="col">City Code</th>
                <th scope="col">Organization</th>
                <th scope="col">Phone Number</th>
                <th scope="col">E-Mail</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <script>${jsContent}</script>
      `;
      res.send(htmlContent);
    });
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

app.get("/remove", (req, res) => {
  if (req.session.authenticated) {
    fs.readFile("remove.html", "utf-8", function (err, html) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
  } else {
    res.redirect("/login"); // Redirect to the login page if not authenticated
  }
});

app.get("/tools", (req, res) => {
  if (req.session.authenticated) {
    fs.readFile("tools.html", "utf-8", function (err, html) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
  } else {
    res.redirect("/login"); // Redirect to the login page if not authenticated
  }
});

// Logout route to clear the session and redirect to the login page (GET)
app.get("/logout", (req, res) => {
  req.session.authenticated = false; // Reset the authentication status
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/login");
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



