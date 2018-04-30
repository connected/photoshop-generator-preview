var _ = require('lodash');
var path = require('path');
var express = require('express');
var app = express();
var config = require('./config.json');

exports.init = function (generator) {
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
          if (artboard.layers) {
            return artboard;
          }
        }

        // If no layers selected, try selected artboard
        if (result.selection.length) {
          return _.find(result.layers, { id: result.selection[0] });
        }

        return result.layers[0];
      });
  }

  function generatePreview () {
    return Promise.all([generator.getDocumentInfo(), getActiveArtboard()])
      // Normalize error format
      .catch(message => {
        throw new Error('No open document found.')
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
      });
  }

  // @todo Generate preview when document changes
  // generator.onPhotoshopEvent('documentChanged', () => {
  // })

  app.get('/', (request, response) => {
    generatePreview()
      .then(() => {
        response.render('index');
      })
      .catch(e => {
        response.status(500).send('Something went wrong: ' + e.message);
      });
  });

  app.get('/image', (request, response) => {
    response.sendFile(getPreviewImagePath());
  });

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.listen(8080);
}