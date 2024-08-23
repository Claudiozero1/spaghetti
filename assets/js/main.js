const pokeSection = document.getElementById('todos')
const verTodos = document.getElementById('ver-todos')
// const cards = document.querySelectorAll('.cards');
const filter = document.querySelectorAll('.btn-filter');
const btnNext = document.getElementById('btn-next');

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/'; //URL a consultar
let ENDPOINT = ''


/*************************************** RENDER POKEMON ************************************/ 

function renderCards(array) {
    // console.log(array)
    const htmlArray = array.map((poke) => {
        return (`  
            <div class="col">
                    <div class="card bg-light text-dark" style="max-width: 540px;">
                         <img src="${poke.sprites.other["official-artwork"].front_default}" class="card-img-top"
                            alt="...">
                        <div class="card-body p-1 justify-content-center">
                            <h6 class="card-title mb-1 text-center">${poke.name}</h6>
                            
                                <a class="btn btn-info btn-sm d-block" data-bs-toggle="collapse" href="#${poke.id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                                    Informacion
                                  </a>
                            
                              <div class="collapse" id="${poke.id}">
                                <div class="card card-body">
                                  <p>Altura: 0,${poke.height}m Peso: ${poke.weight}kg</p>
                                  <p>${poke.types[0].type.name}</p>
                                  <p>${poke.types[1]?.type ? `${poke.types[1]?.type.name}`: ``}</p>
                                </div>
                              </div>

                        </div>
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
const {next, results} = respuestaJSON
    let nextPage = next;
    yield results; // results son url no pkmn
    while(nextPage) {
        const respuesta = await fetch(nextPage);
        const respuestaJSON = await respuesta.json();
        yield respuestaJSON.results;
        nextPage = respuestaJSON.next
    }
    return[]
}

const initPoke = initPokes();

const pagination = async () => {
    for await (const page of initPoke) {
        // initPoke.next().then((res) => console.log(res))
        const {value: url, done} = await initPoke.next();
        if (!done) {

            const pokemonURL = url.map(pokemon => pokemon.url);
            
            const infoPoke = pokemonURL.map(async (urlPoke) => {
                const respuesta = await fetch(urlPoke);
                const info = await respuesta.json();
                return info;
            })
            // console.log(infoPoke)
            const arrayPokemon = await Promise.all(infoPoke)
            console.log(arrayPokemon)
            renderCards(arrayPokemon)
            return arrayPokemon

        }
    }
}

// pagination()

btnNext.addEventListener('click', pagination())






// arriba tengo array de cada pagina

// podria combinar de alguna forma la paginacion con getpokes para obtener los pokemon de cada pagina
// opciones: cambiar el valor de ENDPOINT y pasarlo a la BASE_URL
//           cambiar la url completa por la paginacion


// abajo tengo array de cada pokemon 


/********************************** PRIMER RENDER ********************************************/

// const initPokes0 = async () => {
//     const pokemon = await getPokes()  
//     renderCards(pokemon)
// }

// initPokes0()

// const initPoke = initPokes();

// const renderPages = async () => {
//     const { value: url, done } = await initPoke.next();
//     if (!done) {
//         const htmlArray = url.map((poke) => {
//             return `
//                      <div class="col">
//                     <div class="card bg-light text-dark" style="max-width: 540px;">
//                          <img src="${poke.sprites.other["official-artwork"].front_default}" class="card-img-top"
//                             alt="...">
//                         <div class="card-body p-1 justify-content-center">
//                             <h6 class="card-title mb-1 text-center">${poke.name}</h6>
                            
//                                 <a class="btn btn-info btn-sm d-block" data-bs-toggle="collapse" href="#${poke.id}" role="button" aria-expanded="false" aria-controls="collapseExample">
//                                     Informacion
//                                   </a>
                            
//                               <div class="collapse" id="${poke.id}">
//                                 <div class="card card-body">
//                                   <p>Altura: 0,${poke.height}m Peso: ${poke.weight}kg</p>
//                                   <p>${poke.types[0].type.name}</p>
//                                   <p>${poke.types[1]?.type ? `${poke.types[1]?.type.name}`: ``}</p>
//                                 </div>
//                               </div>

//                         </div>
//                     </div>
//                 </div>
//                 </div>
//                 `;
//         });
//         const html = htmlArray.join('')
//     const pokeSection = document.getElementById('todos');
//     pokeSection.innerHTML = html;
//         return;
//     }

//     return (buttonNext.disabled = true);
// };

// const btnNext = document.getElementById('btn-next');
// btnNext.addEventListener('click', renderPages())

// renderPages()



// const btnNext = document.getElementById('btn-next');
// btnNext.addEventListener('click', renderPages())




// <div class="col">
// <div class="card bg-light p-2 text-dark" style="max-width: 540px;">
//     <img src="${poke.sprites.other["official-artwork"].front_default}" class="card-img-top" alt="...">
//     <div class="card-body">
//         <h5 class="card-title mb-0">${poke.name}</h5>
        

//     </div>
// </div>
// </div>




// const queryParams = new URLSearchParams(window.location.search);
// const charID = queryParams.get('id');


// const renderCard = async (e) => {

// }

// cards.forEach(card => {card.addEventListener('MouseOver', renderCard)})

//////////////////////////////////////////////////////////////////////

