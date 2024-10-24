let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZnppemFlc2RmZGlqeWdya2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzNDczNzIsImV4cCI6MjA0MzkyMzM3Mn0.llAqlwkL2QvoEaHCq9b9yf0Thp3F31xlA2f-QGx0lGk`

let endPoint = `https://qnfzizaesdfdijygrkkh.supabase.co/rest/v1/movies`

let modalComments
let modalMovies

let commentsMovie = []

const logIn = () => {
    event.preventDefault()

    let username = inputUserName.value
    window.localStorage.setItem('username', username)

    window.location = "movies.html"
}

const getUserName = () => {

    let username = window.localStorage.getItem('username')

    userNameLabel.innerHTML = username

}

const showComments = (id) => {

    modalComments = new bootstrap.Modal(document.getElementById("modalComments"))
    modalComments.show()
    inputIdMovie.value = id
    getComments(id)

}


const getMovies = async () => {

    let url = `${endPoint}?order=title.asc`

    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': token,
            'Authorization': token
        }
    })

    let body = await response.json()
    
    if (response.ok) {

        let cardLayOut = ``

        for (let i = 0; i < body.length; i++) {

            cardLayOut += `<div class="m-3" style="width: 400px;">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${body[i].title}</h5>
                    <p class="card-text">Rating: ${body[i].rating} </p>
                    <button onclick="showComments(${body[i].id})" class="btn btn-primary"><i class="fa-regular fa-comment"></i></a>
                </div>
            </div>
        </div>`

        }

        movieCards.innerHTML = cardLayOut

    }


}


const getComments = async (id) => {

    let url = `${endPoint}?id=eq.${id}`


    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': token,
            'Authorization': token
        }
    })

    let body = await response.json()

    if (response.ok) {

        let movie = body[0]
        let comments = movie.comments

        let listItemLayOut = ``

        for (let i = 0; i < comments.length; i++) {

            listItemLayOut += `<li class="list-group-item">${comments[i].user}: ${comments[i].text} </li>`

        }

        listOfComment.innerHTML = listItemLayOut
        commentsMovie = comments
    }


}


const addComment = async ()=>{


    let id = inputIdMovie.value
    let text  = inputComment.value
    let user = window.localStorage.getItem('username')

    let comment = { 
        text, 
        user
    }

    commentsMovie.push(comment)

    let updateInfo = {
        comments : commentsMovie
    }


    let url = `${endPoint}?id=eq.${id}`
    let response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'apikey': token, 
            'Authorization' : token, 
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(updateInfo)
    })

    if (response.ok){
        console.log("Comment Added") 
        getComments(id)
    }else{
        console.log("Comment wasn´t added")
        let body = await response.json()
        console.log(body)
    }

}


const onLoadMovies = () => {

    getMovies()
    getUserName()

}


const showModalMovies = ()=>{

    modalMovies = new bootstrap.Modal(document.getElementById("modalMovies1"))
    modalMovies.show()

}


const createMovie = async() =>{

    let title = inputTitle.value
    let rating = inputRating.value 
    let genre = inputGenre.value
     
    let movie = {
        title, 
        rating, 
        genre
    }

    let response = await fetch(endPoint, {
        method : 'POST',
        headers: {
            'apikey' : token, 
            'Authorization': token, 
            'Content-Type' : 'application/json'
        }, 
        body : JSON.stringify(movie)
    })

    if (response.ok){

        window.location = "movies.html"
        
    }else{
        console.log("Movie wasn´t created")
        let body  = await response.json()
        console.log(body)
    }

}