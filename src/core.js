import view from './view';

view();

class Core {
  constructor(q) {
    this.rowStart = 0;
    this.rowEnd = 4;
    this.page = 1;
    this.q = q;
    this.getContent();
  }

  getContent() {
    fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBIRcZ6FuPQ1cNuv5zyTLAVOwMQNLHXji4&type=video&part=snippet&maxResults=50&q=${this.q}`)

      .then(dataWrappedByPromise => dataWrappedByPromise.json())
      .then((data) => {
        if (this.items == undefined) {
          this.items = data.items;
        } else {
          this.items = Object.assign(this.items, data.items);
        }

        this.countPages();
        this.render();
      });
  }

  pushContent(start, end) {
    for (let i = start; i < end; i += 1) {
      fetch(`https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&id=${this.items[i].id.videoId}&part=snippet,statistics`)
        .then(dataPromise => dataPromise.json())
        .then((videoStat) => {
          view.innerHTML = videoStat.items[0].statistics.viewCount;
          newRow('title', title.innerHTML, 'description', description.innerHTML, 'img', img.innerHTML, 'autor', autor.innerHTML, 'data', data.innerHTML, 'view', view.innerHTML);
        });

      const title = document.createElement('div');
      const description = document.createElement('div');
      const img = document.createElement('div');
      const autor = document.createElement('div');
      const data = document.createElement('div');

      title.innerHTML = this.items[i].snippet.title;
      description.innerHTML = this.items[i].snippet.description;
      img.innerHTML = this.items[i].snippet.thumbnails.high.url;
      autor.innerHTML = this.items[i].snippet.channelTitle;
      data.innerHTML = this.items[i].snippet.publishedAt;
    }
  }

  render() {
    if (this.currentPage === undefined) {
      this.pushContent(this.rowStart, this.rowEnd);
    }

    if (this.currentPage === 1) {
      this.rowStart -= 4;
      this.rowEnd -= 4;
      this.page -= 1;
      document.querySelectorAll('.pages')[1].innerHTML = `${this.page}`;

      this.pushContent(this.rowStart, this.rowEnd);
    }

    if (this.currentPage === 3) {
      this.rowStart += 4;
      this.rowEnd += 4;
      this.page += 1;
      document.querySelectorAll('.pages')[1].innerHTML = `${this.page}`;
      this.pushContent(this.rowStart, this.rowEnd);
    }
  }


  pages(current) {
    this.currentPage = current;
    document.querySelector('.container').innerHTML = '';
    this.render();
  }


  countPages() {
    this.count = Math.ceil(this.items.length / 4);
    let i = 0;
    while (i <= 2) {
      const pages = document.createElement('div');
      pages.className = 'pages';
      pages.innerHTML = `${i + 1}`;
      if (pages.innerHTML == 3) pages.innerHTML = '+';
      if (pages.innerHTML == 1) pages.innerHTML = '-';
      if (pages.innerHTML == 2) pages.innerHTML = `${this.page}`;
      document.body.appendChild(pages);
      i += 1;
    }

    document.querySelectorAll('.pages')[2].addEventListener('click', this.pages.bind(this, 3), false);
    document.querySelectorAll('.pages')[0].addEventListener('click', this.pages.bind(this, 1), false);
    document.onkeydown = this.checkKey.bind(this);
  }

  checkKey(e) {
    if (e.keyCode == '37') {
      document.querySelector('.container').innerHTML = '';
      this.rowStart -= 4;
      this.rowEnd -= 4;
      this.page -= 1;
      document.querySelectorAll('.pages')[1].innerHTML = `${this.page}`;
      this.pushContent(this.rowStart, this.rowEnd);
    }
    if (e.keyCode == '39') {
      document.querySelector('.container').innerHTML = '';
      this.rowStart += 4;
      this.rowEnd += 4;
      this.page += 1;
      document.querySelectorAll('.pages')[1].innerHTML = `${this.page}`;

      this.pushContent(this.rowStart, this.rowEnd);
    }
  }
}
function newObject() {
  const q = document.querySelector('.textinput').value;
  if (q !== '') { const obj = new Core(q); } else { alert('заполните поле!'); return; }
  document.querySelector('.container').innerHTML = '';

  for (let i = 0; i < 4; i += 1) {
    const n = document.querySelectorAll('.pages')[0];
    n.parentNode.removeChild(n);
  }
}
document.querySelector('.sendbutton').addEventListener('click', newObject);


function newRow(clasname, inner, clasname1, inner1, clasname2, inner2, clasname3, inner3, clasname4, inner4, clasname5, inner5) {
  const row = document.createElement('div');
  row.className = 'row';
  document.querySelector('.container').appendChild(row);
  const img = document.createElement('div');
  img.className = clasname2;
  row.appendChild(img).style.backgroundImage = `url(${inner2})`;
  const description = document.createElement('div');
  description.className = clasname1;
  description.innerHTML = inner1;
  row.appendChild(description);
  const title = document.createElement('div');
  title.className = clasname;
  title.innerHTML = inner;
  row.appendChild(title);
  const autor = document.createElement('div');
  autor.className = clasname3;
  autor.innerHTML = inner3;
  row.appendChild(autor);
  const dataimg = document.createElement('div');
  dataimg.className = 'dataimg';
  row.appendChild(dataimg);
  const data = document.createElement('div');
  data.className = clasname4;
  data.innerHTML = inner4;
  row.appendChild(data);
  const viewimg = document.createElement('div');
  viewimg.className = 'viewimg';
  const view = document.createElement('div');
  row.appendChild(viewimg);
  view.className = clasname5;
  view.innerHTML = inner5;
  row.appendChild(view);
  const autorimg = document.createElement('div');
  autorimg.className = 'autorimg';
  row.appendChild(autorimg);
}
