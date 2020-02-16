(() => {
  usersList = [];
  let createUserWorker = null;
  let displayUserList = null;
  const dom = {
    cr: (tagName) => document.createElement(tagName),
    el: (elId) => document.getElementById(elId)
  };
  const didMount = () => {
    for(var i = 0; i<5;i++){
    usersList.push( new User( array[i][0], array[i][1], array[i][2], 
                      array[i][3], array[i][4], array[i][5],
                      array[i][6], array[i][7] ) );
    } 
    const signinBtn = dom.el('sign-in');
    signinBtn.onclick = () => {
      goToPage("index2.html", false);
    }

    createUserWorker = new UserDOMWorker( new User('', '', "", '', '', [],[],[]) );
    createUserWorker.editMode();
    usersList.sort(sortUsers);
    displayUserList = displayList.bind(this, dom.el('user-list'),
               usersList, UserDOMWorker);
    displayUserList();
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

  function sortUsers(a, b) {
    if ( (a.libraryBook.length + a.otherBook.length) >
     (b.libraryBook.length + b.otherBook.length) ) return -1;
    if ( (a.libraryBook.length + a.otherBook.length) <
     (b.libraryBook.length + b.otherBook.length) ) return 1;
  }
 
  class UserDOMWorker {
    constructor(user = new User()) {
      this.user = user;
      this.form = {
        fields: null
      };
    }
    editMode () {
      const createBtn = dom.el('create-user');
      this.initForm();
      createBtn.onclick = () => {
        this.createFromForm();
        if( this.isEmpty() ){
          alert("Fill in all the fields!");
        }else{
          var newUser = new User(this.user.firstName,this.user.lastName,
            this.user.birsday,this.user.login,this.user.password,
            this.user.interests);
          window.usersList.unshift( newUser );
          displayUserList();
          goToPage("users-page.html",true);
      }
      }
    };
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
      button.onclick = ((user, ev) => {
        usersList.splice(usersList.indexOf(user), 1);
        ev.target.parentNode.parentNode.remove();
      }).bind(this, this.user);
      el.appendChild(button);
      return el;
    };
    initForm () {
      let fields;
      if(!this.form.fields) {
        this.form.fields = {
          firstName: dom.el('first_name'),
          lastName: dom.el('last_name'),
          birsday: dom.el('birsday'),
          interests: dom.el('interests'),
          login: dom.el('login'),
          password: dom.el('password')
        }
      }
      fields = this.form.fields;
      fields.firstName.value = this.user.firstName;
      fields.lastName.value = this.user.lastName;
      fields.birsday.value = this.user.birsday;
      fields.interests.value = this.user.interestsToString();
      fields.login.value = this.user.login;   
      fields.password.value = this.user.password;   
    };
    createFromForm () {
      const fields = this.form.fields;
      this.user.firstName = fields.firstName.value;
      this.user.lastName = fields.lastName.value;
      this.user.birsday = fields.birsday.value;
      this.user.interests = fields.interests.value.split(", ");
      this.user.login = fields.login.value;
      this.user.password = fields.password.value;
    };
    isEmpty(){
      return !(!!this.user.firstName && !!this.user.lastName &&
         !!this.user.birsday && !!this.user.login && 
         !!this.user.password && !!this.user.interests[0]);
    }
  }
  function displayList(rootEl, usersList = [], domWorker) {
    if(!rootEl)
      return;
    rootEl.innerHTML = null;
    usersList.forEach(user => rootEl.appendChild(new domWorker(user).createElement()));
  }
  function goToPage(location, flag){
    var theUser = window.usersList[0];
    window.usersList.sort(sortUsers);
    window.parent.postMessage(window.usersList, "*");
    if(flag){
      setUser(theUser);
    }
  document.location = location;
}
  function setUser(user){
    window.parent.postMessage(user, "*");
  }
  didMount();
})();