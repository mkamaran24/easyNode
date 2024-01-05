function collection(rows, res) {
  // Create a map to organize posts by user ID
  const userPostsMap = new Map();

  rows.forEach((row) => {
    const userID = row.userID;

    console.log(userPostsMap.has(userID));

    // if controlling the unique of the seting
    if (!userPostsMap.has(userID)) {
      userPostsMap.set(userID, {
        id: row.userID,
        name: row.name,
        password: row.password,
        posts: [],
      });
    }

    // Add the post details to the posts array for the corresponding user ID
    userPostsMap.get(userID).posts.push({
      ID: row.postID,
      text: row.text,
    });
  });

  console.log(typeof userPostsMap.values());

  // Convert the map values to an array and include both user ID and post ID
  const resultArray = Array.from(
    userPostsMap.values(),
    ({ id, name, password, posts }) => ({ id, name, password, posts })
  );

  res.json({
    data: resultArray,
  });
}

module.exports = collection;
