const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", "userID": "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", "userID": "aJ48lD" }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.equal(user, expectedOutput);
  });

  it("should return undefined if user doesnt exist", function() {
    const user = getUserByEmail(testUsers, "example@example.com")
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});

describe('urlsForUser', function() {
  it('should return shortURL and longURL', function() {
    const object = urlsForUser("aJ48lW", urlDatabase)
    const expectedOutput = {"b6UTxQ": { "longURL": "https://www.tsn.ca", userID: "aJ48lW" }};
    // Write your assert statement here
    assert.deepEqual(object, expectedOutput);
  });
});