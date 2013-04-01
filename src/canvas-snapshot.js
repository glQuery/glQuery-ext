  gl.canvas.extend('snapshot', function(self){ return function(srcDimensions, destDimensions, format) {
      if (self.glContext.isContextLost())
        return null;

      // Render a frame manually in chrome / safari browsers
      // (See http://stackoverflow.com/questions/12625876/how-to-detect-chrome-and-safari-browser-webkit)
      var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
      if (isChrome || isSafari)
        gl.render(self.glContext);

      // Get the morpheus canvas (that was instantiated dynamically by morpheus)
      var canvasEl = self.glContext.canvas;
      var canvasDimensions = [canvasEl.width, canvasEl.height];

      // Copy the contents of the clipped portion to a new canvas
      var copyCanvas = document.createElement('canvas');
      copyCanvas.width = destDimensions? destDimensions[0] : canvasDimensions[0];
      copyCanvas.height = destDimensions? destDimensions[1] : canvasDimensions[1];
      copyContext = copyCanvas.getContext('2d');
      copyContext.drawImage(canvasEl,
        0, 0,
        (srcDimensions? srcDimensions[0] : canvasDimensions[0]), (srcDimensions? srcDimensions[1] : canvasDimensions[1]),
        0, 0,
        copyCanvas.width, copyCanvas.height);

      // Convert the new canvas data into a data url
      if (format == null)
        return copyCanvas.toDataURL('image/png');
      var uriArgs = [].slice.call(arguments, 2);
      return copyCanvas.toDataURL.apply(copyCanvas, uriArgs);
    };
  });
