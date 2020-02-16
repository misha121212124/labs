(() => {
  var usersList = [];
  var library = [];
  var theUser = [];
  let displayUserList = null;
  var iframe;
  
  const didMount = () => {


    
      const libraryBtn = dom.el('toLibrary-btn');
      libraryBtn.onclick = () => {
        goToPage("library.html");
      }
      var dd = document.documentElement.clientWidth;
        window.onload = function(){
            document.getElementById('area').coords=[dd-81,38,dd-32,88];
            document.getElementById('ttable').style.minWidth = dd/2+'px';
        }
    }

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

  class Book {
    constructor( name, year, author, src, id){
      this.name = name;
      if(!!year){
        this.year = year;
      }else{
        this.year = "??"
      }      
      this.author = author;
      if(!!src){
        this.src = src;
      }else{
        this.src = "images/bookUnknown.jpg";
      }
      this.id = id;
    }
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
      const el = dom.cr('tr');
      const cEl = this.createPropertyElement;
      el.appendChild(cEl(this.user.getFullName()));
      el.appendChild(cEl(this.user.birsday));
      el.appendChild(cEl(this.user.interestsToString()));
      el.appendChild(cEl(this.user.login+"\n"+this.user.password));
      el.appendChild(this.createRemoveButton());
      return el;
    };

    createPropertyElement (value) {
      const el = dom.cr('td');
      el.innerHTML = value;
      return el;
    };

    createRemoveButton () {
      const el = dom.cr('td');
      el.classList.add('tr-center');
      const button = dom.cr('button');
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

  class BookDOMWorker {
    constructor(book = new Book()) {
      this.book = book;
    }
    createElement () {
      const el = dom.cr('tr');
      const cEl = this.createPropertyElement;
      const im = this.createImEl;
      
      el.appendChild(im(this.book.src));
      el.appendChild(cEl(this.book.name, this.book.year, this.book.author, this.book.id));
      return el;
    };

    createPropertyElement (value1, value2, value3, id) {
      const el = dom.cr('td');
      el.innerHTML = "<label>Назва:</label><br>"+
        "<label>"+value1+"</label><br><label>Рік:</label><br>"+
        "<label>"+value2+"</label><br><label>Автор:</label><br>"+
        "<label>"+value3+"</label><label style='display: none'>"+
        id+"</label>";;
      return el;
    };

    createImEl (value) {
      const el = dom.cr('td');
      el.innerHTML='<img src= "' +value+'" onerror="this.src= ' +
       			"'images/bookUnknown.jpg'"+';">';
      return el;      
    }
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
  	if ( event.data == 11 ){
  		closeIFrame();
  	}else{
      if( typeof( event.data[0] ) == "object" ){
        usersList=event.data;
        usersList.sort(sortUsers);
        displayUserList = displayList.bind(this, dom.el('user-list'), usersList, UserDOMWorker);
        displayUserList();
      }else{
      	library = [];
    	theUser = event.data;
    	var result = usersList.map(a => a.login);
    	usersList[result.indexOf(theUser.login)] = theUser;
    	usersList.sort(sortUsers);
    	displayUserList();
        var title = dom.el("greating");
        title.innerHTML = "Вітаю "+theUser.firstName;
        displayBooks(theUser);
        
      }
  	}
  }

  $("#user-list").on("click", "tr", function(e) {

    if( !iframe ){
    	iframe = dom.cr("iframe");
    }

    
    initIfframe(iframe);
    iframe.onload = function() {
    	var params = [];
    	params.push( usersList[$(e.currentTarget).index()] );
    	params.push( theUser );
    	window.frames[0].postMessage( params , "*");
    }

  });

  function initIfframe(frame){
  	frame.style.minWidth = '27%';
    frame.style.minHeight = '82%';
    frame.style.maxHeight = '90%';
    frame.style.display = "block";
    frame.style.border = "0";
    frame.style.position = "fixed";
    frame.style.backgroundImage = "url('images/background2.jpg')"

    frame.src = "shortTable.html";
    dom.el("prob").appendChild(iframe);
  }

  function closeIFrame(){
     //window.frames[0].remove();
     dom.el("prob").removeChild(iframe);
}

  function sortUsers(a, b) {
    if ( (a.libraryBook.length + a.otherBook.length) >
     (b.libraryBook.length + b.otherBook.length) ) return -1;
    if ( (a.libraryBook.length + a.otherBook.length) <
     (b.libraryBook.length + b.otherBook.length) ) return 1;
  }

  function displayBooks(saved){
  	var result = arrayOfBook.map(a => a[4]);
  	for(var i = 0; i<saved.libraryBook.length;i++){
  		var id = result.indexOf( saved.libraryBook[i] );
    	library.push( new Book( 
      		arrayOfBook[id][0], arrayOfBook[id][1], 
      		arrayOfBook[id][2], arrayOfBook[id][3],
      		arrayOfBook[id][4] ) );
    } 

  	for(var i = 0; i<saved.otherBook.length;i++){
    	library.push( saved.otherBook[i] );
    } 

    displayBookList = displayList.bind(this, dom.el('list'), library, BookDOMWorker);
    displayBookList();
  }

  function goToPage(location){
  setUser();
  document.location = location;
  }
  function setUser(){
    window.parent.postMessage(theUser, "*");
  }
})();