/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
const progresses = {};
const filesizeWithUnit = (size) => {
    if (size < 1024) {
        return `${size} B`;
    }
    size = size / 1024;
    if (size < 1024) {
        return `${size.toFixed(2)} KB`;
    }
    size = size / 1024;
    if (size < 1024) {
        return `${size.toFixed(2)} MB`;
    }
    size = size / 1024;
    return `${size.toFixed(2)} GB`;
};
const progressSpan = document.getElementById('progressSpan');
const statusSpan = document.getElementById('statusSpan');
const chatUl = document.getElementById('chatUl');
const chatTextarea = document.getElementById('chatTextarea');
const sendButton = document.getElementById('sendButton');
let interval = null;
const worker = new Worker('./dist/worker.bundle.js');
worker.addEventListener('message', (e) => {
    const { action, data } = e.data;
    // For debug
    console.log(action, data);
    if (action === 'progressCallback') {
        const arg = data;
        if (arg.status === 'progress') {
            const name = arg.file;
            progresses[name] = {
                progress: arg.progress,
                loaded: arg.loaded,
                total: arg.total
            };
            while (progressSpan.firstChild) {
                progressSpan.firstChild.remove();
            }
            const ul = document.createElement('ul');
            for (const key in progresses) {
                const data = progresses[key];
                const li = document.createElement('li');
                li.innerText = `${key}: ${data.progress.toFixed(2)}% (${filesizeWithUnit(data.loaded)} / ${filesizeWithUnit(data.total)})`;
                ul.appendChild(li);
            }
            progressSpan.appendChild(ul);
        }
        else if (arg.status === 'ready') {
            statusSpan.innerText = 'Ready';
            chatTextarea.addEventListener('keypress', e => {
                // 13: Enter key
                if (e.keyCode === 13 && !e.shiftKey) {
                    e.preventDefault();
                    sendButton.click();
                }
                e.stopPropagation();
            });
            chatTextarea.addEventListener('keyup', e => {
                e.stopPropagation();
            });
            chatTextarea.addEventListener('keydown', e => {
                e.stopPropagation();
            });
            sendButton.addEventListener('click', e => {
                e.preventDefault();
                let input = chatTextarea.value.trim();
                if (!input) {
                    return;
                }
                if (input.length > 250) {
                    input = input.slice(0, 247) + '...';
                }
                chatTextarea.value = '';
                chatTextarea.disabled = true;
                sendButton.disabled = true;
                const userLi = document.createElement('li');
                userLi.classList.add('chat');
                userLi.classList.add('userchat');
                userLi.innerText = input;
                chatUl.appendChild(userLi);
                const aiLi = document.createElement('li');
                aiLi.classList.add('chat');
                aiLi.classList.add('aichat');
                aiLi.innerText = 'processing...';
                chatUl.appendChild(aiLi);
                const now = performance.now();
                interval = setInterval(() => {
                    const elapsed = performance.now() - now;
                    aiLi.innerText = `processing... (${(elapsed / 1000).toFixed(2)} sec)`;
                }, 1000 / 15);
                worker.postMessage({ action: 'text2text', data: input });
            });
            chatTextarea.disabled = false;
            sendButton.disabled = false;
        }
    }
    else if (action === 'text2textResult') {
        clearInterval(interval);
        interval = null;
        // Hacky...
        chatUl.lastChild.innerText = data;
        chatTextarea.disabled = false;
        sendButton.disabled = false;
    }
});

/******/ })()
;
//# sourceMappingURL=app.bundle.js.map