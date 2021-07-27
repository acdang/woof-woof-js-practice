// fetch all pups
function fetchPups() {
    return fetch('http://localhost:3000/pups')
    .then(resp => resp.json())
}

// handle display pup names in dog bar
const dogBar = document.querySelector('div#dog-bar')

function showAllPups() {
    while (dogBar.firstChild) {
        dogBar.removeChild(dogBar.firstChild);
    }

    fetchPups().then(pupsArray => {
        return pupsArray.map(function(pup) {
            const span = document.createElement('span')
            span.textContent = `${pup.name}`
    
            dogBar.appendChild(span)
        })
    })
}

function showGoodPups() {
    while (dogBar.firstChild) {
        dogBar.removeChild(dogBar.firstChild);
    }
    
    fetchPups().then(pupsArray => { return pupsArray.filter(pup => pup.isGoodDog === true) })
    .then(goodPupsArray => {
        goodPupsArray.map(function(pup) {
            const span = document.createElement('span')
            span.textContent = `${pup.name}`
    
            dogBar.appendChild(span)
        })
    })
}

const filterButton = document.querySelector('button#good-dog-filter')

filterButton.addEventListener('click', function(event) {
    const filterButtonContent = event.target.textContent

    if (filterButtonContent === "Filter good dogs: OFF") {
        filterButton.textContent = "Filter good dogs: ON"
        // filter = true
        handleFilter()
    } else if (filterButtonContent === "Filter good dogs: ON") {
        filterButton.textContent = "Filter good dogs: OFF"
        // filter = false
        handleFilter()
    }
})

// handle filter
function handleFilter() {
    const filterButtonContent = filterButton.textContent

    if (filterButtonContent === "Filter good dogs: ON") {
        showGoodPups()
    } else  if (filterButtonContent === "Filter good dogs: OFF") {
        showAllPups()
    }
}
handleFilter() // no filter when page first loads

// show info about pup when its name is clicked from dog bar
const dogInfo = document.querySelector('div#dog-info')

function showPup(pupName) {
    // find matching pup Object
    fetchPups().then(pupsArray => { return pupsArray.find(pup => pup.name === pupName) })
    // update div#dog-info
    .then(pup => {
        dogInfo.dataset.id = pup.id
        dogInfo.innerHTML = `
            <img src=${pup.image} alt=${pup.name}>
            <h2>${pup.name}</h2>
            <button>${pup.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
        `
    })
}

dogBar.addEventListener('click', function(event) {
    if (event.target.matches('span')) {
        const pupName = event.target.textContent
        showPup(pupName)
    }
})

// toggle Good/Bad Dog
dogInfo.addEventListener('click', function(event) {
    if (event.target.matches('button')) {
        const button = dogInfo.querySelector('button')
        let pupStatus = button.textContent
        let newStatus;
        
        if (pupStatus === "Good Dog!") {
            button.textContent = "Bad Dog!"
            newStatus = false
        } else if (pupStatus === "Bad Dog!") {
            button.textContent = "Good Dog!"
            newStatus = true
        }

        fetch(`http://localhost:3000/pups/${dogInfo.dataset.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isGoodDog: newStatus })
        })
        handleFilter()
    }
})
