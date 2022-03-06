const vapidKey = 'BJ47mTyLGqEnQZR0kymxJmReHKjE9jJgFEPnwbHzYR8RKi3dUguQZvmFu4a49oWkn7JvYRQYSvcQhpidpVlbWVI';
const Storage = window.localStorage;

/**
 * client js part
 */
const subscribeFunc = async (e) => {
    /**
     * check scope in prod mode
     * @type {ServiceWorkerRegistration}
     */
    console.log('ohohho')
    const usersContainer = document.querySelector('#users_container');
    const registration = await navigator.serviceWorker.register('js/serviceWorker.js', {scope: '/static/js/'});
    console.log('registration   --> ', registration);
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
    });
    const payload = {
        userId: Storage.userId,
        subscription
    }
    console.log('subscription   --> ', subscription);
    await fetch('https://web-notifications.ru/subscribe/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(payload)
    });
};

const urlBase64ToUint8Array = function(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const getUsers = async () => {
    const usersContainer = document.querySelector('#users_container');
    const res = await fetch('https://web-notifications.ru/users', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
    });
    const data =  await res.json();
    data.users.map(u => {
        const btnEl = document.createElement('button');
        btnEl.innerText = u.username;
        btnEl.setAttribute("id", u._id);
        btnEl.setAttribute("class", "user btn btn-secondary w-100 my-1");
        btnEl.onclick = chooseUser;
        usersContainer.appendChild(btnEl);
    })
};
const sendMessage = async (e) => {
    const title = document.querySelector('#msg_title').value;
    const body = document.querySelector('#msg_body').value;
    const id = Storage.resiverId;
    const payload = {id, title, body}
    const res = await fetch('https://web-notifications.ru/sent-notifications', {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log(data);
}

const chooseUser = (e) => {
    const subscribe = document.querySelector('#subscribe');
    const usersContainer = document.querySelector('#users_container');
    if (e.target.classList.contains('user')) {
        Storage.resiverId = null;
        usersContainer.childNodes.forEach(u => {
            u.classList.remove('btn-warning');
        });
        e.target.classList.add('btn-warning');
        Storage.resiverId = e.target.id;
    }
};


/**
 * login part
 */
const loginFunc = async (e) => {
    e.preventDefault();
    const username = document.querySelector('#loginInput').value;
    const password = document.querySelector('#passwordInput').value;
    const url = 'https://141.8.193.204/login';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({username, password})
    });
    const response = await res.json();
    if (response.status == 200) {
        const Storage = window.localStorage;
        Storage.userId = response.user.id;
        Storage.login = response.user.username;
        window.location.href = '../home.html';
    } else {
        console.log('something wrong')
    }
};

/**
 * register part
 */
const registerFunc = async (e) => {
    e.preventDefault();
    const username = document.querySelector('#loginInput').value;
    const password = document.querySelector('#passwordInput').value;
    const url = 'https://141.8.193.204/registration';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({username, password})
    });
    const response = await res.json();
    if (response.status == 201) {
        window.location.href = '/login.html';
    } else {
        console.log(response)
    }
};

const fakeLoad = setTimeout(() => {
    getUsers()
}, 1000);
document.addEventListener("DOMContentLoaded", fakeLoad);


