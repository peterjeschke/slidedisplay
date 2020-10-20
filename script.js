// The path were all images are stored
const url = "https://slidedisplay.jeschke.dev/img/";
// All supported fileendings
// The order is important, as they get tried in the given order. If you only use "GIF", it should probably be the first entry
const fileendings = ["png", "jpg", "PNG", "JPG", "jpeg", "JPEG", "webp", "WEBP", "apng", "APNG", "gif", "GIF", "svg", "SVG"];

var startTransition = () => {
    var images = document.getElementsByTagName("img");
  
    for (var i = 0; i < images.length; ++i) {
      images[i].style.opacity = 1;
    }
  
    var top = 1;
    var cur = images.length - 1;
    var nextImage = 0;
    setInterval(changeImage, 10000);
    async function changeImage() {
      nextImage = (1 + cur) % images.length;
      if (cur < 0) cur = images.length - 1;
      await transition();
      cur = nextImage;
    }
  
    function transition() {
      return new Promise(function (resolve, reject) {
        images[nextImage].classList.add("opaque");
        images[cur].classList.remove("opaque");
        resolve();
      });
    }
  };
  
  var checkImageExists = async (url) => {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        cache: "no-cache"
      });
  
      return response.status == 200;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  
  var loadSingle = (src) => {
    return new Promise((resolve) => {
      const image = document.createElement("img");
  
      image.setAttribute("src", src);
  
      image.addEventListener("load", () => resolve(image));
    });
  };
  
  var loadImages = async () => {
    var i = 1;
    var endFound = false;
    var fileNames = [];
    while (!endFound && i < 30) {
      let fileName = "slide" + i.toString().padStart(2, "0");
      for (var ending of fileendings) {
        endFound = true;
        if (await checkImageExists(url + fileName + "." + ending)) {
          endFound = false;
          fileNames.push(url + fileName + "." + ending);
          break;
        }
      }
      i++;
    }
    Promise.all(fileNames.map((fn) => loadSingle(fn))).then((values) => {
      for (const img of values) {
        document.getElementById("slideshow").appendChild(img);
      }
    });
  };
  
loadImages().then(() => startTransition());

window.setInterval(function() {
  var date = new Date();
  if (date.getHours() === 8 && date.getMinutes() === 0) {
    location.reload();
  }
}, 60000);
