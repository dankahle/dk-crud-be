const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  apiErrorHandler = require('api-error-handler'),
  userRouter = require('./rest/user/router'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  graphqlHTTP = require('express-graphql'),
  schema = require('./graphql'),
  userRepo = require('./rest/user/repo');

// Promise = require('bluebird'); // eslint-disable-line no-global-assign
// mongoose.Promise = Promise;

const mongoUri = 'mongodb://localhost/dkcrud';
mongoose.connect(mongoUri);
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

const port = 3005;
const app = express()
app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true })); // use qs library, but don't see the need for it

app.use(function tap(req, res, next) {
  let msg = req.method + ' - ' + req.url;
  if (req.body && (req.body.query || req.body.mutation)) {


    // msg = msg + JSON.stringify(req.body, null, 2);

    // msg = msg + req.body.query || req.body.mutation;
    if (req.body.query) {
      msg = msg + req.body.query.replace('\n', ' ').substr(0, 30);
    }
    if (req.body.mutatation) {
      msg = msg + req.body.mutation.replace('\n', ' ').substr(0, 30);
    }
    console.log(msg);
  } else {
    console.log(msg);
  }
  next();
})

app.use(express.static(path.resolve(__dirname, '../ui/dist')));

app.use('/api/users', userRouter);
app.use('/api/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack ? error.stack.split('\n') : [],
    path: error.path
  })
}));

app.get(['/', '/user', '/user/**'], (req, res) => {
  res.sendFile(path.resolve(__dirname, '../ui/dist') + '/index.html');
});


app.use(function (req, res) {
  res.status(404).send('Oops, file not found')
})
app.use(apiErrorHandler())
app.listen(port, function() {
  console.log(`listening on ${port}`);
});
