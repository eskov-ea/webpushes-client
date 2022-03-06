const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    "/static/": "/static/home.html",
    "/static/login": "/static/login.html",
    "/static/registration": "/static/registration.html",
    404: "/404.html"
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then(data => data.text());
    document.querySelector('#root').innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
