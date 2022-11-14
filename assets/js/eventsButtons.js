//Function to replace # -> %23 to share the link
const doClick = (page, lang) => {
    var url = ''
    if (lang == 'es') {
        url = 'https://heraldo2022.vercel.app/#pagina/' + page;
    } else {
        url = 'https://heraldo2022.vercel.app/#page/' + page;
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


//variables auxiliares para el audio
var band_audio = true;
var audio_array = [];
const hideAudio = () => {

    try {
        $('.button-audio').parent().parent().css({ display: 'flex' })
        $('.button-audio').css({ display: 'flex' })
        $('.audioPage').css({ display: 'none' })
        //$('.audioPage ')[0].pause();
        audio_array.map((audio) => {
            audio.pause();
        })
        band_audio = true;
        audio_array = [];
        $('.audio-img-content').removeClass('opacity-audio')
    }
    catch (error) {
        console.log(error)
    }

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

    audio_array.map((audio) => {
        audio.pause();
    })
    band_audio = true;
    audio_array = [];

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
        element = $(`<div style='width: 100%; height: 100%;' id="content-inter-${page}" />`, { class: 'hard' });
    } else {
        element = $(`<div  style='width: 100%; height: 100%;' id="content-inter-${page}" />`, {});
    }

    if (page % 2 == 0) {
        element.addClass('even')
    } else {
        element.addClass('odd')
    }

    //Insertar html para saber en pagina se encuentra
    element.html('<div class="gradient"></div><div id=' + "pie-pagina-" + page + ' class="number-page" onclick=goPage(2)>' + page + ' | Heraldo - 2022</div>');

    insert_img_background(page, element)

    if (lang !== 'espana') { add_components_page(element, page, lang) } else { loadRegions(page, element, 'es') }

    return element

}



/**
 * @dec insertar imagen de fondo
*/
function insert_img_background(page, pageElement) {

    var img = $(`<img id="background-page-${page}" />`, { class: 'backPage' + page });

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

const playAudio = (e) => {

    if (audio_array.length > 0) {

        audio_array.map((audio) => {
            audio.pause();
        })
        //eventos para quitar el audio
        audio_array = [];
        band_audio = true;
        $('.audio-img-content').removeClass('opacity-audio')

    }
    else if (band_audio) {

        var audio = new Audio(e);
        audio_actual = audio;
        $(audio).attr('id', 'audio-page')
        audio.play();
        band_audio = false;

        audio_array.push(audio)
        $('.audio-img-content').addClass('opacity-audio')

        //saber si el audio no ha terminado
        audio.addEventListener('ended', function () {
            $('.audio-img-content').removeClass('opacity-audio')
            band_audio = true;
            audio_array = [];
        }, false);

    }



}

/**
    * @dec Funcion para agregar una region
<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA… NO CON EJÉRCITO, SINO CON MI ESPÍRITU</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>

 

<p style='font-size: 2em; text-align: center; color: #387086;'><strong>BRIEF DES VORSITZENDEN</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; color: #387086;'>Wer an mich glaubt, wie die Heilige Schrift sagt ….</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Brüderliche Grüße an alle unsere Brüder im Namen Jesu. Wenn ich über das Thema dieser
neuen Ausgabe mit dem Titel ;Wie die Schrift sagt' nachdenke, muss ich sagen, dass sein Wort die Fackel ist, die unseren Weg erleuchtet und unser Schicksal lenkt.

</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Mit dem Ziel, Instrumente zu fördern, die zu unserem Wachstum und unserer Ausbildung beitragen, hat das Konsistorium der Ältesten, das immer danach strebt, in allem, was wir tun, unter der Führung Gottes zu handeln, das Ziel unserer vorherigen Ausgabe mit dem Titel 'Für immer der Glaube' aufgegriffen und auf unseren christlichen Lebensstil ausgerichtet und schlägt daher unser neues Motto vor: 'Wie die Schrift sagt'.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Die Heilige Schrift ist das Wort Gottes, obwohl sie von Menschen geschrieben wurde, die von ihm inspiriert wurden; wir sind uns nicht darüber im Unklaren, dass sieden ganzen Plan des Herrn für die Menschen enthält, um gerettet zu werden, gerecht und gottesfürchtig zu leben, in der Weisheit zu wachsen, vollendet und zu jedem guten Werk vorbereitet zu werden.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Unter den vielen bereichernden Lehren für unser Leben und in Übereinstimmung mit dem Vorschlag Christi, in Frieden, Gemeinschaft, Brüderlichkeit und Harmonie zu leben, hat er uns mit dem gleichen inspirierenden Geist seines Wortes ausgestattet, der uns dazu führt, im Licht zu wandeln und unsere möglichen Unterschiede zu akzeptieren, ohne Streit, Hass und Groll zu erzeugen.

</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><span style='font-style: italic;'><strong>“Seine Stimme ertönt auf der ganzen Erde...” (Psalm 19.4).</strong></span>
Durch sein Wort werden wir gereinigt. Erinnern wir uns daran, dass menschliche Anstrengungen, unsere Opfer, nutzlos sind, um ein reines Herz zu erlangen; nur ein Wille, der auf sein Wort und durch seinen Geist ausgerichtet ist, wird uns verwandeln. Durch sein Wort werden wir aufgebaut und mit den notwendigen Grundlagen für ein siegreiches Leben in Christus Jesus versorgt; sein Wort gibt uns Wachstum und Festigkeit, sein Wort ist Leben.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Sein Wort ist ein Licht, das unsere Schritte erhellt, damit unsere Füße nicht vom Weg abkommen, wir nicht ausrutschen, nicht stolpern und so den Marsch zur Eroberung unserer Heiligung fortsetzen.

</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Wir haben das sicherste prophetische Wort; wir werden gut daran tun, es immer zu beachten und zu befolgen. Wir werden auf diese Fackel achten, die an einem dunklen Ort leuchtet, inmitten der Finsternis dieser Welt, bis der Tag anbricht und der Morgenstern in unseren Herzen aufgeht.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Das Wort des Herrn Jesus ist es wert, von allen aufgenommen zu werden; ein Teil des Ziels unserer neuen Ausgabe ist es, ein weiteres Mittel zu seiner Verbreitung zu sein. Deshalb laden wir unsere Leser ein, die Heilige Schrift zu schätzen; sie wird uns bis zum Ende leiten.
</p>
<p  style='padding-top: 0.7em; font-size: 1em; color: #387086;'>Von Héctor Ariel Campuzano Fonseca. Präsident IPUC
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
*/
