# ng-jsoneditor

Angular version of the insanely cool [jsoneditor](https://github.com/josdejong/jsoneditor)

## Requirements

- AngularJS
- [Jsoneditor](https://github.com/josdejong/jsoneditor)

## Usage

[Bower](http://bower.io/) option:

```sh
bower install angular-tools/ng-jsoneditor
```
or NPM option:

```sh
npm install ng-jsoneditor
```


This will copy the ng-jsoneditor.js files into a `bower_components` folder, along with its dependencies. Load the script files in your application:

```html
<script src="/static/bower_components/angularjs/angular.min.js"></script>
<script src="/static/bower_components/jsoneditor/dist/jsoneditor.min.js"></script>
<script src="/static/bower_components/ng-jsoneditor/ng-jsoneditor.js"></script>
```

Add the 'ng.jsoneditor' module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['ng.jsoneditor']);
```

Finally, add the directive to your html:

```html
<div ng-jsoneditor ng-model="obj.data" options="obj.options" style="width: 400px; height: 300px;"></div>
```

## Demo

[Try this fiddle](http://jsfiddle.net/angulartools/sd3at5ek/)

http://jsfiddle.net/angulartools/sd3at5ek/

## Local Demo

Run `npm install` to install the local server, then `npm start` to start it. Then visit `http://localhost:1112/demo/`

### Sample code

```javascript
myAppModule.controller('MyController', [ '$scope', function($scope) {
  $scope.obj = {data: json, options: { mode: 'tree' }};

  $scope.btnClick = function() {
    $scope.obj.options.mode = 'code'; //should switch you to code view
  }
});
```
### Working with ng-model

Any changes to Jsoneditor or ng-model are reflected instantly.

Instead of `editor.get()` now you can simply access your `ng-model`, or `$scope.obj.data` in this case, to get or set values.

If you would to get and set your JSON data as text (instead of JSON Objects), then you can set `prefix-text="true"` like this:

```html
<div ng-jsoneditor ng-model="obj.text" prefer-text="true"></div>
```

### Additional options

There are some additional options specific to ng-jsoneditor only.

`expanded`: can be set to either `true` or `false` to have Jsoneditor fully expanded or collapsed by default.

`timeout`: the timeout interval after which the `ng-model` is updated to reflect changes in Jsoneditor (as described [here](https://github.com/josdejong/jsoneditor/issues/192)). Default is 100ms.

### Jsoneditor direct access

For more interaction with the Jsoneditor instance in the directive, we provide a direct access to it.
Using

```html
<div ng-jsoneditor="editorLoaded" ></div>
```

the `$scope.editorLoaded` function will be called with the [Jsoneditor instance](https://github.com/josdejong/jsoneditor/blob/master/docs/api.md) as first argument

```javascript
myAppModule.controller('MyController', [ '$scope', function($scope) {

  $scope.editorLoaded = function(jsonEditor){
        jsonEditor.expandAll()
  };

}]);
```

### Development

To minify the source file, run `npm install` to install the *uglify-js* module, then run `npm run minify`

### Contributors

- Sanchit Bhatnagar
- Manuel B.
- Alan blount
- xshen2026

### Licence

The Artistic License 2.0: see LICENSE.md
