# React Flow Task

![Project Banner](https://github.com/Bannuru-vani/react-flow/blob/main/readme.png)

## Used Tools

- React
- Material UI
- React-flow
- zustand
- json-server
- axios
- Vite


## Running locally

Step-by-step instructions on how to set up the project locally.

Take clone from the repository

```bash
git clone https://github.com/Bannuru-vani/react-flow.git
```

After clone

```bash
cd react-flow/

npm install
```
Once the NPM packages installed, before running React app start the json server

```bash
json-server --watch db.json --port 3000
```

next start vite server on port http://localhost:5173/


```bash
npm run dev
```

## Features

- Modal View
  - To see List of Nodes
  - To add new Node by clicking Create component button
  - To delete a node
- Table View
  - To view the Nodes with their Properties
- React Flow View
  - To See Nodes and Interact with nodes

I am using json server as suggested to store data and save whenever the position is updated updating the Nodes in database also to keep the position persisted.

