const generateRandomString = () => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var numChar= characters.length;
  for ( let i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * numChar));
  }
  return result;
};

function urlsForUser(id, database) {
  const filter = {};
  for (const person in database) {
    if (database[person].userID === id) {
      filter[person] = database[person];
    }
  }
  return filter;
};

const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
  return;
}

module.exports = { generateRandomString, urlsForUser, getUserByEmail};