const express = require('express');
const Pusher = require('pusher');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pusher = new Pusher({
  appId: "2080160",
  key: "b7d05dcc13df522efbbc",
  secret: "4064ce2fc0ac5596d506",
  cluster: "us2",
  useTLS: true
});

app.post('/message', async (req, res) => {
  console.log('[SERVER] POST /message received:', req.body);
  const { displayName, message } = req.body;
  if (!displayName || !message) {
    console.log('[SERVER] Missing fields in request body');
    return res.status(400).send("Missing fields");
  }

  try {
    await pusher.trigger("Veil
