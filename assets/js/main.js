const pokeSection = document.getElementById('todos')
const verTodos = document.getElementById('ver-todos')
// const cards = document.querySelectorAll('.cards');
const filter = document.querySelectorAll('.btn-filter');
const btnNext = document.getElementById('btn-next');
const btnPrevious = document.getElementById('btn-previous');

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/'; //URL a consultar
let ENDPOINT = ''


/*************************************** RENDER POKEMON ************************************/ 

function renderCards(array) {
    // console.log(array)
    const htmlArray = array.map((poke) => {
        return (`  
            <div class="col"> 
                    <div class="pl-0 d-flex card bg-light text-dark" style="max-width: 540px;">
                         <img src="${poke.sprites.other["official-artwork"].front_default}" class="card-img-top"
                            alt="...">
                        <div class="col card-body p-1 justify-content-center">
                            <h6 class="card-title mb-1 text-center">${poke.name}</h6>
                            
                                <a class="btn btn-info btn-sm d-block" data-bs-toggle="collapse" href="#${poke.id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                                    Informacion
                                  </a>
                            
                              

                        </div>
                    </div>
                    </div>
                    <div class=" collapse collapse-horizontal p-0 overflow-x-auto text-dark" id="${poke.id}">
                                <div class="card card-body">
                                  <p>Altura: 0,${poke.height}m Peso: ${poke.weight}kg</p>
                                  <p>${poke.types[0].type.name}</p>
                                  <p>${poke.types[1]?.type ? `${poke.types[1]?.type.name}`: ``}</p>
                                </div>
                              </div>
                </div>
                
        `);
    });
    const html = htmlArray.join('')
    const pokeSection = document.getElementById('todos');
    pokeSection.innerHTML = html;
}

/************************************* OBTENER POKEMON ***************************************/

const getPokes = async () => {
    const respuesta = await fetch(BASE_URL);
    const respuestaJSON = await respuesta.json();
    const pokemonURL = respuestaJSON.results.map(pokemon => pokemon.url);
    const infoPoke = pokemonURL.map(async (urlPoke) => {
        const respuesta = await fetch(urlPoke);
        const info = await respuesta.json();
        return info;
    })
    const arrayPokemon = await Promise.all(infoPoke)
    return arrayPokemon
}

/************************************ RENDER FILTRO ******************************************/


const renderFilter = async () => {

    const respuesta = await fetch(`https://pokeapi.co/api/v2/type/${ENDPOINT}`);
    const respuestaJSON = await respuesta.json();
    const pokemonTypes = respuestaJSON.pokemon.map(pokemon => pokemon.pokemon.url);

    const pokeTypes = pokemonTypes.map(async (pokeType) => {
        const respuesta = await fetch(pokeType);
        const info = await respuesta.json();
        return info;
    })

    const arrayPokemon = await Promise.all(pokeTypes)
    return arrayPokemon
}

/*************************************** FILTRO **********************************************/


const composeFilter = async (e) => {
    const btnID = e.target.id

    pokeSection.innerHTML = '';

    if (btnID === 'ver-todos') {
        const array = await getPokes()
        renderCards(array)

    } else {
        ENDPOINT = btnID
        const array = await renderFilter()
        renderCards(array)
    }

}

filter.forEach((button) => { button.addEventListener('click', composeFilter) })


/************************************* PAGINACION ********************************************/

async function* initPokes() {
const respuesta = await fetch(BASE_URL);
const respuestaJSON = await respuesta.json();
const {next, previous, results} = respuestaJSON
    let nextPage = next;
    let previousPage = previous;
    yield results; // results son url no pkmn
    while(nextPage) {
        const respuesta = await fetch(nextPage);
        const respuestaJSON = await respuesta.json();
        yield respuestaJSON.results;
        nextPage = respuestaJSON.next
    }
    if(!previousPage) {
        return (btnPrevious.disabled = true);
} else {
     const respuesta = await fetch(nextPage);
    const respuestaJSON = await respuesta.json();
    previousPage = respuestaJSON.previous
    console.log(previousPage)
}
    return[]
}

const initPoke = initPokes();

const forward = async () => {
    const {value: nextPage, done} = await initPoke.next();
    if (!done) {

        const pokemonURL = nextPage.map((pokemon) => pokemon.url);
        const infoPoke = pokemonURL.map(async (urlPoke) => {
        const respuesta = await fetch(urlPoke);
        const info = await respuesta.json();
        return info;
        })
        const arrayPokemon = await Promise.all(infoPoke)
        renderCards(arrayPokemon)

        return arrayPokemon

        }
    return (btnNext.disabled = true);
}



forward()

btnNext.addEventListener('click', () => forward())
// btnPrevious.addEventListener('click', () => backward())


// cards.forEach(card => {card.addEventListener('MouseOver', renderCard)})

//////////////////////////////////////////////////////////////////////

// async function* initPokes() {
//     const respuesta = await fetch(BASE_URL);
//     const respuestaJSON = await respuesta.json();
//     const {next, results} = respuestaJSON
//         let nextPage = next;
//         yield results; // results son url no pkmn
//         while(nextPage) {
//             const respuesta = await fetch(nextPage);
//             const respuestaJSON = await respuesta.json();
//             yield respuestaJSON.results;
//             nextPage = respuestaJSON.next
//         }
//         return[]
//     }
    
//     const initPoke = initPokes();
    
//     const pagination = async () => {
//             const {value: page, done} = await initPoke.next();
//             if (!done) {
    
//                 const pokemonURL = page.map((pokemon) => pokemon.url);
                
//                 const infoPoke = pokemonURL.map(async (urlPoke) => {
//                     const respuesta = await fetch(urlPoke);
//                     const info = await respuesta.json();
//                     return info;
//                 })
//                 // console.log(infoPoke)
//                 const arrayPokemon = await Promise.all(infoPoke)
//                 renderCards(arrayPokemon)
//                 return arrayPokemon
    
//             }
//             return (btnNext.disabled = true);
//         }
    
//     pagination()
    
//     btnNext.addEventListener('click', () => pagination())
    