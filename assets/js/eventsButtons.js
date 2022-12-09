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

const click_autor = (e) => {

    if (e !== '') {
        //poner visible la caja de texto
        $('.read-more-box').removeClass('display-none')
        $('.read-more-content').addClass('aux-video-author')
        $('.read-more-close').addClass('change-color-text')
        $('.read-more-text').addClass('aux-video-author-text')
        $('.read-more-text').html(`<iframe width='100%' height='100%' src="${e}" title='Secretario General Heraldo 09 junio 2022 11 18 09 a m' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>`)
    }

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

    //scroll 0
    $('.read-more-text').scrollTop(0)

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
    //quitar reproductor de audio e video de un iframe
    $('.read-more-text').html('')
    $('.read-more-content').removeClass('aux-video-author')
    $('.read-more-close').removeClass('change-color-text')
    $('.read-more-text').removeClass('aux-video-author-text')
    $('.read-more-content').removeClass('height-auto')
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

function click_ul_li(e) {

    $('.read-more-box').removeClass('display-none')
    $('.read-more-content').addClass('height-auto')
    //scroll 0
    $('.read-more-text').scrollTop(0)

    //switch para saber que tipo de contenido es
    switch (e) {
        case '1':
            $('.read-more-text').html(`<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento evangelístico</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Cada misionero ha realizado campañas, trabajo evangelístico y Refam tanto virtual como presencial; además han realizado ayunos, vigilias, devocionales y programas espirituales, que fortalezcan la visión del misionero y su familia.</p>`)
            break;
        case '2':
            $('.read-more-text').html(` <p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento espiritual</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Se han tenido enseñanzas con invitados, de acuerdo a la necesidad en las reuniones con los misioneros y esposas, como también se han tenido enseñanzas con invitados de acuerdo a la necesidad de los hijos de misioneros.</p>`)
            break;
        case '3':
            $('.read-more-text').html(`<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento formativo</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Capacitación y orientación al misionero, generando y brindando herramientas, por medio de seminarios y talleres de formación, con diversas temáticas de forma integral.</p>`)
            break;
        case '4':
            $('.read-more-text').html(`<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento social</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Fortalecemos la obra social como mecanismo de participación en la obra misionera, mediante jornadas socio-evangelísticas. Realizando visitas a varios misioneros y sus familias por parte del Director Nacional, coordinador y su esposa, dando apoyo y fortaleza; y se enseñó a las iglesias. Hubo felicitaciones a misioneros y esposas, a través de los grupos por motivo de cumpleaños entre otros. Los misioneros nacionales realizaron actividades participativas en el campamento de Melgar, realizaron la dinámica del amigo secreto con entrega de detalles unos a otros.</p>`)
            break;
        case '5':
            $('.read-more-text').html(`<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento administrativo</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Asesoramos a los misioneros dando técnicas de administración ministerial, logrando la consolidación y estructuración de proyectos e ideas mediante conferencias. Las esposas de los misioneros se reunieron en la Asamblea de Pastores en Medellín para recibir formación, y se publicaron artículos formativos por parte de ellas en la revista digital de Misiones Nacionales.</p> <p style='padding-top: 0.7em; font-size: 1em;'>De las familias misioneras nacionales se han escogido dos, para el campo misionero internacional: Edilberto Díaz y familia (Misionero en Duitama, Boyacá, Distrito 14) para Cabo Verde; y Rafael Gómez y familia (Misionero en San Andrés Islas, Distrito 8) para Trinidad y Tobago.</p>`)
            break;

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



<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento evangelístico</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Cada misionero ha realizado campañas, trabajo evangelístico y Refam tanto virtual como
presencial; además han realizado ayunos, vigilias, devocionales y programas espirituales, que
fortalezcan la visión del misionero y su familia.</p>


<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento espiritual</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se han tenido enseñanzas con invitados, de acuerdo a la necesidad en las reuniones con los
misioneros y esposas, como también se han tenido enseñanzas con invitados de acuerdo a la
necesidad de los hijos de misioneros.</p>

<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento formativo</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Capacitación y orientación al misionero, generando y brindando herramientas, por medio de
seminarios y talleres de formación, con diversas temáticas de forma integral.</p>


<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento social</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Fortalecemos la obra social como mecanismo de participación en la obra misionera, mediante
jornadas socio-evangelísticas. Realizando visitas a varios misioneros y sus familias por parte del
Director Nacional, coordinador y su esposa, dando apoyo y fortaleza; y se enseñó a las iglesias.
Hubo felicitaciones a misioneros y esposas, a través de los grupos por motivo de cumpleaños entre
otros. Los misioneros nacionales realizaron actividades participativas en el campamento de Melgar,
realizaron la dinámica del amigo secreto con entrega de detalles unos a otros.</p>

<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento administrativo</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Asesoramos a los misioneros dando técnicas de administración ministerial, logrando la
consolidación y estructuración de proyectos e ideas mediante conferencias. Las esposas de los
misioneros se reunieron en la Asamblea de Pastores en Medellín para recibir formación, y se
publicaron artículos formativos por parte de ellas en la revista digital de Misiones Nacionales.</p>





<p  style='padding-top: 0.7em; font-size: 1em;'>De las familias misioneras nacionales se han escogido dos, para el campo misionero internacional:
Edilberto Díaz y familia (Misionero en Duitama, Boyacá, Distrito 14) para Cabo Verde; y
Rafael Gómez y familia (Misionero en San Andrés Islas, Distrito 8) para Trinidad y Tobago.</p>
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



<p style='font-size: 2em; text-align: center; color: #194d10;'><strong> CAPACITACION MISIONERA </strong></p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Métodos y evangelismo</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Métodos y evangelismo</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-000.png' /></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<ul>
 <li>Atención a distritos y congregaciones, de forma presencial y virtual.
 </li>
 <li>Asesorías realizadas a diferentes distritos por los coordinadores distritales.
 </li>
 <li>Conferencia presencial en el campamento de Melgar (Tolima) – con los treinta y cinco distritos, y sus coordinadores distritales.	 </li>
 <li> Capacitación estratégica en la implementación de Refam digital.
</li>
 <li>Articulación Refam digital con Refam en vivo.  </li>
 <li> Creación del Linkr.bio. - con veintisiete distritos, equivalente al 77% de cobertura.
</li>
</ul>
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Rendimiento de las actividades desarrolladas en la ruta evangelística 
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>1. Métodos de evangelismo - Cobertura de 53% de congregaciones encuestadas.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>2. Uno Más – cobertura del 17.5% de congregaciones encuestadas.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>3. Bis - cobertura del 23.6% de congregaciones encuestadas. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>4. Refam - cobertura de un 100% de distritos y 73.9% de congregaciones encuest</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>5. Refam digital – cobertura de 6.3% de congregaciones encuestadas. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>6. Refam en vivo – cobertura nacional y extranjera, 12.2% de congregaciones. 
encuestadas con un promedio de quinientas personas conectadas en cada programa, 
y un promedio de personas alcanzadas de treinta y seis mil.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>7. Discipulado – cobertura de 42.5% de congregaciones encuestadas. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangelístico - rendimiento </strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Implementación de “Ruta evangelística a nivel local”, “Métodos de evangelismo” usados en las congregaciones. 53% de 743 congregaciones encuestadas. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-003.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gráfica de alcance evangelístico – Consolidado nacional</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-002.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Asuntos étnicos°°</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Continuar la búsqueda y fortalecimiento de la vida espiritual de nuestros hermanos en los grupos étnicos, mediante devocionales que atiendan las diferentes necesidades de ellos. Se realizaron ayunos en las diferentes regiones.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<ul>
 <li>Región Caribe - 85% de las congregaciones y 245 asistentes.
</li>
 <li>Región Pacífica y Andina - 82% de las congregaciones y 367 asistentes.
</li>
 <li>Región Orinoquía y Amazónica - 78% de las congregaciones y 289 asistentes.
</li>
</ul>
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>También se realizó asesoría y acompañamiento en estas tres regiones.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Formar y capacitar al personal que trabaja entre los grupos étnicos, para así brindarles herramientas del desarrollado del trabajo formativo transcultural, en cada una de las sesenta y ocho etnias alcanzadas por Misiones Nacionales.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento administrativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Continuar con la estructura administrativa de segmentación estratégica, desde lo nacional hasta lo local, en los diferentes procesos de la caracterización y consolidación étnica, desde la Guajira hasta el Amazonas y la región insular.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Continuar apoyando la parte social con ayudas de menor cuantía entre los grupos étnicos, con el apoyo de Misiones Nacionales y el aval de los distritos étnicos, en las diferentes necesidades para el bienestar de nuestros hermanos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Contamos con ochenta y siete poblaciones étnicas en Colombia, sesenta y nueve de ellas alcanzadas y diecinueve en proyección.</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gráfica de alcance evangelístico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-007.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gráfica de personal evangelístico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-008.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>
Obra carcelaria
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangelístico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Continuar con expansión del Evangelio dentro y fuera de las cárceles, ofreciendo recursos y materiales estratégicos para llegar a las familias de los PPL, en forma virtual o presencial a través de BIS.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se realizaron impactos, campañas, Refam, BIS, cultos de prevención y sensibilización; además evangelismo personalizado en las ocho zonas y a todos los distritos.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se realizaron ayunos, vigilias y oración; para que impulsen la consagración y llenura del Espíritu Santo, de nuestros Pastores y evangelistas carcelarios; en las ocho zonas y a todos los distritos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo 
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se están consolidando procesos y mejorándolos, mediante el uso de nuevas herramientas y estrategias puestas al alcance de Pastores y líderes de evangelismo carcelario. Por medio de talleres, capacitaciones y conversatorios mes a mes, en las ocho zonas y a todos los distritos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Lograr un alcance amplio mediante jornadas de donación y colectas de todo lo referente con lo social, para poder suplir parte de las necesidades de los PPL y familias.
Por medio de donaciones, kit de aseo, mercados y bioseguridad elementos, en las ocho zonas y a todos los distritos, de forma presencial y virtual.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento administrativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Orientar a los grupos de apoyo y comités locales, en el conocimiento de las normas del Inpec y funciones administrativas mediante actividades evaluativas y de proyección, con el fin de fortalecer el liderazgo (hacia una buena administración de una manera integral).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por medio de reuniones evaluativas, reuniones de asesoría con mesas de trabajo, reuniones y asesorías con coordinadores distritales y zonales; en las ocho zonas y a todos los distritos, de forma presencial y virtual.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-009.png' /></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gráfica de alcance evangelístico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-010.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Evangelismo medios de comunicación
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangelístico</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Llevar el mensaje de salvación por medio de videos e imágenes diarios, con el propósito de ganar almas para Jesucristo. Por medio de los siguientes programas:
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>1. Cápsula de Vida – de lunes a viernes por las redes sociales, Facebook, Instagram, WhatsApp
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>2. Tik Tok: Creación de plataforma de lunes a viernes.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Generar ambientes virtuales, propicios para que los amigos y simpatizantes le entreguen su vida al Señor Jesús.	
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Palabras de Vida – Todos los viernes 9:00 pm, por las plataformas virtuales – Facebook.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Informar y capacitar mediante informes, talleres, seminarios y encuentros formativos, con el propósito de ser más eficientes en el campo evangelístico virtual.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Creación del grupo de WhatsAppla como red de apoyo y difusión, que vincule la información nacional, llegando así a las áreas nacionales, equipos distritales e iglesia local.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento administrativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Evaluar, capacitar y realizar seguimiento al equipo de evangelismo en medios de comunicación, por medio de reuniones mensuales coordinadores de los distritos y reuniones de equipo de trabajo nacional.  
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-011.png' /></p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Evangelismo población sorda
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Brindamos mediante capacitaciones, talleres teóricos, mesas de trabajo, convenios, entre otros, los recursos y herramientas necesarias de quienes integran, desarrollan y ejecutan la gran comisión “Pescadores de hombres”, con la idoneidad que se requiere, dirigida a la población con discapacidad sensorial.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Estamos desarrollando el tercer nivel de la EFIS y la Refam en LSC.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Contribuimos y motivamos la continua confraternidad social de esta hermosa familia de misiones, mediante eventos afines, para mantener un ambiente fraternal y de hermandad, en la cual el Señor envía bendición y vida eterna por medio de integraciones y conversatorios.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Otras actividades realizadas, pertinentes a su comité
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<ul>
 <li>Acompañamiento a Pastores con sordos en su congregación.
</li>
 <li>Servicio de interpretación en diferentes eventos distritales y nacionales.
</li>
 <li>Consejería a sordos de diferentes distritos.</li>
 <li>Ayudas extraordinarias para matrimonios, parejas de sordos y otras situaciones pertinentes.
</li>
 <li>Proyecto piloto de IBP para sordos en el Distrito 4.
</li>
 <li>Desarrollo de material pedagógico para sordos semilingües (analfabetas).
</li>
 <li>Asistencia y acompañamiento a ceremonias de graduación de los estudiantes de la EFIS en los distritos.</li>
</ul>
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong> Talleres y capacitaciones
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-012.jpg' /></p>
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-013.jpg' /></p>
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Evangelismo en grupos especiales y misión hospitalaria
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangelístico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Motivamos al grupo a proyectar el evangelismo en nuestra área. Visitando los hospitales, clínicas en treinta y cinco distritos, a fundaciones, cuarenta y cuatro sedes de “Rescatados por su sangre”, también fundación “Renovando tu mente” y fundación “Vives”; además se han hecho trabajos en la calle con la población habitante de calle, en hogares geriátricos, hogares de paso y centro de rehabilitación para drogadictos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Fortalecemos el conocimiento de los coordinadores distritales en algunos distritos, por medio de asesoría y acompañamiento presencial y virtual, y seminarios evangelísticos de:
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<ul>
 <li>Seminario de sensibilización.
</li>
 <li>Campamento en fundaciones.</li>
 <li>Encuentro con los coordinadores especiales y hospitalarios, Melgar (Tolima).
</li>
</ul>
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-014.jpg' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-018.jpg' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-016.jpg' /></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-017.jpg' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gráfica de alcance evangelístico</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-015.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Evangelismo en Instituciones Públicas
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangelístico</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Llevamos el Evangelio a las diferentes Instituciones Públicas de nuestro país y sus familias, por medio de campañas; fortaleciendo y afirmando el crecimiento espiritual de cada uno de los hermanos de las Instituciones Públicas por medio de devocionales y ayunos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Capacitamos a cada uno de los coordinadores y sus equipos de apoyo, para el desarrollo del trabajo en el evangelismo de las Instituciones Públicas, se han realizado capacitaciones y campamento.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Otros:</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<ul>
 <li>Posesión del primer Pastor de tiempo completo para las Instituciones Públicas en Melgar.</li>
 <li>Bautismo en Tolemaida de dos uniformados y la esposa de uno de ellos, en el fuerte militar de Tolemaida.</li>
 <li>Hasta la fecha se han realizado quinientas cincuenta y dos visitas a diferentes guarniciones de las Instituciones Públicas, con una asistencia de treinta y dos mil simpatizantes a nuestras reuniones.
</li>
</ul>
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-019.jpg' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-020.jpg' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-021.jpg' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gráfica de alcance evangelístico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-022.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gráfica de personal evangelístico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-023.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Evangelismo estudiantil
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangelístico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
Concientizamos a los hermanos que a lo largo y ancho del país están realizando esta labor, en la necesidad de recibir de parte de Dios y a través de su Palabra, una unción fresca que nos lleve a predicar este mensaje con demostración del poder de Dios.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Fortalecer la vida devocional del evangelista estudiantil, a través de actividades y eventos espirituales que le impulsen a depender 100% del Espíritu Santo.  Por medio de ayunos nacionales, matutinos y con un congreso con enfoque espiritual, congreso con enfoque espiritual y formativo de manera presencial y virtual.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Formar integralmente al evangelista estudiantil, ofreciendo herramientas de capacitación para realizar la labor con excelencia.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Seminario “Cátedras de vida” de manera virtual y presencial.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Temáticas: Ansiedad, depresión, suicidio, entornos digitales, pornografía, sustancias psicoactivas, duelo y salud mental.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
Fortalecemos la sinergia con los líderes de jóvenes y coordinadores distritales, para llevar a cabo el cumplimiento de la gran comisión a través del programa Misión Juvenil, diseñando actividades que nos permitan crecer en la fraternidad con un 75% de cobertura de distritos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gráfica del alcance evangelístico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-024.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Área de estadística
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Fortalecer el aspecto espiritual de líderes de estadísticas en los distritos. Por medio de alborada virtual bajo la temática. Servicio a Dios desde el componente estadístico.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangelístico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Apoyar al trabajo de la escuela nacional de evangelistas por medio de la relatoría de la escuela “Pescadores de hombres”.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento administrativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Establecemos lineamientos administrativos para consolidar el área.
Organización de material pedagógico en el ámbito estadístico; la logística empleada es la asignación de módulos a cada asesor. Lenguaje estadístico, medidas de tendencia central con una cobertura del 100%, todos los asesores nacionales del área participaron.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Fortalecimiento técnico a líderes distritales y locales.

Capacitación a líderes distritales y locales de estadísticas de manera presencial; técnicas estadísticas, instrumentos de recolección de información y tabulación de los datos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>
Objetivo segmento social
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Trabajo social ente los lideres distritales de estadísticas.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Programa de felicitaciones a líderes distritales que cumplen años de vida y matrimonial por medio de redes sociales.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>


*/
