# Photoshop preview generator plug-in

This plug-in allows you to preview your currently opened Photoshop document in any broswer. Primarily it can be used to see how your website design looks on mobile devices.

Tested with Photoshop CC 2017/2018.

### Features
* Artboards support
* Realtime preview updates

### Setup
0. Close any running Photoshop app
1. Download bundled plug-in version [here](https://github.com/connected/photoshop-generator-preview/releases/download/1.1/preview.zip)
2. Extract archive content to `preview` folder inside your Photoshop Generator plug-in directory e.g. `C:\Program Files\Adobe\Adobe Photoshop CC 2018\Plug-ins\Generator\preview`
3. Start Photoshop and open any document
4. Open http://localhost:8080 in your browser

**Important!** Make sure Windows firewall is not blocking Photoshop.

If you want to preview image on mobile device, use [LAN IP address](https://www.google.lv/search?q=how+to+find+out+local+ip+address) instead of localhost.

### Development
If you are a developer and want to contribute, please refer to [Generator Development Environment Setup](https://github.com/adobe-photoshop/generator-core/wiki/Generator-Development-Environment-Setup) docs for more info.

Pull requests are appreciated :)

### TODO
* Reduce preview update latency (websockets, SSE?)
* Refactor code for better readability and maintainability
* ~~Store generated preview image in memory~~

### Feedback
In case of any questions, feel free to open issues.
