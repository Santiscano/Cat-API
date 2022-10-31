import './style.css'

const api = axios.create({
  baseURL: 'https://api.thecatapi.com/v1'
});
api.defaults.headers.common['X-API-KEY'] = 'c08d415f-dea7-4a38-bb28-7b2188202e46';

const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_URL_FAVOTITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVOTITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('error')
const load_new = document.getElementById('recargar')

// get basico
async function loadRandomMichis() {
  const res = await fetch(API_URL_RANDOM);
  const data = await res.json();
  console.log('Random')
  console.log(data)

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    
    img1.src = data[0].url;
    img2.src = data[1].url;

    btn1.onclick = () => saveFavouriteMichi(data[0].id);
    btn2.onclick = () => saveFavouriteMichi(data[1].id);
  }
}
load_new.onclick = () => loadRandomMichis();
// cargar favoritos
async function loadFavouriteMichis() {
  const res = await fetch(API_URL_FAVOTITES, {
    method: 'GET',
    headers: {
      'X-API-KEY': 'c08d415f-dea7-4a38-bb28-7b2188202e46',
    },
  });
  const data = await res.json();
  console.log('Favoritos')
  console.log(data)

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    const section = document.getElementById('favoriteMichis')
    section.innerHTML = "";

    const h2 = document.createElement('h2');
    const h2Text = document.createTextNode('Michis favoritos');
    h2.className = 'text-white'
    h2.appendChild(h2Text);
    // section.appendChild(h2);

    data.forEach(michi => {
      const article = document.createElement('article');
      const margin = document.createElement('div');
      const div = document.createElement('div')
      const img = document.createElement('img');
      const btn = document.createElement('button');
      const btnText = document.createTextNode('Eliminar de favoritos');

      img.src = michi.image.url;
      img.width = 150;
      section.className ='py-20 grid gap-28 md:gap-12 md:grid-cols-3'

      article.className = 'w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700'
      margin.className = 'flex flex-col items-center pb-10 px-6 pt-8'
      img.className = 'mb-3 w-24 h-24 rounded-full shadow-lg'
      div.className = 'flex mt-4 space-x-3 md:mt-6'
      btn.className = 'inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
      
      btn.appendChild(btnText);
      btn.onclick = () => deleteFavouriteMichi(michi.id);
      div.append(btn);
      margin.append(img,div);
      article.appendChild(margin);
      section.appendChild(article);
    });
  }
}

async function saveFavouriteMichi(id) {
  const { data, status } = await api.post('/favourites', {
    image_id: id,
  });

  console.log('Save')

  if (status !== 200) {
    spanError.innerHTML = "Hubo un error: " + status + data.message;
  } else {
    console.log('Michi guardado en favoritos')
    loadFavouriteMichis();
  }
}

async function deleteFavouriteMichi(id) {
  const res = await fetch(API_URL_FAVOTITES_DELETE(id), {
    method: 'DELETE',
    headers: {
      'X-API-KEY': 'c08d415f-dea7-4a38-bb28-7b2188202e46',
    }
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    console.log('Michi eliminado de favoritos')
    loadFavouriteMichis();
  }
}

async function uploadMichiPhoto() {
  const form = document.getElementById('uploadingForm')
  const formData = new FormData(form);

  console.log(formData.get('file'))

  const res = await fetch(API_URL_UPLOAD, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'multipart/form-data',
      'X-API-KEY': 'c08d415f-dea7-4a38-bb28-7b2188202e46',
    },
    body: formData,
  })
  const data = await res.json();

  if (res.status !== 201) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    console.log({data})
  } else {
    console.log('Foto de michi subida :)')
    console.log({data})
    console.log(data.url)
    saveFavouriteMichi(data.id);
  }
}

loadRandomMichis();
loadFavouriteMichis();