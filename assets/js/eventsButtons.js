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
   <p style='padding-bottom: 1.5em; font-size: 1.5em; text-align: center;'><strong>Carta do presidente</strong></p> 
   <p style='padding-bottom: 0.5em; font-size: 1em;'><strong> quem crê em mim, como diz a Escritura...  </strong></p>
   <p style='padding-bottom: 0.5em; font-size: 1em;'>um cumprimento fraternal para todos os irmãos no nome de Jesus. Ao pensar no tema que ocupa esta nova edição titulado <strong>“como diz a Escritura” </strong>, devo dizer que sua palavra é a tocha que ilumina nosso caminho e direcciona nosso destino.</p>
   <p  style='padding-bottom: 0.5em; font-size: 1em;'>Como propósito de promover ferramentas que contribuem para o nosso crescimento e formação , o Consistório de Anciãos , sempre em procura de actuar sob a direcção de Deus em todo o que fazemos; relacionou o propósito de nossa entrega anterior titulado “ Fé sempre”,  orientendo-a a nossa forma de vida cristã e propõe assim novo lema: “ Como diz a Escritura”.</p>
   <p  style='padding-bottom: 0.5em; font-size: 1em;'>A Escritura é a Palavra de Deus, ainda que escrita por homens inspirados por Deus; não desconhecemos que ela contem todo o plano do senhor para que a humanidade seja salva, viva recta e piedosamente, cresça em sabedoria, se aperfeiçoe e se prepare para toda a boa obra. </p>
  <p  style='padding-bottom: 0.5em; font-size: 1em;'>Entre os muitos ensinamentos enriquecedores para a nossa vida, e sendo consequentes com a proposta de Cristo para que vivamos em paz, comunhão, fraternidade e harmonia; nos proveu o mesmo Espírito inspirador de sua Palavra que nos conduz a caminhar na luz, aceitando nossas possiveis diferenças, sem que por isso se gerem contendas, ódios e rancores.</p>
  <p  style='padding-bottom: 0.5em; font-size: 1em;'> <strong> “Por toda a terra saiu a sua voz”... (salmos 19:4).</strong></p>
  <p  style='padding-bottom: 0.5em; font-size: 1em;'>É por sua Palavra que somos limpos. Lembremos que os esforços humanos, nossos sacrifícios serão inuteis para alcançar um coração puro; só uma vontade encaminhada em sua Palavra e   mediante seu Espírito é que seremos transformados. Por sua Palavra somos edificados e provistos dos fundamentos necessários para uma vida victoriosa em Cristo Jesus; sua Palavra nos dá crescimento e firmeza, sua Palavra é vida.</p>
  <p  style='padding-bottom: 0.5em; font-size: 1em;'>Sua Palavra é luz que ilumina nossos passos para que nossos pés não saiam do caminho, não escorreguemos, não tropecemos e dessa forma continuemos na marcha, à conquista da nossa santificação.</p>
  <p  style='padding-bottom: 0.5em; font-size: 1em;'> Temos a Palavra profética mais segura; faremos bem em acatá-la e obedecê-la sempre. Estaremos atentos a essa tocha que ilumina no lugar escuro, em meio a melancolia deste mundo, até que o dia esclareça e a estrela da alva apareça em nossos corações.</p>
  <p  style='padding-bottom: 0.5em; font-size: 1em;'>A Palavra do Senhor Jesus é digna de ser recebida por todos; parte do propósito de nossa nova edição é ser somente outro meio de difusão. Pelo qual convidamos a nossos leitores a entesourar as escrituras, ela nos guiará até o fim. </p>
  <p  style='padding-bottom: 0.5em; font-size: 1em;'> Por: Hector ariel campuzano Fonseca – Presidente IPUC  </p>
 


<p><span style='color: #a92021; font-size: 2em'>U</span>m cumprimento fraternal para todos os irmãos no nome de Jesus. Ao pensar no tema que ocupa esta nova edição titulado “como diz a Escritura”, devo dizer que sua palavra é a tocha que ilumina nosso caminho e direcciona nosso destino.</p> 
<p style='padding-top: 0.5em'>Como propósito de promover ferramentas que contribuem para o nosso crescimento e formação , o Consistório de Anciãos , sempre em procura de actuar sob a direcção de Deus em todo o que fazemos; relacionou o propósito de nossa entrega anterior titulado “ Fé sempre”,  orientendo-a a nossa forma de vida cristã e propõe assim novo lema: “ Como diz a Escritura”.</p>



“Comme disent les Ecritures”.


  <p style='padding-top: 0.5em; font-size: 1em;'>“Dije: Traeré, pues, a la
memoria los años de la diestra
del Altísimo.</p>
<p style='padding-top: 0.5em; font-size: 1em;'>Me acordaré de las obras del
Señor; Sí, haré yo memoria de
tus maravillas antiguas.</p>
<p style='padding-top: 0.5em; font-size: 1em;'>Meditaré en todas tus obras, Y
hablaré de tus hechos.</p>
<p style='padding-top: 0.5em; font-size: 1em;'>Oh Dios, santo es tu camino;
¿Qué dios es grande como
nuestro Dios?
Tú eres el Dios que hace
maravillas; Hiciste notorio en
los pueblos tu poder”</p>
<p style='padding-top: 0.5em; font-size: 1.5em; color: #0d5b78 ;'><strong>(Salmos 77:10-14)</strong></p>
*/