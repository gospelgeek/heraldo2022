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
    let array_data_class = ['1','2','3','4','5']
    if (array_data_class.includes(e)) {
    $('.read-more-content').addClass('height-auto')
    }
    //scroll 0
    $('.read-more-text').scrollTop(0)

    const array = { 
        '1': `<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento evangel??stico</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Cada misionero ha realizado campa??as, trabajo evangel??stico y Refam tanto virtual como presencial; adem??s han realizado ayunos, vigilias, devocionales y programas espirituales, que fortalezcan la visi??n del misionero y su familia.</p>`,
        '2':  `<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento espiritual</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Se han tenido ense??anzas con invitados, de acuerdo a la necesidad en las reuniones con los misioneros y esposas, como tambi??n se han tenido ense??anzas con invitados de acuerdo a la necesidad de los hijos de misioneros.</p>`,
        '3': `<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento formativo</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Capacitaci??n y orientaci??n al misionero, generando y brindando herramientas, por medio de seminarios y talleres de formaci??n, con diversas tem??ticas de forma integral.</p>`,
        '4': `<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento social</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Fortalecemos la obra social como mecanismo de participaci??n en la obra misionera, mediante jornadas socio-evangel??sticas. Realizando visitas a varios misioneros y sus familias por parte del Director Nacional, coordinador y su esposa, dando apoyo y fortaleza; y se ense???? a las iglesias. Hubo felicitaciones a misioneros y esposas, a trav??s de los grupos por motivo de cumplea??os entre otros. Los misioneros nacionales realizaron actividades participativas en el campamento de Melgar, realizaron la din??mica del amigo secreto con entrega de detalles unos a otros.</p>`,
        '5': `<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento administrativo</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Asesoramos a los misioneros dando t??cnicas de administraci??n ministerial, logrando la consolidaci??n y estructuraci??n de proyectos e ideas mediante conferencias. Las esposas de los misioneros se reunieron en la Asamblea de Pastores en Medell??n para recibir formaci??n, y se publicaron art??culos formativos por parte de ellas en la revista digital de Misiones Nacionales.</p> <p style='padding-top: 0.7em; font-size: 1em;'>De las familias misioneras nacionales se han escogido dos, para el campo misionero internacional: Edilberto D??az y familia (Misionero en Duitama, Boyac??, Distrito 14) para Cabo Verde; y Rafael G??mez y familia (Misionero en San Andr??s Islas, Distrito 8) para Trinidad y Tobago.</p>`,
        '6': `<p class='monserrat-black' style='font-size: 2em; text-align: center; color: #62164b;'><strong>CURSO INTENSIVO UNA MIRADA INTEGRAL A LA VIDA ADULTA</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>El envejecimiento de la poblaci??n mundial y los adultos ha crecido de manera importante; la mayor??a de los pa??ses del mundo est??n experimentando un aumento en el n??mero y proporci??n de personas mayores. Seg??n datos del DANE en el mundo para el 2050, el n??mero de personas de m??s 60 a??os crecer?? de 600 millones a casi 2000 millones, y se</p> <p style='padding-top: 0.7em; font-size: 1em;'>prev?? que el porcentaje de personas de 60 a??os o m??s se duplique, pasando de un 10% a un 21%. Ese incremento ser?? mayor y m??s r??pido en los pa??ses en desarrollo, donde se prev?? que la poblaci??n anciana se multiplique por cuatro en los pr??ximos 50 a??os.</p> <p style='padding-top: 0.7em; font-size: 1em;'>Colombia no est?? lejos de esa realidad, los datos demogr??ficos demuestran que la fertilidad y la mortalidad han cambiado; en este pa??s se ha experimentado un aumento considerable en la esperanza de vida al nacer y la mejora en la supervivencia de las personas mayores que repercute en la proporci??n cada vez mayor de la longevidad colombiana.</p> <p style='padding-top: 0.7em; font-size: 1em;'> Este panorama no es otra cosa que la indicaci??n de que debemos prepararnos para cuidarnos y cuidar a otros. Comprometidos con el cuidado del adulto mayor, iniciamos una muy buena propuesta de capacitar a mujeres en esta ??rea; pues como lo hemos visto es una demanda social del presente, y a futuro una muy buena herramienta laboral en caso de necesitarla. Para este a??o hemos tenido la oportunidad de capacitar 150 mujeres en esta ??rea, con un grupo experto en adulto mayor grupo (GEA).</p> <p style='padding-top: 0.7em; font-size: 1em; color: #62164b;'>Tem??tica:</p> <p style='padding-top: 0.7em; font-size: 1em;'> <ul style='color: #62164b; list-style-type: decimal;'> <li>Gerontolog??a</li> <li>Psicolog??a cl??nica</li> <li>Salud y nutrici??n</li> <li>Pedagog??a</li> <li>Fisioterapia-h??bitos saludables</li> <li>??tica del cuidado</li> <li>Odontolog??a</li> </ul></p>`,
        '7': `<p class='monserrat-black' style='font-size: 2em; text-align: center; color: #62164b;' id='title-aux-page-51'><strong>ACADEMIA DE EMPRENDIMIENTO</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Emprender es una actividad compleja que requiere tomar decisiones cruciales en las que no basta el sentido com??n.</p> <p style='padding-top: 0.7em; font-size: 1em; background-color: #e6dae9; padding: 0.4em; border: solid 0.1em #ae86b7;'>??No te lo he ordenado yo? ??S?? fuerte y valiente! No temas ni te acobardes, porque el Se??or tu Dios estar?? contigo dondequiera que vayas.</p> <p style='padding-top: 0.7em; font-size: 1em;'>En UDIM trabajamos para potenciar los recursos de muchas mujeres talentosas que sirven de manera incansable en la obra del se??or. Es por lo que damos herramientas que enriquecen su quehacer en cada entorno social donde se encuentran. La academia para emprendedoras tiene como fin formar mujeres, brindando asistencia en las siguientes ??reas:</p> <p style='padding-top: 0.7em; font-size: 1em;'> <ul style='list-style-type: decimal;'> <li>??rea administrativa</li> <li>??rea de emprendimiento</li> <li>??rea de mercadeo</li> <li>??rea econ??mica</li> <li>??rea financiera</li> <li>??tica del cuidado</li> <li>Odontolog??a</li> </ul> </p> <p style='padding-top: 0.7em; font-size: 1em;'>Se trabaja de manera virtual, con los profesionales en cada ??rea. Tenemos un aproximado de 100 mujeres emprendedoras, dispuestas a hacer un proceso y crecer de manera productiva para ellas y su entorno social.</p> <p style='padding-top: 0.7em; font-size: 1em;'>En algunos distritos el consejo directivo</p> <p style='padding-top: 0.7em; font-size: 1em;'>se ha desplazado para llevar este programa con un profesional en negocios internacionales, para incentivar este programa, que de manera preventiva se hace tambi??n con las esposas de pastores activos en el ministerio.</p> <p style='padding-top: 0.7em; font-size: 1em;'> Si quieres capacitarte contacta con nosotros: 3148233134 encargada del programa. Te puedes capacitar de manera virtual, nuestra aula virtual cuenta con todos los pasos para que hagas tu propio proceso individual.</p>`,
        '8': `<p class='monserrat-black' style='font-size: 2em; text-align: center; color: #62164b;' id='title-aux-page-51'><strong>ACOMPA??AMIENTO AL SECTOR DE LA MOJANA</strong></p> <p style='padding-top: 0.7em; font-size: 1em; color: #62164b;'>fecha 22- 31 de mayo 2022</p> <p style='padding-top: 0.7em; font-size: 1em;'>Comitiva delegada:</p> <p style='padding-top: 0.7em; font-size: 1em;'> <ul> <li>Coordinadora: Claudia Hoyos Psic??loga y especialista en pareja y familia</li> <li>Marisela Castro: Soci??loga (esposa de pastor)</li> <li>Ely Yohana Lozada: Gestora Comunitaria (esposa de pastor)</li> <li>Esneira Salazar; Nutricionista (servidora local)</li> </ul> </p> <p style='padding-top: 0.7em; font-size: 1em;'> La Mojana Sucre es un sector de alta vulnerabilidad en donde las necesidades se hacen evidentes, sin embargo, para la comisi??n que tuvo la oportunidad de trabajar durante 11 d??as en el sector fue un tiempo de aprendizaje, adem??s de la ayuda que se pudo brindar a las diferentes comunidades de la regi??n; el trabajo fue muy gratificante, ya que se pudo percibir la disposici??n de la comunidad</p> <p style='padding-top: 0.7em; font-size: 1em;'>en participar de todas las actividades las cuales fueron de gran beneficio no solamente a cada individuo sino tambi??n a la poblaci??n en general.</p> <p style='padding-top: 0.7em; font-size: 1em;'>Se realiz?? un trabajo integral con parejas, al igual que con los adolescentes y los ni??os, tratando de suplir las necesidades de los diferentes grupos, dando excelentes resultados en cada intervenci??n.</p>`
    }

    $('.read-more-text').html(array[e])

}

