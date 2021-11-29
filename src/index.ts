import './index.scss';

import Example from './components/exanple/example';

let exampleBtn = document.getElementById('exapmleSendRequest');
if (exampleBtn) {
    exampleBtn.onclick = ()=> {
        new Example('http://127.0.0.1:8181/test','POST',document.getElementById('examplePostRequest')).send('');
    }
}
