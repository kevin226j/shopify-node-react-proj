import React from 'react';
import ReactDOM from 'react-dom';

import App from '../app/App';

console.log('Hello from Client');

ReactDOM.hydrate(<App/>, document.getElementById('app'))