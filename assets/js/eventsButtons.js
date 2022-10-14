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
const clickReadMore = async (e) => {

    //poner visible la caja de texto
    $('.read-more-box').removeClass('display-none')

    let id_page = (e.replace("+", "").replace("+", "")).split('-')[2]
    let lang = (e.replace("+", "").replace("+", "")).split('-')[1]

    console.log(id_page, (e.replace("+", "").replace("+", "")).split('-')[1])

    if (id_page !== undefined && id_page !== '') {

        json = await getPagesJson(id_page, (lang !== 'espana') ? 1 : 0);

        if (lang !== 'espana') {
            text_insert = ((json[id_page])[lang]).find(x => x._id == 'text-read-more').text
        } else {
            text_insert = json.find(x => x._id == 'text-read-more').text
        }

        //insertar el texto en la caja de texto
        $('.read-more-text').html(text_insert)

    }

}


//event click of lenguage
const clickLenguage = async (e) => {

    //page even
    page_even = (e).split('-')[0]
    lang_even = (e).split('-')[1]

    //page odd
    page_odd = (e).split('-')[2]
    lang_odd = (e).split('-')[3]


    $(`#content-inter-${page_odd}`).html(change_info_page_lengauage(page_odd, lang_odd))
    $(`#content-inter-${page_even}`).html(change_info_page_lengauage(page_even, lang_even))

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
async function getPagesJson(page, type) {

    try {
        const array = {
            "0": {
                fetch: `./assets/pages-es/${page}-page.json`
            },
            "1": {
                fetch: `./assets/json_Languages/languages.json`
            }
        }
        const response = await fetch((array[type]).fetch);
        const data = await response.json();
        return data;

    } catch (error) {
        console.log(error)
    }

}


/**
 * @dec Simular el proceso de creacion de los componentes
*/
function change_info_page_lengauage(page, lang) {

    //crear el div padre
    if (checkMobile()) {
        element = $(`<div id="content-inter-${page}" />`, { class: 'hard' });
    } else {
        element = $(`<div id="content-inter-${page}" />`, {});
    }

    if (page % 2 == 0) {
        element.addClass('even')
    } else {
        element.addClass('odd')
    }

    //Insertar html para saber en pagina se encuentra
    element.html('<div class="gradient"></div><div class="number-page" onclick=goPage(2)>' + page + ' | Heraldo - 2022</div>');

    insert_img_background(page, element)

    if (lang !== 'espana') { add_components_page(element, page, lang) } else { loadRegions(page, element, 'es') }

    return element

}



/**
 * @dec insertar imagen de fondo
*/
function insert_img_background(page, pageElement) {

    var img = $('<img />', { class: 'backPage' + page });

    img.mousedown(function (e) {
        e.preventDefault();
    });

    img.load(function () {

        // Set the size
        $(this).css({ width: '100%', height: '100%' });

        // Add the image to the page after loaded

        $(this).appendTo(pageElement);

        // Remove the loader indicator

        pageElement.find('.loader').remove();
    });

    // Load the page
    checkImage('../assets/pics/backgrounds/' + page + '.jpg', img, pageElement, page)

}

async function add_components_page(element, page, lang) {

    try {

        //sacar la informacion de la pagina
        json = await getPagesJson(5, 1);
        let data = (json[page])[lang]

        console.log(data)

        data.map((region) => {
            addRegion(region, element, 'es', page);
        })

    } catch (error) {
        console.log(error)
    }

}

/**
   <p style='padding-bottom: 1.5em; font-size: 1.5em;'><strong>LETTRE DU PRÉSIDENT</strong></p> 
   <p style='padding-bottom: 0.5em; font-size: 1em;'><strong>Celui qui croit en moi, comme dit l'Écriture, .....</strong></p>
   <p style='padding-bottom: 0.5em; font-size: 1em;'>
Salutations fraternelles à tous nos frères au Nom de Jésus. En réfléchissant au thème de cette nouvelle édition intitulée "Comme dit l'Écriture", je dois dire que Sa Parole est le flambeau qui éclaire notre chemin et dirige notre destinée. 
</p>
   <p  style='padding-bottom: 0.5em; font-size: 1em;'>Dans le but de promouvoir des outils qui contribuent à notre croissance et à notre formation, le Consistoire des Anciens, cherchant toujours à agir sous la direction de Dieu dans tout ce que nous faisons, a relié l'objectif de notre précédent numéro intitulé "La foi toujours", en l'orientant vers notre mode de vie chrétien et propose ainsi notre nouvelle devise : "Comme dit l'Écriture".</p>
   <p  style='padding-bottom: 0.5em; font-size: 1em;'>L'Écriture est la Parole de Dieu, bien qu'elle soit écrite par des hommes inspirés par Lui ; nous n'ignorons pas qu'elle contient tout le plan du Seigneur pour que l'humanité soit sauvée, qu'elle vive avec droiture et piété, qu'elle croisse en sagesse, qu'elle soit perfectionnée et préparée pour toute bonne œuvre. </p>
  <p  style='padding-bottom: 0.5em; font-size: 1em;'>Parmi les nombreux enseignements enrichissants pour notre vie, et en cohérence avec la proposition du Christ de vivre dans la paix, la communion, la fraternité et l'harmonie, il nous a doté du même Esprit inspirateur de sa Parole qui nous conduit à marcher dans la lumière, en acceptant nos éventuelles différences, sans générer de querelles, de haines et de ressentiments. </p>
  <p  style='padding-bottom: 0.5em; font-size: 1em;'> <strong>  'Sa voix s'est répandue par toute la terre... ' (Psaume 19, 4).</strong>

C'est par sa Parole que nous sommes purifiés. Rappelons-nous que les efforts humains, nos sacrifices seront inutiles pour obtenir un cœur pur ; seule une volonté orientée vers Sa Parole et par Son Esprit nous transformera. Par sa Parole, nous sommes édifiés et pourvus des fondements nécessaires à une vie victorieuse en Jésus-Christ ; sa Parole nous donne croissance et fermeté, sa Parole est vie.

</p>
  <p  style='padding-bottom: 0.5em; font-size: 1em;'> Sa Parole est la lumière qui éclaire nos pas afin que nos pieds ne s'écartent pas du chemin, que nous ne glissions pas, que nous ne trébuchions pas et que nous continuions ainsi la marche, à la conquête de notre sanctification.</p>
  <p  style='padding-bottom: 0.5em; font-size: 1em;'>Nous avons la Parole prophétique la plus sûre ; nous ferons bien de l'écouter et de lui obéir toujours. Nous serons attentifs à ce flambeau qui brille dans un endroit sombre, au milieu de la pénombre de ce monde, jusqu'à ce que le jour se lève et que l'étoile du matin se lève dans nos cœurs.</p>
  <p  style='padding-bottom: 0.5em; font-size: 1em;'> La Parole du Seigneur Jésus est digne d'être reçue par tous ; le but de notre nouvelle édition est en partie d'être un moyen supplémentaire de la diffuser. Nous invitons donc nos lecteurs à chérir les Écritures ; elles nous guideront jusqu'à la fin.
</p>
  <p  style='padding-bottom: 0.5em; font-size: 1em;'> Par Héctor Ariel Campuzano Fonseca. Président de l'IPUC</p>
 





*/