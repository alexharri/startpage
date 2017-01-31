import Inferno from "inferno";
import App from './App';
console.log("aaaaaaaaaaaah");

if (module.hot) {
  require('inferno-devtools');
}

console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa");

Inferno.render(
  <App />,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}