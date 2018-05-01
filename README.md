# Photoshop preview generator plug-in

This plug-in allows you to preview your currently opened Photoshop document in any broswer. Primarily it can be used to see how your website design looks on mobile devices.

Tested with Photoshop CC 2018.

### Features
* Artboards support
* Realtime preview updates

### Setup
0. Close any running Photoshop app
1. Download bundled plug-in version [here](https://drive.google.com/open?id=1LopQ9yY3H8aHWvFJSA8-yZFhnzOvhFNG)
2. Extract archive content to your Desktop
3. Go to extracted `preview` folder and open `config.json` file with any text editor
4. Change `imageDir` path param to where you want to save preview file (make sure target folder is writable!)
5. Save changes and move extracted `preview` folder to your Photoshop Generator plug-in directory e.g. `C:\Program Files\Adobe\Adobe Photoshop CC 2018\Plug-ins\Generator`
6. Start Photoshop and open any document
7. Open http://localhost:8080 in your browser

If you want to preview image on mobile device, use [LAN IP address](https://www.google.lv/search?q=how+to+find+out+local+ip+address) instead of localhost.

### Development
If you are a developer and want to contribute, please refer to [Generator Development Environment Setup](https://github.com/adobe-photoshop/generator-core/wiki/Generator-Development-Environment-Setup) docs for more info.

Pull requests are appreciated :)

### TODO
* Reduce preview update latency (websockets, SSE?)
* Store generated preview image in memory
* Refactor code for better readability and maintainability

### Feedback
In case of any questions, feel free to open issues.
