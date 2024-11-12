const get = (url) => {
	return new Promise((resolve, reject) => {
		resolve({ data: JSON.parse(localStorage.getItem("db"))[url] });
	});
};
const post = (url, data) => {
  let db = localStorage.getItem("db");
  if (db !== null) {
    db = JSON.parse(db);
    db[url].push(data);
    localStorage.setItem("db", JSON.stringify(db));
    return new Promise((resolve, reject) => {
      resolve({ status: 201 });
    })
  } else {
    return new Promise((resolve, reject) => {
      reject("There is no db in localStorage");
    })
  }
};
export { get, post };