function event_click_accordion(e) {

    const array = {
        '1': (`<p style='padding-top: 0.7em; font-size: 1em;'><strong>M??todos y evangelismo</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'> <ul> <li>Atenci??n a distritos y congregaciones, de forma presencial y virtual. </li> <li>Asesor??as realizadas a diferentes distritos por los coordinadores distritales. </li> <li>Conferencia presencial en el campamento de Melgar (Tolima) ??? con los treinta y cinco distritos, y sus coordinadores distritales. </li> <li> Capacitaci??n estrat??gica en la implementaci??n de Refam digital. </li> <li>Articulaci??n Refam digital con Refam en vivo. </li> <li> Creaci??n del Linkr.bio. - con veintisiete distritos, equivalente al 77% de cobertura. </li> </ul> </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Rendimiento de las actividades desarrolladas en la ruta evangel??stica </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>1. M??todos de evangelismo - Cobertura de 53% de congregaciones encuestadas.</p> <p style='padding-top: 0.7em; font-size: 1em;'>2. Uno M??s ??? cobertura del 17.5% de congregaciones encuestadas. </p> <p style='padding-top: 0.7em; font-size: 1em;'>3. Bis - cobertura del 23.6% de congregaciones encuestadas. </p> <p style='padding-top: 0.7em; font-size: 1em;'>4. Refam - cobertura de un 100% de distritos y 73.9% de congregaciones encuest</p> <p style='padding-top: 0.7em; font-size: 1em;'>5. Refam digital ??? cobertura de 6.3% de congregaciones encuestadas. </p> <p style='padding-top: 0.7em; font-size: 1em;'>6. Refam en vivo ??? cobertura nacional y extranjera, 12.2% de congregaciones. encuestadas con un promedio de quinientas personas conectadas en cada programa, y un promedio de personas alcanzadas de treinta y seis mil. </p> <p style='padding-top: 0.7em; font-size: 1em;'>7. Discipulado ??? cobertura de 42.5% de congregaciones encuestadas. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico - rendimiento </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Implementaci??n de ???Ruta evangel??stica a nivel local???, ???M??todos de evangelismo??? usados en las congregaciones. 53% de 743 congregaciones encuestadas. </p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-003.png' /> </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de alcance evangel??stico ??? Consolidado nacional</strong></p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-002.png' /> </p>`),
        '2': (`<p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Continuar la b??squeda y fortalecimiento de la vida espiritual de nuestros hermanos en los grupos ??tnicos, mediante devocionales que atiendan las diferentes necesidades de ellos. Se realizaron ayunos en las diferentes regiones. </p> <p style='padding-top: 0.7em; font-size: 1em;'> <ul> <li>Regi??n Caribe - 85% de las congregaciones y 245 asistentes. </li> <li>Regi??n Pac??fica y Andina - 82% de las congregaciones y 367 asistentes. </li> <li>Regi??n Orinoqu??a y Amaz??nica - 78% de las congregaciones y 289 asistentes. </li> </ul> </p> <p style='padding-top: 0.7em; font-size: 1em;'>Tambi??n se realiz?? asesor??a y acompa??amiento en estas tres regiones. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Formar y capacitar al personal que trabaja entre los grupos ??tnicos, para as?? brindarles herramientas del desarrollado del trabajo formativo transcultural, en cada una de las sesenta y ocho etnias alcanzadas por Misiones Nacionales. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento administrativo </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Continuar con la estructura administrativa de segmentaci??n estrat??gica, desde lo nacional hasta lo local, en los diferentes procesos de la caracterizaci??n y consolidaci??n ??tnica, desde la Guajira hasta el Amazonas y la regi??n insular.</p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Continuar apoyando la parte social con ayudas de menor cuant??a entre los grupos ??tnicos, con el apoyo de Misiones Nacionales y el aval de los distritos ??tnicos, en las diferentes necesidades para el bienestar de nuestros hermanos. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Contamos con ochenta y siete poblaciones ??tnicas en Colombia, sesenta y nueve de ellas alcanzadas y diecinueve en proyecci??n.</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de alcance evangel??stico </strong></p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/MISIONES_EXTRANJERAS_IPUC-001.png' /> </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de personal evangel??stico </strong></p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-008.png' /> </p>`),
        '3': (`<p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Continuar con expansi??n del Evangelio dentro y fuera de las c??rceles, ofreciendo recursos y materiales estrat??gicos para llegar a las familias de los PPL, en forma virtual o presencial a trav??s de BIS. </p> <p style='padding-top: 0.7em; font-size: 1em;'>Se realizaron impactos, campa??as, Refam, BIS, cultos de prevenci??n y sensibilizaci??n; adem??s evangelismo personalizado en las ocho zonas y a todos los distritos.</p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Se realizaron ayunos, vigilias y oraci??n; para que impulsen la consagraci??n y llenura del Esp??ritu Santo, de nuestros Pastores y evangelistas carcelarios; en las ocho zonas y a todos los distritos. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Se est??n consolidando procesos y mejor??ndolos, mediante el uso de nuevas herramientas y estrategias puestas al alcance de Pastores y l??deres de evangelismo carcelario. Por medio de talleres, capacitaciones y conversatorios mes a mes, en las ocho zonas y a todos los distritos. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Lograr un alcance amplio mediante jornadas de donaci??n y colectas de todo lo referente con lo social, para poder suplir parte de las necesidades de los PPL y familias. Por medio de donaciones, kit de aseo, mercados y bioseguridad elementos, en las ocho zonas y a todos los distritos, de forma presencial y virtual. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento administrativo </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Orientar a los grupos de apoyo y comit??s locales, en el conocimiento de las normas del Inpec y funciones administrativas mediante actividades evaluativas y de proyecci??n, con el fin de fortalecer el liderazgo (hacia una buena administraci??n de una manera integral).</p> <p style='padding-top: 0.7em; font-size: 1em;'>Por medio de reuniones evaluativas, reuniones de asesor??a con mesas de trabajo, reuniones y asesor??as con coordinadores distritales y zonales; en las ocho zonas y a todos los distritos, de forma presencial y virtual. </p> <p style='padding-top: 0.7em; font-size: 1em;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-009.png' /></p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de alcance evangel??stico </strong></p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-010.png' /> </p>`),
        '4': (`<p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Llevar el mensaje de salvaci??n por medio de videos e im??genes diarios, con el prop??sito de ganar almas para Jesucristo. Por medio de los siguientes programas: </p> <p style='padding-top: 0.7em; font-size: 1em;'>1. C??psula de Vida ??? de lunes a viernes por las redes sociales, Facebook, Instagram, WhatsApp </p> <p style='padding-top: 0.7em; font-size: 1em;'>2. Tik Tok: Creaci??n de plataforma de lunes a viernes.</p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Generar ambientes virtuales, propicios para que los amigos y simpatizantes le entreguen su vida al Se??or Jes??s. </p> <p style='padding-top: 0.7em; font-size: 1em;'>Palabras de Vida ??? Todos los viernes 9:00 pm, por las plataformas virtuales ??? Facebook. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Informar y capacitar mediante informes, talleres, seminarios y encuentros formativos, con el prop??sito de ser m??s eficientes en el campo evangel??stico virtual. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Creaci??n del grupo de WhatsAppla como red de apoyo y difusi??n, que vincule la informaci??n nacional, llegando as?? a las ??reas nacionales, equipos distritales e iglesia local.</p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento administrativo </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Evaluar, capacitar y realizar seguimiento al equipo de evangelismo en medios de comunicaci??n, por medio de reuniones mensuales coordinadores de los distritos y reuniones de equipo de trabajo nacional. </p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-011.png' /></p>`),
        '5': (`<p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Brindamos mediante capacitaciones, talleres te??ricos, mesas de trabajo, convenios, entre otros, los recursos y herramientas necesarias de quienes integran, desarrollan y ejecutan la gran comisi??n ???Pescadores de hombres???, con la idoneidad que se requiere, dirigida a la poblaci??n con discapacidad sensorial.</p> <p style='padding-top: 0.7em; font-size: 1em;'>Estamos desarrollando el tercer nivel de la EFIS y la Refam en LSC. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Contribuimos y motivamos la continua confraternidad social de esta hermosa familia de misiones, mediante eventos afines, para mantener un ambiente fraternal y de hermandad, en la cual el Se??or env??a bendici??n y vida eterna por medio de integraciones y conversatorios.</p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Otras actividades realizadas, pertinentes a su comit?? </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'> <ul> <li>Acompa??amiento a Pastores con sordos en su congregaci??n. </li> <li>Servicio de interpretaci??n en diferentes eventos distritales y nacionales. </li> <li>Consejer??a a sordos de diferentes distritos.</li> <li>Ayudas extraordinarias para matrimonios, parejas de sordos y otras situaciones pertinentes. </li> <li>Proyecto piloto de IBP para sordos en el Distrito 4. </li> <li>Desarrollo de material pedag??gico para sordos semiling??es (analfabetas). </li> <li>Asistencia y acompa??amiento a ceremonias de graduaci??n de los estudiantes de la EFIS en los distritos.</li> </ul> </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong> Talleres y capacitaciones </strong></p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-012.jpg' /></p> </p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-013.jpg' /></p> </p>`),
        '6': (`<p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Motivamos al grupo a proyectar el evangelismo en nuestra ??rea. Visitando los hospitales, cl??nicas en treinta y cinco distritos, a fundaciones, cuarenta y cuatro sedes de ???Rescatados por su sangre???, tambi??n fundaci??n ???Renovando tu mente??? y fundaci??n ???Vives???; adem??s se han hecho trabajos en la calle con la poblaci??n habitante de calle, en hogares geri??tricos, hogares de paso y centro de rehabilitaci??n para drogadictos. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Fortalecemos el conocimiento de los coordinadores distritales en algunos distritos, por medio de asesor??a y acompa??amiento presencial y virtual, y seminarios evangel??sticos de: </p> <p style='padding-top: 0.7em; font-size: 1em;'> <ul> <li>Seminario de sensibilizaci??n. </li> <li>Campamento en fundaciones.</li> <li>Encuentro con los coordinadores especiales y hospitalarios, Melgar (Tolima). </li> </ul> </p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-014.jpg' /> </p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-018.jpg' /> </p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-016.jpg' /></p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-017.jpg' /> </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de alcance evangel??stico</strong></p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-015.png' /> </p>`),
        '7': (`<p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Llevamos el Evangelio a las diferentes Instituciones P??blicas de nuestro pa??s y sus familias, por medio de campa??as; fortaleciendo y afirmando el crecimiento espiritual de cada uno de los hermanos de las Instituciones P??blicas por medio de devocionales y ayunos. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Capacitamos a cada uno de los coordinadores y sus equipos de apoyo, para el desarrollo del trabajo en el evangelismo de las Instituciones P??blicas, se han realizado capacitaciones y campamento. </p> <p style='padding-top: 0.7em; font-size: 1em;'>Otros:</p> <p style='padding-top: 0.7em; font-size: 1em;'> <ul> <li>Posesi??n del primer Pastor de tiempo completo para las Instituciones P??blicas en Melgar.</li> <li>Bautismo en Tolemaida de dos uniformados y la esposa de uno de ellos, en el fuerte militar de Tolemaida.</li> <li>Hasta la fecha se han realizado quinientas cincuenta y dos visitas a diferentes guarniciones de las Instituciones P??blicas, con una asistencia de treinta y dos mil simpatizantes a nuestras reuniones. </li> </ul> </p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-019.jpg' /> </p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-020.jpg' /> </p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-021.jpg' /> </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de alcance evangel??stico </strong></p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-022.png' /> </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de personal evangel??stico </strong></p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-023.png' /> </p>`),
        '8': (`<p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'> Concientizamos a los hermanos que a lo largo y ancho del pa??s est??n realizando esta labor, en la necesidad de recibir de parte de Dios y a trav??s de su Palabra, una unci??n fresca que nos lleve a predicar este mensaje con demostraci??n del poder de Dios. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Fortalecer la vida devocional del evangelista estudiantil, a trav??s de actividades y eventos espirituales que le impulsen a depender 100% del Esp??ritu Santo. Por medio de ayunos nacionales, matutinos y con un congreso con enfoque espiritual, congreso con enfoque espiritual y formativo de manera presencial y virtual. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Formar integralmente al evangelista estudiantil, ofreciendo herramientas de capacitaci??n para realizar la labor con excelencia. </p> <p style='padding-top: 0.7em; font-size: 1em;'>Seminario ???C??tedras de vida??? de manera virtual y presencial. </p> <p style='padding-top: 0.7em; font-size: 1em;'>Tem??ticas: Ansiedad, depresi??n, suicidio, entornos digitales, pornograf??a, sustancias psicoactivas, duelo y salud mental. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'> Fortalecemos la sinergia con los l??deres de j??venes y coordinadores distritales, para llevar a cabo el cumplimiento de la gran comisi??n a trav??s del programa Misi??n Juvenil, dise??ando actividades que nos permitan crecer en la fraternidad con un 75% de cobertura de distritos. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica del alcance evangel??stico </strong></p> <p style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'> <img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-024.png' /> </p>`),
        '9': (`<p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Fortalecer el aspecto espiritual de l??deres de estad??sticas en los distritos. Por medio de alborada virtual bajo la tem??tica. Servicio a Dios desde el componente estad??stico. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Apoyar al trabajo de la escuela nacional de evangelistas por medio de la relator??a de la escuela ???Pescadores de hombres???.</p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento administrativo </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Establecemos lineamientos administrativos para consolidar el ??rea. Organizaci??n de material pedag??gico en el ??mbito estad??stico; la log??stica empleada es la asignaci??n de m??dulos a cada asesor. Lenguaje estad??stico, medidas de tendencia central con una cobertura del 100%, todos los asesores nacionales del ??rea participaron. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Fortalecimiento t??cnico a l??deres distritales y locales. Capacitaci??n a l??deres distritales y locales de estad??sticas de manera presencial; t??cnicas estad??sticas, instrumentos de recolecci??n de informaci??n y tabulaci??n de los datos. </p> <p style='padding-top: 0.7em; font-size: 1em;'><strong> Objetivo segmento social </strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Trabajo social ente los lideres distritales de estad??sticas. </p> <p style='padding-top: 0.7em; font-size: 1em;'>Programa de felicitaciones a l??deres distritales que cumplen a??os de vida y matrimonial por medio de redes sociales. </p> `),
    }
    
    if (!$(`#accordion-${e}`).hasClass('active-accordion')) {
        $(`#accordion-${e}`).addClass('active-accordion')
        $(`#accordion-${e}`).parent().append(array[e])
    } else {
        $(`#accordion-${e}`).removeClass('active-accordion')
        $(`#accordion-${e}`).parent().find('p').remove()
        $(`#accordion-${e}`).parent().find('ul').remove()
    }


}

