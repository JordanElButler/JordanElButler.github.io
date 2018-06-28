
function init() {
  spin();
  glInit();
}

let a = 0;
function spin() {
  let eight = document.getElementById("gear-eight");
  let six = document.getElementById("gear-six");
  eight.style.transform = "rotate(" + (a) + "deg)";
  six.style.transform = "rotate(" + (-a*8/6) + "deg)";
  a += 0.3;
  window.requestAnimationFrame(spin);
}
