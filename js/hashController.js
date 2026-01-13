function updateForHash() {

}

window.addEventListener('load', function() {

  updateForHash();

  window.addEventListener("hashchange", function() {
    updateForHash();
  });

});

