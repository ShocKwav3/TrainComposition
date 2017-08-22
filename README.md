# Description
A simple chat application using ReactJS with [Socket.io](https://socket.io)

Components used from [material-ui](http://www.material-ui.com) and [semantic-ui](https://react.semantic-ui.com) libraries.

1. Clone the repository
2. Run `npm install` to install all the dependencies
3. Run `npm run postinstall`(prod) to generate transpiled files
4. Run `npm start`
5. Hit [localhost:3000](http://localhost:3000/) in browser

[Babel](https://github.com/babel/babel) is used to transpile ES6/ES2015 with [Webpack](https://github.com/webpack/webpack) 2.

Server auto restarts on file change using webpacks watch feature.

[ESLint](http://eslint.org/) activated.

Webpack config includes [Bootstrap](https://github.com/twbs/bootstrap), SASS, CSS loaders and custom html templates (ejs is used here).
