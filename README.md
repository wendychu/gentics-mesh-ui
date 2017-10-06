# Mesh Admin UI

Browser-based client app for the Mesh CMS REST API.


# Important Note

This project makes use of Angular 1.4.8. We are currently developing a new revision of the UI using Angular 2 (develop branch)
Please note that we will discontinue to support and develop version 0.7.x of the UI in favour of the new version.

## Build

```Shell
npm install
```
Bower and typings will be installed in NPM postinstall.

### Dev build

The dev build leaves the source files intact and does not concatenate or minify anything. Outputs
to `/build`.

```
gulp build
# or
gulp watch
```

### Distribution build

The distribution build minifies and concatenates all js and css, outputs to `/dist`.

```
gulp dist
```


## Folder Structure

```
src/                        // the source files for the app
 |
 |-app/                     // app javascripts, templates, styles and unit tests
 |  |
 |  |-common/               // components and services used in more than one of the app
 |  |   |-components/       // common UI components (directives)
 |  |   |-services/         // common services
 |  |
 |  |-login/                // specific parts of the app, e.g. login, projects, admin etc.
 |  |- etc...
 |
 |-assets/                  // static assets
 |  |-fonts
 |  |-images/        
 |
 |-microschemaControls/     // source files for custom microschema controls
 |
 |-styles/                  // app-wide styles. Styles specific to a component or section should reside with that component/section.
 
build/                      // dev version of the app generated by the gulp build task
e2e/                        // end-to-end tests
```

## Modular Sections

The app is split into separate Angular modules along the following pattern:

```JavaScript
angular.module('root', []);
angular.module('root.common', []);
angular.module('root.sectionOne', []);
angular.module('root.sectionTwo', []);
// etc.
```

Each new module must be declared in it's own file following the pattern `moduleName.module.js`.

An angular module declaration should not be mixed in with a controller or directive (etc.) definition.

In development, the dependency graph is managed by the gulp plugin [gulp-angular-filesort](https://github.com/klei/gulp-angular-filesort). 
This will ensure the .js files are ordered correctly in the index.html file so as to prevent "module undefined" errors.

In production, all JavaScript will be concatenated into a single file anyway so order of loading will not be an issue.

### Routing
Routes specific to a single module should be defined at the level of that module. Only global routes (e.g. 'login') would be defined
in the main app config.

This is managed by ui-router's support for nested routes. The purpose is to prevent a huge and unmanageable routes list from developing as
the app grows, and to keep the concerns of single modules all in one place.

As above, modules are defined in `moduleName.module.js`.
Routes and other config/run logic for the module (if it exists) should be defined in `moduleName.config.js`.

## Modular Components

Separate to the Angular module definitions, the app is physically organized into logical components, and each component is typically in its own folder. This folder contains *all* code 
pertaining to this component, including JavaScripts, HTML templates, .less files, and unit tests.

Example:

```
myComponent/
  |-myComponent.js          // The component code (e.g. an Angular directive, service etc.)
  |-myComponent.spec.js     // Unit tests for the component
  |-myComponent.html        // The template for the component (if applicable)
  |-myComponent.less        // Custom styles for the component (if applicable)
```

Gulp is configured to automatically include the .less files into the main app stylesheet on build.

## Exceptions

Services and components should be written with robust error handling in mind. Since Angular has a global error handler service, we can
throw new errors whenever we need to, and know that it will be caught by Angular. By default, Angular will just log it to the console,
but in future we can easily implement another error handling strategy by simply extending the default handler. See [this article](http://bahmutov.calepin.co/catch-all-errors-in-angular-app.html).

Guidelines:

* Always throw an instance of Error class, never throw a string or an object: `throw new Error('message');`
* Prefix the message with the name of the service/component/whatever that produces the error (optional hash to specify a method): 
'myMenuComponent#doThing: invalid argument...'

## Testing

### Unit Tests

Unit tests are written with the Jasmine framework and each suite should be named after the component it is testing, with the extension
".spec.js". E.g. unit tests for "myComponent.js" would live in "myComponent.spec.js", which should be in the same folder.

Tests are run with the Karma test runner, which will be started when you run `gulp watch` and will re-run all tests whenever a `.js` or `.spec.js` 
file is modified.

### End-to-end Tests

e2e tests reside in the `e2e/` folder. Since they are slow to run, they are not part of the gulp watch task. Run them with `gulp e2e`.
