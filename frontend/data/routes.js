import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("data/questions.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use((req, res, next) => {
  setTimeout(() => next(), 500); // 2 seconds delay
});

// Define custom routes
server.get("/questions/my", (req, res) => {
  res.jsonp(router.db.get("questions.my"));
});

server.get("/questions/recents", (req, res) => {
  res.jsonp(router.db.get("questions.recents"));
});

// Use default router
server.use(router);

const PORT = 9000;
server.listen(PORT, () => {
  console.log(`JSON Server is running at http://localhost:${PORT}`);
});
