if (typeof AFRAME !== "undefined") {
  AFRAME.registerComponent("arjs-vr", {
    init: function() {
      var vrButton;
      var observer = new MutationObserver(function(mutationList) {
        for (var mutation of mutationList) {
          for (var child of mutation.addedNodes) {
            //hide vr button until VIDEO is Ready
            if (child.classList.contains("a-enter-vr")) {
              vrButton = child;
              child.style.display = "none";
            } else if (child.nodeName === "VIDEO") {
              vrButton.style.display = "initial";
              console.log(child);
              this.disconnect();

              //Add Camera
              var vidCam = child;
              vidCam.setAttribute("id", "arVideo");

              var camera = document.querySelector("[camera]");
              var webCamSource = document.createElement("a-entity");
              webCamSource.setAttribute("geometry", "primitive: plane;");
              webCamSource.setAttribute(
                "material",
                "shader: flat; src: #arVideo"
              );
              webCamSource.setAttribute("position", "0 0 -50");
              webCamSource.object3D.visible = false;
              camera.insertBefore(webCamSource, camera.firstChild);
              document
                .querySelector(".a-enter-vr-button")
                .addEventListener("clik", () => {
                  camera.object3D.position.set(0, 0, 0);
                });
              var onResize = () => {
                var orientation = window.screen.orientation.angle;
                var x = 0;
                var y = 0;
                if (orientation === 0) {
                  x = vidCam.offsetWidth / 15; //15
                  y = vidCam.offsetHeight / 15; //15
                } else {
                  x = vidCam.offsetWidth / 12; //12
                  y = vidCam.offsetHeight / 12; //12
                }
                webCamSource.object3D.scale.set(x, y, 1);
                //webCamSource.object3D.position.set(0, vidCam.offsetTop/5.8, -50)
              };
              onResize();
              window.addEventListener("resize", onResize);
              window.addEventListener("orientationchange", onResize);

              webCamSource.sceneEl.addEventListener("enter-vr", function() {
                webCamSource.object3D.visible = true;
              });
              webCamSource.sceneEl.addEventListener("exit-vr", function() {
                webCamSource.object3D.visible = false;
              });
            }
          }
        }
      });
      observer.observe(document, { childList: true, subtree: true });
    }
  });
} else {
  console.warn(
    "WARNING: import AFRAME by CDN or npm module (npm install aframe)"
  );
}
