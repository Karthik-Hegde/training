function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    let resolvedValues = [];
    let pendingPromises = promises.length;

    if (promises.length === 0) {
      resolve(promises);
    }

    for (let i = 0; i < promises.length; i++) {
      promises[i]
        .then((result) => {
          pendingPromises -= 1;
          resolvedValues[i] = result;
          if (pendingPromises === 0) resolve(resolvedValues);
        })
        .catch(() => {
          reject("Promise_all function failed.");
        });
    }
  });
}

Promise_all([]).then((array) => {
  console.log("This should be []:", array);
});

function soon(val) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(val), Math.random() * 500);
  });
}

Promise_all([soon(1), soon(2), soon(3)]).then((array) => {
  console.log("This should be [1, 2, 3]:", array);
});

Promise_all([soon(1), Promise.reject("X"), soon(3)])
  .then((array) => {
    console.log("We Should not get here");
  })
  .catch((error) => {
    if (error != "X") {
      console.log("Unexpected failure:", error);
    }
  });
