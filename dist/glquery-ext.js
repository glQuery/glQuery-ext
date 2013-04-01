/*
 * glQuery-ext - A collection of extensions for a fluent WebGL engine (https://github.com/glQuery)
 * glQuery-ext is free, public domain software (http://creativecommons.org/publicdomain/zero/1.0/)
 * Originally created by Rehno Lindeque of http://www.mischievousmeerkat.com
 */
(function() {
"use strict";
  var gl = glQuery;

  gl.canvas.extend('snapshot', function(self){ return function(srcDimensions, destDimensions, format) {
      if (self.glContext.isContextLost())
        return null;

      // Render a frame manually in chrome / safari browsers (for when this call was kicked off by an event, in which case chrome does not use the last rendered buffer available)
      // (See http://stackoverflow.com/questions/12625876/how-to-detect-chrome-and-safari-browser-webkit)
      var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
      if (isChrome || isSafari)
        gl(self.rootId).render(self.glContext);

      // Get the morpheus canvas (that was instantiated dynamically by morpheus)
      var canvasEl = self.glContext.canvas;
      var canvasDimensions = [Number(canvasEl.width), Number(canvasEl.height)];

      // Copy the contents of the clipped portion to a new canvas
      var copyCanvas = document.createElement('canvas');
      copyCanvas.width = destDimensions? destDimensions[0] : canvasDimensions[0];
      copyCanvas.height = destDimensions? destDimensions[1] : canvasDimensions[1];
      var copyContext = copyCanvas.getContext('2d');
      copyContext.drawImage(canvasEl,
        0, 0,
        (srcDimensions? srcDimensions[0] : canvasDimensions[0]), (srcDimensions? srcDimensions[1] : canvasDimensions[1]),
        0, 0,
        Number(copyCanvas.width), Number(copyCanvas.height));

      // Convert the new canvas data into a data url
      if (format == null)
        return copyCanvas.toDataURL('image/png');
      var uriArgs = [].slice.call(arguments, 2);
      return copyCanvas.toDataURL.apply(copyCanvas, uriArgs);
    };
  });

  return;
})();

