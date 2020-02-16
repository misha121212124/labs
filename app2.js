(() => {
  var usersList = [];
  let displayUserList = null;
  
  const didMount = () => {
      const signinBtn = dom.el('sign-in-btn');
      signinBtn.onclick = () => {
      var number = new UserDOMWorker(new User('', '', "", '', '', [''],[],[]))
        .getAccountData();

      if( number <= -1 ){
        if ( number == -1 ) {
          alert("Логін не правильний");
        }else{
          alert("Пароль не правильний");
        }}else{
        setUser(number);
        goToPage("users-page.html");
      }
    }
  };

  const dom = {
    cr: (tagName) => document.createElement(tagName),
    el: (elId) => document.getElementById(elId)
  };

  class User {
    constructor( firstName, lastName, birsday = "unknown", login,
      password, interests = [], libraryBook = [], otherBook = [] ){
      this.firstName = firstName;
      this.lastName = lastName;
      this.login = login;
      this.password = password;
      this.birsday = birsday;
      this.interests = interests;
      this.libraryBook = libraryBook;
      this.otherBook = otherBook;
    }

    getFullName () {
      return `${this.firstName} ${this.lastName}`;
    };

    interestsToString () {
      return this.interests.join(', ');
    };
  }

  class UserDOMWorker {
    constructor(user = new User()) {
      this.user = new User(user.firstName, user.lastName, user.birsday, 
        user.login, user.password, user.interests, user.libraryBook, user.otherBook);
      this.form = {
        fields: null
      };
    }

    getAccountData () {
      const logField = dom.el('login');
      const passField = dom.el('password');
      var login = logField.value;
      var password = passField.value;
      return this.searchUser(login,password);
    }

    searchUser(login, password){
      var logins = usersList.map(a => a.login);
      var number = logins.indexOf(login);
      if( !(number==-1) ){
       if( !(usersList[number].password==password) )
        number = -2;
      }
      return number;
    }

    createElement () {
      const el = document.createElement('tr');
      const cEl = this.createPropertyElement;
      el.appendChild(cEl(this.user.getFullName()));
      el.appendChild(cEl(this.user.birsday));
      el.appendChild(cEl(this.user.interestsToString()));
      el.appendChild(cEl(this.user.login+"\n"+this.user.password));
      el.appendChild(this.createRemoveButton());
      return el;
    };
    createPropertyElement (value) {
      const el = document.createElement('td');
      el.innerHTML = value;
      return el;
    };
    createRemoveButton () {
      const el = document.createElement('td');
      el.classList.add('tr-center');
      const button = document.createElement('button');
      button.classList.add('btn');
      button.classList.add('remove-btn');
      button.innerHTML = 'x';
      button.onclick = ( (user, ev) => {
        usersList.splice(usersList.indexOf(user), 1);
        ev.target.parentNode.parentNode.remove();})
      .bind(this, this.user);
      el.appendChild(button);
      return el;
    };
  }

  function displayList(rootEl, usersList = {}, domWorker) {
    if(!rootEl)
      return;
    rootEl.innerHTML = null;
    usersList.forEach(user => rootEl.appendChild( new domWorker(user).createElement() ) );
  }
  
  didMount();
  window.addEventListener("message", receiveMessage, false);
  function receiveMessage(event){
    usersList=event.data;
    displayUserList = displayList.bind(this, dom.el('user-list'), usersList, UserDOMWorker);
    displayUserList();
  }

  function goToPage(location){
  document.location = location;
  }
  function setUser(number){
    window.parent.postMessage(usersList[number], "*");
  }
})();