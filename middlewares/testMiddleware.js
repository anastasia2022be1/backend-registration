function hiMiddleware(req, res, next) {
    console.log("Hi");
    next()
}

app.get("/test", hiMiddleware, (req, res) => {
    res.send("Check die Console")
})