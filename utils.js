function genRandomId() {
  const possible = "0123456789abcdefghijkmnpqrstuvwxyz";

  function genCluster() {
    let cluster = "";
    for (let i = 0; i < 4; i++) {
      const randIndex = Math.floor(Math.random() * possible.length);
      cluster += possible[randIndex];
    }
    return cluster;
  }

  let id = "";
  id += genCluster();
  id += '-';
  id += genCluster();
  return id;
}

function setRandomChannels() {
  const ids = document.querySelectorAll('.channel');
  const randId = genRandomId();
  ids.forEach(el => el.innerText = randId);
}

export {
  setRandomChannels,
};
