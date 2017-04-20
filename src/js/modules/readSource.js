export default function readSource (source) {
  var results = []

  return new Promise(readOr)

  function readOr (resolve) {
    source.read()
      .then(function (result) {
        if (result.done) {
          return resolve(results)
        }
        results.push(result.value)
        readOr(resolve)
      })
  }
}
