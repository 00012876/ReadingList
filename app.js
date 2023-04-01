
//third party libs
const express = require('express')
const app =express()

//node libs
const fs = require('fs')
const PORT = 8000

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded ({ extended: false}))

// http://localhost:8000
app.get('/', (req, res)=> {
 fs.readFile('./data/books.json', (err, data) => {
   if (err) throw err
   
   const books = JSON.parse(data)

   res.render('home', { books: books })
 })
})

app.post('/add', (req, res) => {
  const formData = req.body 
  
  if (formData.book.trim() == '') {
    fs.readFile('./data/books.json', (err, data) => {
      if (err) throw err

      const books = JSON.parse(data)

      res.render('home', { error: true, books: books })
    })
  } else {
    fs.readFile('./data/books.json', (err, data) =>{
      if (err) throw err

      const books = JSON.parse(data)

      const book = {
        id: id(),
        info: formData.book,
        read: false
        }

        books.push(book)

        fs.writeFile('./data/books.json', JSON.stringify(books), (err) => {
          if (err) throw err

          fs.readFile('./data/books.json', (err, data) => {
            if (err) throw err

            const books = JSON.parse(data)

            res.render('home', {success: true, books: books })
          })
        })
    })
  }
})

app.get('/:id/delete', (req, res) => {
  const id = req.params.id

  fs.readFile('./data/books.json', (err, data) => {
    if (err) throw err

    const books = JSON.parse(data)

    const filteredBooks = books.filter(book => book.id != id)

    fs.writeFile('./data/books.json', JSON.stringify(filteredBooks), (err) => {
      if (err) throw err
      res.render('home', { books: filteredBooks, deleted:true })

    })
  })
})


app.get('/:id/update', (req, res) => {
  const id = req.params.id
  
  fs.readFile('./data/books.json', (err, data) => {
    if (err) throw err

    const books = JSON.parse(data)
    const book = books.filter(book => book.id == id)[0]
    const bookIdx = books.indexOf(book)
    const splicedBook = books.splice(bookIdx, 1)[0]

    splicedBook.read = true

    books.push(splicedBook)

    fs.writeFile('./data/books.json', JSON.stringify(books), (err) => {
      if (err) throw err
      
      res.render('home', { books: books })
    })
  })
    
})

app.listen(PORT, (err) => {
    if (err) throw err

console.log (`This app is running on port ${PORT}`)
})


function id () {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
  }
