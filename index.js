import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Path fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Temporary storage
let posts = [];

// Routes
app.get("/", (req, res) => {
    res.render("index", { posts });
});

app.post("/add", (req, res) => {
    const { author, title, content } = req.body;
    const newPost = {
        id: Date.now(), // unique ID
        author,
        title,
        content,
        createdAt: new Date().toLocaleString()
    };
    posts.push(newPost);
    res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    res.render("edit", { post });
});

app.post("/edit/:id", (req, res) => {
    const { author, title, content } = req.body;
    const postIndex = posts.findIndex(p => p.id == req.params.id);
    if (postIndex !== -1) {
        posts[postIndex] = {
            ...posts[postIndex],
            author,
            title,
            content
        };
    }
    res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Blog app running at http://localhost:${port}`);
});
