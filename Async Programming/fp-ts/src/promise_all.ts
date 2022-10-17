import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";

function Promise_all<T>(promises: Promise<T>[]) {
  const tasks = promises.map((promise) =>
    TE.tryCatch(
      () =>
        Promise.resolve(promise)
          .then((result) => result)
          .catch((err) => Promise.reject(err)),
      (reason) => new Error(`${reason}`)
    )
  );
  return TE.sequenceArray(tasks)();
}

function soon<T>(val: T) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(val), Math.random() * 500);
  });
}

Promise_all<string[]>([])
  .then((e) =>
    pipe(
      e,
      E.fold(
        (err) =>
          err.message !== "X" ? `Unexpected failure: ${err}` : `${err}`,
        (result) => `This should be []: ${JSON.stringify(result)}`
      )
    )
  )
  .then(console.log);

Promise_all<number>([soon(1), soon(2), soon(3)])
  .then((e) =>
    pipe(
      e,
      E.fold(
        (err) =>
          err.message !== "X" ? `Unexpected failure: ${err}` : `${err}`,
        (result) => `This should be [1, 2, 3]: ${JSON.stringify(result)}`
      )
    )
  )
  .then(console.log);

Promise_all<number>([soon(1), Promise.reject("X"), soon(3)])
  .then((e) =>
    pipe(
      e,
      E.fold(
        (err) =>
          err.message !== "X" ? `Unexpected failure: ${err}` : `${err}`,
        (result) => `We Should not get here ${JSON.stringify(result)}`
      )
    )
  )
  .then(console.log);

Promise_all([soon("Hello"), soon("FP-TS")])
  .then((e) =>
    pipe(
      e,
      E.fold(
        (err) =>
          err.message !== "X" ? `Unexpected failure: ${err}` : `${err}`,
        (result) =>
          `This should be ["Hello","FP-TS"]: ${JSON.stringify(result)}`
      )
    )
  )
  .then(console.log);
