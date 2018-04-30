var _ = require('lodash');
var path = require('path');
var express = require('express');
var app = express();
var config = require('./config.json');

var busy = false;

exports.init = function (generator) {
  function isBusy () {
    return busy;
  }

  function setBusy (busy) {
    busy = busy;
  }

  function getPreviewImagePath () {
    return path.join(config.imageDir, [
      config.imageName, 
      config.imageFormat
    ].join('.'));
  }

  function getActiveArtboard () {
    return generator.getDocumentInfo(null, { selectedLayers: true })
      .then(result => {
        // Try to find active artboard by checking selected layers
        for (var artboard of result.layers) {
          if (artboard.artboard && artboard.layers) {
            return artboard;
          }
        }

        // If no layers selected, try selected artboard
        if (result.selection.length) {
          return _.find(result.layers, { id: result.selection[0] });
        }

        if (result.layers[0].artboard) {
          return result.layers[0];
        }
      });
  }

  function generatePreview () {
    setBusy(true);

    return Promise.all([generator.getDocumentInfo(), getActiveArtboard()])
      .catch(message => {
        setBusy(false);
        throw new Error('No open document found.');
      })
      .then(values => {
        // @todo Destructure arguments when this feature is available
        var document = values[0];
        var artboard = values[1];

        if (!artboard) {
          return generator.getDocumentPixmap(document.id, {});
        }

        return generator.getPixmap(document.id, artboard.id, {});
      })
      .then(pixmap => {
        return generator.savePixmap(pixmap, getPreviewImagePath(), {
          ppi: config.imageResolution,
          format: config.imageFormat,
          quality: config.imageQuality
        });
      })
      .then(imagePath => {
        setBusy(false);
        return imagePath;
      });
  }

  if (config.watch) {
    generator.onPhotoshopEvent('documentChanged', () => {
      if (!isBusy()) {
        generatePreview();
      }
    });

    generator.onPhotoshopEvent('currentDocumentChanged', () => {
      if (!isBusy()) {
        generatePreview();  
      }
    });
  }

  function nocache (request, response, next) {
    response.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.header('Expires', '-1');
    response.header('Pragma', 'no-cache');
    next();
  }

  app.get('/', (request, response) => {
    generatePreview()
      .then(() => {
        response.render('index', { config });
      })
      .catch(e => {
        response.status(500).send('Something went wrong: ' + e.message);
      });
  });

  app.get('/image', nocache, (request, response) => {
    response.sendFile(getPreviewImagePath());  
  });

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.listen(config.serverPort);
}