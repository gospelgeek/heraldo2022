//Function to replace # -> %23 to share the link
const doClick = (page, lang) => {
    var url = ''
    if (lang == 'es') {
        url = 'https://perfiles-2022.netlify.app/#pagina/' + page;
    } else {
        url = 'https://perfiles-2022.netlify.app/#page/' + page;
    }

    url = url.replace('#', '%23')
    return url
}


//Functions to show audio
const showAudio = (audio) => {
    $('#button-' + audio.id).parent().parent().css({ display: 'none' })
    $('#button-' + audio.id).css({ display: 'none' })
    $('#' + audio.id).css({ display: 'flex' })
    $('#' + audio.id)[0].play();
}

const hideAudio = () => {
    $('.button-audio').parent().parent().css({ display: 'flex' })
    $('.button-audio').css({ display: 'flex' })
    $('.audioPage').css({ display: 'none' })
    $('.audioPage ')[0].pause();
}

//event click of read more
const clickReadMore = async () => {

    //poner visible la caja de texto
    $('.read-more-box').removeClass('display-none')

    //capturar los parametros de la url
    let url_href = window.location.href;
    let url = new URL(url_href);
    let id_page = (url.href).split('#')[1].split('/')[1];
    json = await getPagesJson(id_page);
    let text_insert = json.find(x => x._id == 'text-read-more').text

    $('.read-more-text').html(text_insert)

}


//Function to show menu
var btnNav = document.querySelector('.show-menu'),
    menu = document.querySelector('.menu');

btnNav.addEventListener('click', () => {
    btnNav.classList.toggle('active-menu');
    menu.classList.toggle('active-menu');
    $('.container-language').removeClass("visible");
    $('.container-search').removeClass("visible");
    $('.container-thumbs').remove()
});



//evento click para quitar el read more
$('.read-more-close').on('click', function (event) {
    //prevent the default action for the click event
    event.preventDefault();

    $(this).parent().parent().addClass('display-none')
});


//capturar el json de la pagina actual
async function getPagesJson(page) {

    try {

        const response = await fetch(`./assets/pages-es/${page}-page.json`);
        const data = await response.json();
        return data;

    } catch (error) {
        console.log(error)
    }

}