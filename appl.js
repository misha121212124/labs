(() => {
  library = [];
  var theUser = [];
  
  const dom = {
    cr: (tagName) => document.createElement(tagName),
    el: (elId) => document.getElementById(elId)
  };

  const didMount = () => {
    for(var i = 0; i<6;i++){
    library.push( new Book( 
      arrayOfBook[i][0], arrayOfBook[i][1], 
      arrayOfBook[i][2], arrayOfBook[i][3],
      arrayOfBook[i][4] ) );
    } 

    var dd = document.documentElement.clientWidth;
        window.onload = function(){
            document.getElementById('ttable').style.minWidth = dd/2+'px';
        }

    document.getElementById('go_back').onclick = () => {
      setUser();
      goToPage("users-page.html", false);
    }

    bookDOMWorker = new BookDOMWorker( new Book('', '', '', '','-1') );
    displayBookList = displayList.bind(this, dom.el('list'), library, BookDOMWorker);
    displayBookList();
    document.getElementById('add-book-btn').onclick = () => {
     document.getElementById('add-book-form').style.display = 'block';
    }

    document.getElementById('add-btn').onclick = () => {
     createNewBook( dom.el('name').value, dom.el('year').value,
           dom.el('author').value, dom.el('imLink').value,);
    }

  };

  function createNewBook(name, year, author, src){
    var book = new Book(name, year, author, src, theUser.otherBook.length
               + theUser.libraryBook.length );
    theUser.otherBook.push(book);
  }

  $("#list").on("click", "tr", function(e) {
    if ( theUser.libraryBook.indexOf($(e.currentTarget).index()) == -1 ){
      theUser.libraryBook.push($(e.currentTarget).index());
      alert("This book was added to your list");
    }else{
      alert("This book is already in your list");
    }
  });

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
      const el = document.createElement('tr');
      const cEl = this.createPropertyElement;
      const im = this.createImEl;
      el.appendChild(im(this.book.src));
      el.appendChild(cEl(this.book.name, this.book.year, this.book.author, this.book.id));
      return el;
    };
    createPropertyElement (value1, value2, value3, id) {
      const el = document.createElement('td');
      el.innerHTML = "<label>Name:</label><br>"+
        "<label>"+value1+"</label><br><label>Yaer:</label><br>"+
        "<label>"+value2+"</label><br><label>Author:</label><br>"+
        "<label>"+value3+"</label><label style='display: none'>"+
        id+"</label>";
      return el;
    };
    createImEl (value) {
      const el = document.createElement('td');
      el.innerHTML="<img src=" +value+">";

      return el;      
    }
  }

  function displayList(rootEl, library = [], domWorker) {
    if(!rootEl)
      return;
    rootEl.innerHTML = null;
    library.forEach(user => rootEl.appendChild(new domWorker(user).createElement()));
  }

  window.addEventListener("message", receiveMessage, false);
  function receiveMessage(event){
    if( typeof( !(event.data[0] ) == "object") ){
      theUser = event.data;
    }
  }

  didMount();

  function goToPage(location){
  document.location = location;
  }
  function setUser(){
    window.parent.postMessage(theUser, "*");
  }

})();