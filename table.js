(() => {
  var usersList = [];
  var library = [];
  var theUser = [];
  var currentUser = [];
  let displayUserList = null;
  var userNum;
  var libraryBookCount;
  
  const didMount = () => {    
        const closeBtn = dom.el('close-btn');
        closeBtn.onclick = () => {
          window.parent.postMessage(11, "*");
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

  class BookDOMWorker {
    constructor(book = new Book()) {
      this.book = book;
    }
    createElement () {
      const el = dom.cr('tr');
      const cEl = this.createPropertyElement;
      const im = this.createImEl;
      
      el.appendChild(im(this.book.src));
      //el.appendChild(cEl(this.book.name, this.book.year, this.book.author, this.book.id));
      return el;
    };

    createPropertyElement (value1, value2, value3, id) {
      const el = dom.cr('td');
      el.innerHTML = "<label>Name:</label><br>"+
        "<label>"+value1+"</label><br><label>Yaer:</label><br>"+
        "<label>"+value2+"</label><br><label>Author:</label><br>"+
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

  
  didMount();

  function displayList(rootEl, library = [], domWorker) {
    if(!rootEl)
      return;
    rootEl.innerHTML = null;
    library.forEach(user => rootEl.appendChild(new domWorker(user).createElement()));
  }

  window.addEventListener("message", receiveMessage, false);
  function receiveMessage(event){
    	theUser = event.data[0];
      currentUser = event.data[1];
      //alert(theUser.firstName);
      displayBooks(theUser);
  }


  function displayBooks(saved){
  	var result = arrayOfBook.map(a => a[4]);
    libraryBookCount = saved.libraryBook.length;
  	for(var i = 0; i<libraryBookCount;i++){
  		var id = result.indexOf( saved.libraryBook[i] );
    	library.push( new Book( 
      		arrayOfBook[id][0], arrayOfBook[id][1], 
      		arrayOfBook[id][2], arrayOfBook[id][3],
      		arrayOfBook[id][4] ) );
    } 

  	for(var i = 0; i < saved.otherBook.length;i++){
    	library.push( new Book( 
          saved.otherBook[i][0], saved.otherBook[i][1], 
          saved.otherBook[i][2], saved.otherBook[i][3],
          saved.otherBook[i][4] ) );
    } 

    displayBookList = displayList.bind(this, dom.el('list'), library, BookDOMWorker);
    displayBookList();
  }


  $("#list").on("click", "tr", function(e) {      

      if ($(e.currentTarget).index()<libraryBookCount){
        if ( currentUser.libraryBook.indexOf( library[$(e.currentTarget).index()].id ) == -1 ){
          currentUser.libraryBook.push(library[$(e.currentTarget).index()].id);
          update();
          alert("This book was added to your list");
        }else{
          alert("This book is already in your list");
        }
      }else{
        alert(library[$(e.currentTarget).index()].name);
        //alert( $(e.currentTarget).index()-libraryBookCount );
        createNewBook(library[$(e.currentTarget).index()]);
        update();
      }

  });

  function createNewBook(book){
    var newBook = new Book(book.name, book.year, book.author, book.src, currentUser.otherBook.length
               + currentUser.libraryBook.length );
    currentUser.otherBook.push(newBook);
  }

  function update(){
    window.parent.postMessage(currentUser, "*");
  }

  $("#list").on("click", "tr", function(e) {
    
  });

})();