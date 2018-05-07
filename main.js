var _ = require('lodash');
var path = require('path');
var express = require('express');
var app = express();
var config = require('./config.json');
var nocache = require('nocache');

exports.init = function (generator) {
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

  function generatePreview (outputStream) {
    return Promise.all([generator.getDocumentInfo(), getActiveArtboard()])
      .catch(message => {
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
        return generator.streamPixmap(pixmap, outputStream, {
          ppi: 144,
          format: config.imageFormat,
          quality: config.imageQuality
        });
      });
  }

  if (config.watch) {
    generator.onPhotoshopEvent('documentChanged', () => {
      generatePreview();
    });

    generator.onPhotoshopEvent('currentDocumentChanged', () => {
      generatePreview();  
    });
  }

  app.get('/', (request, response) => {
    response.render('index', { config });
  });

  app.get('/image', nocache(), (request, response) => {
    generatePreview(response)
      .then(() => {
        response.end();
      })
      .catch(e => {
        response.status(500).send('Something went wrong: ' + e.message)
      })
  });

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.listen(config.serverPort);
}