/* eslint-disable import/unambiguous -- Testing */

/**
 * @typedef {any} ArbitraryValue
 */

/**
 * @param {ArbitraryValue} t
 * @yields {ArbitraryValue}
 * @returns {void}
 */
function * postorder (t) {
  if (Array.isArray(t)) {
    for (const child of t) {
      yield * postorder(child);
    }
  } else {
    for (const child of Object.values(t)) {
      yield * postorder(child);
    }
  }
  if (t !== null && typeof t === 'object' && !Array.isArray(t)) {
    yield t;
  }
}

const mytree = {
  value: 1,
  children: [
    {
      value: 2,
      children: [{
        value: 4,
        children: []
      }]
    },
    {
      value: 3,
      children: [
        {
          value: 5,
          children: []
        },
        {
          value: 6,
          children: [
            {
              value: 7,
              children: []
            }
          ]
        }
      ]
    }
  ]
};

console.log([...postorder(mytree)]);
