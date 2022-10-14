function httpReq(){
    return{
        post({url, body, headers}, cb){
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            Object.entries(headers).forEach(([key, value])=>{
                xhr.setRequestHeader(key, value);
            });
            xhr.addEventListener('load', function(){
                if(xhr.status < 200 || xhr.status > 300){
                    cb(xhr.status, 'Error');
                }else{
                    cb(null, JSON.parse(xhr.response))
                }
                
            })
            xhr.addEventListener('error', function(){
                console.log('Error :'+ xhr.status);
                cb(xhr.status, xhr);
            })
            xhr.send(JSON.stringify(body))

        },
        get(url, cb){
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.addEventListener('load', function(){
                if(xhr.status === 200){
                    cb(null, JSON.parse(xhr.response))
                }else{
                    cb(xhr.status, 'Error');
                }
            })
            xhr.addEventListener('error', function(){
                cb(xhr.status, 'Error');
            })
            xhr.send()

        }
    }
}

window.onload = function(){
    loadNews()
}

const newsContainer = document.querySelector('.news')
const req = httpReq();

//Elements
const inputCountry = document.forms[0][0];
const selectQuery = document.forms[0][1];
document.querySelector('button').addEventListener('click', function(e){
    e.preventDefault();
    if(selectQuery.value === ''){
        service.topHeadlines(inputCountry.value, getNews);
    }else{
        service.everything(selectQuery.value, getNews)
    }
})




const service = (function(){
    const api = 'c795c393dd354040bad1ff3dae4c1f8a';
    const url = 'https://newsapi.org/v2'
    
    return{
        everything(query = 'business', cb){
            req.get(`${url}/everything?q=${query}&apiKey=${api}`, cb);
        },
        topHeadlines(country = 'ru', cb){
            req.get(`${url}/top-headlines?country=${country}&apiKey=${api}`, cb);
        }
    }
})()   



function loadNews(){
   
    service.topHeadlines('ru',getNews );
}

function getNews(err, respons){
    
    newsContainer.innerHTML = '';
    newsContainer.innerText = '';
    if(err){
        alertError()
        console.error('Ошибка')
        return
    }
    
    getsArticle(respons.articles)
}

function getsArticle(news){
    
    
    if(news.length === 0){
        alertError()
    }
    news.forEach((article)=>{
        renderNews(article)

    });

}
function renderNews({urlToImage,title, url,description, source}){
    
    newsContainer.innerHTML += `
    <div class="card m-2 mt-3 p-0" style="width: 19rem;">
        <img class="card-img-top " style="width:100%" src="${urlToImage? urlToImage: ''}" alt="${title? title: ''}">
        <div class="card-body">
            <h5 class="card-title">${title? title: ''}</h5>
            <p class="card-text">${description? description: ''}</p>
            <a href="${url? url: ''}" title="go to source" target="_blank"  class="btn btn-primary">${source.name? source.name: 'go to source'}</a>
        </div>
    </div>
    `
}




function alertError(){
    const wrapperNews = document.querySelector('.card-columns');
    const patterError = `
    <div class="alert  m-auto alert-danger" role="alert">
        Ошибка запроса
    </div>
    `
    
    wrapperNews.insertAdjacentHTML('beforeend', patterError)
    setTimeout(()=>{
        wrapperNews.querySelector('.alert-danger').remove();
        
    }, 2000)
}





