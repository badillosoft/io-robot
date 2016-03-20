'use strict';

var Robot = require('./robot.js');

var robot = new Robot([
  {
    command: 'dot',
    u: { x: 1, y: 2 },
    v: { x: 4, y: 5 }
  },
  {
    command: 'norm',
    v: { x: 1, y: 1 }
  },
  {
    command: 'normalize',
    v: { x: 1, y: 1 }
  },
]);
