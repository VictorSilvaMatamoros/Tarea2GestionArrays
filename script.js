const main = document.getElementById('main');
const addUserBtn = document.getElementById('add-user');
const doubleBtn = document.getElementById('double');
const showMillionairesBtn = document.getElementById('show-millionaires');
const sortBtn = document.getElementById('sort');
const calculateWealthBtn = document.getElementById('calculate-wealth');

//creamos el vector para almacenar usuarios
let userList = getSavedUsers() || []; //cargamos los datos al inciar laapp
let totalWealth = getSavedTotalWealth() || 0; //cargamos el totalde dinero a 0 cuando iniciamos la app

//creamos una funcion asincrona con el async donde cogeremos de una api
//los nombres aleatorios de los millonarios y genereamos un numero random

async function getRandomUser() {
  let res = await fetch("https://randomuser.me/api");
  let data = await res.json();
  let user = data.results[0];

  const newUser = {
    name: `${user.name.first} ${user.name.last}`,
    money: Math.floor(Math.random() * 1000000),
  };
  
  addData(newUser);
}

//funcion para añadir usuarios a la lista y guradralos en el local storage

function addData(obj) {
  userList.push(obj);
  updateDOM();
  saveData();
}

//funcion para doblar el dinero

function doblarDinero() {
  userList = userList.map((user) => {
    return {
      ...user,
      money: user.money * 2,
    };
  });
  updateDOM();
  saveData();
}

//ordenar usuarios por dinero

function ordenarPorDinero() {
  userList.sort((a, b) => b.money - a.money);
  updateDOM();
  saveData();
}

//filtrar por dinero

function mostrarMillonarios() {
  userList = userList.filter((user) => user.money >= 1000000);
  updateDOM();
  saveData();
}

//medainte el metodo reduce vamos acumulando la suma del dinero en el acc que inicalmente valdria 0 para finalmente mostrar el total 
function calculateWealth() {
    totalWealth = userList.reduce((acc, user) => (acc += user.money), 0);
    const wealthElement = document.createElement('div');
    wealthElement.innerHTML = `<h3>Total de riqueza: <strong>${formatMoney(totalWealth)}</strong></h3>`;
    main.appendChild(wealthElement);
    saveTotalWealth();
  }

  // Función que actualiza el DOM
function updateDOM() {
    main.innerHTML = '<h2><strong>Usuario</strong> Riqueza</h2>';
    userList.forEach(user => {
      const userElement = document.createElement('div');
      userElement.classList.add('user');
      userElement.innerHTML = `<strong>${user.name}</strong> ${formatMoney(user.money)}`;
      main.appendChild(userElement);
    });
  }
  
  
  //le damos el formato que queramos al dinero 
  function formatMoney(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '€';
  }
  // Función que guarda los usuarios y el total de riqueza en localStorage
  function saveData() {
    localStorage.setItem('users', JSON.stringify(userList));
  }
  
  // Función que carga los usuarios desde localStorage al iniciar la app
  function getSavedUsers() {
    return JSON.parse(localStorage.getItem('users'));
  }
  
  // Función que guarda el total de riqueza en localStorage
  function saveTotalWealth() {
    localStorage.setItem('totalWealth', JSON.stringify(totalWealth));
  }
  
  // Función que carga el total de riqueza desde localStorage al iniciar la app
  function getSavedTotalWealth() {
    return JSON.parse(localStorage.getItem('totalWealth'));
  }
  
  // Obtenemos un usuario al iniciar la app si no hay usuarios guardados
  if (!userList.length) {
    getRandomUser();
  }
  
  // Event listeners
  addUserBtn.addEventListener('click', getRandomUser);
  doubleBtn.addEventListener('click', doblarDinero);
  sortBtn.addEventListener('click', ordenarPorDinero);
  showMillionairesBtn.addEventListener('click', mostrarMillonarios);
  calculateWealthBtn.addEventListener('click', calculateWealth);
  