const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositoryId(req, res, next) {
  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({ message : `${id} is not a valid repository ID`})
  }

  return next();
}

function repositoryFindIndexById(id) {
  return repositoryIndex = repositories.findIndex(repo => 
    repo.id === id
  );
}

app.use("/repositories/:id", validateRepositoryId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id : uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex =  repositoryFindIndexById(id);

  if(repositoryIndex === -1){
    return response.status(400).json({ message : `Repository with ID ${id} doesn't exists!`});
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes : repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositoryFindIndexById(id);

  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
  } else {
    return response.status(400).json({ message : `Repository with ID ${id} doesn't exists!`});
  }

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);

  if(!repository){
    return response.status(400).json({ message : `Repository with ID ${id} doesn't exists!`});
  }

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
