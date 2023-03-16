class View {
    constructor() {
        this.app = document.getElementById('app');

        this.title = this.createElement('h1', 'title');
        this.title.textContent = 'Поиск репозиториев github';

        this.searchLine = this.createElement('div', 'search-line');
        this.searchInput = this.createElement('input', 'search-input',);
        this.searchCounter = this.createElement('span', 'counter');
        this.searchBtn = this.createElement('button', 'btn');
        this.searchBtn.textContent = "Найти";
        this.searchLine.append(this.searchInput);
        this.searchLine.append(this.searchCounter);
        this.searchLine.append(this.searchBtn);

        this.userWrapper = this.createElement('div', 'user-wrapper');
        this.usersList = this.createElement('ul', 'users');
        this.userWrapper.append(this.usersList);

        this.main = this.createElement('div', 'main');
        this.main.append(this.userWrapper);

        this.app.append(this.title);
        this.app.append(this.searchLine);
        this.app.append(this.main);
    }

    createElement(elementTeg, elementClass) {
        const element = document.createElement(elementTeg);
        if (elementClass) {
            element.classList.add(elementClass);
        }
        return element;
    }

    createUser(userData) {
        const userElement = this.createElement('li', 'user-prev');
        userElement.innerHTML = `<img class="user-prev-photo" src="${userData.owner.avatar_url}" alt="${userData.owner.login}"><br>
                                 <span class="user-prev-name">Events url:  ${userData.events_url}</span><br>
                                <a href="${userData.html_url}" target="_blank><span class="user-prev-name">Full name:  ${userData.full_name}</span></a>`;

        this.usersList.append(userElement);
    }
}

class Search {
    constructor(view) {
        this.view = view;
        this.view.searchInput.addEventListener('keypress', this.key.bind(this))
        this.view.searchBtn.addEventListener('click', this.searchUsers.bind(this))
    }

    key = (e) => {
        if (e.key === 'Enter') {
            this.searchUsers(this);
        }
    }

    async searchUsers() {
        const searchValue = this.view.searchInput.value;
        if (searchValue || searchValue !== '') {
            this.view.searchCounter.textContent = ''
            try {
                return await fetch(`https://api.github.com/search/repositories?q=/${this.view.searchInput.value}&per_page=10`)
                    .then((res) => {
                        if (res.ok) {
                            res.json()
                                .then(res => {
                                    if (res.items.length === 0) {
                                        this.view.searchCounter.textContent = 'по вашему запросу ничего не найдено';
                                    }
                                    res.items.forEach(user => {
                                        this.view.createUser(user)
                                    });
                                })
                        }
                    })
            } catch (e) {
                this.view.searchCounter.style.color = 'red';
                this.view.app.style.cssText = 'font-size: 50px; color:red; text-align:center; text-content:center';
                this.view.app.textContent = 'Упс! Что-то пошло не так!';
            }

        } else {
            this.view.searchInput.style.borderColor = 'red';
            this.view.searchCounter.textContent = 'строка поиска пустая';
            this.view.usersList.innerHTML = "";
        }
    }
}


new Search(new View())