function indice_event(e) {
    $('.magazine').turn('page', e);
}


/**
    * @dec Funcion para agregar una region
<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA??? NO CON EJ??RCITO, SINO CON MI ESP??RITU</strong></p>
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
<p  style='padding-top: 0.7em; font-size: 1em;'>Gr??fica de alcance evangel??stico</p>

 

<p style='font-size: 2em; text-align: center; color: #387086;'><strong>BRIEF DES VORSITZENDEN</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; color: #387086;'>Wer an mich glaubt, wie die Heilige Schrift sagt ???.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Br??derliche Gr????e an alle unsere Br??der im Namen Jesu. Wenn ich ??ber das Thema dieser
neuen Ausgabe mit dem Titel ;Wie die Schrift sagt' nachdenke, muss ich sagen, dass sein Wort die Fackel ist, die unseren Weg erleuchtet und unser Schicksal lenkt.

</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Mit dem Ziel, Instrumente zu f??rdern, die zu unserem Wachstum und unserer Ausbildung beitragen, hat das Konsistorium der ??ltesten, das immer danach strebt, in allem, was wir tun, unter der F??hrung Gottes zu handeln, das Ziel unserer vorherigen Ausgabe mit dem Titel 'F??r immer der Glaube' aufgegriffen und auf unseren christlichen Lebensstil ausgerichtet und schl??gt daher unser neues Motto vor: 'Wie die Schrift sagt'.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Die Heilige Schrift ist das Wort Gottes, obwohl sie von Menschen geschrieben wurde, die von ihm inspiriert wurden; wir sind uns nicht dar??ber im Unklaren, dass sieden ganzen Plan des Herrn f??r die Menschen enth??lt, um gerettet zu werden, gerecht und gottesf??rchtig zu leben, in der Weisheit zu wachsen, vollendet und zu jedem guten Werk vorbereitet zu werden.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Unter den vielen bereichernden Lehren f??r unser Leben und in ??bereinstimmung mit dem Vorschlag Christi, in Frieden, Gemeinschaft, Br??derlichkeit und Harmonie zu leben, hat er uns mit dem gleichen inspirierenden Geist seines Wortes ausgestattet, der uns dazu f??hrt, im Licht zu wandeln und unsere m??glichen Unterschiede zu akzeptieren, ohne Streit, Hass und Groll zu erzeugen.

</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><span style='font-style: italic;'><strong>???Seine Stimme ert??nt auf der ganzen Erde...??? (Psalm 19.4).</strong></span>
Durch sein Wort werden wir gereinigt. Erinnern wir uns daran, dass menschliche Anstrengungen, unsere Opfer, nutzlos sind, um ein reines Herz zu erlangen; nur ein Wille, der auf sein Wort und durch seinen Geist ausgerichtet ist, wird uns verwandeln. Durch sein Wort werden wir aufgebaut und mit den notwendigen Grundlagen f??r ein siegreiches Leben in Christus Jesus versorgt; sein Wort gibt uns Wachstum und Festigkeit, sein Wort ist Leben.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Sein Wort ist ein Licht, das unsere Schritte erhellt, damit unsere F????e nicht vom Weg abkommen, wir nicht ausrutschen, nicht stolpern und so den Marsch zur Eroberung unserer Heiligung fortsetzen.

</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Wir haben das sicherste prophetische Wort; wir werden gut daran tun, es immer zu beachten und zu befolgen. Wir werden auf diese Fackel achten, die an einem dunklen Ort leuchtet, inmitten der Finsternis dieser Welt, bis der Tag anbricht und der Morgenstern in unseren Herzen aufgeht.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Das Wort des Herrn Jesus ist es wert, von allen aufgenommen zu werden; ein Teil des Ziels unserer neuen Ausgabe ist es, ein weiteres Mittel zu seiner Verbreitung zu sein. Deshalb laden wir unsere Leser ein, die Heilige Schrift zu sch??tzen; sie wird uns bis zum Ende leiten.
</p>
<p  style='padding-top: 0.7em; font-size: 1em; color: #387086;'>Von H??ctor Ariel Campuzano Fonseca. Pr??sident IPUC
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


<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA??? NO CON EJ??RCITO, SINO CON MI ESP??RITU</strong></p>
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



<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento evangel??stico</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Cada misionero ha realizado campa??as, trabajo evangel??stico y Refam tanto virtual como
presencial; adem??s han realizado ayunos, vigilias, devocionales y programas espirituales, que
fortalezcan la visi??n del misionero y su familia.</p>


<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento espiritual</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se han tenido ense??anzas con invitados, de acuerdo a la necesidad en las reuniones con los
misioneros y esposas, como tambi??n se han tenido ense??anzas con invitados de acuerdo a la
necesidad de los hijos de misioneros.</p>

<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento formativo</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Capacitaci??n y orientaci??n al misionero, generando y brindando herramientas, por medio de
seminarios y talleres de formaci??n, con diversas tem??ticas de forma integral.</p>


<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento social</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Fortalecemos la obra social como mecanismo de participaci??n en la obra misionera, mediante
jornadas socio-evangel??sticas. Realizando visitas a varios misioneros y sus familias por parte del
Director Nacional, coordinador y su esposa, dando apoyo y fortaleza; y se ense???? a las iglesias.
Hubo felicitaciones a misioneros y esposas, a trav??s de los grupos por motivo de cumplea??os entre
otros. Los misioneros nacionales realizaron actividades participativas en el campamento de Melgar,
realizaron la din??mica del amigo secreto con entrega de detalles unos a otros.</p>

<p style='font-size: 2em; text-align: center; color: #194d10;'><strong>Objetivo segmento administrativo</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Asesoramos a los misioneros dando t??cnicas de administraci??n ministerial, logrando la
consolidaci??n y estructuraci??n de proyectos e ideas mediante conferencias. Las esposas de los
misioneros se reunieron en la Asamblea de Pastores en Medell??n para recibir formaci??n, y se
publicaron art??culos formativos por parte de ellas en la revista digital de Misiones Nacionales.</p>





<p  style='padding-top: 0.7em; font-size: 1em;'>De las familias misioneras nacionales se han escogido dos, para el campo misionero internacional:
Edilberto D??az y familia (Misionero en Duitama, Boyac??, Distrito 14) para Cabo Verde; y
Rafael G??mez y familia (Misionero en San Andr??s Islas, Distrito 8) para Trinidad y Tobago.</p>
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
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>M??todos y evangelismo</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>M??todos y evangelismo</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-000.png' /></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<ul>
 <li>Atenci??n a distritos y congregaciones, de forma presencial y virtual.
 </li>
 <li>Asesor??as realizadas a diferentes distritos por los coordinadores distritales.
 </li>
 <li>Conferencia presencial en el campamento de Melgar (Tolima) ??? con los treinta y cinco distritos, y sus coordinadores distritales.	 </li>
 <li> Capacitaci??n estrat??gica en la implementaci??n de Refam digital.
</li>
 <li>Articulaci??n Refam digital con Refam en vivo.  </li>
 <li> Creaci??n del Linkr.bio. - con veintisiete distritos, equivalente al 77% de cobertura.
</li>
</ul>
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Rendimiento de las actividades desarrolladas en la ruta evangel??stica 
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>1. M??todos de evangelismo - Cobertura de 53% de congregaciones encuestadas.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>2. Uno M??s ??? cobertura del 17.5% de congregaciones encuestadas.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>3. Bis - cobertura del 23.6% de congregaciones encuestadas. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>4. Refam - cobertura de un 100% de distritos y 73.9% de congregaciones encuest</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>5. Refam digital ??? cobertura de 6.3% de congregaciones encuestadas. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>6. Refam en vivo ??? cobertura nacional y extranjera, 12.2% de congregaciones. 
encuestadas con un promedio de quinientas personas conectadas en cada programa, 
y un promedio de personas alcanzadas de treinta y seis mil.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>7. Discipulado ??? cobertura de 42.5% de congregaciones encuestadas. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico - rendimiento </strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Implementaci??n de ???Ruta evangel??stica a nivel local???, ???M??todos de evangelismo??? usados en las congregaciones. 53% de 743 congregaciones encuestadas. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-003.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de alcance evangel??stico ??? Consolidado nacional</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-002.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Asuntos ??tnicos????</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Continuar la b??squeda y fortalecimiento de la vida espiritual de nuestros hermanos en los grupos ??tnicos, mediante devocionales que atiendan las diferentes necesidades de ellos. Se realizaron ayunos en las diferentes regiones.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<ul>
 <li>Regi??n Caribe - 85% de las congregaciones y 245 asistentes.
</li>
 <li>Regi??n Pac??fica y Andina - 82% de las congregaciones y 367 asistentes.
</li>
 <li>Regi??n Orinoqu??a y Amaz??nica - 78% de las congregaciones y 289 asistentes.
</li>
</ul>
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Tambi??n se realiz?? asesor??a y acompa??amiento en estas tres regiones.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Formar y capacitar al personal que trabaja entre los grupos ??tnicos, para as?? brindarles herramientas del desarrollado del trabajo formativo transcultural, en cada una de las sesenta y ocho etnias alcanzadas por Misiones Nacionales.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento administrativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Continuar con la estructura administrativa de segmentaci??n estrat??gica, desde lo nacional hasta lo local, en los diferentes procesos de la caracterizaci??n y consolidaci??n ??tnica, desde la Guajira hasta el Amazonas y la regi??n insular.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Continuar apoyando la parte social con ayudas de menor cuant??a entre los grupos ??tnicos, con el apoyo de Misiones Nacionales y el aval de los distritos ??tnicos, en las diferentes necesidades para el bienestar de nuestros hermanos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Contamos con ochenta y siete poblaciones ??tnicas en Colombia, sesenta y nueve de ellas alcanzadas y diecinueve en proyecci??n.</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de alcance evangel??stico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/MISIONES_EXTRANJERAS_IPUC-001.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de personal evangel??stico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-008.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>
Obra carcelaria
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Continuar con expansi??n del Evangelio dentro y fuera de las c??rceles, ofreciendo recursos y materiales estrat??gicos para llegar a las familias de los PPL, en forma virtual o presencial a trav??s de BIS.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se realizaron impactos, campa??as, Refam, BIS, cultos de prevenci??n y sensibilizaci??n; adem??s evangelismo personalizado en las ocho zonas y a todos los distritos.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se realizaron ayunos, vigilias y oraci??n; para que impulsen la consagraci??n y llenura del Esp??ritu Santo, de nuestros Pastores y evangelistas carcelarios; en las ocho zonas y a todos los distritos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo 
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se est??n consolidando procesos y mejor??ndolos, mediante el uso de nuevas herramientas y estrategias puestas al alcance de Pastores y l??deres de evangelismo carcelario. Por medio de talleres, capacitaciones y conversatorios mes a mes, en las ocho zonas y a todos los distritos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Lograr un alcance amplio mediante jornadas de donaci??n y colectas de todo lo referente con lo social, para poder suplir parte de las necesidades de los PPL y familias.
Por medio de donaciones, kit de aseo, mercados y bioseguridad elementos, en las ocho zonas y a todos los distritos, de forma presencial y virtual.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento administrativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Orientar a los grupos de apoyo y comit??s locales, en el conocimiento de las normas del Inpec y funciones administrativas mediante actividades evaluativas y de proyecci??n, con el fin de fortalecer el liderazgo (hacia una buena administraci??n de una manera integral).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por medio de reuniones evaluativas, reuniones de asesor??a con mesas de trabajo, reuniones y asesor??as con coordinadores distritales y zonales; en las ocho zonas y a todos los distritos, de forma presencial y virtual.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-009.png' /></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de alcance evangel??stico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-010.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Evangelismo medios de comunicaci??n
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Llevar el mensaje de salvaci??n por medio de videos e im??genes diarios, con el prop??sito de ganar almas para Jesucristo. Por medio de los siguientes programas:
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>1. C??psula de Vida ??? de lunes a viernes por las redes sociales, Facebook, Instagram, WhatsApp
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>2. Tik Tok: Creaci??n de plataforma de lunes a viernes.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Generar ambientes virtuales, propicios para que los amigos y simpatizantes le entreguen su vida al Se??or Jes??s.	
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Palabras de Vida ??? Todos los viernes 9:00 pm, por las plataformas virtuales ??? Facebook.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Informar y capacitar mediante informes, talleres, seminarios y encuentros formativos, con el prop??sito de ser m??s eficientes en el campo evangel??stico virtual.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Creaci??n del grupo de WhatsAppla como red de apoyo y difusi??n, que vincule la informaci??n nacional, llegando as?? a las ??reas nacionales, equipos distritales e iglesia local.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento administrativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Evaluar, capacitar y realizar seguimiento al equipo de evangelismo en medios de comunicaci??n, por medio de reuniones mensuales coordinadores de los distritos y reuniones de equipo de trabajo nacional.  
</p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-011.png' /></p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Evangelismo poblaci??n sorda
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Brindamos mediante capacitaciones, talleres te??ricos, mesas de trabajo, convenios, entre otros, los recursos y herramientas necesarias de quienes integran, desarrollan y ejecutan la gran comisi??n ???Pescadores de hombres???, con la idoneidad que se requiere, dirigida a la poblaci??n con discapacidad sensorial.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Estamos desarrollando el tercer nivel de la EFIS y la Refam en LSC.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Contribuimos y motivamos la continua confraternidad social de esta hermosa familia de misiones, mediante eventos afines, para mantener un ambiente fraternal y de hermandad, en la cual el Se??or env??a bendici??n y vida eterna por medio de integraciones y conversatorios.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Otras actividades realizadas, pertinentes a su comit??
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<ul>
 <li>Acompa??amiento a Pastores con sordos en su congregaci??n.
</li>
 <li>Servicio de interpretaci??n en diferentes eventos distritales y nacionales.
</li>
 <li>Consejer??a a sordos de diferentes distritos.</li>
 <li>Ayudas extraordinarias para matrimonios, parejas de sordos y otras situaciones pertinentes.
</li>
 <li>Proyecto piloto de IBP para sordos en el Distrito 4.
</li>
 <li>Desarrollo de material pedag??gico para sordos semiling??es (analfabetas).
</li>
 <li>Asistencia y acompa??amiento a ceremonias de graduaci??n de los estudiantes de la EFIS en los distritos.</li>
</ul>
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong> Talleres y capacitaciones
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-012.jpg' /></p>
</p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-013.jpg' /></p>
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Evangelismo en grupos especiales y misi??n hospitalaria
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Motivamos al grupo a proyectar el evangelismo en nuestra ??rea. Visitando los hospitales, cl??nicas en treinta y cinco distritos, a fundaciones, cuarenta y cuatro sedes de ???Rescatados por su sangre???, tambi??n fundaci??n ???Renovando tu mente??? y fundaci??n ???Vives???; adem??s se han hecho trabajos en la calle con la poblaci??n habitante de calle, en hogares geri??tricos, hogares de paso y centro de rehabilitaci??n para drogadictos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Fortalecemos el conocimiento de los coordinadores distritales en algunos distritos, por medio de asesor??a y acompa??amiento presencial y virtual, y seminarios evangel??sticos de:
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<ul>
 <li>Seminario de sensibilizaci??n.
</li>
 <li>Campamento en fundaciones.</li>
 <li>Encuentro con los coordinadores especiales y hospitalarios, Melgar (Tolima).
</li>
</ul>
</p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-014.jpg' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-018.jpg' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-016.jpg' /></p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-017.jpg' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de alcance evangel??stico</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-015.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Evangelismo en Instituciones P??blicas
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Llevamos el Evangelio a las diferentes Instituciones P??blicas de nuestro pa??s y sus familias, por medio de campa??as; fortaleciendo y afirmando el crecimiento espiritual de cada uno de los hermanos de las Instituciones P??blicas por medio de devocionales y ayunos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Capacitamos a cada uno de los coordinadores y sus equipos de apoyo, para el desarrollo del trabajo en el evangelismo de las Instituciones P??blicas, se han realizado capacitaciones y campamento.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Otros:</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<ul>
 <li>Posesi??n del primer Pastor de tiempo completo para las Instituciones P??blicas en Melgar.</li>
 <li>Bautismo en Tolemaida de dos uniformados y la esposa de uno de ellos, en el fuerte militar de Tolemaida.</li>
 <li>Hasta la fecha se han realizado quinientas cincuenta y dos visitas a diferentes guarniciones de las Instituciones P??blicas, con una asistencia de treinta y dos mil simpatizantes a nuestras reuniones.
</li>
</ul>
</p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-019.jpg' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-020.jpg' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-021.jpg' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de alcance evangel??stico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-022.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica de personal evangel??stico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-023.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>Evangelismo estudiantil
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
Concientizamos a los hermanos que a lo largo y ancho del pa??s est??n realizando esta labor, en la necesidad de recibir de parte de Dios y a trav??s de su Palabra, una unci??n fresca que nos lleve a predicar este mensaje con demostraci??n del poder de Dios.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Fortalecer la vida devocional del evangelista estudiantil, a trav??s de actividades y eventos espirituales que le impulsen a depender 100% del Esp??ritu Santo.  Por medio de ayunos nacionales, matutinos y con un congreso con enfoque espiritual, congreso con enfoque espiritual y formativo de manera presencial y virtual.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Formar integralmente al evangelista estudiantil, ofreciendo herramientas de capacitaci??n para realizar la labor con excelencia.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Seminario ???C??tedras de vida??? de manera virtual y presencial.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Tem??ticas: Ansiedad, depresi??n, suicidio, entornos digitales, pornograf??a, sustancias psicoactivas, duelo y salud mental.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
Fortalecemos la sinergia con los l??deres de j??venes y coordinadores distritales, para llevar a cabo el cumplimiento de la gran comisi??n a trav??s del programa Misi??n Juvenil, dise??ando actividades que nos permitan crecer en la fraternidad con un 75% de cobertura de distritos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Gr??fica del alcance evangel??stico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/Informe_evangelismo.docx-024.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1.5em;'><strong>??rea de estad??stica
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Fortalecer el aspecto espiritual de l??deres de estad??sticas en los distritos. Por medio de alborada virtual bajo la tem??tica. Servicio a Dios desde el componente estad??stico.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangel??stico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Apoyar al trabajo de la escuela nacional de evangelistas por medio de la relator??a de la escuela ???Pescadores de hombres???.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento administrativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Establecemos lineamientos administrativos para consolidar el ??rea.
Organizaci??n de material pedag??gico en el ??mbito estad??stico; la log??stica empleada es la asignaci??n de m??dulos a cada asesor. Lenguaje estad??stico, medidas de tendencia central con una cobertura del 100%, todos los asesores nacionales del ??rea participaron.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Fortalecimiento t??cnico a l??deres distritales y locales.

Capacitaci??n a l??deres distritales y locales de estad??sticas de manera presencial; t??cnicas estad??sticas, instrumentos de recolecci??n de informaci??n y tabulaci??n de los datos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>
Objetivo segmento social
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Trabajo social ente los lideres distritales de estad??sticas.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Programa de felicitaciones a l??deres distritales que cumplen a??os de vida y matrimonial por medio de redes sociales.
</p>



<p class='monserrat-black' style='font-size: 2em; text-align: center; color: #002da6;'><strong>MISIONES EXTRANJERAS IPUC</strong></p> <p style='padding-top: 0.7em; font-size: 1em;'>Hablar de misiones extranjeras, es hablar de algo con lo que ha crecido nuestra Iglesia Pentecostal Unida de Colombia, es algo que va en el ADN de la amada del Se??or, tanto que hoy por hoy nuestros Pastores tienen como un gran logro ir a las misiones y darse del todo por cumplir con la gran comisi??n, es como ver realizado un sue??o. </p> <p style='padding-top: 0.7em; font-size: 1em;'>Es por eso que muchos de los cinco mil treinta pastores de la IPUC estamos listos a dejar una iglesia por grande que sea y una buena econom??a, no interesa, lo m??s grande son las misiones. Un ni??o le pregunt?? a su maestro de escuela dominical ?????qu?? quieres ser cuando seas grande???? La respuesta no se hizo esperar ???misi??nelo???: Misionero, pero as?? respondi?? el ni??o y as?? los j??venes y adultos. </p> <p style='padding-top: 0.7em; font-size: 1em;'>Aqu?? en la congregaci??n le pregunt?? a una joven que cumpli?? los quince a??os ??qu?? es lo que m??s desea usted? ???Ser una misionera??? me respondi??, servir al Dios de las misiones por ese sentir que ha puesto en su pueblo. </p> <p style='padding-top: 0.7em; font-size: 1em;'>Hoy deseamos compartir con todos algo que estamos haciendo en Centro y sur Am??rica, las islas del caribe, ??frica, Europa y Asia, nuestro director el hermano Vicente Arango tiene una visi??n extraordinaria de las misiones y buena experiencia en este campo, y ??l como los coordinadores nacionales de misiones extranjeras nos aportar??n un informe muy hermoso de lo que all?? en estos lugares viene sucediendo. </p> <p style='padding-top: 0.7em; font-size: 1em;'>Y como dice el texto Sagrado: ???Como el agua fr??a al alma sedienta, As?? son las buenas nuevas de lejanas tierras???. (Proverbios 25:25). </p> <p style='padding-top: 0.7em; font-size: 1em;'>Video 1. Hno. Vicente Arango, Director de Misiones Extranjeras. </p> <p style='padding-top: 0.7em; font-size: 1em;'>En ??frica, por la gracia del Se??or ya se han abierto cinco obras misioneras Guinea Bissau, Cabo Verde, Tanzania, Mozambique y Guinea Ecuatorial, en la actualidad hay una membres??a de doscientos setenta y tres hermanos, y catorce pastores predicando el mensaje de salvaci??n </p> <p style='padding-top: 0.7em; font-size: 1em;'>Video 2. ??frica (Grupo de alabanza en Guinea Ecuatorial, octubre 2021, misionero Juan Carlos Soto).</p> <p style='padding-top: 0.7em; font-size: 1em;'>Video 3. (Palabras de dos hermanos caboverdianos, Cabo Verde, julio de 2022, misionero Jerem??as Vel??squez) en el video hablan idioma portugu??s pero traducido al espa??ol dicen ???Que Dios bendiga a toda la iglesia en Colombia, el Consistorio de Ancianos, todos los Pastores, las obras misioneras. Somos agradecidos por todos los misioneros que han sido enviados a todo el mundo, principalmente a Cabo verde y tambi??n agradecidos por los que apoyan la obra con sus ofrendas misioneras??? </p> <p style='padding-top: 0.7em; font-size: 1em;'>Video 4. Bautismo de cuatro hermanos en Tanzania, cantan una alabanza que dice en espa??ol ???Le digo a Satan??s, ??no m??s!, y voy a Dios mi Padre???. </p> <p style='padding-top: 0.7em; font-size: 1em;'>Audio 1. El misionero de Guinea Bissau, el hermano. Manuel Cassiani narra el momento que el Se??or le confirm?? su llamado como misionero a Guinea Bissau. </p> <p style='padding-top: 0.7em; font-size: 1em;'>Cu??n grandes maravillas ha hecho el Alto y Sublime Dios, sus Palabras siguen siendo esp??ritu y vida, vida para los pueblos encadenados en densa oscuridad. Tenemos buenas nuevas desde Europa y Asia, damos gracias al Se??or por cada una de ellas, una de las naciones m??s bendecidas por el Se??or en Europa es la iglesia del Se??or en Espa??a, actualmente hay m??s de cinco mil quinientos hermanos bautizados en el Nombre de Jes??s, y cerca de ciento cincuenta pastores a los que Colombia apoya econ??micamente. </p> <p style='padding-top: 0.7em; font-size: 1em;'>Video 5. Misionero Marcos Pab??n, Madrid, Espa??a 12 de noviembre de 2021.</p> <p style='padding-top: 0.7em; font-size: 1em;'>En Europa la Iglesia Pentecostal Unida de Colombia tambi??n hace presencia en Portugal, Francia, Italia, B??lgica, Alemania, Suecia, Suiza, Austria, Reino Unido y Holanda. El Se??or este a??o nos ha permitido un avance especial en cada una de las obras misioneras, dentro de ellas la posesi??n del primer Pastor italiano nativo, su nombre es el hermano Nuccio Arcidiacono, en el lugar de La Sicilia, pedimos sus oraciones por ??l y su familia, que el Se??or sea ayud??ndoles y gui??ndoles. </p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/MISIONES_EXTRANJERAS_IPUC-001.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
En Asia por la gracia del Se??or hace presencia en 3 pa??ses, Jap??n zona norte y sur, Filipinas
e Israel.
</p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/MISIONES_EXTRANJERAS_IPUC-003.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
Por algo el Se??or Jes??s dice: y con tu sangre nos has redimido para Dios, de todo linaje y
lengua y pueblo y naci??n; apocalipsis 5:9. No podemos dejar de decir lo que hemos visto y
o??do, este es un mensaje fuera de lo com??n y sus efectos tienen alcances eternos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
En Centro y Sur Am??rica y el Caribe la IPUC hace presencia en Honduras, Panam??, Costa
Rica, Nicaragua, El Salvador, Guatemala, Argentina, Uruguay, Paraguay, Chile, Brasil,
Venezuela, Surinam, Guayana Francesa, Bonaire, Curazao, Aruba, y pr??ximamente
Martinica, el Se??or se ha glorificado y muchas almas han aceptado al Se??or como su salvador
</p>
<p  style='padding-top: 0.7em; font-size: 1em; display: grid; width: 100%; justify-items: center;'>
<img style='width: 70%; heigth: 70%;' src='./assets/pics/icons/MISIONES_EXTRANJERAS_IPUC-005.png' />
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
Por otro lado, del gran trabajo realizado por nuestro hermano Reinel Galvis, otro hombre
usado por Dios para hacer un gran trabajo durante varias generaciones y como director de
misiones extranjeras en la vigencia pasada organiz?? un trabajo muy importante que hoy en
hno. Vicente ha fortalecido y son las comunicaciones de misiones extranjeras y que hoy
cuenta con una organizaci??n muy importante para esta magna labor.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
A continuaci??n, este es el organigrama del equipo de comunicaciones de misiones
extranjeras, as?? continuamos esta gran labor
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
 <span style='font-size: 1.5em;'>DIRECTOR GENERAL:</span> Vicente Arango
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<span style='font-size: 1.5em;'>ENCARGADO AREA:</span> Jairo Graffe Brand
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<span style='font-size: 1.5em;'>DIRECTOR CREATIVO: </span> Javier Restrepo
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<span style='font-size: 1.5em;'>DIRECTOR WEB: </span> Wilmar Acosta
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<span style='font-size: 1.5em;'>EDITOR DE VIDEO:</span> Javier Restrepo
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<span style='font-size: 1.5em;'>DISE??ADOR GRAFICO:</span> Keyla Tejada
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<span style='font-size: 1.5em;'>OPERADOR:</span> Johan Vel??squez
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<span style='font-size: 1.5em;'>TALLERISTAS:</span> Javier Restrepo Y Geovanny 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<span style='font-size: 1.5em;'>DIRECTOR DE PROGRAMACION:</span> Carlos Echeverry
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<span style='font-size: 1.5em;'>MEDIOS ESCRITOS:</span> Carlos P??rez
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<span style='font-size: 1.5em;'>LOCUTORES Y PERIODISTAS:</span> 35 promotores distritales y dpto. Misiones extranjeras
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
  <strong>Listado de Obras misioneras en el extranjero</strong>
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
Esperamos sigan orando y ofrendando para continuar estableciendo el reino de Dios en el
coraz??n de todos los hombres en todo el mundo.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
Atentamente,
</p>
<p  style='padding-top: 0.7em; font-size: 1em; color: #073580;'>
VICENTE ARANGO - DIRECTOR OBISPO
</p>
<p  style='padding-top: 0.7em; font-size: 1em; color: #073580;'>
MISIONES EXTRANJERAS
</p>


<p  style='padding-top: 0.7em; font-size: 1em;' class='box-accordion'> 
   <a id='accordion-1' onClick='event_click_accordion(`1`)' class='items-accordion'>M??todos y evangelismo</a>
</p>

<p  style='padding-top: 0.7em; font-size: 1em;' class='box-accordion'> 
   <a id='accordion-2' onClick='event_click_accordion(`2`)' class='items-accordion'>Asuntos ??tnicos</a>
</p>

<p  style='padding-top: 0.7em; font-size: 1em;' class='box-accordion'> 
    <a id='accordion-3' onClick='event_click_accordion(`3`)' class='items-accordion'>3</a>
</p>

<p  style='padding-top: 0.7em; font-size: 1em;' class='box-accordion'> 
    <a id='accordion-4' onClick='event_click_accordion(`4`)' class='items-accordion'>4</a> 
</p>

<p  style='padding-top: 0.7em; font-size: 1em;' class='box-accordion'> 
    <a id='accordion-5' onClick='event_click_accordion(`5`)' class='items-accordion' >5</a>
</p>

<p  style='padding-top: 0.7em; font-size: 1em;' class='box-accordion'> 
    <a id='accordion-6' onClick='event_click_accordion(`6`)' class='items-accordion'>6</a>
</p>

<p  style='padding-top: 0.7em; font-size: 1em;' class='box-accordion'> 
    <a id='accordion-7' onClick='event_click_accordion(`7`)' class='items-accordion'>Evangelismo en Instituciones P??blicas</a>
</p>

<p  style='padding-top: 0.7em; font-size: 1em;' class='box-accordion'> 
    <a id='accordion-8' onClick='event_click_accordion(`8`)' class='items-accordion'>Evangelismo estudiantil</a>
</p>

<p  style='padding-top: 0.7em; font-size: 1em;' class='box-accordion'> 
    <a id='accordion-9' onClick='event_click_accordion(`9`)' class='items-accordion'>??rea de estad??stica</a>
</p>

</div>


<p class='monserrat-black' style='font-size: 2em; text-align: center; color: #62164b;'><strong>CURSO INTENSIVO UNA MIRADA INTEGRAL A LA VIDA ADULTA</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El envejecimiento de la poblaci??n
mundial y los adultos ha crecido de
manera importante; la mayor??a de los
pa??ses del mundo est??n
experimentando un aumento en el
n??mero y proporci??n de personas
mayores. Seg??n datos del DANE en el
mundo para el 2050, el n??mero de
personas de m??s 60 a??os crecer?? de
600 millones a casi 2000 millones, y se</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>prev?? que el porcentaje de personas de
60 a??os o m??s se duplique, pasando de
un 10% a un 21%. Ese incremento ser??
mayor y m??s r??pido en los pa??ses en
desarrollo, donde se prev?? que la
poblaci??n anciana se multiplique por
cuatro en los pr??ximos 50 a??os.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Colombia no est?? lejos de esa realidad,
los datos demogr??ficos demuestran
que la fertilidad y la mortalidad han
cambiado; en este pa??s se ha
experimentado un aumento
considerable en la esperanza de vida al
nacer y la mejora en la supervivencia
de las personas mayores que repercute
en la proporci??n cada vez mayor de la
longevidad colombiana.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
Este panorama no es otra cosa que la
indicaci??n de que debemos
prepararnos para cuidarnos y cuidar a
otros. Comprometidos con el cuidado
del adulto mayor, iniciamos una muy
buena propuesta de capacitar a
mujeres en esta ??rea; pues como lo
hemos visto es una demanda social del
presente, y a futuro una muy buena
herramienta laboral en caso de
necesitarla. Para este a??o hemos
tenido la oportunidad de capacitar 150
mujeres en esta ??rea, con un grupo
experto en adulto mayor grupo (GEA).</p>
<p  style='padding-top: 0.7em; font-size: 1em; color: #62164b;'>Tem??tica:</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<ul style='color: #62164b;  list-style-type: decimal;'>
 <li>Gerontolog??a</li>
 <li>Psicolog??a cl??nica</li>
 <li>Salud y nutrici??n</li>
 <li>Pedagog??a</li>
 <li>Fisioterapia-h??bitos saludables</li>
 <li>??tica del cuidado</li>
 <li>Odontolog??a</li>
</ul></p>
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




<p class='monserrat-black' style='font-size: 2em; text-align: center; color: #62164b;'><strong>ACADEMIA DE
EMPRENDIMIENTO</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Emprender es una actividad compleja
que requiere tomar decisiones
cruciales en las que no basta el sentido
com??n.</p>
<p  style='padding-top: 0.7em; font-size: 1em; background-color: #e6dae9; padding: 0.4em; border: solid 0.1em #ae86b7;'>??No te lo he ordenado yo? ??S??
fuerte y valiente! No temas ni te
acobardes, porque el Se??or tu Dios
estar?? contigo dondequiera que
vayas.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En UDIM trabajamos para potenciar los
recursos de muchas mujeres
talentosas que sirven de manera
incansable en la obra del se??or. Es por
lo que damos herramientas que
enriquecen su quehacer en cada
entorno social donde se encuentran. La
academia para emprendedoras tiene
como fin formar mujeres, brindando
asistencia en las siguientes ??reas:</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>

<ul style='list-style-type: decimal;'>
 <li>??rea administrativa</li>
 <li>??rea de emprendimiento</li>
 <li>??rea de mercadeo</li>
 <li>??rea econ??mica</li>
 <li>??rea financiera</li>
 <li>??tica del cuidado</li>
 <li>Odontolog??a</li>
</ul>
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se trabaja de manera virtual, con los
profesionales en cada ??rea. Tenemos
un aproximado de 100 mujeres
emprendedoras, dispuestas a hacer un
proceso y crecer de manera productiva
para ellas y su entorno social.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En algunos distritos el consejo directivo</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>se ha desplazado para llevar este
programa con un profesional en
negocios internacionales, para
incentivar este programa, que de
manera preventiva se hace tambi??n
con las esposas de pastores activos en
el ministerio.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
Si quieres capacitarte contacta con
nosotros: 3148233134 encargada del
programa. Te puedes capacitar de
manera virtual, nuestra aula virtual
cuenta con todos los pasos para que
hagas tu propio proceso individual.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>



<p class='monserrat-black' style='font-size: 2em; text-align: center; color: #62164b;'><strong>ACOMPA??AMIENTO
AL SECTOR DE LA
MOJANA</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; color: #62164b;'>fecha 22- 31 de mayo 2022</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Comitiva delegada:</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
<ul>
 <li>Coordinadora: Claudia Hoyos
Psic??loga y especialista en pareja y
familia</li>
 <li>Marisela Castro: Soci??loga (esposa
de pastor)</li>
 <li>Ely Yohana Lozada: Gestora
Comunitaria (esposa de pastor)</li>
 <li>Esneira Salazar; Nutricionista
(servidora local)</li>
</ul>
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
La Mojana Sucre es un sector de alta
vulnerabilidad en donde las
necesidades se hacen evidentes, sin
embargo, para la comisi??n que tuvo la
oportunidad de trabajar durante 11 d??as
en el sector fue un tiempo de
aprendizaje, adem??s de la ayuda que
se pudo brindar a las diferentes
comunidades de la regi??n; el trabajo
fue muy gratificante, ya que se pudo
percibir la disposici??n de la comunidad</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>en participar de todas las actividades
las cuales fueron de gran beneficio no
solamente a cada individuo sino
tambi??n a la poblaci??n en general.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se realiz?? un trabajo integral con
parejas, al igual que con los
adolescentes y los ni??os, tratando de
suplir las necesidades de los diferentes
grupos, dando excelentes resultados
en cada intervenci??n.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>



<p class='monserrat-black' style='font-size: 2em; text-align: center; color: #62164b;'><strong>UDI</strong></p>
<p  style='padding-top: 0.7em; font-size: 1.2em; color: #62164b;'><strong>MARIELA FORERO
DE TORRES</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em; color: #62164b;'>MUERTE, USO DE BUEN RETIRO,
DESTITUCI??N, RENUNCIA,
ENFERMEDAD</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>??Frente a cada una de estas palabras,
qu?? pensamiento le llega?...??Qu??
sensaci??n le da?...??Siente vac??o?...Son 5
puertas por las cuales cada uno de
ustedes como pastor tendr?? que salir
un d??a, y por ende su esposa y familia.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hoy quiero ser
la voz de todas
aquellas
mujeres que
acompa??a a
cada uno de
ustedes en la
hermosa labor como es el servicio en la
obra del se??or. Para nadie es ajeno la
situaci??n que tuvo que vivir la iglesia
durante la pandemia con la perdida de
muchos pastores que fallecieron;
muchos de ellos en angustia por dejar
sus familias con muchos proyectos
pendientes. Escuchamos voces de
mujeres que dec??an de sus esposos -sus
??ltimas palabras fueron: ???SE??OR te
encargo mi familia???, otras recib??an
notas en servilletas donde ellos
escrib??an ???los am?? y Dios tiene el
control???, otra que su esposo oraba y dec??a ???se??or, yo cuide de tu grey, cuida
t?? de mi familia???.</p>
<p  style='padding-top: 0.7em; font-size: 1em; background-color: #e6dae9; padding: 0.4em; border: solid 0.1em #ae86b7;'>
Proverbios 31: 8,9

??Levanta la voz por los que no tienen voz!
??Defiende los derechos de los despose??dos!
??Levanta la voz, y hazles justicia! ??Defiende

a los pobres y necesitados!
.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La fundaci??n UDIM durante 17 a??os ha
venido tocando temas frente a la
viudez, la destituci??n, el retiro, la
enfermedad; circunstancias que hacen
que la familia tome un giro diferente y
se vea enfrentada a situaciones muy
dolorosas; y donde a trav??s de un
proyecto de investigaci??n se observ??</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>que la mujer
al acontecer
uno de estos
momentos,
se ve
enfrentada a
tomar
responsabilidades que desconoc??an y
que no saben c??mo hacerlo.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hoy, son mujeres que deben asumir la
total responsabilidad de ellas y de la
familia a cargo, hijos peque??os,
adolescentes, j??venes en proceso de
formaci??n profesional. Temas que se
deben pensar y planear con
anticipaci??n, (pero la muerte lleg??...) y
son temas aplazados para cuando
tuvieran el ???dinero, el tiempo o una
mejor iglesia???. Y ese es el objetivo de la
fundaci??n UDIM, dar herramientas,</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>preparar para que cada una de ellas
este lista a hacer frente a esta situaci??n
que de todas formas tendr?? que
asumir; y que mejor que la encuentre
preparada.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Es por eso que hoy, en nombre de
aquella mujer esposa de pastor y como
directora de la fundaci??n UDIM (que,
en tiempo de pandemia, ya no sab??a
c??mo consolar o que decir a cada
mujer que iba quedando sola con su
familia, y que deb??a desocupar la casa,
para el nuevo pastor y su familia)
recordarles que el m??s comprometido
con la capacitaci??n, preparaci??n
formaci??n y planeaci??n de la familia y
de esa mujer que lo acompa??a, es
usted Como cabeza y sacerdote de
ellos. ???Solo Dios sabe que, en cada
llamada, quer??a escuchar que esos
pastores ten??an seguridad social,
seguro de vida, que ya le ten??a una
casa; para as??, poder atender a la mujer
en su duelo y hacer un proceso
emocional; pero, cuando est??, la
preocupaci??n econ??mica, ellas deben
saltar ese proceso y dedicarse a buscar
qu?? hacer, para generar ingresos y velar
por su familia, siendo ahora la ???cabeza???
por la ausencia del esposo, padre y
pastor.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Mi admiraci??n y respeto, por todos
aquellos que han entendido el mensaje
de la fundaci??n y han apoyado a su
esposa en educaci??n, o en un
emprendimiento o proyecto social;
porque tambi??n es cierto que muchas,
han manifestado ???mi esposo siempre
me dijo que si le pasaba algo, yo deb??a
conocer de temas econ??micos, y
gracias a Dios quede con casa, con la
pensi??n y pude invertir lo del seguro y
lo de corpentunida, en un
emprendimiento de negocio. Mi
esposo siempre fue muy organizado y
me compart??a todo lo que yo deb??a
saber en su ausencia???.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>???Las peque??as cosas son las
responsables de los grandes cambios???.</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Atentamente: Mariela forero
Representante legal.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>


<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'><a type='button' onclick='indice_event(4)' class='a-aux-indice'>Carta del Presidente</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
H??ctor Ariel Campuzano Fonseca | <span style='font-weight: normal; color: gray;'>Presidente</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 2</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(6)' class='a-aux-indice'>
Notas del Director
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(6)' class='a-aux-indice'>
 ??lvaro de Jes??s Torres Forero | <span style='font-weight: normal; color: gray;'>Pastor IPUC</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 4</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(8)' class='a-aux-indice'>
Como dice la Escritura, por toda la tierra sali?? su voz
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(8)' class='a-aux-indice'>
 Esdras Barranco Jim??nez | <span style='font-weight: normal; color: gray;'>Primer Vicepresidente IPUC</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 8</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(12)' class='a-aux-indice'>
Con la sencillez que dice la Escritura
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(12)' class='a-aux-indice'>
 H??ctor Ra??l Betancur Montoya  | <span style='font-weight: normal; color: gray;'>Secretario General IPUC</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 10</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(14)' class='a-aux-indice'>
Como dice la Escritura, la Palabra de Dios es viva
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(14)' class='a-aux-indice'>
Oscar de Jes??s Restrepo Villada | <span style='font-weight: normal; color: gray;'>Director Administrativo IPUC
</span> | <span style='font-weight: normal; color: #9a211f;'>pagina 12</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.7em;'>
<a type='button' onclick='indice_event(16)' class='a-aux-indice'>
Como dice la Escritura, bienaventurados los que oyen y obedecen
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(16)' class='a-aux-indice'>
 Fernando L??pez Pimiento | <span style='font-weight: normal; color: gray;'>Director Misiones Nacionales IPUC</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 14</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(18)' class='a-aux-indice'>
Como dice la Escritura, limpios por La Palabra
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(18)' class='a-aux-indice'>
Vicente Arango Varela | <span style='font-weight: normal; color: gray;'>Director Misiones Extranjeras</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 16</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(20)' class='a-aux-indice'>
Como dice la Escritura, l??mpara es a mis pies tu Palabra
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(20)' class='a-aux-indice'>
Angelmiro Camacho Isaza | <span style='font-weight: normal; color: gray;'>Director General FECP</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 18</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.65em;'>
<a type='button' onclick='indice_event(22)' class='a-aux-indice'>
Como dice la Escritura, el Se??or abri?? su coraz??n para que oyese su Palabra
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(22)' class='a-aux-indice'>
Exel Javier Copete Gamboa | <span style='font-weight: normal; color: gray;'>Supervisor distrito 9</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 20</span>
</a>
</p>

//parte 1 acabada

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(24)' class='a-aux-indice'>
Como dice la Escritura, no con ej??rcito sino con mi Esp??ritu
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(24)' class='a-aux-indice'>
Segundo G. Arboleda Rosero | <span style='font-weight: normal; color: gray;'>Pastor IPUC</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 22</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(26)' class='a-aux-indice'>
Como dice la Escritura, predica a tiempo y fuera de tiempo
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(26)' class='a-aux-indice'>
Jairo Antonio Mar??n Leiva | <span style='font-weight: normal; color: gray;'>Pastor IPUC
</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 24</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(28)' class='a-aux-indice'>
Preparados para toda buena obra
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(28)' class='a-aux-indice'>
Willman Mar??n Parra | <span style='font-weight: normal; color: gray;'>Pastor IPUC</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 26</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(30)' class='a-aux-indice'>
Como dice la Escritura, var??n y hembra los cre??
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(30)' class='a-aux-indice'>
Eduardo Tejada | <span style='font-weight: normal; color: gray;'>Pastor IPUC</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 28</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(32)' class='a-aux-indice'>
??l es el que produce el querer, como el hacer
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(32)' class='a-aux-indice'>
Rodrigo Mu??oz | <span style='font-weight: normal; color: gray;'>Pastor IPUC</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 30</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(34)' class='a-aux-indice'>
La Palabra de Dios es intachable y es escudo
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(34)' class='a-aux-indice'>
Marcos Pab??n Duarte | <span style='font-weight: normal; color: gray;'>Misionero en Espa??a</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 32</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(36)' class='a-aux-indice'>
Como dice la Escritura, La Palabra prof??tica m??s segura
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(36)' class='a-aux-indice'>
Miguel ??ngel Lozano | <span style='font-weight: normal; color: gray;'>Pastor IPUC</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 34</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(38)' class='a-aux-indice'>
Reconocimiento Ministerial | <span style='font-weight: normal; color: #9a211f;'>P??gina 36</span>
</a></p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(42)' class='a-aux-indice'>
Capacitaci??n Misionera
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(42)' class='a-aux-indice'>
Fernando L??pez Pimiento | <span style='font-weight: normal; color: gray;'>Director Misiones Nacionales</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 40</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(44)' class='a-aux-indice'>
Innovaci??n y transformaci??n con proyecci??n eterna
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(44)' class='a-aux-indice'>
Angelmiro Camacho Isaza | <span style='font-weight: normal; color: gray;'>Director General FECP</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 42</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(46)' class='a-aux-indice'>
Misiones Extranjeras
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(46)' class='a-aux-indice'>
Vicente Arango Varela | <span style='font-weight: normal; color: gray;'>Director Misiones Extranjeras</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 44</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(48)' class='a-aux-indice'>
Expecodes
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(48)' class='a-aux-indice'>
Medios escritos | <span style='font-weight: normal; color: gray;'>Misiones Extranjeras</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 46</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(50)' class='a-aux-indice'>
Uni??n para el desarrollo integral de la mujer
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(50)' class='a-aux-indice'>
Mariela Forero de Torres | <span style='font-weight: normal; color: gray;'>Directora UDIM</span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 48</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(52)' class='a-aux-indice'>
  Sopa de Letras | <span style='font-weight: normal; color: #9a211f;'>P??gina 50</span>
</a></p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(53)' class='a-aux-indice'>
   Cr??ditos  | <span style='font-weight: normal; color: #9a211f;'>P??gina 52</span>
</a></p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
 | <span style='font-weight: normal; color: gray;'></span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 2</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
 | <span style='font-weight: normal; color: gray;'></span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 2</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
 | <span style='font-weight: normal; color: gray;'></span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 2</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
 | <span style='font-weight: normal; color: gray;'></span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 2</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
 | <span style='font-weight: normal; color: gray;'></span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 2</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
 | <span style='font-weight: normal; color: gray;'></span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 2</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
 | <span style='font-weight: normal; color: gray;'></span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 2</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
 | <span style='font-weight: normal; color: gray;'></span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 2</span>
</a>
</p>

<p class='monserrat-black indice-text' style='padding-top: 0.5em; font-size: 0.8em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
</a></p>
<p class='monserrat-black indice-text-aux' style='padding-top: 0.1em; font-size: 0.63em;'>
<a type='button' onclick='indice_event(4)' class='a-aux-indice'>
 | <span style='font-weight: normal; color: gray;'></span> | <span style='font-weight: normal; color: #9a211f;'>P??gina 2</span>
</a>
</p>




*/
