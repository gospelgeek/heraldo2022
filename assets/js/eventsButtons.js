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
    element.html('<div class="gradient"></div><div id=' +"pie-pagina-"+ page +' class="number-page" onclick=goPage(2)>' + page + ' | Heraldo - 2022</div>');

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
    console.log(audio_array.length)

    if (audio_array.length > 0) {

        audio_array.map((audio) => {
            audio.pause();
        })
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

<p style='padding-top: 1em; font-size: 1em;'><span style='color: #0d5b78; font-size: 2em'>D</span>ios les bendiga grandemente mis hermanos. Hoy quiero saludarles como el hermano Álvaro, como la familia que somos y el pueblo que Dios ha forjado, pagando un alto precio y dedicándole sus cuidados con profundo amor.
</p>
<p style='padding-top: 1em; font-size: 2em; color: #0d5b78'><strong>Introducción</strong></p>
<p style='padding-top: 0.7em; font-size: 1em;'>Tuve una madre que me enseñó los caminos de Dios y que oraba conmigo por las noches. Me enseñó a cantar todo el día y me dio muy buen ejemplo. No era una mujer iracunda y aun en el castigo no perdía ni la razón ni el control, ni olvidaba la misericordia.
Crecí en una familia que disfrutaba levantarse a las cinco de la mañana para ir al templo a orar. No me puedo quejar, tuve toda la oportunidad de conocer a Dios en un ambiente cristiano.
</p>
<p style='padding-top: 0.7em; font-size: 1em;'>Dios me ha guiado toda la vida y he sentido su presencia inmaterial muy cerca cuidándome y guiándome, aun librándome de las acechanzas de los que en algún momento procuraron mi mal. 
A lo largo de toda la vida Él ha provisto todas mis necesidades, desde mi alimento hasta mis zapatos, sin que olvidara mi educación ni mi formación espiritual y ministerial.
</p>



<p style='padding-top: 1em; font-size: 1em;'><span style='color: #0d5b78; font-size: 2em'>D</span></p>
<p style='padding-top: 1em; font-size: 2em; color: #0d5b78'><strong>Introducción</strong></p>
<p style='padding-top: 0.7em; font-size: 1em;'>
</p>
<p style='padding-top: 0.7em; font-size: 1em;'>
</p>


<p style='font-size: 2em; text-align: center;'><strong>DISCURSO FINAL</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Dije: Traeré, pues, a la memoria los años de la diestra del Altísimo.
Me acordaré de las obras del Señor; Sí, haré yo memoria de tus maravillas antiguas.
Meditaré en todas tus obras, Y hablaré de tus hechos.
Oh Dios, santo es tu camino; ¿Qué dios es grande como nuestro Dios?
Tú eres el Dios que hace maravillas; Hiciste notorio en los pueblos tu poder” (Salmos 77:10-14).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Dios les bendiga grandemente mis hermanos. Hoy quiero saludarles como el hermano Álvaro, como la familia que somos y el pueblo que Dios ha forjado, pagando un alto precio y dedicándole sus cuidados con profundo amor.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><span style='padding-bottom: 0.7em;'><strong>Introducción</strong></span>
Tuve una madre que me enseñó los caminos de Dios y que oraba conmigo por las noches. Me enseñó a cantar todo el día y me dio muy buen ejemplo. No era una mujer iracunda y aun en el castigo no perdía ni la razón ni el control, ni olvidaba la misericordia.
Crecí en una familia que disfrutaba levantarse a las cinco de la mañana para ir al templo a orar. No me puedo quejar, tuve toda la oportunidad de conocer a Dios en un ambiente cristiano.
Dios me ha guiado toda la vida y he sentido su presencia inmaterial muy cerca cuidándome y guiándome, aun librándome de las acechanzas de los que en algún momento procuraron mi mal. 
A lo largo de toda la vida Él ha provisto todas mis necesidades, desde mi alimento hasta mis zapatos, sin que olvidara mi educación ni mi formación espiritual y ministerial.
Llenó mi alma con una pasión muy profunda por su obra, aunque no tenía el perfil adecuado y solo yo soy testigo de lo que Dios ha tenido que hacer conmigo y la paciencia que ha tenido con Álvaro. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hoy quiero hablar como un ser humano para agradecerle a mi Dios sus bondades conmigo; su llamado inmerecido y el haberme permitido compartir la vida en igualdad de condiciones con hombres que eran mejores que yo. Nunca me sentí digno del grande privilegio que llevo en mi alma como un tesoro, el más grande tesoro de vida: El servicio a Dios. Espero que los que me tuvieron que soportar me perdonen las imprudencias y errores cometidos. Nunca me consideré perfecto ni intocable, mucho menos mejor que ellos. Como dice el apóstol: “Por su gracia soy lo que soy”. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>He tenido dos esposas con las que me siento endeudado y a las que he admirado por su comprensión, inteligencia y capacidad de servicio. Mariela me ha soportado más de treinta años y no sé cómo lo ha conseguido, pero todavía le dura la gana.
He encontrado que el camino de la vida es sinuoso y de una topografía irregular, con las alturas y los valles cambia la presión, pero Dios es inmutable. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Dios me permitió compartir por muchos años en la administración de la iglesia y aprendí que, para ser útiles no es necesario ser iguales; todo lo contrario, en la diversidad está la riqueza. El diálogo y la confrontación de ideas es un ejercicio noble que enriquece la vida y produce soluciones sabias.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>He encontrado que para mí fue muy difícil expresar mis sentimientos y me voy con esa deuda, pero les aseguro que significaron mucho para mí, y que contribuyeron invaluablemente a mi crecimiento espiritual y formación ministerial.
Solo quiero decir simplemente: ¡Muchas gracias!
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'> Me voy a atrever a pensar en voz alta sobre algunas particularidades de la administración de la iglesia.  He dicho y quiero repetirlo, que la palabra “administración” usada en nuestro caso tiene apellido y es indispensable que no lo olvidemos, porque la iglesia es tan peculiar en su cotidianidad que se hace necesaria una manera especial en su manejo. Esta administración se llama: “Administración Eclesial” y no es un eufemismo, es indispensable que lo entendamos. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Cuando consideramos la protección de las ovejas y su buen manejo nos encontramos con la necesidad de armonizar tres derechos, primero el derecho de Dios, ya que son sus ovejas; el del pastor como administrador y el del pueblo. Obviamente que Dios es la primera consideración y es necesario entender que la comunidad está por encime del individuo.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La naturaleza del servicio a Dios requiere de la profunda nobleza del servidor como lo expresa el apóstol Pablo, “así como también sabéis de qué modo, como el padre a sus hijos, exhortábamos y consolábamos a cada uno de vosotros” (1 Tesalonicenses 2:11). O como lo dice en (Romanos 9:3) “Porque deseara yo mismo ser anatema, separado de Cristo, por amor a mis hermanos, los que son mis parientes según la carne”. La mejor expresión de amor en la administración es hacer lo correcto y justo en el contexto de las circunstancias.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Sin embargo, el mundo no es blanco y negro; la justicia debe considerar la variedad de acciones, circunstancias y motivaciones, pero nunca debe ser parcializada. Con mucha razón la justicia está representada con los ojos vendados y como tal no conoce a nadie. El amiguismo es enemigo mortal de lo justo. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Las normas deben estar al servicio de los sujetos a juicio, pero no pueden ignorar la gravedad de los hechos. Un pastor acusado no debe tener como fortaleza para su defensa “el debido proceso”, aunque es su derecho; sino la inocencia. Un hombre inocente necesita que se le haga justicia, la misericordia es para los culpables. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Nuestra iglesia ha madurado y se ha de forma gradual y creciente, de tal forma que hoy gozamos de un avance tecnológico de punta, y contamos con profesionales capaces y comprometidos que hacen un excelente trabajo, pero tiene un cuello de botella y es que los pastores no son empleados. Esta realidad impone una relación que dificulta enormemente implementar procesos y políticas que facilitarían la gestión administrativa y que la harían más eficiente. Espero que en el futuro se encuentre una solución porque a medida que se expande la iglesia, estos detalles se hacen más protuberantes. No olvidemos que cuanto más se crece más necesaria es la auditoria para asegurar que los procesos y las políticas se implementan de manera adecuada y eficaz.
Debemos tener siempre presente que lo que administramos es la iglesia y su visión y su misión no la definimos nosotros sino Dios y que los recursos que se manejan tienen el propósito esencial de cumplir con el objetivo propuesto por Dios que es la salvación de los perdidos. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Bueno es que un hombre prospere, pero no de forma desmedida porque nos dice la Escritura: “Lo hizo cabalgar sobre las alturas de la tierra, y comió el producto del campo; le hizo gustar miel de la peña, y aceite del pedernal, cuajada de vacas y leche de ovejas, con grosura de corderos, y carneros de raza de Basán y machos cabríos, con lo mejor del trigo; y de la sangre de uvas bebiste vino. Pero Jesurún engordó y dio coces (has engordado, estás cebado y rollizo); entonces abandonó a Dios que lo hizo, y menospreció a la Roca de su salvación” (Deuteronomio 32: 13-15). O la advertencia que encontramos en el capítulo 8 del mismo libro:
“Cuídate de no olvidarte de Jehová tu Dios, no suceda que comas y te sacies, y edifiques buenas casas en que habites, y se enorgullezca tu corazón, y te olvides de Jehová tu Dios, que te sacó de tierra de Egipto, de casa de servidumbre; y digas en tu corazón: Mi poder y la fuerza de mi mano me han traído esta riqueza”. Cuando nos convertimos, nos enseñaron a sacar los ídolos materiales de nuestra casa, pero otros ídolos se quieren instalar: La avaricia y la obstinación. 1 Samuel 15:23; Colosenses 3:5.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Los principios y doctrinas que abrazamos son nuestra riqueza, y no el alcanzar relevancia en este mundo. Alguien dijo hace muchos años, “generalmente estar bien con Dios te lleva a la confrontación con los hombres”. No aspiremos a ser como el otro o a tener lo que el otro tiene, ¡Nuestro referente es CRISTO! </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Los ministros somos adherentes a una causa y no amantes de una actividad. Los que aman la causa, hablan y piensan como el apóstol Pablo, “Y yo con el mayor placer gastaré lo mío, y aun yo mismo me gastaré del todo por amor de vuestras almas, aunque amándoos más, sea amado menos” (2 Corintios 12:15).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Merodea un peligro doloroso, y es que la generación que se está levantando tenga la tendencia imperceptible de regresar por el camino de perdición que transitamos y de donde nos rescató el Señor. No es normal que nuestros hijos no amen ni admiren nuestra forma de vivir. Espero que Dios nos ilumine para encontrar la manera de evitar esta muerte y que nuestra creencia no se convierta en un “canto de amores”, Ezequiel 33:32.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Yo le planteo un reto a la iglesia colombiana, la evangelización de cincuenta millones de compatriotas. Mientras usemos expresiones como, “esta es una señora iglesia” y nos gloriemos en lo alcanzado, el trabajo se quedará sin hacer. Hay que mirar adelante al camino por recorrer porque “largo camino te resta” y el tiempo se acabó.  Es hora de que el pastor local se empodere, se apropie de esta visión y con pasión sagrada ponga su mirada en el campo que “está blanco”; considere la gran necesidad de los perdidos y dedique su esfuerzo y sus recursos para alcanzar la meta planteada por Jesús, “todo el mundo”, “cada criatura”. Ese es el reto. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Y por último les hablaré de una realidad que pareciera que todos quisieran ignorar, la vejez.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>ineludibles; es responsabilidad de cada persona planear y asegurar esa etapa de la vida y tenemos que comenzar por el estilo de vida que cada uno desea escoger. Podemos ser empleados o independientes, el Estado ha creado unas herramientas y recursos para que los ciudadanos aseguren su vejez. Cuando eres empleado la responsabilidad está compartida entre el trabajador y la empresa, cuando se es independiente eres tu propio jefe y debes asumir toda la responsabilidad de la administración de todos tus recursos, y proyectarlos a largo plazo. Si las personas viven como la cigarra cantando todo el verano, cuando llegue el invierno morirán y no será culpa de nadie. Si viven como la hormiga sobrevivirán, no se puede vivir como si no existiera el invierno. De ahí la necesidad de las pensiones. Pero si la aspiración es vivir a un nivel medio, entonces el ahorro debe ser más robusto. La vida del independiente tiene que ser más responsable y más inteligente “y si alguno tiene falta de sabiduría pídala a Dios el cual da a todos abundantemente” (Santiago 1:5). O de otra manera busque ayuda de alguien que le colabore, los fondos de pensiones, por ejemplo. No provoquemos una situación lamentable en que no nos podamos retirar y los demás nos tengan que pedir que nos vayamos, y entonces caigamos en el resentimiento y la amargura, o que ya no ejerzamos nuestro ministerio eficientemente y obliguemos a los demás a soportar nuestra incapacidad funcional. Dios nos ayude, Bienaventurado el hombre que sabe cuándo dar un paso al costado.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Solo me resta decirles que mantengamos una vida de profunda relación íntima con Dios, para que Él pueda hablarnos y guiarnos, y el final sea mejor que el principio.   Familia, que mi Señor Jesús les bendiga.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hermano y servidor en Cristo,</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Álvaro Torres Forero. Pastor IPUC</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>


«Je rappellerai les oeuvres de l'Éternel, Car je me souviens de tes merveilles d'autrefois; Je parlerai de toutes tes oeuvres, Je raconterai tes hauts faits. O Dieu! tes voies sont saintes; Quel dieu est grand comme Dieu?Tu es le Dieu qui fait des prodiges; Tu as manifesté parmi les peuples ta puissance.» Psaumes 77: 11-14


  <p style='padding-top: 0.5em; font-size: 1em;'>Je rappellerai les oeuvres de l'Éternel, Car je me souviens de tes merveilles d'autrefois; Je parlerai de toutes tes oeuvres, Je raconterai tes hauts faits..</p>
<p style='padding-top: 0.5em; font-size: 1em;'>O Dieu! tes voies sont saintes; Quel dieu est grand comme Dieu?Tu es le Dieu qui fait des prodiges; Tu as manifesté parmi les peuples ta puissance.</p>
<p style='padding-top: 0.5em; font-size: 1.5em; color: #0d5b78 ;'><strong>( Psaumes 77: 11-14 )</strong></p>


<p style='padding-top: 1em; font-size: 1em;'><span style='color: #0d5b78; font-size: 2em'>D</span>ieu vous bénisse énormément mes frères. Aujourd'hui, je veux vous saluer en tant que frère Alvaro, en tant que famille que nous sommes et le peuple que Dieu a forgé, en payant un prix élevé et en vous dédiant ses soins avec un amour profond.
</p>
<p style='padding-top: 1em; font-size: 2em; color: #0d5b78'><strong>Introduction</strong></p>
<p style='padding-top: 0.7em; font-size: 1em;'>J'avais une mère qui m'enseignait les voies de Dieu et qui priait avec moi le soir. Elle m'a appris à chanter toute la journée et m'a donné un très bon exemple. Elle n'avait pas un caractère colérique et même dans la punition, elle ne perdait pas la raison ou le contrôle, et n'oubliait pas la pitié.
</p>
<p style='padding-top: 0.7em; font-size: 1em;'>J'ai grandi dans une famille qui aimait se lever à cinq heures du matin pour aller prier au temple. Je ne peux pas me plaindre, j'ai eu toutes les occasions de connaître Dieu dans un environnement chrétien.
</p>



<p style='font-size: 2em; text-align: center;'><strong>LE DISCOURS FINAL</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>«Je rappellerai les oeuvres de l'Éternel, Car je me souviens de tes merveilles d'autrefois; Je parlerai de toutes tes oeuvres, Je raconterai tes hauts faits. O Dieu! tes voies sont saintes; Quel dieu est grand comme Dieu?Tu es le Dieu qui fait des prodiges; Tu as manifesté parmi les peuples ta puissance.» Psaumes 77: 11-14</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Dieu vous bénisse énormément mes frères. Aujourd'hui, je veux vous saluer en tant que frère Alvaro, en tant que famille que nous sommes et le peuple que Dieu a forgé, en payant un prix élevé et en vous dédiant ses soins avec un amour profond.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Introduction</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>J'ai grandi dans une famille qui aimait se lever à cinq heures du matin pour aller prier au temple. Je ne peux pas me plaindre, j'ai eu toutes les occasions de connaître Dieu dans un environnement chrétien.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Dieu m'a guidé toute ma vie et j'ai senti sa présence immatérielle très proche, prenant soin de moi et me guidant, me délivrant même des ruses de ceux qui cherchaient autrefois à me nuire</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Tout au long de ma vie, Il a pourvu à tous mes besoins, de ma nourriture à mes chaussures, sans oublier mon éducation et ma formation spirituelle et ministérielle.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Il a rempli mon âme d'une profonde passion pour son œuvre, même si je n'avais pas le bon profil et je suis le seul témoin de ce que Dieu a dut faire avec moi et de la patience qu'il a eue avec Alvaro. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Aujourd'hui, je veux parler en tant qu'être humain pour remercier mon Dieu de sa bonté envers moi, de son appel immérité et de m'avoir permis de partager la vie sur un pied d'égalité avec des hommes qui étaient meilleurs que moi. Je ne me suis jamais senti digne du grand privilège que je porte dans mon âme comme un trésor, le plus grand trésor de la vie : le service de Dieu. J'espère que ceux qui ont dû me supporter me pardonneront pour mes imprudences et mes erreurs. Je ne me suis jamais considéré comme parfait ou intouchable, et encore moins meilleur qu'eux. Comme le dit l'apôtre : 'Par sa grâce, je suis ce que je suis'.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>J'ai eu deux épouses à qui je me sens redevable et que j'ai admirées pour leur compréhension, leur intelligence et leur capacité de service. Mariela me supporte depuis plus de trente ans et je ne sais pas comment elle y est parvenue, mais elle en a encore la volonté. J'ai découvert que la route de la vie est sinueuse et accidentée, avec des hauts et des bas, la pression change, mais Dieu est immuable. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Dieu m'a permis de participer pendant de nombreuses années à l'administration de l'église et j'ai appris que, pour être utile, il n'est pas nécessaire d'être identiques ; au contraire, la diversité est une richesse. Le dialogue et la confrontation des idées est un exercice noble qui enrichit la vie et produit des solutions judicieuses.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Il m'a été très difficile d'exprimer mes sentiments et je pars avec cette dette, mais je vous assure que vous avez beaucoup compté pour moi et que vous avez contribué de manière inestimable à ma croissance spirituelle et à ma formation ministérielle.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Je vais oser réfléchir à voix haute à certaines particularités de l'administration de l'église.  J'ai dit, et je veux le répéter, que le mot 'administration' utilisé dans notre cas a un nom de famille et qu'il est essentiel de ne pas l'oublier, car l'église est si particulière dans sa vie quotidienne qu'une manière spéciale de la gérer est nécessaire. Cette administration s'appelle : 'Administration Ecclésiale' et ce n'est pas un euphémisme, il est indispensable que nous la comprenions. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Lorsque nous considérons la protection des brebis et leur bonne gestion, nous constatons la nécessité d'harmoniser trois droits, tout d'abord le droit de Dieu, car ce sont ses brebis, le droit du pasteur en tant qu'intendant et le droit du peuple. Évidemment, Dieu est la première considération et il faut comprendre que la communauté est au-dessus de l'individu.
La nature du service à Dieu exige la profonde noblesse du serviteur, comme le dit l'apôtre Paul : 'Vous savez aussi comment, comme un père envers ses enfants, nous exhortons et réconfortons chacun de vous' (1 Thessaloniciens 2:11). Ou comme il le dit dans (Romains 9:3) 'Car je voudrais être moi-même anathème, séparé du Christ, à cause de mes frères, qui sont mes parents selon la chair'. La meilleure expression de l'amour dans l'administration consiste à faire ce qui est droit et juste dans le contexte des circonstances.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Cependant, le monde n'est pas noir et blanc ; la justice doit tenir compte de la variété des actions, des circonstances et des motivations, mais elle ne doit jamais être partiale. À juste titre, la justice est représentée les yeux bandés et, en tant que telle, ne connaît personne. Le copinage est l'ennemi mortel de l'équité. 
Les règles doivent servir les justiciables, mais elles ne peuvent ignorer la gravité des faits. Un pasteur accusé ne devrait pas avoir le 'procédure régulière' comme bastion pour sa défense, même si c'est son droit ; mais l'innocence. Un homme innocent a besoin de justice, la pitié est pour les coupables. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Notre église a mûri et s'est développée progressivement et de plus en plus, de sorte qu'aujourd'hui nous bénéficions d'une avancée technologique de pointe, et nous avons des professionnels capables et engagés qui font un excellent travail, mais elle a un goulot d'étranglement et c'est que les pasteurs ne sont pas des employés. Cette réalité impose une relation qui rend très difficile la mise en œuvre de processus et de politiques qui faciliteraient la gestion administrative et la rendraient plus efficace. J'espère qu'une solution sera trouvée à l'avenir, car à mesure que l'église s'agrandit, ces détails deviennent plus saillants. N'oublions pas que plus nous nous développons, plus l'audit est nécessaire pour garantir que les processus et les politiques sont mis en œuvre correctement et efficacement.
Nous devons toujours garder à l'esprit que ce que nous gérons est l'église, que sa vision et sa mission ne sont pas définies par nous, mais par Dieu, et que les ressources que nous gérons ont pour but essentiel d'atteindre l'objectif prévu par Dieu, à savoir le salut des perdus.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
Il est bon pour un homme de prospérer, mais pas de façon démesurée, car l'Écriture nous dit : 'Il l'a fait monter sur les hauteurs de la terre, et il a mangé les produits des champs ; il lui a fait goûter le miel du rocher, et l'huile du silex, le lait des vaches, le lait des brebis, la graisse des agneaux, les béliers de la race de Basan, et les boucs, avec le meilleur du blé ; et du sang des raisins tu as bu du vin. Mais Jeshurun s'engraissa et s'empourpra (tu es gros, tu es gras et dodu) ; alors il abandonna le Dieu qui l'avait fait, et méprisa le Rocher de son salut' (Deutéronome 32, 13-15). Ou l'avertissement que l'on trouve au chapitre 8 du même livre :
'Prends garde de ne pas oublier l'Éternel, ton Dieu, de peur que tu ne manges et ne sois rassasié, que tu ne bâtisses de belles maisons pour y habiter, que ton cœur ne s'enfle d'orgueil et que tu n'oublies l'Éternel, ton Dieu, qui t'a fait sortir du pays d'Égypte, de la maison de servitude, et que tu ne dises en ton cœur : Ma force et la vigueur de ma main m'ont procuré cette richesse.' Lorsque nous nous sommes convertis, on nous a appris à retirer les idoles matérielles de notre maison, mais d'autres idoles veulent s'installer : L'avidité et l'entêtement. 1 Samuel 15:23 ; Colossiens 3:5.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Les principes et les doctrines que nous embrassons sont notre richesse, et non l'obtention d'une certaine importance dans ce monde. Quelqu'un a dit, il y a de nombreuses années, que 'généralement, être juste avec Dieu vous amène à vous confronter aux hommes'. N'aspirons pas à être comme les autres ou à avoir ce que les autres ont, notre point de référence est CHRIST ! 
Nous, ministres, sommes des adhérents à une cause et non des amoureux d'une activité. Ceux qui aiment la cause parlent et pensent comme l'apôtre Paul : ' Pour moi, je dépenserai très volontiers, et je me dépenserai moi-même pour vos âmes, dussé-je, en vous aimant davantage, être moins aimé de vous.' (2 Corinthiens 12:15).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Il y a un danger douloureux, c'est que la génération montante a une tendance imperceptible à revenir sur le chemin de perdition que nous avons emprunté et dont le Seigneur nous a sauvés. Il n'est pas normal que nos enfants n'aiment pas et n'admirent pas notre mode de vie. J'espère que Dieu nous éclairera pour trouver un moyen d'éviter cette mort et que notre croyance ne deviendra pas un 'chant d'amour', Ezéchiel 33:32.
Je lance un défi à l'église colombienne, l'évangélisation de cinquante millions de compatriotes. Tant que nous utilisons des expressions comme 'nous sommes une église forte' et que nous nous glorifions de ce que nous avons accompli, le travail restera inachevé. Nous devons regarder le chemin à parcourir car 'la route est longue' et le temps presse.  Il est temps pour le pasteur local de se responsabiliser, de s'approprier cette vision et, avec une passion sacrée, de jeter son dévolu sur le champ qui 'est blanc' ; de considérer le grand besoin des perdus et de consacrer ses efforts et ses ressources pour atteindre le but fixé par Jésus, 'le monde entier', 'toute créature'. C'est là le défi.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Et enfin, je vous parlerai d'une réalité que tout le monde semble vouloir ignorer : la vieillesse.
Tôt ou tard, nous serons tous vieux. La vieillesse a ses propres caractéristiques et elles sont inéluctables ; il incombe à chacun de planifier et de sécuriser cette étape de la vie et nous devons commencer par le style de vie que chacun d'entre nous souhaite choisir. Que nous soyons salariés ou indépendants, l'État a créé des outils et des ressources permettant aux citoyens d'assurer leur retraite. Lorsque vous êtes salarié, la responsabilité est partagée entre le travailleur et l'entreprise, lorsque vous êtes indépendant, vous êtes votre propre patron et vous devez assumer l'entière responsabilité de la gestion de toutes vos ressources, et les projeter à long terme. Si les gens vivent comme la cigale qui chante tout l'été, quand l'hiver arrivera, ils mourront et ce ne sera la faute de personne. S'ils vivent comme une fourmi, ils survivront ; vous ne pouvez pas vivre comme s'il n'y avait pas d'hiver. D'où la nécessité des pensions. Mais si l'aspiration est de vivre à un niveau confortable, l'épargne doit être plus solide. La vie de l'indépendant doit être plus responsable et plus intelligente 'et si quelqu'un manque de sagesse, qu'il la demande à Dieu, qui donne généreusement à tous les hommes' (Jacques 1,5). Ou alors, demandez l'aide de quelqu'un qui vous aidera, les fonds de pension, par exemple. Ne provoquons pas une situation malheureuse où nous ne pourrions pas prendre notre retraite et où d'autres devraient nous demander de partir, et où nous tomberions alors dans le ressentiment et l'amertume, ou n'exercerions plus notre ministère de manière efficace et obligerions les autres à supporter notre incapacité fonctionnelle. Dieu nous aide, béni soit l'homme qui sait quand se mettre de côté.
Il ne me reste plus qu'à vous dire de maintenir une vie de relation profonde et intime avec Dieu, afin qu'il puisse nous parler et nous guider, et la fin sera meilleure que le début. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Famille, que mon Seigneur Jésus vous bénisse.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Frère et serviteur en Christ,
Álvaro Torres Forero. Pasteur IPUC
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>

<p style='padding-top: 0.5em; font-size: 1em;'>E eu disse:  Isto é enfermidade minha; e logo me lembrei dos anos da dextra do Altíssimo. Lembrar-me-ei, pois, das obras do Senhor: Certamente que me lembrarei das tuas maravilhas da antiguidade.</p>
<p style='padding-top: 0.5em; font-size: 1em;'>Meditarei, também,em todas as tuas obras , e falarei dos teus feitos. O teu caminho, ó Deus, está no santuário. Que Deus é tão grande como o nosso Deus? Tu és o Deus que fazes maravilhas: Tu fizeste notória a tua força entre os povos .</p>
<p style='padding-top: 0.5em; font-size: 1.5em; color: #0d5b78 ;'><strong>( Psaumes 77: 11-14 )</strong></p>


<p style='padding-top: 1em; font-size: 1em;'><span style='color: #0d5b78; font-size: 2em'>Q</span>ue Deus lhes abençoe grandemente meus irmãos. Hoje quero comprimentar-vos como o irmão  Álvaro, como a familia que somos e o povo que Deus forjou, pagando um alto preço e dedicando-o os seus cuidados com profundo amor.
</p>
<p style='padding-top: 1em; font-size: 2em; color: #0d5b78'><strong>Introdução</strong></p>
<p style='padding-top: 0.7em; font-size: 1em;'>Tive uma mãe que me ensinou os caminhos de Deus e que orava comigo pelas noites. Me ensinou a cantar todo o dia e deu-me um bom exemplo. Não era uma mulher iracunda e ainda no castigo não perdia nem a razão nem o controle, nem esquecia a misericordia.
</p>
<p style='padding-top: 0.7em; font-size: 1em;'>Cresci numa familia que disfrutava levantar-se as cinco da manhã para ir ao templo a orar. Não me posso queixar, tive toda a oportunidade de conhecer a Deus num ambiente cristão.
</p>


<p style='font-size: 2em; text-align: center;'><strong>Discurso final</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>E eu disse:  Isto é enfermidade minha; e logo me lembrei dos anos da dextra do Altíssimo. Lembrar-me-ei, pois, das obras do Senhor: Certamente que me lembrarei das tuas maravilhas da antiguidade. Meditarei, também,em todas as tuas obras , e falarei dos teus feitos. O teu caminho, ó Deus, está no santuário. Que Deus é tão grande como o nosso Deus? Tu és o Deus que fazes maravilhas: Tu fizeste notória a tua força entre os povos (Salmos 77:10-14).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Que Deus lhes abençoe grandemente meus irmãos. Hoje quero comprimentar-vos como o irmão  Álvaro, como a familia que somos e o povo que Deus forjou, pagando um alto preço e dedicando-o os seus cuidados com profundo amor.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Introdução:
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Tive uma mãe que me ensinou os caminhos de Deus e que orava comigo pelas noites. Me ensinou a cantar todo o dia e deu-me um bom exemplo. Não era uma mulher iracunda e ainda no castigo não perdia nem a razão nem o controle, nem esquecia a misericordia.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Cresci numa familia que disfrutava levantar-se as cinco da manhã para ir ao templo a orar. Não me posso queixar, tive toda a oportunidade de conhecer a Deus num ambiente cristão.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Deus  guiou-me em toda a vida e senti sua presença imaterial muito perto cuidando-me e guiando-me, e ainda livrando-me das façanhas dos que em algum momento procuraram meu mal.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Ao longo de toda a vida Ele proveu para todas as minhas necessidades, desde o meu alimento até meus sapatos, sem esquecer minha educação, nem minha formação espiritual e ministerial.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Encheu a minha alma com uma paixão muito profunda por sua obra, ainda que não tinha o perfil adequado e só eu sou testemunha do que Deus teve que fazer comigo e paciência que teve com Álvaro.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hoje quero falar como um ser humano para agradecer ao meu Deus pelas suas bondades comigo; Seu chamado imerecido e por permitir-me compartilhar a vida em igualdade de condições com homens que eram melhores que eu. Nunca me senti digno do grande privilégio que levo em minha alma como um tesouro, o mais grande tesouro da vida: O serviço a Deus. Espero que os que tiveram que suportar-me, me perdoem as imprudências e os erros cometidos.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Nunca me considerei perfeito nem intocavel , muito menos melhor que eles. Como disse o apóstolo: 'Por sua graça sou o que sou'.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Tive duas esposas com as que me sinto individado e as que admirei por sua compreensão, inteligência e capacidade de serviço. Mariela me suportou por mais de trinta anos e não sei como conseguiu, mas todavia ela ainda quer.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Encontrei que o caminho da vida é sinuoso e de uma topografia irregular, com as alturas e os vales muda a pressão, mas Deus é imutavel.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Deus permitiu-me compartilhar por muitos anos na administração da igreja e aprendi que, para ser úteis não é necessário ser iguais; ao contrário, na diversidade está a riqueza. O diálogo e a confrontação de idéias é um exercício nobre que enriquece a vida e produz soluções sábias.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Encontrei que para mim foi muito dificil expressar meus sentimentos e vou-me com essa dívida, mas asseguro-lhes que significaram muito para mim e que contribuiram inevitavelmente para meu crescimento espiritual e formação ministerial.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Só quero dizer simplismente: Muito obrigado!</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Me atrevo a pensar em voz alta sobre algumas particularidades da administração da igreja. Disse e quero repetí-lo, que a palavra 'administração' usada em nosso caso tem apelido e é indispensavel que não o esqueçamos, porque a igreja é tão peculiar em sua quotidianidade e que é necessária uma maneira especial em seu manejo. Esta administração se chama: “Administração eclesial” e não é um eufemismo, é indispensavel.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Quando consideramos a proteção das ovelhas e seu bom manejo encontra-mo-nos com a necessidade de harmonizar três direitos, primeiro o direito de Deus, já que são suas ovelhas; o do pastor como administrador e o do povo. Obviamente que Deus é a primeira consideração e é necessario entender que a comunidade está acima do indivíduo.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>A natureza do serviço a Deus requer da profunda nobreza do servidor como expressa o apóstolo Paulo, “Assim como bem sabeis de que modo vos exortávamos e consolávamos, a cada um de vós, como pai a seus filhos”(1 Tessalonicenses 2:11) . Ou como o diz em (Romanos 9:3) “Porque, eu mesmo poderia desejar ser separado de Cristo, por amor dos meus irmãos que são meus parentes segundo a carne.” A melhor expressão de amor na administração é fazer o correto e justo no contexto das circunstâncias.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Embora, o mundo não é branco e negro; a justiça deve cosiderar a variedade de ações, circunstâncias e motivações mas nunca deve ser parcializada. Com muita razão a justiça está representada com os olhos vendados e como tal não conhece a ninguém. O amiguismo é o inimigo mortal do justo.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>As normas devem estar ao serviço dos sujeitos a juizo, mas não podem ignorar a gravidade dos atos. Um pastor acusado não deve ter como fortaleza para sua defesa “o devido processo” , ainda que é seu direito; senão a inocência. Um homem inocente necessita que se lhe faça justiça, a misericordia é para os culpados.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Nossa igreja amadureceu de uma forma gradual e crescente, de tal forma que hoje gozamos de um avanço tecnológico de ponta, e contamos com profissioanis capazes e comprometidos que fazem um excelente trabalho mas tem um gargalo e é que os pastores não são empregados. Esta realidade impõe uma relação que dificulta enormemente implementar processos e políticas que facilitariam a gestão administrativa e que a fariam mais eficiente. Espero que no futuro se encontre uma solução porque a medida que se expande a igreja, estes detalhes se fazem mais salientes. Não esqueçamos que quanto mais se cresce, mais necessária é a auditoria para assegurar que os processos e as políticas se implementam de maneira adequada e eficaz. Devemos ter sempre presente que o que administramos é a Igreja e sua visão e sua missão não a defenimos nós senão Deus e que os recursos que maneja  tém o propósito essencial de cumprir com o objectivo proposto por Deus que é a salvação dos perdidos.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Bom é que o homem prospere, mas não de forma desmedida porque nos diz a Escritura: “ Ele o fez cavalgar sobre as alturas da terra, e comeu as novidades do campo, e fez chupar mel da rocha, e azeite da dura pederneira, manteiga de vacas e leite do rebanho, com a gordura dos cordeiros e dos carneiros que pastam em Basan, e dos bodes, com  o mais escolhido trigo; e bebeste o sangue das uvas, o vinho puro. E, engordando-se Jeshurun, deu coices; engordaste-te, engrossate-te, e de gordura te cobriste: e deixou a Deus, que o fez, e desprezou a Rocha da sua salvação” ( Deuteronómio 32:13-15), ou a advertência que encontramos no mesmo livro, no capítulo 8:11-14, 17 “ Guarda-te para que não te esqueças do Senhor, teu Deus, não guardando os seus mandamentos, e os seus juízos, e os seus estatutos que hoje te ordeno: Para  que porventura, havendo tu comido e estando farto, e havendo edificado boas casas, e habitando-as , e tiverem aumentado as tuas ovelhas, e se acrescentar a prata e o ouro, e se multiplicar tudo quanto tens, se não se eleve o teu coração  e te esqueças  do Senhor, teu Deus, que te tirou da terra do Egito, da casa da servidão... E digas no teu coração: A minha força, e a fortaleza do meu braço me adquiriu este poder. Quando nos convertemos, nos ensinaram a tirar os ídolos materiais da nossa casa, mas outros ídolos se querem instalar: A avareza e a obstinação. 1 Samuel 15:23; Colossenses 3:5.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Os princípios e doutrinas que abraçamos são a nossa riqueza, e não o alcançar relevância neste mundo. Há alguns anos alguém disse: “geralmente estar bem com Deus te leva a confrontação com os homens”. Não aspiremos a ser como o outro ou a ter o que o outro tem. Nosso referente é CRISTO!
Os ministros somos aderentes a uma causa e não amantes de uma actividade. Os que amam a causa,  falam e pensam como o apóstolo Paulo. “ Eu, de muita vontade, me gastarei, e me deixarei gastar, pelas vossas almas, ainda que,  amando-vos cada vez mais, seja menos amado” ( 2 Coríntios 12:15).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Me rodeia um perigo doloroso, e é que a geração que se está levantando tenha a tendência imperceptivel  de regressar pelo caminho da perdição que transitámos e de onde nos resgatou o Senhor. Não é normal que nossos filhos não amem, nem admirem nossa forma de viver. Espero que Deus nos ilumine para encontrar a maneira de evitar essa morte e que nossa crença não se converte num “canto de amores” ( Ezequiel 33:32).  </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hoje desafio a igreja colombiana, a evangelização de cincoenta milhões de compatriotas. Enquanto usarmos expressões como “ essa é uma senhora igreja” e nos gloriemos no alcançado, o trabalho ficará sem fazer. Há que olhar em frente, o caminho que falta por percorrer  “porque longo caminho te resta” e o tempo se acabou. É hora de que o pastor local se empodere, se apropie dessa visão e com paixão sagrada ponha sua olhada no campo que “está branco”; considere a grande necessidade dos perdidos e dedique seu esforço e seus recursos para alcançar a meta planteada por Jesus “todo o mundo”, “cada criatura”. Esse é o desafio.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>E por último falarei de uma realidade que  parecera que todos quisessem  ignorar; a velhice.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Tarde ou cedo todos seremos anciãos. A velhice tem as suas próprias características e são analisaveis; é responsabilidadede cada pessoa planear e assegurar essa etapa da vida e temos que começar pelo estilo de vida que cada um deseja escolher.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Podemos ser empregados ou independentes. O Estado criou umas ferramentas e recursos para que os cidadãos assegurem sua velhice. Quando és empregado a responsabilidade está compartilhada entre o trabalhador e a empresa, quando se é independente és teu próprio chefe e deves assumir toda a responsabilidade da administração de todos os recursos, e projectá-los a longo prazo. Se as pessoas vivem como a cigarra cantando todo o verão, quando chega o inverno morrerão, e não será culpa de ninguém. Se vivem como a formiga, sobreviverão. Não se pode viver como se não existisse o inverno. Daí a necessidade das pensões. Mas se a aspiração é viver um nível  médio, a poupançca deve ser mais robusta. A vida do independente tem que ser mais responsavel e mais inteligente “ E se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá, liberalmente... (Santiago 1:5). Ou de outra maneira busque a ajuda de alguém que o colabore, os fundos de pensão, por exemplo. Não provoquemos uma situação lamentavel em que não podemos retirar e os demais não tenham que pedir que retiremos, e então caiamos no ressentimento e a amargura, ou que já não exercemos nosso ministério eficientemente e obriguemos os demais a suportar nossa incapacidade funcional. Deus nos ajude. Bem aventurado o homem que sabe cuando afastar.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Só resta-me dizer-lhes que mantenhamos uma vida de profunda relação  íntima com Deus, para que Ele possa falar-nos e guiar-nos, e o final seja melhor que o princípio. Família, que o meu Senhor Jesus vos abençoe.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Irmão e servidor em Cristo – Álvaro Torres Forrero. Pastor  IPUC</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>




<p style='padding-top: 1em; font-size: 1em;'><span style='color: #0d5b78; font-size: 2em'>E</span>l Señor Jesús resucitó y durante cuarenta días dio testimonio de su
resurrección, apareciéndoles a más de quinientas personas, y antes de
ascender a los cielos encomendó a sus discípulos la responsabilidad de ir
por todo el mundo para anunciar a toda persona el Evangelio de la
salvación y la vida eterna.</p>
<p style='padding-top: 0.7em; font-size: 1em;'>El Evangelio es la buena noticia de Dios para todos los hombres, y este
consiste en que el diablo, quien tenía cautivo a los seres humanos, fue
vencido en la cruz del Calvario. Ahora todos los hombres tienen la
oportunidad de salir de su dominio y conocer la salvación de Dios.
</p>
<p style='padding-top: 0.7em; font-size: 1em;'>
</p>

<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA… POR TODA LA TIERRA SALIÓ SU VOZ</strong></p>
<p  style='padding-top: 0.7em; font-size: 1.5em; text-align: center;'><strong>Somos llamados a predicar su Palabra</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'> <strong>“Por toda la tierra salió su voz, </strong> Y hasta el extremo del mundo sus palabras.  En ellos puso tabernáculo para el sol” (Salmos 19:4).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El Señor Jesús resucitó y durante cuarenta días dio testimonio de su resurrección, apareciéndoles a más de quinientas personas, y antes de ascender a los cielos encomendó a sus discípulos la responsabilidad de ir por todo el mundo para anunciar a toda persona el Evangelio de la salvación y la vida eterna.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El Evangelio es la buena noticia de Dios para todos los hombres, y este consiste en que el diablo, quien tenía cautivo a los seres humanos, fue vencido en la cruz del Calvario.  Ahora todos los hombres tienen la oportunidad de salir de su dominio y conocer la salvación de Dios.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Esta buena noticia de gran victoria y libertad espiritual, nos fue encomendada por el Señor, para que la diésemos a conocer a todos los hombres.
 “Y les dijo: <strong>Id por todo el mundo y predicad el evangelio a toda criatura.</strong>
El que creyere y fuere bautizado, será salvo; mas el que no creyere, será condenado” 
(Marcos 16:15-16).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Predicar es proclamar, gritar, anunciar a toda persona en todo lugar, que nuestros pecados fueron pagados por Jesucristo cuando dio su vida y derramó toda su sangre en la cruz; ahora solo toca reconocer y aceptar lo que el Señor Jesús hizo por nosotros como nuestro Salvador, disponiéndonos para seguirle y obedecerle.
Si el pecado es quitado de una persona, entonces puede acercarse confiadamente ante la presencia de Dios y obtener en cualquier circunstancia oportuno socorro de parte de Dios.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El deseo de Dios es que todos los seres humanos seamos salvos, que nadie se pierda, que cada hombre se entere de esta noticia y sea partícipe de las promesas de Dios, y esta función corresponde a cada uno de los que nos hemos ido enterando y experimentando la salvación del alma y su gracia Divina.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Esta labor no fue encargada a los ángeles, porque ellos no han vivido la experiencia de ser cautivos por el diablo, por el pecado y la opresión del mal; porque ellos desconocen lo que es vivir bajo ese dominio, dado que están al servicio de Dios. Somos los que hemos vivido bajo el dominio del maligno, del pecado, de vicios y maldades, podemos entender a los otros pecadores y siendo movidos a misericordia anunciar a los otros que sí hay una vida mejor, feliz, grata, de paz, amor y comunión con Dios.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Dios establece el proceso a través del cual se debe proclamar su obra libertadora y salvadora.
“Pues la Escritura dice: Todo aquel que en él creyere, no será avergonzado.” 
Porque no hay diferencia entre judío y griego, pues el mismo que es Señor de todos, es rico para con todos los que le invocan;
porque todo aquel que invocare el nombre del Señor, será salvo.
¿Cómo, pues, invocarán a aquel en el cual no han creído? ¿Y cómo creerán en aquel de quien no han oído? ¿Y cómo oirán sin haber quien les predique? (Romanos 10:11-14).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hacer este trabajo tiene dos aspectos.  Un agente emisor y un agente receptor.
</p>
<p  style='padding-top: 0.7em; font-size: 1.3em;'><strong>Emisor</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Dios llama al predicador.
El Espíritu Santo lo envía.
La iglesia respalda y apoya al enviado.
El llamado debe predicar a Jesús y su obra redentora; proclamar para que sea escuchado.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><ul><li>Dios llama al predicador.</li>
<li>El Espíritu Santo lo envía.</li>
<li>La iglesia respalda y apoya al enviado.</li>
<li>El llamado debe predicar a Jesús y su obra redentora; proclamar para que sea escuchado.</li></ul>
</p>
<p  style='padding-top: 0.7em; font-size: 1.3em;'><strong>Receptor</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><ul><li>Escucha al predicador, quiera o no.</li>
<li>Cuando escuches de Jesús, puedan creer en Él.</li>
<li>Cuando crean en el Señor, le invoquen (llamen).</li>
<li>Cuando le invoquen sean salvos.</li></ul></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Fuimos escogidos con el propósito de que anunciemos todas las virtudes maravillosas que hay en el Señor Jesús, 1 Pedro 2:9-10; sabiendo que la obra de regeneración y conversión, solo el Señor es quien la hace, Hechos 4:12; Tito 3:5. Jesús dijo: “… el que a mi viene, yo no le echo fuera” (Juan 6:37). Y es el Señor Jesús quien a través de su Santo Espíritu se encarga de convencer al pecador de pecado, de justicia y de juicio. Juan 16:8.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La predicación es el medio establecido por Dios, para que sea anunciada su salvación, su Reino, sus promesas, su Palabra, sea revelado su Santo Nombre. 
 “Pues ya que en la sabiduría de Dios, el mundo no conoció a Dios mediante la sabiduría, agradó a Dios salvar a los creyentes por la locura de la predicación. 
Porque los judíos piden señales, y los griegos buscan sabiduría; 
pero nosotros predicamos a Cristo crucificado, para los judíos ciertamente tropezadero, y para los gentiles locura; 
mas para los llamados, así judíos como griegos, Cristo poder de Dios, y sabiduría de Dios” (1 Corintios 1:21-24).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Bueno es saber que el predicador no está llamado para hablar de sí mismo ni de la organización, sino que ha sido llamado y enviado para predicar a Jesucristo, quién es, qué ha hecho y lo que enseña en su santa Palabra.  Cuando esto se hace, entonces el Espíritu Santo confirma su obra y convierte al oyente. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Cuando una persona se entrega al Señor, recibe la salvación de Dios, y el predicador gana un alma para Cristo; el Señor le dice que cubre multitud de pecados del predicador y atesora galardón para sí en el Reino de los cielos.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Dios nos bendiga maravillosamente y proclamemos con mucha pasión la obra gloriosa que Cristo hizo por nosotros en el Calvario, sabiendo que nuestro trabajo en el Señor no es en vano.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Esdras Barranco Jiménez. Primer Vicepresidente IPUC</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>


"<p style='padding-top: 1em; font-size: 1em;'><span style='color: #b41015; font-size: 2em'>E</span>l Señor Jesús resucitó y durante cuarenta días dio testimonio de su resurrección, apareciéndoles a más de quinientas personas, y antes de ascender a los cielos encomendó a sus discípulos la responsabilidad de ir por todo el mundo para anunciar a toda persona el Evangelio de la salvación y la vida eterna.</p> <p style='padding-top: 0.7em; font-size: 1em;'>El Evangelio es la buena noticia de Dios para todos los hombres, y este consiste en que el diablo, quien tenía cautivo a los seres humanos, fue vencido en la cruz del Calvario. Ahora todos los hombres tienen la oportunidad de salir de su dominio y conocer la salvación de Dios. </p>”

<p style='padding-top: 1em; font-size: 1em;'><span style='color: #0d5b78; font-size: 2em'>“Y</span>o planté, Apolos regó; pero el crecimiento lo ha dado Dios. De
manera que ni el que siembra ni el que riega son nada, sino que Dios lo
es todo, pues él es quien hace crecer lo sembrado”
(1 Corintios 3:6-7 DHH).

</p>
<p style='padding-top: 0.7em; font-size: 1em;'>
El Reino de Dios es comparado a la semilla de mostaza, la más pequeña
de todas, para los judíos insignificante. Siendo tan pequeña se sembró,
creció y se hizo árbol fuerte que ofreció albergue en sus ramas para las
aves. Pero, ¿cómo crece esa semilla hasta ser un árbol grande que da
sombra? Marcos 4:26-29, de manera que es Dios quien trabaja en el
nuevo nacimiento en la vida de la persona
</p>



<p style='padding-top: 1em; font-size: 1.3em; font-style: italic;'><span style='color: #0d5b78; font-size: 2em'>“Y</span>oi, j’ai planté, Apollos a arrosé, mais c’est Dieu qui a fait pousser. 7Celui qui plante n’est rien, celui qui arrose n’est rien. Mais celui qui fait pousser est tout, et c’est Dieu (1 Corinthiens 3: 6-7PDV2017).

</p>
<p style='padding-top: 0.7em; font-size: 1.3em;'>
Le Royaume de Dieu est comparé à une graine de moutarde, la plus petite de toutes, insignifiante pour les Juifs. Elle était si petite qu'elle a été semée, a grandi et est devenue un arbre solide qui offrait un abri dans ses branches pour les oiseaux. Mais comment cette graine devient-elle un grand arbre qui donne de l'ombre ?  Marc 4:26-29, c'est donc Dieu qui opère la nouvelle naissance dans la vie d'une personne.
</p>

<p style='padding-top: 1em; font-size: 1.1em; font-style: italic;'><span style='color: #b41015; font-size: 2em'>“E</span>u plantei, Apolo regou; mas Deus deu o crescimento. Por isso, nem oque planta é alguma coisa, nem o que rega, mas Deus, que dá o crescimento”. ( 1 Coríntios 3:6-7).
</p>
<p style='padding-top: 0.7em; font-size: 1.1em;'>
O Reino de Deus é comparado a semente de mostarda, a mais pequena de todas,  para os judeus insignificante. Sendo tão pequena se semeou, cresceu e se fez árvore forte que ofereceu abrigo em seus ramos para as aves. Como cresce essa semente até ser uma árvore grande que dá sombra? (Marcos 4:26-29), de maneira que é Deus que trabalha no novo nascimento na vida da pessoa.
</p>



<p style='padding-top: 1em; font-size: 1em; font-style: italic;'><span style='color: #b41015; font-size: 2em'>“Y</span>
oi, j’ai planté, Apollos a arrosé, mais c’est Dieu qui a fait pousser. 7Celui qui plante n’est rien, celui qui arrose n’est rien. Mais celui qui fait pousser est tout, et c’est Dieu (1 Corinthiens 3: 6-7PDV2017). </p> <p style='padding-top: 0.7em; font-size: 1em;'>
 Le Royaume de Dieu est comparé à une graine de moutarde, la plus petite de toutes, insignifiante pour les Juifs. Elle était si petite qu'elle a été semée, a grandi et est devenue un arbre solide qui offrait un abri dans ses branches pour les oiseaux. Mais comment cette graine devient-elle un grand arbre qui donne de l'ombre ? Marc 4:26-29, c'est donc Dieu qui opère la nouvelle naissance dans la vie d'une personne. </p>




<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA… PERO EL CRECIMIENTO LO HA DADO DIOS</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Yo planté, Apolos regó; pero el crecimiento lo ha dado Dios. De manera que ni el que siembra ni el que riega son nada, sino que Dios lo es todo, pues él es quien hace crecer lo sembrado” (1 Corintios 3:6-7 DHH).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El Reino de Dios es comparado a la semilla de mostaza, la más pequeña de todas, para los judíos insignificante. Siendo tan pequeña se sembró, creció y se hizo árbol fuerte que ofreció albergue en sus ramas para las aves. Pero, ¿cómo crece esa semilla hasta ser un árbol grande que da sombra?  Marcos 4:26-29, de manera que es Dios quien trabaja en el nuevo nacimiento en la vida de la persona.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La explicación de cómo ocurre el crecimiento de la semilla es imposible. No se acierta a comprender el misterio de la vida; el desarrollo y crecimiento de la semilla depende solo de Dios. (Eclesiastés 11:5) dice: “Como tú no sabes cuál es el camino del viento, o cómo crecen los huesos en el vientre de la mujer encinta, así ignoras la obra de Dios, el cual hace todas las cosas”. Esta semilla que es la Palabra de Dios, siempre, hoy y por los siglos crece de la mano poderosa de Dios.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Crecimiento del Evangelio</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La semilla que se siembra es el Evangelio, siendo nuestro Señor Jesucristo el primer expositor (sembrador). “Desde entonces comenzó Jesús a predicar, y a decir: Arrepentíos, porque el reino de los cielos se ha acercado” (Mateo 4:17).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Esta semilla dio una planta que empezaba a crecer, “Andando Jesús junto al mar de Galilea, vio a dos hermanos, Simón, llamado Pedro, y Andrés su hermano, que echaban la red en el mar; porque eran pescadores” (Mateo 4:18). Sus ramas empezaron a extenderse, “Y les dijo: Venid en pos de mí, y os haré pescadores de hombres” (Mateo 4:19).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>De manera que, los discípulos fueron comisionados para continuar la obra “Id por todo el mundo y predicad el evangelio a toda criatura” (Marcos 16:15). Teniendo la garantía que es el Señor Jesucristo quien da el crecimiento. “Enseñándoles que guarden todas las cosas que os he mandado; y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén” (Mateo 28:20).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Así como en la parábola del sembrador, la semilla sembrada en buena tierra dio buen fruto y se multiplicó, la Palabra predicada por los discípulos tuvo una cobertura más allá de Jerusalén. Diez días después de la ascensión del Señor, el Espíritu Santo fue derramado sobre los ciento veinte creyentes que estaban esperando en Jerusalén; con la nueva unción que recibieron los discípulos empezaron a predicar el Evangelio. Los resultados eran casi increíbles y es que el crecimiento que da Dios es sobrenatural, no es del humano.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>A través de la Palabra de Dios podemos ver cómo día tras día, el número de personas que recibían a Cristo se incrementaba enormemente. “Así que, los que recibieron su palabra fueron bautizados; y se añadieron aquel día como tres mil personas” (Hechos 2:41). “Y el Señor añadía cada día a la iglesia los que habían de ser salvos” (Hechos 2:47). “Y los que creían en el Señor aumentaban más, gran número así de hombres como de mujeres” (Hechos 5:14). Porque el crecimiento lo ha dado Dios y la salvación proviene unicamente de Él. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Crecimiento de la Iglesia hasta lo último de la tierra</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Además, el Evangelio se expandió rápidamente desde Jerusalén a toda Judea, Samaria, y hasta lo último de la tierra. “Entonces las iglesias tenían paz por toda Judea, Galilea y Samaria; y eran edificadas, andando en el temor del Señor, y se acrecentaban fortalecidas por el Espíritu Santo” (Hechos 9:31).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Poco a poco los apóstoles empezaron a salir a otros países para predicar. La semilla fue plantada y llegó a conocerse la Palabra del Dios y el Evangelio en el mundo, de donde muchos hombres tomados por el Espíritu, deciden emprender grandes viajes para llevar estas Buenas Nuevas a todos los países que aún no habían escuchado de este mensaje maravilloso que solo proviene de Dios.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Pero la palabra del Señor crecía y se multiplicaba” (Hechos 12:24). “Así que las iglesias eran confirmadas en la fe, y aumentaban en número cada día” (Hechos 16:5). “Así crecía y prevalecía poderosamente la palabra del Señor” (Hechos 19:20).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Dios toma el corazón del hermano Larsen </strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Quien llega a Colombia con el mensaje de Salvación. Una iglesia que empezó con gran sacrificio y esfuerzo, tiempos de persecución y muerte para los cristianos, Pero la Palabra predicada siempre ha sido respaldada y nadie ha podido detener el crecimiento de esta Iglesia. El Señor dijo que, las puertas del infierno no prevalecerán contra ella, Mateo 16:18.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Una Iglesia que empezó con una familia, luego se convirtieron algunos, después muchos y ahora somos miles, hoy día hemos crecido tanto que tenemos más de 5.180 pastores en territorio nacional; con la ayuda de Dios hemos llegado al corazón de grupos étnicos, cárceles, población sorda y diferentes grupos vulnerables, que también están alabando y glorificando el Nombre de Jesús. Así mismo, hacemos presencia en muchos paises y contamos con más de setecientos pastores en el extranjero, aproximadamente.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Es nuestra tarea llevar el Evangelio a todos los rincones de Colombia, somos miles de hermanos guiados y respaldados por Dios para alcanzar este objetivo. Podemos ver el territorio muy grande, sin embargo, Dios mismo nos está mostrando caminos y abriendo puertas, Él lo seguirá haciendo, pues es Dios mismo quien ha dado y seguirá dando el crecimiento. 
La labor es ardua y el trabajo duro y complejo, para esto Dios sigue levantando hombres y mujeres con convicción, pasión y amor por las almas, que han creído a la Palabra y llevan con orgullo la bandera de nuestro Evangelio, no nos han podido callar, ni lo podrán hacer porque esta Palabra es respaldada directamente por Jesucristo.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hemos trabajado, hemos crecido, nos hemos fortalecido; pero no hemos terminado, aún queda mucho por hacer, esta semilla seguirá esparciéndose. Solo el poder del Espíritu Santo dirige el crecimiento de la Iglesia, ella da frutos porque Dios es el que da el crecimiento.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Edilberto Ortiz Sanmartín. Segundo Vicepresidente IPUC</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>





<p style='font-size: 2em; text-align: center;'><strong>COMME DIT L'ÉCRITURE... MAIS LA CROISSANCE A ÉTÉ DONNÉE PAR DIEU</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Moi, j’ai planté, Apollos a arrosé, mais c’est Dieu qui a fait pousser. 7Celui qui plante n’est rien, celui qui arrose n’est rien. Mais celui qui fait pousser est tout, et c’est Dieu (1 Corinthiens 3: 6-7PDV2017).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Le Royaume de Dieu est comparé à une graine de moutarde, la plus petite de toutes, insignifiante pour les Juifs. Elle était si petite qu'elle a été semée, a grandi et est devenue un arbre solide qui offrait un abri dans ses branches pour les oiseaux. Mais comment cette graine devient-elle un grand arbre qui donne de l'ombre ?  Marc 4:26-29, c'est donc Dieu qui opère la nouvelle naissance dans la vie d'une personne.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>L'explication de la manière dont la croissance de la graine se produit est impossible. Elle ne comprend pas le mystère de la vie ; le développement et la croissance de la graine dépendent de Dieu seul (Ecclésiaste 11:5) : 'Comme tu ne connais pas le chemin du vent, ni la croissance des os dans le sein d'une femme enceinte, tu ne connais pas non plus l'œuvre de Dieu, qui opère toutes choses'. Cette graine qui est la Parole de Dieu, toujours, aujourd'hui et pour toujours, pousse de la main puissante de Dieu.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Croissance de l'Évangile</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La graine qui est semée est l'Évangile, notre Seigneur Jésus-Christ étant le premier exposant (semeur). Dès lors, Jésus commença à prêcher et à dire : ”Repentez-vous, car le royaume des cieux est proche“ (Matthieu 4:17).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Cette graine a produit une plante qui a commencé à pousser. “Comme Jésus marchait le long de la mer de Galilée, il vit deux frères, Simon appelé Pierre et André son frère, qui jetaient un filet dans la mer ; car ils étaient pêcheurs” (Matthieu 4:18). Leurs branches ont commencé à s'étendre, “et il leur dit : “Suivez-moi, et je ferai de vous des pêcheurs d'hommes”” (Matthieu 4:19).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Les disciples ont donc été chargés de poursuivre l'œuvre : “Allez dans le monde entier et prêchez la bonne nouvelle à toute créature” (Marc 16:15). En ayant l'assurance que c'est le Seigneur Jésus-Christ qui donne la croissance. Et enseignez-leur à observer tout ce que je vous ai prescrit. Et voici, je suis avec vous tous les jours, jusqu’à la fin du monde.”. Amen” (Matthieu 28:20).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>De même que dans la parabole du semeur, la graine semée sur une bonne terre portait de bons fruits et se multipliait, de même la Parole prêchée par les disciples avait une portée au-delà de Jérusalem. Dix jours après l'ascension du Seigneur, le Saint-Esprit a été déversé sur les cent vingt croyants qui attendaient à Jérusalem ; avec la nouvelle onction qu'ils ont reçue, les disciples ont commencé à prêcher l'Évangile. Les résultats étaient presque incroyables car la croissance que Dieu donne est surnaturelle, pas humaine.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Grâce à la Parole de Dieu, nous pouvons voir comment, jour après jour, le nombre de personnes recevant le Christ a énormément augmenté. “Ceux qui acceptèrent sa parole furent baptisés; et, en ce jour-là, le nombre des disciples s’augmenta d’environ trois mille âmes.” (Actes 2:41). “Et le Seigneur ajoutait chaque jour à l'Église ceux qui étaient sauvés” (Actes 2:47). “Le nombre de ceux qui croyaient au Seigneur, hommes et femmes, s’augmentait de plus en plus; ” (Actes 5:14). Car l'augmentation est donnée par Dieu et le salut vient de Lui seul. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>La croissance des églises jusqu'aux extrémités de la terre</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En outre, l'Évangile s'est rapidement répandu de Jérusalem dans toute la Judée, la Samarie et jusqu'aux extrémités de la terre. “L’Église était en paix dans toute la Judée, la Galilée et la Samarie, s’édifiant et marchant dans la crainte du Seigneur, et elle s’accroissait par l’assistance du Saint-Esprit. ” (Actes 9:31).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Peu à peu, les apôtres ont commencé à aller prêcher dans d'autres pays. La semence fut plantée et la Parole de Dieu et l'Évangile furent connus dans le monde, d'où de nombreux hommes, pris par l'Esprit, décidèrent d'entreprendre de grands voyages pour annoncer cette Bonne Nouvelle à tous les pays qui n'avaient pas encore entendu parler de ce merveilleux message qui ne vient que de Dieu.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Cependant la parole de Dieu se répandait de plus en plus, et le nombre des disciples augmentait.” (Actes 12:24). “Les Églises se fortifiaient dans la foi, et augmentaient en nombre de jour en jour. (Actes 16:5). “C’est ainsi que la parole du Seigneur croissait en puissance et en force.” (Actes 19:20).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Dieu touche le cœur du Frère Larsen</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Notre frère arrive en Colombie avec le message du salut. Une église qui a commencé avec beaucoup de sacrifices et d'efforts, des temps de persécution et de mort pour les chrétiens, mais la Parole prêchée a toujours été soutenue et personne n'a pu arrêter la croissance de cette église. Le Seigneur a dit, les portes de l'enfer ne prévaudront pas contre elle, Matthieu 16:18.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Une église qui a commencé avec une famille, puis quelques uns se sont convertis, puis beaucoup et maintenant nous sommes des milliers, aujourd'hui nous avons tellement grandi que nous avons plus de 5 180 pasteurs sur le territoire national ; avec l'aide de Dieu nous avons atteint le cœur des groupes ethniques, des prisons, de la population sourde et de différents groupes vulnérables, qui louent et glorifient également le Nom de Jésus. Nous sommes également présents dans de nombreux pays et comptons plus de 700 pasteurs à l'étranger.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>C'est notre tâche d’annoncer l'Evangile dans tous les coins de la Colombie, nous sommes des milliers de frères guidés et soutenus par Dieu pour atteindre ce but.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'> Nous pouvons voir que le territoire est très vaste, cependant, Dieu lui-même nous montre des chemins et ouvre des portes, il continuera à le faire, car c'est Dieu lui-même qui a donné et continuera à donner la croissance. 
La tâche est ardue et le travail est dur et complexe, pour cela Dieu continue à susciter des hommes et des femmes avec conviction, passion et amour des âmes, qui ont cru la Parole et portent fièrement le drapeau de notre Évangile, ils n'ont pas pu nous faire taire, et ils ne pourront pas le faire parce que cette Parole est soutenue directement par Jésus-Christ.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Nous avons travaillé, nous avons grandi, nous nous sommes consolidés ; mais nous n'avons pas fini, il y a encore beaucoup à faire, cette graine va continuer à se répandre. Seule la puissance du Saint-Esprit dirige la croissance de l'Église, elle porte du fruit parce que c'est Dieu qui donne la croissance.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Par Edilberto Ortiz Sanmartín. Deuxième vice-président IPUC</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>




<p style='font-size: 2em; text-align: center;'><strong>Mas Deus deu  o crescimento</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Eu plantei, Apolo regou; mas Deus deu o crescimento. Por isso, nem oque planta é alguma coisa, nem o que rega, mas Deus, que dá o crescimento”. ( 1 Coríntios 3:6-7).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>O Reino de Deus é comparado a semente de mostarda, a mais pequena de todas,  para os judeus insignificante. Sendo tão pequena se semeou, cresceu e se fez árvore forte que ofereceu abrigo em seus ramos para as aves. Como cresce essa semente até ser uma árvore grande que dá sombra? (Marcos 4:26-29), de maneira que é Deus que trabalha no novo nascimento na vida da pessoa.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>A explicação de como ocorre o crescimento da semente é impossivel. Não se alcança comprender o mistério da vida; o desenvolvimento e crescimento da semente depende só de Deus. ( Eclesiastes 11:5) diz: “ assim como tu não sabes qual o caminho do vento, nem como se formam os ossos no ventre da mulher grávida, assim também não sabes as obras de Deus, que faz todas as coisas. Esta semente que é a Palavra de Deus, sempre, hoje e pelos séculos cresce da mão poderosa de Deus.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Crescimento do evangelho</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>A semente que se semeia é o Evangelho, sendo o nosso Senhor Jesus Cristo o primeiro expositor  ( semeador). “ desde então começou jesus a pregar, e a dizer: Arrependei-vos, porque está próximo o Reino dos céus”. (Mateus 4:17).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Esta semente deu uma planta que começou a crescer, “e Jesus andando junto ao mar da Galileia, viu a dois irmãos, viu a dois irmãos, Simão, chamado Pedro, e André, seu irmão, que lançavam a rede ao mar porque ream pescadores. Seus ramos começaram aextender-se, “ e disse-lhes: Vinde após mim, e eu vos farei peescadores de homens” (Mateus 4:19).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>De maneira que, os discípulos foram comissionados para continuar a obra “  ensinando-os a guardar todas as coisas que vos tenho mandado; e eis que eu estou convosco todos os dias, até a consumação do mundo. Amém. (Mateus 28:20). </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Assim que na parábola do semeador, a semente semeada em boa terra deu bom fruto e se multiplicou, a palavra pelos discípulos teve uma cobertura mais além de Jerusalém. Dez dias depois da ascenção do Senhor, o Espírito foi derramado sobre os cento e vinte crentes que estavam esperando em Jerusalém; com a nova unção que receberam os discípilos começaram a pregar o Evangelho. Os resultados eram quase incriveis porque o crescimento que dá Deus é sobrenatural, não é humano.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Através da Palavra de Deus podemos ver como dia após dia, o número de pessoas que recebiam a Cristo se aumentava enormemente.  “ de sorte que foram batizados os que debom grado receberam a sua palavra; e naquele dia agregaram-se quase três mil almas” (Atos 2:41). “... E todos os dias acrescentava o Senhor a igreja os que se haviam de  salvar” ( Atos 2:47). “E a multidão dos que criam no Senhor, tanto homens como mulher, crescia cada vez mais”. ( Atos 5:14). Porque o crescimento o deu Deus e a salvação provem unicamente dele.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Crescimento da igreja até aos confins da terra.</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Além do mais, o Evangelho se expandiu rapidamente desde Jerusalém a toda a Judeia, Samaria e até aos confins da terra. “ Assim pois as igrejas em toda a Judeia, e Galileia e Samaria tinham paz, e eram edificadas; e se multiplicavam, andando no temor do Senhor e consolação do Espírito”. (Atos 9:31).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Pouco a pouco os apóstolos começaram a sair por outros países para pregar, a semente foi plantada e chegou-se a conhecer a Palavra de Deus e o Evangelho no mundo, de onde muitos homens tomados pelo Espírito, decidem empreender grandes viagens para levar estas Boas Novas a todos os países que ainda não haviam escutado esta mensagem maravilhosa que só provem de Deus.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>“E a Palavra de Deus crescia e multiplicava”. (Atos 12:24). “ De sorte que as igrejas eram confirmadas na fé, e cada dia cresciam em número”.( Atos 16:5). “ Assim a Palavra do Senhor crescia poderosamente e prevalecia”. (Atos 19:20).</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Deus toma o coração do irmão Larsen.</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Foi precisamente o irmão Larsen quem chegou a Colômbia com a mensagem de salvação. Uma igreja que começou com grande sacrifício e esforço, tempos de persiguição e morte para os cristãos, mas a Palavra pregada sempre foi respaldada e ninguém pôde deter o crescimento desta igreja. O Senhor disse que: “ as portas do inferno não prevalecerão contra ela”.  Mateus 16:18.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Uma igreja que começou com uma família, logo se converteram alguns, depois muitos e agora somos milhares. Hoje em dia crescemos tanto que temos mais de 5180 pastores no território nacional;  com a ajuda de Deus chegamos ao coração de grupos étnicos, cadeias, população surda e diferentes grupos vulneraveis, que também estão louvando e glorificando ao Senhor Jesus. Assim mesmo, estamos presentes em muitos países e contamos com mais de setecentos pastores no extrangeiro,  aproximadamente.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>É nossa tarefa levar o Evangelho a todos os cantos de Colômbia. Somos milhares de irmãos respaldados por Deus para alcançar esse objectivo. Podemos ver o território muito grande, embora, Deus mesmo nos está mostrando caminhos e abrindo portas, Ele o seguirá fazendo, pois é Deus mesmo quem deu e seguirá dando crescimento.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>O labor é árduo e o trabalho duro e complexo, mas para isso Deus segue levantando homens e mulheres com convicção, paixão e amor pelas almas, que creram a Palavra e levam com orgulho a bandeira  do nosso Evangelho, e não conseguiram calar-nos, e nem poderão fazê-lo porque  essa palavra é respaldada directamente por Jesus Cristo.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Temos trabalhado, temos crescido, temos fortalecidos; mas ainda não terminamos, ainda há muito por fazer, essa semente seguirá  se espalhando. Só o poder do Espírito Santo dirige o crescimento da igreja, ela dá frutos porque Deus é quem dá o crescimento.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por: Edilberto ortiz Sanmartín – segundo vice presidente IPUC.</p>
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




















<p style='padding-top: 1em; font-size: 1em; font-style: italic;'><span style='color: #b41015; font-size: 2.3em'>“E</span>ntonces volvieron a llamar al hombre que había sido ciego, y le
dijeron: Da gloria a Dios; nosotros sabemos que ese hombre es
pecador. Entonces él respondió y dijo: Si es pecador, no lo sé; una cosa
sé, que habiendo yo sido ciego, ahora veo. Le volvieron a decir: ¿Qué
te hizo? ¿Cómo te abrió los ojos?”
(Juan 9:24-26).</p>

<p style='font-weight: 100; padding-top: 0.5em; font-size: 1.5em; font-style: italic; color: #fff;'>
“La complejidad es tu enemiga”,“Dios es simple,
todo lo demás es complejo”
(Albert Einstein).
“Las cosas simples son las más extraordinarias y
sólo los sabios consiguen verlas”
(Paulo Coelho).
“La simplicidad es la máxima sofisticación”
(Leonardo Da Vinci).
“Las cosas más simples suelen ser las más
verdaderas”
<p style=' font-size: 1.6em; font-style: italic; color: #fff; text-align: center !important; font-weight: 100 !important;'>
<strong>(Richard Bach)</strong></p></p>

<p style='font-size: 2em; text-align: center;'><strong>CON LA SENCILLEZ QUE DICE LA ESCRITURA</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Entonces volvieron a llamar al hombre que había sido ciego, y le dijeron: Da gloria a Dios; nosotros sabemos que ese hombre es pecador. Entonces él respondió y dijo: Si es pecador, no lo sé; una cosa sé, que habiendo yo sido ciego, ahora veo. Le volvieron a decir: ¿Qué te hizo? ¿Cómo te abrió los ojos?” (Juan 9:24-26).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“La complejidad es tu enemiga”, “Dios es simple, todo lo demás es complejo” (Albert Einstein). “Las cosas simples son las más extraordinarias y sólo los sabios consiguen verlas” (Paulo Coelho). “La simplicidad es la máxima sofisticación” (Leonardo Da Vinci). “Las cosas más simples suelen ser las más verdaderas” (Richard Bach).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La Palabra de Dios responde las preguntas a un niño y confunde la sabiduría de los sabios. Uno de los factores más relevantes del Evangelio es la manera sencilla en la que Dios se ha comunicado con los hombres, Dios es el todo Sabio, Él no pretende que los humanos alcancen una dimensión sobrenatural para entender todo a plenitud.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>La fe es la única que nos hace entender lo que está oculto</strong>
Es allí, en el espacio que deja el desconocimiento humano donde entra en acción la fe; el don que se recibe de Dios para poder tener “convicción de lo que no se ve”. Lo sencillo lo entendemos y lo explicamos, lo confuso lo creemos y lo predicamos. Hay suficientes razones para creer en Dios, eso es fe; muchas cosas que están expresas en la Biblia son de difícil entendimiento, y en estos casos a Dios hay que creerle, no siempre entenderle. “Por la fe entendemos haber sido constituido el universo por la palabra de Dios, de modo que lo que se ve fue hecho de lo que no se veía” (Hebreos 11:3).
</p
<p  style='padding-top: 0.7em; font-size: 1em;'>La razón de ser de la Palabra de Dios es guiar al hombre para que sea salvo; es importante que el creyente crea y conozca las verdades fundamentales y que se cumplan en él.  Alguien dijo: “No necesito que me digan cómo es el cielo; solo les pido que me enseñen como llegar allí”. Muchas posiciones doctrinales pretender profundizarse y lo único que logran es confundir a los creyentes. Los buzos se sumergen en las aguas y disfrutan de las bellezas del mar, sin embargo, tienen un límite al profundizarse; descender demasiado puede hacer doler la cabeza, y bajar aún más puede hacer que esta se reviente</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Las grandes herejías de la historia han sido el resultado del deseo de algunos hombres por tratar de explicar lo inexplicable. La curiosidad por lo desconocido y lo no revelado, ha motivado a presentar una serie de entramados doctrinales diversos, que lo único que han logrado es dividir el cuerpo de Cristo, y alejar a los creyentes de la hermosura de un Evangelio simple y entendible que conduce a los creyentes al cielo. Las cosas más sublimes de Dios son inexplicables, Él mismo es inexplicable. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>“Agradó a Dios salvar a los creyentes por la locura de la predicación. </strong>Porque la palabra de la cruz es locura a los que se pierden; pero a los que se salvan, esto es, a nosotros, es poder de Dios. Pues está escrito: Destruiré la sabiduría de los sabios, Y desecharé el entendimiento de los entendidos. ¿Dónde está el sabio? ¿Dónde está el escriba? ¿Dónde está el disputador de este siglo? ¿No ha enloquecido Dios la sabiduría del mundo? Pues ya que en la sabiduría de Dios, el mundo no conoció a Dios mediante la sabiduría, agradó a Dios salvar a los creyentes por la locura de la predicación” (1Corintios 1:18-21).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>La sencillez de la cruz</strong>
“Porque los judíos piden señales, y los griegos buscan sabiduría; pero nosotros predicamos a Cristo crucificado, para los judíos ciertamente tropezadero, y para los gentiles locura; mas para los llamados, así judíos como griegos, Cristo poder de Dios, y sabiduría de Dios” (1 Corintios 1:22-24).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Hay cosas difíciles de entender </strong>   
“casi en todas sus epístolas, hablando en ellas de estas cosas; entre las cuales hay algunas difíciles de entender, las cuales los indoctos e inconstantes tuercen, como también las otras Escrituras, para su propia perdición” (2 Pedro 3:16).  
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Siempre habrá cosas secretas</strong> 
“Las cosas secretas pertenecen a Jehová nuestro Dios; mas las reveladas son para nosotros y para nuestros hijos para siempre, para que cumplamos todas las palabras de esta ley” (Deuteronomio 29:29).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Siempre habrá cosas secretas </strong>
“Las cosas secretas pertenecen a Jehová nuestro Dios; mas las reveladas son para nosotros y para nuestros hijos para siempre, para que cumplamos todas las palabras de esta ley” (Deuteronomio 29:29).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Las añadiduras traen problemas </strong>
“Yo testifico a todo aquel que oye las “palabras de la profecía de este libro: Si alguno añadiere a estas cosas, Dios traerá sobre él las plagas que están escritas en este libro. Y si alguno quitare de las palabras del libro de esta profecía, Dios quitará su parte del libro de la vida, y de la santa ciudad y de las cosas que están escritas en este libro” (Apocalipsis 22:18-19).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Conocemos en parte</strong>
“Porque en parte conocemos, y en parte profetizamos; mas cuando venga lo perfecto, entonces lo que es en parte se acabará” (1 Corintios 13:9-10).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>De lo que sabemos hablamos </strong>
“Entonces volvieron a llamar al hombre que había sido ciego, y le dijeron: Da gloria a Dios; nosotros sabemos que ese hombre es pecador. Entonces él respondió y dijo: Si es pecador, no lo sé; una cosa sé, que habiendo yo sido ciego, ahora veo. Le volvieron a decir: ¿Qué te hizo? ¿Cómo te abrió los ojos? Él les respondió: Ya os lo he dicho, y no habéis querido oír; ¿por qué lo queréis oír otra vez? ¿Queréis también vosotros haceros sus discípulos?” (Juan 9:24-27).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Los grandes milagros de Dios no tienen explicación lógica</strong>
“Como tú no sabes cuál es el camino del viento, o cómo crecen los huesos en el vientre de la mujer encinta, así ignoras la obra de Dios, el cual hace todas las cosas” (Eclesiastés 11:5). </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“El viento sopla de donde quiere, y oyes su sonido; mas ni sabes de dónde viene, ni a dónde va…” (Juan 3:8). 
“Y mandó Jehová al pez, y vomitó a Jonás en tierra” (Jonás 2:10). 
 “Porque Jehová se levantará … para hacer su obra, su extraña obra, y para hacer su operación, su extraña operación” (Isaías 28:21).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>No trates de explicarlo, tan solo, creélo </strong>
¿Cómo explicar el suceso en que una bestia le habló a Balaam? ¿Cómo explicar que el sol y la luna se detuvieron en el tiempo de Gedeón? ¿Cómo explicar la manera en que la vara de Aarón reverdeció? ¿Cómo explicar que a los amigos de Daniel no se les quemara un solo cabello en un horno calentado siete veces más de lo normal? ¿Cómo pudieron Abraham y Sara tener un hijo en las condiciones físicas en las que estaban? ¿Cómo se recompuso el cuerpo putrefacto y hediondo de Lázaro? ¿Cómo explicar una sanidad Divina? ¿Cómo explicar el bautismo del Espíritu Santo?  ¿Cómo explicar lo sucedido en el vientre de María?
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>“… ¿No te he dicho que si crees, verás la gloria de Dios?” (Juan 11:40).
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Héctor Raúl Betancur Montoya. Secretario General IPUC
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>




<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA… LÁMPARA ES A MIS PIES TU PALABRA</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'> “Lámpara es a mis pies tu palabra, Y lumbrera a mi camino” (Salmos 119: 105).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La Palabra de Dios tiene muchos propósitos y significados en la Biblia, miraremos en este artículo varios de ellos:
Es como pan… Que alimenta nuestra alma.
Es como martillo… Que quebranta el corazón.
Es como oro… Que tiene un gran valor.
Es como semilla… Que da vida.
Es como espejo… Que nos hace ver lo que somos.
Es como  fuego… Que quema nuestras impurezas. 
Es como lluvia… Que refresca nuestra alma.
Es más dulce que la miel..  Que satisface.
Es como espada… Que parte el corazón.
Es como una lámpara… Que alumbra el camino.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En estas notas nos ocuparemos de ella, como lámpara a nuestros pies y lumbrera a nuestro camino.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El ser humano siempre está expuesto en este camino de la vida a tropezar y tomar caminos equivocados. Eso fue lo que le sucedió a nuestros primeros padres Adán y Eva, se dejaron seducir por el maligno obedeciendo su voz y como consecuencia sentenciaron a toda la humanidad a la tragedia más grande, la condenación eterna, Génesis 3:6.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Desde ese momento tan deplorable para el hombre, ha vivido en la oscuridad espiritual, alejado de Dios y ha expensas de Satanás; siendo guiado por filosofías y pensamientos que lo han alejado durante mas de dos mil años, de la luz de Aquel que es la Luz.
  “Otra vez Jesús les habló, diciendo: Yo soy la luz del mundo; el que me sigue, no andará en tinieblas, sino que tendrá la luz de la vida” (Juan 8:12).  </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La Palabra de Dios ha jugado un papel muy importante en orientar e iluminar la senda por donde el hombre debe caminar y transitar con pasos firmes, sin extraviarse del buen camino que Dios ha trazado, para que los caminantes hacia la gloria eterna no se aparten  de Él. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Eso fue lo que Dios le exigió a través de Moisés a su pueblo cuando les dio la ley en el monte Sinaí, para que fuera prosperado.
“Ahora, pues, Israel, ¿qué pide Jehová tu Dios de ti, sino que temas a Jehová tu Dios, que andes en todos sus caminos, y que lo ames, y sirvas a Jehová tu Dios con todo tu corazón y con toda tu alma;  que guardes los mandamientos de Jehová y sus estatutos, que yo te prescribo hoy, para que tengas prosperidad?” (Deuteronomio 10:12-13).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>De igual manera, fue lo que Dios le pidió a Josué al entregarle la gran tarea de introducir a Israel a la tierra prometida.
“Nunca se apartará de tu boca este libro de la ley, sino que de día y de noche meditarás en él, para que guardes y hagas conforme a todo lo que en él está escrito; porque entonces harás prosperar tu camino, y todo te saldrá bien” (Josué 1:8). </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El apóstol escribiéndole a los corintios nos hace un planteamiento de la sabiduría del hombre y la eficacia de la Palabra de Dios, muy interesante.
“¿Dónde está el sabio? ¿Dónde está el escriba? ¿Dónde está el disputador de este siglo? ¿No ha enloquecido Dios la sabiduría del mundo? Pues ya que en la sabiduría de Dios, el mundo no conoció a Dios mediante la sabiduría, agradó a Dios salvar a los creyentes por la locura de la predicación” (1 Corintios 1:20-21).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Y el escritor de la carta a los hebreos, también nos muestra el poder que tiene la Palabra de Dios, como la espada del Espíritu para dar vida, para escudriñar integralmente al hombre y ayudarle a conocerse asi mismo. 
 “Cada palabra que Dios pronuncia tiene poder y tiene vida. La palabra de Dios es más cortante que una espada de dos filos, y penetra hasta lo más profundo de nuestro ser. Allí examina nuestros pensamientos y deseos, y deja en claro si son buenos o malos”  (Hebreos 4:12 TLA).  </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La Biblia es muy amplia en mostrarnos cómo la Palabra de Dios es  una luz, y una lámpara que guía nuestros pies e ilumina nuestro caminar. 
 “La exposición de tus palabras imparte luz; da entendimiento a los sencillos” (Salmos 119:130 LBLA).  </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Los preceptos del SEÑOR son rectos, que alegran el corazón; el mandamiento del SEÑOR es puro, que alumbra los ojos” (Salmos 19:8 LBLA).
“Porque el mandamiento es lámpara, y la enseñanza luz, y camino de vida las reprensiones de la instrucción” (Proverbios 6:23 LBLA).  
“Prestadme atención, pueblo mío, y oídme, nación mía; porque de mí saldrá una ley, y estableceré mi justicia para luz de los pueblos” (Isaías 51:4 LBLA).   
“Y así tenemos la palabra profética más segura, a la cual hacéis bien en prestar atención como a una lámpara que brilla en el lugar oscuro, hasta que el día despunte y el lucero de la mañana aparezca en vuestros corazones” (2 Pedro 1:19 LBLA).  </p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Conclusión</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
Para que esto se cumpla en nuestras vidas, mi consejo es; enamorémonos, zambullámonos, valoremos este precioso regalo que Dios ha colocado en nuestra manos. Su Palabra es la lámpara que nos ha dado para que nuestros pies no se salgan del camino, y podamos caminar por la senda que nos llevará al feliz puerto de su Reino, que espera a los caminantes triunfantes que lleguemos al final de la jornada.  </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Angelmiro Camacho Isaza. Director General FECP
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>




<p style='padding-top: 0.5em; font-size: 1em;'>El salmista en esta poética expresión, cargada de verdad y
perfección, manifestaba la seguridad que tenía al confiar en su
Dios, pues esa Palabra se convertía en su escudo y defensa.
Podrían pasar muchos años y aparecer circunstancia tras
circunstancia, su fe se mantendría firme, pues estaba anclada a
una Palabra intachable y perfecta, que nunca sería cuestionada ni
removida ni refutada</p>
<p style='padding-top: 0.5em; font-size: 1em;'>Cuando decimos que la Palabra de Dios es intachable, estamos
declarando que su Palabra es limpia, perfecta, sin tacha, que no
admite reproche ni censuras, que no da lugar a cuestionamientos
ni dudas.  </p>
<p style='padding-top: 1em; font-size: 1em;'> Solo la Palabra de Dios es intachable, perfecta y limpia, <span style='color: #b41015;'>porque
Él es perfecto.</span></p>
<p style='padding-top: 1em; font-size: 1em;'> </p>
<p style='padding-top: 1em; font-size: 1em;'> </p>



















<p style='font-size: 2em; text-align: center;'><strong>LA PALABRA DE DIOS ES INTACHABLE Y ES ESCUDO.</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“En cuanto a Dios perfecto es su camino, Y acrisolada la palabra de Jehová; Escudo es a todos los que en él esperan” (Salmos 18:30).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El salmista en esta poética expresión, cargada de verdad y perfección, manifestaba la seguridad que tenía al confiar en su Dios, pues esa Palabra se convertía en su escudo y defensa. Podrían pasar muchos años y aparecer circunstancia tras circunstancia, su fe se mantendría firme, pues estaba anclada a una Palabra intachable y perfecta, que nunca sería cuestionada ni removida ni refutada. 
Esta es la razón por la que la Palabra de Dios se convierte en escudo y defensa, porque es perfecta e inalterable. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Cuando decimos que la Palabra de Dios es intachable, estamos declarando que su Palabra es limpia, perfecta, sin tacha, que no admite reproche ni censuras, que no da lugar a cuestionamientos ni dudas. 
Solo la Palabra de Dios es intachable, perfecta y limpia, porque Él es perfecto. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“La ley de Jehová es perfecta, que convierte el alma...” “El temor de Jehová es limpio, que permanece para siempre…” (Salmos 19:7 y 9). </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La Palabra de Dios es perfecta, intachable y limpia, pues conduce al hombre a un reconocimiento de su situación y le promueve a un arrepentimiento y a una conversión genuina. Es allí, donde el ser humano encuentra verdadera seguridad y la garantía de que su esperanza jamás será cambiada ni removida, será permanente. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Solo la Palabra de Dios es la única que tiene la capacidad de convertir, cambiar, transformar y crear, porque es poder y es intachable, de tal manera que el hombre que la cree y la recibe, puede vivir seguro, pues esa Palabra se convierte en un verdadero escudo contra toda situación. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>No hay nada que mejorar a su Palabra, no se le puede cambiar ni corregir, ni agregar absolutamente nada. Su Palabra es perfecta, no tiene sombras ni errores, por cuanto Él es Dios Inmutable y es la Verdad. 
La Palabra de Dios es perfecta en su esencia, su obra, su poder, su grandeza, su dignidad y Señorío. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Los hombres de nuestro mundo se esfuerzan para que sus palabras tengan la suficiente credibilidad, y hacen énfasis en demostrar que hablan con verdad, transparencia y algunos afirman que, aunque pasen los años, nada cambiará.  Pero el hombre es un ser imperfecto, por eso sus palabras están rodeadas de debilidad, incertidumbre e imperfección.  Es por ello que el hombre no tiene la capacidad de brindarle a su prójimo una palabra de sí mismo, de tal manera que pueda depositar toda su confianza y despertar confianza en su corazón, pues lo que hoy parece ser firme y cierto, mañana no lo es, ya que por las diversas situaciones y circunstancias, esa palabra se debilita, pierde valor y es cuestionada, pues está saturada de errores e imperfección.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En cierta ocasión el Señor dijo: “¿Quién de vosotros me redarguye de pecado? Pues si digo la verdad, ¿por qué vosotros no me creéis?” (Juan 8:46). </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El Señor les dio la oportunidad de expresar cualquier duda, cuestionamiento o tacha que tuvieran de Él y su Palabra. Quedaron totalmente desarmados, porque nadie pudo redargüirlo de pecado, por cuanto Él es la perfección en la expresión suma.  
“Una palabra y una vida intachables, solo pueden provenir de un ser intachable”.
La mayor seguridad que puede tener una persona que crea en Jesucristo, es conocer que la Palabra que ha creído es intachable y nadie podrá cuestionarla, por lo que la misma Palabra se convierte en escudo permanente para su vida. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Lo que hizo que la fe de muchos hombres en la antigüedad pudiera mantenerse, fructificar y resplandecer en medio de tantas situaciones, circunstancias adversas y devastadoras, fue precisamente, porque esa fe descansaba en una Palabra intachable, una Palabra jamás cuestionada, una Palabra sin sombra de duda o errores. 
Es impresionante ver cómo se enfrentaron a retos muy duros y difíciles, ya que la misma Palabra se convertía en un verdadero escudo, pues no se trataba solamente de una protección física, sino de su fe, de su esperanza y su relación con el Dios de sus vidas. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Eso fue lo que llevó a Abel a ofrecer más excelente sacrificio que Caín, y es Dios mismo quien da testimonio de sus ofrendas. Esa Palabra de Dios, intachable, limpia y perfecta, inspiró a Abel a permanecer en esa verdad sin temor a la muerte, pues se convirtió en protección y defensa, para enfrentar los retos del momento. Es maravilloso pensar que, aunque muerto Abel, esas ofrendas hablan por él.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La misma Palabra del Señor intachable y escudo, produjo en Enoc una convicción tal, que pudo enfrentarse a su generación incrédula, que amenazaba su fe y confianza en el Dios de su vida. Enoc iba contra corriente, seguro en la Palabra que no contiene errores ni incertidumbre, y fue un verdadero testimonio a su generación y a las que vendrían después de él, proclamando que sí se puede agradar a Dios, de tal manera que Dios lo traspuso para no ver muerte. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>¿Qué diremos de Noé? Pregonero de justicia, a quien Dios le advierte acerca de cosas que aún no se veían, para que se preparara e hiciera lo que Él le dijera y su familia así pudiera salvarse, ya que el juicio de Dios era inminente sobre esa generación.  Noé creyó esa Palabra intachable y perfecta de Dios, y tuvo en cuenta todos los detalles para hacer conforme a lo dicho. Esa Palabra no tuvo sombra de duda ni variación, fue firme y segura. Así que Noé con determinación y confianza, realiza lo que su Señor le dice, y esa misma Palabra de Dios se convirtió en un verdadero escudo contra el diluvio destructor y especialmente contra todo aquello que pudiera amenazar su fe o la de su familia. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hoy la Iglesia mantiene su fe en el Dios de su salvación, porque esa Palabra intachable que ha creído, sigue siendo la verdad para obedecer y seguir. Esa Palabra perfecta de Dios, sigue conservando su valor, vigencia y poder, porque lo que se dijo hace muchos años mantiene su esencia, altura y dignidad. No hay cuestionamientos ni errores que pudieran amenazar la fe, o poner en tela de duda sus promesas o declaraciones. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“… En el mundo tendréis aflicción; pero confiad, yo he vencido al mundo” y vosotros también venceréis (Juan 16: 33).
“No se turbe vuestro corazón; creéis en Dios, creed también en mí. En la casa de mi Padre muchas moradas hay; si así no fuera, yo os lo hubiera dicho; voy, pues, a preparar lugar para vosotros. Y si me fuere y os preparare lugar, vendré otra vez, y os tomaré a mí mismo, para que donde yo estoy, vosotros también estéis” (Juan 14:1-3).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Todas estas palabras de nuestro Señor Jesús jamás tendrán duda ni cuestionamiento, porque siguen siendo fortaleza y esperanza para el pueblo cristiano. Todos nuestros hermanos y seres queridos que han muerto, han descansado creyendo en que esta Palabra intachable les levantará en el día postrero para estar delante de Aquel que murió por ellos y los salvó.  
Nosotros también lo creemos y estamos dispuestos a seguir esperando en sus promesas, aunque las situaciones que vivamos sean adversas. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Le animo querido hermano a mantener su mirada en esa Palabra intachable de nuestro Dios, que jamás puede variar, o despertar dudas o incertidumbre, porque es nuestro verdadero escudo contra toda situación que pretenda amenazar nuestra fe. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Marcos Pabón Duarte. Misionero en España </p>
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







<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA… EL SEÑOR ABRIÓ SU CORAZÓN PARA QUE OYESE SU PALABRA</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Lucas en su Evangelio, capítulo 24:13 nos narra la forma como Jesús caminó al lado de dos de sus discípulos que regresaban tristes y frustrados, porque para ellos, Cristo no había resucitado. Jesús les interpeló, pero ellos no le reconocieron porque tenían sus ojos velados. Jesús a través del camino les va citando las Escrituras desde Moisés, los profetas, y todo lo que decían de Él. Cuando Jesús fue invitado a quedarse con ellos, al partir el pan, los ojos de sus discípulos fueron abiertos y le reconocieron, que Jesús está vivo, y como prueba irrefutable está soportada por su gloriosa Palabra y por ellos como testigos oculares, le vieron, sintieron sus corazones encendidos por el poder de la Palabra que oyeron de sus labios, Lucas 24:32. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Podemos inferir que, el Señor les abrió los ojos a estos dos discípulos, para que le reconocieran y fueran testigos oculares de su resurrección. El Señor Jesús les dio pruebas indubitables de su resurrección a sus discípulos, no solo para que contemplaran las cicatrices de sus heridas, sino también para que las palparan, Lucas 24:39; todo esto debido a que había turbación en sus corazones, y luego pasó a probarles a través de las Escrituras que estas tenían que cumplirse, lo que escribió Moisés, lo que escribieron los profetas y lo que está escrito en los Salmos. Y en esta ocasión el Señor les abrió el entendimiento para que comprendiesen las Escrituras. ¿Y qué era lo que debían entender de las Escrituras? Que Él es el Cristo, que fue necesario su padecimiento extremo para que por medio de su pasión, la muerte fuera derrotada a través de su resurrección Lucas 24:44. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Ante sus discípulos, Jesús presenta las Sagradas Escrituras, es decir, el Antiguo Testamento, como autoritativo y digno de ser creído; porque lo que ellos estaban viendo no fue improvisado, sino que todo estaba predicho, escrito desde mucho antes de la venida del Mesías prometido. Jesucristo se presenta como la principal clave hermenéutica al abrir el entendimiento a sus discípulos, para que comprendieran, interpretaran y supieran quien es Él, su gloriosa obra, poder, esencia y carácter; a fin de que estuviesen plenamente convencidos para poderles encomendar la gran comisión, para que se predicase en su Nombre el arrepentimiento y el perdón de los pecados a todas las naciones comenzando desde Jerusalén.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El evangelista Lucas nos enseña en el último capítulo de su Evangelio, el propósito de abrirle los ojos a dos de sus discípulos, para que lo reconocieran y para ser testigos oculares de su resurrección; y le abrió el entendimiento a sus discípulos para que comprendieran las Escrituras, para lanzarlos a dar testimonio del Cristo resucitado como el Salvador del mundo.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En el capítulo 16 de Hechos de los Apóstoles, Lucas nos narra el segundo viaje misionero de Pablo, y como el Espíritu Santo les prohibió hablar de la Palabra en Asia, Pablo insistió y ahora el Espíritu Santo no se los permitió; y fue a Troas donde se les mostró la visión de un varón macedonio pidiendo ayuda. Pablo y sus compañeros de viaje entendieron que Dios los llamaba para anunciar el Evangelio en Europa, llegan a Filipos territorio Europeo y después de hacer oración al Señor, salieron y junto al rio enseñaban la Palabra del Señor a mujeres que se reunía allí. Lucas nos presenta una mujer llamada Lidia, vendedora de púrpura, de la ciudad de Tiatira, que adoraba a Dios, Hechos 16:13-15. Lucas documenta este acontecimiento presentándonos el nombre de esta mujer, Lidia; su oficio, vendedora de púrpura; su procedencia Tiatira; y su fe y devoción a Dios. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Lidia estaba oyendo lo que Pablo decía, es decir, escuchaba la predicación del Evangelio, que era algo nuevo para ella, y es allí donde intervino el Señor y abrió el corazón, su mente, para que estuviese atenta a la exposición de la Palabra de Dios a fin de que pudiera entenderla y creerla para ser salva. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El Señor abrió el corazón de Lidia y esta creyó a la Palabra expuesta por Pablo, y fue tal el efecto que Lidia fue bautizada, su familia también; practicó con Pablo y sus compañeros la ley de la hospitalidad, y el Señor no solo había abierto el corazón de Lidia para que fuese salva junto con su familia, sino que también había abierto el corazón del continente europeo para que conocieran al Señor Jesucristo como el único Dios y Salvador de todos los hombres. Lidia la primera mujer convertida y bautizada junto con su familia en el continente europeo, y todo porque Pablo y sus compañeros se dejaron guiar por el Espíritu Santo; porque decidieron viajar a Filipos, porque antes de… oraron al Señor y Él los guió hasta donde se encontraba Lidia para predicarle el glorioso Evangelio y, sobre todo, el mismo Señor le abrió el corazón. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Lucas en su obra, de forma magistral nos enseña sobre los sublimes propósitos del Señor, cuando abre los ojos de los hombres para que le conozcan y sepan que Él está vivo, el Señor abre el entendimiento para que comprendan quién es Él, su obra, poder y carácter; para que anuncien sin temor su Palabra. Y abre el corazón para que los hombres sean salvos, sus familias y todo un pueblo, una nación, un continente, este es el poder del Evangelio.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Vivimos en medio de una sociedad a la que el enemigo ha cegado los ojos, les ha cerrado el entendimiento y el pecado les ha endurecido su corazón; una sociedad cerrada para los propósitos de Dios, pero totalmente abierta para hacer el mal e ignorar la obra de Dios. Esta es la gran paradoja humana, cerrados para hacer lo bueno, pero abiertos para hacer toda clase de mal. Pero el Señor hoy sigue abriendo los ojos, el entendimiento, el corazón de los perdidos, a fin de que sean salvos a través de la predicación del Evangelio.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Exel Javier Copete Gamboa. Supervisor Distrito 9 
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







<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA… NO CON EJÉRCITO, SINO CON MI ESPÍRITU</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Esta es Palabra de Jehová a Zorobabel, que dice: No con ejército, ni con fuerza, sino con mi Espíritu, ha dicho Jehová de los ejércitos” (Zacarías 4:6).
Dios delega a Zorobabel la responsabilidad de reconstruir el templo, una tarea grande, pero le manifiesta que esto no será posible por habilidades o estrategias humanas, sino por su Espíritu.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se entiende por estrategia un plan de acción para alcanzar un objetivo, sobre este particular hoy tenemos a disposición muchos conocimientos y por cierto nada despreciables; sin embargo, respecto a la predicación del Evangelio debemos ser cuidadosos en el uso de estas herramientas, a fin de no perder la perspectiva del sentido de la misión. Podemos tomar algunos de estos recursos, pero debemos tener presente que las estrategias o métodos no pueden desplazar al Espíritu Santo en la tarea de la predicación.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por ejemplo, Jesús dijo que se predicase en su Nombre el arrepentimiento y perdón de pecados. En muchos casos la predicación se centra en mover las emociones, trayendo como resultado, multitudes frente a un altar pero, no hay convicción de pecado y por ende no se busca el perdón de ellos para alcanzar la salvación.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Modelos de Dios</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Al correr un poco el velo de la historia del trato de Dios con el hombre, podemos darnos cuenta que para el desarrollo de cada proyecto Él tiene su propio modelo y ha sido muy enfático en la fidelidad a estos, miremos:
</p>
<p  style='padding-top: 0.7em; padding-left: 0.7em; font-size: 1em;'>1.  Cuando Dios determinó hacer juicio por la maldad de los antidiluvianos, le dio a Noé un modelo para la salvación de este y preservación de vida, el cual debía seguir fielmente, Génesis 6:9-21. -Noe siguió el modelo que le dio el Señor y se salvó con toda su casa incluyendo los animales. “Y lo hizo así Noé; hizo conforme a todo lo que Dios le mandó” (Génesis 6:22; 7:1-5).
Que el modelo de Dios fue efectivo lo vemos en (Génesis 8:18-19). “Entonces salió Noé, y sus hijos, su mujer, y las mujeres de sus hijos con él. Todos los animales, y todo reptil y toda ave, todo lo que se mueve sobre la tierra según sus especies, salieron del arca”. Esto es como dice la Escritura.
</p>
<p  style='padding-top: 0.7em; padding-left: 0.7em; font-size: 1em;'>2.  Cuando ordena construir el tabernáculo, el lugar de encuentro con su pueblo Israel, le pide a Moisés subir al monte para reunirse con Él y allí le mostró el modelo y le recomienda seguirlo. “Pon mucho cuidado, porque todo esto debes hacerlo exactamente igual a lo que te mostré en la montaña” (Éxodo 25:40 TLA). (Le dijo exactamente igual, no parecido, Dios no lo dejó a la inventiva de Moisés por muy cercano que fuese).
Registra la Biblia que Moisés hizo las cosas conforme Dios le había ordenado y cuando se hubo terminado, Dios lleno el lugar con su presencia. “Entonces una nube cubrió el tabernáculo de reunión, y la gloria de Jehová llenó el tabernáculo” (Éxodo 40:34). De esta manera da testimonio que las cosas se habían hecho según lo ordenado. Esto es como dice la Escritura.</p>
<p  style='padding-top: 0.7em; padding-left: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Modelo de Dios para la predicación</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En la sinagoga de Nazaret, Jesús inicia su predicación con la siguiente declaración:
“El Espíritu del Señor está sobre mí, Por cuanto me ha ungido para dar buenas nuevas a los pobres…” (Lucas 4:18-19).
Deja presente que la predicación del Evangelio debía hacerse siempre guiado y bajo la unción del Espíritu Santo, Jesús es nuestro ejemplo supremo a seguir. (Él comenzó a hacer y a enseñar).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En Marcos 16:15-16, Jesús les da la gran comisión a sus discípulos, pero Lucas registra la estrategia o el modelo de Dios que debían seguir para cumplirla.
“y que se predicase en su nombre el arrepentimiento y el perdón de pecados en todas las naciones, comenzando desde Jerusalén. He aquí, yo enviaré la promesa de mi Padre sobre vosotros; pero quedaos vosotros en la ciudad de Jerusalén, hasta que seáis investidos de poder desde lo alto” (Lucas 24:47-49). Aquí se nos muestran tres cosas sobre el modelo que Jesús entrega a sus discípulos.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>1-Predicar en el Nombre de Jesús el arrepentimiento y el perdón de pecados en todas las naciones, comenzando en Jerusalén.
2-Él les enviaría la promesa del Padre (El Espíritu Santo).
3-Debian quedarse en Jerusalén hasta que fuesen investido del poder desde lo alto</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Los discípulos habían recibido la misión de ir a llevar el mensaje, pero primero debían ser investidos de poder del Espíritu Santo; Lucas muestra que Jesús se presenta nuevamente a sus discípulos y les ratifica la promesa. Quería dejar muy claro su modelo o estrategia. Hechos 1:8</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>El cumplimiento de la promesa</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En el cumplimiento de la promesa, la Biblia declara que “… fueron todos llenos del E.S…”. De esta manera los capacita para la vida cristiana y para el cumplimiento de la misión. Hechos 2:1-4.
Jesús les había dicho que el Espíritu Santo sería quien convencería de pecado. Pedro lleno del Espíritu Santo el día de pentecostés da su primer discurso, y efectivamente miramos cómo los presentes son convencidos de pecado y más de tres mil personas reconocen su necesidad de salvación. En Hechos 2:37-42 miramos claramente la efectividad del modelo de Dios.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Fue el Espíritu Santo, quien seleccionó y envió los misioneros. Hechos 13:2-3.
Un hombre llegó a Colombia hace ochenta y cinco años ungido con el Espíritu Santo y comenzó a predicar, hoy somos cerca de cinco mil pastores; quiere decir que el modelo que el Señor Jesús usó, que implementaron los discípulos y que además está a disposición de los creyentes ha funcionado.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Conclusión</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La Iglesia en su compromiso de proclamar el mensaje del Evangelio, debe mantenerle ese papel protagónico al Espíritu Santo y seguir los lineamientos de la Palabra de Dios. Nunca permitir que las estrategias humanas (aunque útiles), sustituyan su presencia en el cumplimiento de la misión que se nos ha encomendado. “… Separados de mí nada podéis hacer” (Juan 15:5). Amén.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Segundo G. Arboleda Rosero. Pastor IPUC</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>





<p style='font-size: 2em; text-align: center;'><strong>Como diz a escritura…o senhor abriu seu coração para que ouvisse a sua palavra.</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Lucas em seu evangelho, capítulo 24:13 narra-nos a forma como Jesus caminhou ao lado de dois dos seus discípulos que regressavam tristes e frustrados, porque para eles, Cristo não havia ressuscitado. Jesus interpelou-lhes, mas eles não o reconheceram porque tinham seus olhos vendados. Jesus através do caminho citou-lhes as Escrituras desde Moisés, os profetas e de tudo o que dele se dizia. Quando Jesus foi convidado a ficar com eles, ao partir o pão, os olhos dos seus discípulos foram abertos e reconheceram, que Jesus está vivo, e a prova irrefutável está suportada por sua gloriosa Palavra e por eles, que como testemunhas oculares, viram-no e sentiram os seus corações em chama pelo poder da Palavra que ouviram dos seus lábios, Lucas 24:32.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Podemos deduzir ou inferir que, o Senhor abriu-lhes os olhos (a esses discípulos) para que o reconhecessem e fossem testemunhas oculares da sua ressurreição. O Senhor Jesus deu provas indubitáveis da sua ressurreição a seus discípulos, não só para que contemplassem as cicatrizes das suas feridas, senão  para que também as palpassem, Lucas 24:39; tudo isto porque estavam turbados os seus corações, e em seguida, provou-lhes pelas Escrituras que estas coisas tinham que cumprir-se, sendo profetizadas por Moisés, nos Salmos e nos Profetas. E nesta ocasião o Senhor abriu-lhes o entendimento para que compreendessem as Escrituras. E o que é que eles deveriam entender das Escrituras? Que Ele é o Cristo, que foi necessário seu padecimento extremo para que por meio da sua paixão, a morte fosse derrotada através da sua ressurreição. Lucas 24:44.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Diante dos seus discípulos, Jesus apresenta as Sagradas Escrituras, ou seja, o Antigo Testamento, como autoritário e digno de ser crido; porque o que eles estavam vendo não foi improvisado, senão que tudo estava profetizado e escrito muito tempo antes da vinda do Messias prometido.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Jesus Cristo se apresenta como a principal chave hermenêutica ao abrir o entendimento a seus discípulos, para que compreendessem, interpretassem e soubessem quem  Ele é, sua gloriosa obra, poder, essência e caracter; a fim de que eles estivessem plenamente convencidos para poder encomendar-lhes a grande comissão, para que se pregasse em seu nome o arrependimento e o perdão dos pecados a todas as nações começando por Jerusalém. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>O evangelista Lucas nos ensina no último capítulo do seu Evangelho, o propósito de abrir-lhes os olhos (a dois dos seus discípulos), para que o reconhecessem e para que fossem testemunhas oculares da sua ressurreição; e abriu-lhes o entendimento para que compreendessem as Escrituras, para envia-los a dar testemunho do Cristo ressuscitado como o Salvador do mundo.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>No capítulo 16 dos Atos dos Apóstolos, Lucas narra-nos a segunda viagem missionária de Paulo, e como o Espírito Santo proibiu-lhes de pregar a Palavra em Ásia. Paulo insistiu e o Espírito Santo não lhe permitiu; e foi a Troas onde se lhe mostrou a visão de um varão macedónio pedindo ajuda. Paulo e seus companheiros de viagem entenderam que Deus lhes chamava para anunciar o Evangelho na Europa, e chegam a Filipos, território europeu e depois de orar ao Senhor, saíram, e junto ao rio ensinavam a Palavra de Deus as mulheres que ali estavam reunidas. Lucas apresenta-nos uma mulher chamada Lídia, vendedora de púrpura, da cidade de Tiatira, que adorava a Deus, Atos 16:13-15. Lucas documenta este acontecimento apresentando-nos o nome dessa mulher, Lídia; seu ofício, vendedora de púrpura; sua procedência, Tiatira; e sua fé e devoção a Deus.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Lídia estava ouvindo o que Paulo dizia, ou seja, escutava a pregação do Evangelho, que para ela era algo novo, e é ali onde o Senhor interveio e abriu-lhe o coração e sua mente para que estivesse atenta a exposição da Palavra de Deus, a fim entendê-la e crê-la para ser salva.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>O Senhor abriu o coração de Lídia e esta creu à Palavra exposta por Paulo, e tal foi o efeito, que ela foi batizada juntamente com a sua família; praticou com Paulo e seus companheiros a lei da hospitalidade, e o Senhor não só havia aberto o coração de Lídia para que fosse salva junto com sua família, senão que havia aberto o coração do continente europeu para que conhecessem ao Senhor Jesus Cristo como o único Deus e Salvador de todos os homens. Lídia foi a primeira mulher convertida e batizada junto com sua família no continente europeu, e tudo isso porque Paulo e seus companheiros se deixaram guiar pelo Espírito Santo; porque decidiram viajar a Filipos, porque antes de … oraram ao Senhor e Ele guiou-lhes até onde se encontrava Lídia para pregar-lhe o glorioso Evangelho e, sobre tudo, o mesmo Senhor abriu-lhe o coração. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Lucas em sua obra, de forma magistral ensina-nos sobre os sublimes propósitos do Senhor, quando abre os olhos dos homens para que o conheçam e saibam que Ele está vivo.  O Senhor abre o entendimento aos homens para que compreendam quem Ele é, sua obra, poder e caracter; para que anunciem sem temor a sua Palavra. E abre o coração para que os homens sejam salvos, suas famílias e todo um povo, uma nação, um continente. Este é o poder do Evangelho. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Vivemos no meio de uma sociedade na qual o inimigo cegou-lhe os olhos, fechou-lhe o entendimento e o pecado endureceu-lhe o coração; uma sociedade fechada para os propósitos de Deus, mas totalmente aberta para fazer o mal e ignorar a obra de Deus. Este é o grande paradoxo humano, fechados para fazer o bem, mas abertos para fazer toda a classe de maldade. Mas, o Senhor hoje segue abrindo os olhos, o entendimento, o coração dos perdidos, a fim de que sejam salvos através da pregação do Evangelho.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
Por:  Javier Copete Gamboa. Supervisor do distrito 9
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>



<p  style='padding-top: 0.7em; font-size: 1em;'>Dios delega a Zorobabel la responsabilidad de reconstruir el templo, una
tarea grande, pero le manifiesta que esto no será posible por habilidades
o estrategias humanas, sino por su Espíritu.
Se entiende por estrategia un plan de acción para alcanzar un objetivo,
sobre este particular hoy tenemos a disposición muchos conocimientos y
por cierto nada despreciables; sin embargo, respecto a la predicación del
Evangelio debemos ser cuidadosos en el uso de estas herramientas, a fin
de no perder la perspectiva del sentido de la misión. Podemos tomar
algunos de estos recursos, pero debemos tener presente que las
estrategias o métodos no pueden desplazar al Espíritu Santo en la tarea de
la predicación.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por ejemplo, Jesús dijo que se predicase en su Nombre el arrepentimiento
y perdón de pecados. En muchos casos la predicación se centra en mover
las emociones, trayendo como resultado, multitudes frente a un altar
pero, no hay convicción de pecado y por ende no se busca el perdón de
ellos para alcanzar la salvación.</p>

<p class='first_letter_red'>Um cumprimento fraternal para todos os irmãos no nome de Jesus.
 Ao pensar no tema que ocupa esta nova edição titulado “como diz a Escritura”, devo dizer que sua palavra é a 
 tocha que ilumina nosso caminho e direcciona nosso destino.</p> 
<p style='padding-top: 0.5em'>Como propósito de promover ferramentas que contribuem para o nosso crescimento e formação , o Consistório de Anciãos , sempre em procura de actuar sob a direcção de Deus em todo o que fazemos; relacionou o propósito de nossa entrega anterior titulado “ Fé sempre”, orientendo-a a nossa forma de vida cristã e propõe assim novo lema: “ Como diz a Escritura”.</p> 


“”
<p class='first_letter_red'>Brotherly greetings to all our brothers in the Name of Jesus. When thinking about the theme of this new edition of Heraldo,  entitled “As the Scripture says”, I must say that his Word is the torch that lights our way and guides us to our destiny.</p> 
<p style='padding-top: 0.5em'>With the purpose of promoting tools that contribute to our growth and discipleship, the Consistory of Elders, always seeks to act under the direction of God in all aspects of their work. That’s why our previously themed issue of ‘Faith Always’ was focused on relating to our Christian way of life. In the same purpose, the Consistory of Elders proposes our new motto: “As the Scripture says”.</p> 

<p style='font-size: 2em; text-align: center;'><strong>LETTER FROM THE PRESIDENT</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Whoever believes in me, As the Scripture says….
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Brotherly greetings to all our brothers in the Name of Jesus. When thinking about the theme of this new edition of Heraldo,  entitled “As the Scripture says”, I must say that his Word is the torch that lights our way and guides us to our destiny.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>With the purpose of promoting tools that contribute to our growth and discipleship, the Consistory of Elders, always seeks to act under the direction of God in all aspects of their work. That’s why our previously themed issue of ‘Faith Always’ was focused on relating to our Christian way of life. In the same purpose, the Consistory of Elders proposes our new motto: “As the Scripture says”.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>The Scripture is the Word of God, although written by men inspired by Him. We are mindful that it contains the entire plan of the Lord so that humanity may be saved, live uprightly and piously, grow in wisdom, be perfected, and be prepared for every good work.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Among the many enriching teachings for our lives, and being consistent with Christ's proposal for us to live in peace, communion, brotherhood and harmony, He has provided us with the same inspiring Spirit of his Word that leads us to walk in the light, accepting our possible differences, without generating disputes, hatred and resentment.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“The voice of Him went out into all the earth...” (Psalms 19:4).
It is by his Word that we are cleansed. Let us remember that our human efforts and our sacrifices will are useless to achieve a clean heart. It is only through a will directed towards his Word and through his Spirit will we be transformed. By his Word we are built and provided with the necessary foundations for a victorious life in Christ Jesus; his Word gives us growth and firmness, his Word is life.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>His Word is a light that illuminates our steps so that our feet do not stray, we do not slip, we do not stumble and in this way we continue to amrch on, to the victory of sanctification.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>We have the most sure prophetic Word; we would do well to abide by it and always obey it. We will be attentive to this torch that shines in a dark place, in the midst of the gloom of this world, until the day dawns and the morning star rises in our hearts.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>The Word of the Lord Jesus is worthy to be received by all.  Part of the purpose of our new edition is to be another way of sowing the Word. Therefore, we invite our readers to treasure the Scriptures, they will guide us to the end.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>By Héctor Ariel Campuzano Fonseca. IPUC President
</p>


<p style='font-size: 2em; text-align: center;'><strong>What do the Scriptures say? But God gave the increase
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'> I planted, Apollos watered, but God gave the increase. 7 So then neither he who plants is anything, nor he who waters, but God who gives the increase. (1 Corinthians 3: 6-7
New King James Version)
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>The Kingdom of Heaven is compared to a mustard seed, the smallest of all seeds, but one that was for the Jewish people quite insignificant. Being so tiny when it is sowed, it grows and makes a robust tree that offers shelter on all its branches for the birds. But how does that small seed grown into such a shade-giving tree? So it is God who works the new borth in a person’s life (Mark 4: 26-29).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>It is impossible to explain how this growth happens. We can’t possibly understand the mystery of life. The development and growth of the seed depend entirely on God. Ecclestiastes 11: 5 says, ‘As you do not know what is the way of thewind, Or how the bones grow in the womb of her who is with child,
So you do not know the works of God who makes everything’</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>This seed that is the Word of God, always, today, and forever grows from the powerful hand of God. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Growing in the Gospel
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>The seed that is sown is the gospel, our Lord Jesus Christ being the first sower. Matthew 4: 17 says, ‘From that time Jesus began to preach and to say, “Repent, for the kingdom of heaven is at hand.” This seed produced a plant that began to grow, ‘And Jesus, walking by the Sea of Galilee, saw two brothers, Simon called Peter, and Andrew his brother, casting a net into the sea; for they were fishermen’ (Matthew 4: 18). And its branches began to spread, ‘Then He said to them, “Follow Me, and I will make you fishers of men’ (Matthew 4: 19). Thus the disciples were commissioned to continue the work, ‘And He said to them, “Go into all the world and preach the gospel to every creature’ (Mark 16: 15). Having the guarantee that it is the Lord Jesus Christ who gives the growth, ‘teaching them to observe all things that I have commanded you; and lo, I am with you always, even to the end of the age.’ (Matthew 28: 20)
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Just as in the parable of the sower, the seed sown in good soil bore good fruit and multiplied, the Word preached by the disciples had coverage beyond Jerusalem. Ten days after the ascension of the Lord, the Holy Spirit was poured out on the hundred and twenty believers who were waiting in Jerusalem; With the new anointing that the disciples received, they began to preach the Gospel. The results were almost incredible because the growth that God gives is supernatural, not human.

</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Through the Word of God we can see how day after day, the number of people who received Christ increased enormously. “Therefore, those who received the word from him were baptized; and there were added that day about three thousand souls” (Acts 2:41). “And the Lord added to the church daily such as should be saved” (Acts 2:47). “And those who believed in the Lord increased the more, great numbers both male and female” (Acts 5:14). Because growth has been given by God and salvation comes only from Him.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>The Growth of the Church to the Ends of the Earth
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Furthermore, the Gospel spread rapidly from Jerusalem to all of Judea, Samaria, and to the ends of the earth. “Then the churches had peace throughout all Judea, Galilee, and Samaria; and they were built up, walking in the fear of the Lord, and they increased, being strengthened by the Holy Spirit” (Acts 9:31).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Little by little the apostles began to go out to other countries to preach. The seed was planted and the Word of God and the Gospel became known in the world, from where many men who were taken by the Spirit, decided to undertake great trips to take this Good News to all the countries that had not yet heard of this wonderful message. That only comes from God.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“But the word of the Lord increased and multiplied” (Acts 12:24). “So the churches were established in the faith, and increased in number daily” (Acts 16:5). “Thus mightily the word of the Lord grew and prevailed” (Acts 19:20).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>God got ahold of Brother Larsen’s heart</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Brother Larsen arrived in Colombia with the message of Salvation. The church began with great sacrifice and effort, times of persecution and death for Christians, but the Word preached always went forward with purpose and no one has been able to stop the growth of this Church. The Lord said that the gates of hell will not prevail against her (Matthew 16:18).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>The church began with a single family, then there were a few converts, then many converted and now we are many thousands. Today we have grown so much that we have more than 5,180 pastors in the national territory. With the help of God we have reached the hearts of ethnic minorities, the prisons, the deaf population and different groups of vulnerable people, all who are praising and glorifying the Name of Jesus. Likewise, we are present in many countries and we have approximately seven hundred pastors abroad.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>It is our task to take the Gospel to all corners of Colombia. We are thousands of brothers guided and supported by God to achieve this goal. We can see that it is a very large territory, however, God Himself is showing us ways and opening doors. He will continue to do so, since it is God Himself who has given and will continue to give the growth.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>The work is arduous and the work hard and complex, but for all this, God continues to raise up men and women with conviction, passion and love for souls. They have believed the Word and proudly carry the banner of our Gospel.  No one has been able to silence us , nor will they be able to do it because this Word is directly endorsed by Jesus Christ.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>We have worked, we have grown, we have become stronger; but we are not finished, there is still much to do. This seed will continue to spread. Only the power of the Holy Spirit directs the growth of the Church. The church bears fruit because God is the one who gives growth.

</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>By Edilberto Ortiz Sanmartín. Second Vice-president IPUC

</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>





<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA… LA PALABRA DE DIOS ES VIVA</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Porque la palabra de Dios es viva y eficaz, y más cortante que toda espada de dos filos; y penetra hasta partir el alma y el espíritu, las coyunturas y los tuétanos, y discierne los pensamientos y las intenciones del corazón. Y no hay cosa creada que no sea manifiesta en su presencia; antes bien todas las cosas están desnudas y abiertas a los ojos de aquel a quien tenemos que dar cuenta” (Hebreos 4:12-13).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Con este artículo proponemos ayudar a cada lector a entender el momento y el tiempo que estamos viviendo, conocer los peligros a los que estamos expuestos, pero sobre todo animarnos a permanecer firmes creyendo en el poder de la bendita Palabra de Dios, la cual es viva, eficaz y permanece para siempre. Hebreos 4:12; 1 Pedro 1:25.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Nuestra fe cristiana descansa sobre dos fundamentos firmes: </p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>1.</strong> La confianza en el Dios Eterno, “… en el cual no hay mudanza, ni sombra de variación” (Santiago 1:17).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>2.</strong> En la Palabra de Dios, como fuente de autoridad y fuente de vida, la cual permanece para siempre.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Estas dos verdades le han brindado seguridad, confianza y solidez a la iglesia a través del tiempo. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La historia nos cuenta que la fe en el Dios verdadero y profesada por el cristianismo, ha sido puesta a prueba en todas las épocas de muchas formas y maneras; al comienzo con el rechazo de la religión dominante, por la familia, los amigos y las costumbres de la sociedad, y en muchos momentos la persecución por parte del estado. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Este rechazo no detuvo el crecimiento de la obra de Dios, al contrario, esto condujo a los creyentes a desarrollar su fe, la confianza en Dios y en su Palabra, y permitió un afianzamiento de la certeza en el corazón de cada creyente, el avance y crecimiento del cristianismo bíblico en nuestro país.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Pero el enemigo cambió de estrategia y ahora el ataque va dirigido a descontextualizar la Palabra de Dios, sembrar inquietudes y poner en duda su veracidad; por medio de hipótesis e interpretaciones basadas en diversas filosofías, entre ellas una que no es nueva, llamada secularismo. Esta filosofía y estrategia está siendo utilizada en nuestros días en muchas formas y maneras, incluyendo algunos llamados “cristianos”. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Cuando hablamos de secularismo nos referimos al proceso que lentamente conduce a las personas que conforman una sociedad, una iglesia, a tomar sus decisiones basados en los criterios humanos, utilizando solo las herramientas, los medios y los conceptos de la razón humana sin recurrir a la fe, ni a la Palabra de Dios; y aunque se hable de Dios, se actúe de manera diferente demostrando que no le necesita, algo sucedía en el pueblo de Israel. Lucas 6:46.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El secularismo tiene unas repercusiones espirituales enormes en todas las áreas de la vida y el desarrollo de una sociedad y de una iglesia; pues las personas dejan de ser Cristocéntricas para convertirse en una sociedad y un cristianismo humanista, donde el ser humano es el centro y donde Dios tiene deberes para con el hombre, y el hombre solo tiene derechos.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El primero en utilizar esta estrategia fue Satanás al comenzar el proceso de comunicación con Eva, proceso que le dio resultado pues terminó con la caída de nuestros primeros padres y la entrada del pecado al mundo con todas sus consecuencias. Genesis 3.1-6.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El secularismo no se implementa de la noche a la mañana, esto lleva tiempo porque responde a un proceso, proceso al que bien haremos nosotros los cristianos Cristocéntricos de estar muy atentos para enfrentarlo con decisión. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El primer paso en este proceso con nuestros primeros padres fue poner en duda lo que Dios les había dicho. “… Conque Dios os ha dicho…” (Génesis 3:1).  Estas palabras tienen como propósito cuestionar, retar y reinterpretar a su modo lo que Dios ya había ordenado, esto significa poner en duda la veracidad de lo dicho por Dios.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El segundo paso fue descontextualizar la orden de Dios para demostrar lo contrario. No comais de todo árbol, suena parecido, pero es totalmente diferente; “Y mandó Jehová Dios al hombre, diciendo: De todo árbol del huerto podrás comer” (Génesis 2:16).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El tercer paso fue contradecir abiertamente la orden de Dios: No moriréis. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El cuarto paso fue hacer ver a Dios como mezquino para con sus hijos y colocar en duda su bondad, su amor y el buen propósito de Dios para con ellos. Satanás indujo a Eva a pensar y luego a creer que Dios no quería compartir con ellos el conocimiento del bien y del mal.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Quinto paso fue hacerle creer que no necesitaría de Dios y que por el contrario podían desarrollar capacidades, habilidades y poderes que los llevaría a ser como Dios. “…seréis como Dios, sabiendo el bien el mal” (Génesis 3:5). </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Este plan se está llevando a cabo hace muchos días de una manera silenciosa pero efectiva, porque desde tiempo atrás, muchos, entre ellos algunos “cristianos” están colocando en duda la veracidad de la Biblia como Palabra de Dios, a cuestionar su autoridad, hasta finalmente reducir el contenido de la Biblia al nivel de otros buenos libros, pero ya no como la fuente de autoridad Divina, como la Palabra inspirada por Dios, entregada a la humanidad para que podamos conocerle. Juan 5:39.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Algo que facilita enormemente el accionar de esta estrategia es la apatía de muchos cristianos hoy a leer la Biblia, esto trae como consecuencia el desconocimiento de su contenido, su inspiración, sus propósitos y de los efectos poderosos que ella produce en la vida de aquellos que la aman, la oyen, leen y la guardan. Apocalipsis 1:3.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hoy más que nunca necesitamos obedecer la orden que Dios le dio a Moisés: “Y estas palabras que yo te mando hoy, estarán sobre tu corazón” (Deuteronomio 6:6).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Y más tarde a Josué: “Nunca se apartará de tu boca este libro de la ley, sino que de día y de noche meditarás en él, para que guardes y hagas conforme a todo lo que en él está escrito; porque entonces harás prosperar tu camino, y todo te saldrá bien” (Josué 1:8).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Para David, leer, estudiar y meditar en la ley de Dios era su delicia. Salmos 119:97.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Como cristianos Cristocéntricos debemos enfrentar con decisión esta filosofía de vida que amenaza el fundamento de nuestra fe para lo cual debemos:
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Amar la Palabra de Dios, apartar tiempo para leer, oír, estudiar, memorizar, meditar y sobre todo obedecerla.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Continuar creyendo que los cielos y la tierra fueron hechos por la Palabra de Dios. Hebreos 11:3; pues, aunque existan otras explicaciones, estas son solo teorías que requieren más fe para creerlas, que estar seguros que la Biblia dice la verdad, porque nadie ha podido demostrar lo contrario.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Continuar predicando la Palabra de Dios, porque ella produce la vida de Dios en los seres humanos, Juan 6:63; como resultado, miles y miles de hombres mujeres nacen de nuevo, sus vidas cambian demostrando de esta manera que la Palabra de Dios es viva y eficaz.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Esto nos traerá enormes beneficios, entre ellos: </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Crecer en el conocimiento de nuestro Señor Jesucristo. Juan 5:39.
Disfrutar de la paz interior que ella produce. Salmos 119:165.
Edificar nuestra vida sobre el fundamento inamovible. Mateo 7:27.
Utilizarla como antorcha en este mundo lleno de tinieblas. 2 Pedro 1:17.
Sobre todo, hacer frente a las amenazas a nuestra fe.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Acerquémonos a ella para nutrir nuestra alma, ser alimentados por ella, ser guiados y ser limpiados.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Otra amenaza que tenemos en este tiempo es la profesionalización en las Escrituras.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El profesionalismo se refiere a la capacidad con la cual una persona desarrolla su actividad profesional, esto es muy importante, pero cuando se trata del cristianismo, de la predicación del Evangelio y del ejercicio de la fe, las cosas son muy diferentes.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Si bien, las herramientas humanas son importantes, nosotros sabemos que tienen unos límites que jamás podrán ser sobrepasados. Recuerdo las palabras de una destacada psicóloga que frente a un paciente expresó con humildad: “Mis herramientas son limitadas, yo puedo actuar de afuera hacia adentro, pero se necesita alguien que actúe de adentro hacia afuera, y solo Dios con su poder lo puede hacer”.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La ciencia con todos sus grandes avances y descubrimientos ha tenido que aceptar que es limitada, lo acabamos de comprobar durante la pandemia donde tuvieron que decir: “Hasta aquí llegan nuestros recursos, no podemos hacer más”
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Pero la Palabra de Dios no tiene límites ni barreras que no puedan ser superadas, eso lo tenía muy claro el centurión cuando le dijo al Señor Jesús: “…solamente di la palabra, y mi criado sanará…” (Mateo 8.15-23). No importa la distancia geográfica, tampoco cual sea la enfermedad, ni qué tan avanzada esté. Y efectivamente el criado fue sanado.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Eso también lo experimentaron los discípulos cuando se levantó una tormenta en medio del mar de Galilea y el Señor Jesús estaba dormido en la popa de la embarcación; cuando lo despertaron Él se levantó y habló con autoridad al mar y a los vientos, y estos inmediatamente obedecieron. Marcos 4:35-41.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por esta razón, quiero invitarles estimados lectores a continuar con mayor amor y mayor esmero a amar la Palabra de Dios, a dedicarle tiempo para estudiarla, conocerla y sobre todo a obedecerla; ella sigue siendo verdad, sigue siendo viva y produciendo vida en aquellos que deciden creerla, con ello podremos permanecer firmes en medio cualquier ataque, disfrutar de todos sus beneficios y explicarla a todos aquellos que lo necesiten. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Tengamos mucho cuidado con el secularismo venga de donde venga y con el profesionalismo, continuemos viviendo y creyendo en la Palabra de Dios con la misma seguridad del comienzo, teniendo claro que el cielo y la tierra pasarán, pero la Palabra de Dios no pasará.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Los libros de todas las disciplinas se desactualizan y se contradicen con el tiempo, lo que hace doscientos años era verdad hoy esta reevaluado y sus conceptos han dejado de tener validez, pero la Palabra de Dios permanece para siempre, sus postulados continúan vigentes y sus efectos siguen siendo poderosos.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Oscar de Jesús Restrepo Villada. Director Administrativo IPUC
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>



<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA… BIENAVENTURADOS LOS QUE OYEN Y OBEDECEN
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“El que tiene oído, oiga lo que el Espíritu dice a las iglesias” (Apocalipsis 3:22).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Según la Organización Mundial de la Salud, hay cuatrocientos cuarenta y seis millones de sordos en el mundo de los cuales quinientos mil son colombianos, es decir, por cada cien colombianos uno es sordo.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Si hablamos de nosotros, la Biblia plantea una paradoja, ya que es posible tener oído y no oír, lo que nos lleva a concluir que:
• Oír va más allá de la percepción acústica. 
• Se puede escuchar sin oír.
• La palabra obediencia, significa “oír lo que alguien en autoridad pide y actuar en consecuencia”.
• En otras palabras, oír es someterse a la orden de alguien en autoridad; es complacer los requerimientos de alguien que está por encima de.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La principal enseñanza para el pueblo hebreo está en Deuteronomio 6, “Escucha, Israel” son las primeras palabras y el nombre de una de las principales plegarias judías en la que se manifiesta su credo en un solo Dios; la recitan dos veces al día en las oraciones de la madrugada y el atardecer.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Cuál ha sido la respuesta humana a esta enseñanza:
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>1. El oidor sordo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Salomón fue un oidor sordo, uno de los hombres más famosos y ricos del mundo. Debía escuchar y observar tres advertencias de parte de Dios, expresadas con quinientos años de anticipación (medicina preventiva).
No aumentar caballos para sí.
No tomar para sí muchas mujeres.
No amontonar para sí en abundancia plata ni oro, ni mujeres ni riquezas.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>No oye la amonestación de escribir también para sí una copia de la enseñanza Divina. 
No aprende la lección que le prolongaría su reino, lo libraría de creerse más que sus hermanos, que le llevarían a reconocer y honrar al Dios que lo había prosperado. Ahora se aparta de Dios... parece mentira, un hombre tan sabio y a la vez tan sordo.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>2. El oidor olvidadizo</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Porque si alguno es oidor de la palabra pero no hacedor de ella, este es semejante al hombre que considera en un espejo su rostro natural. Porque él se considera a sí mismo, y se va, y luego olvida cómo era” (Santiago 1:23-24).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>3. El oidor sin entendimiento
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“¿Por qué no entendéis mi lenguaje? Porque no podéis escuchar mi palabra” (Juan 8:43).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>4. El oidor que se engaña a sí mismo</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Pero sed hacedores de la palabra, y no tan solamente oidores, engañándoos a vosotros mismos” (Santiago 1:22).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>5. El oidor de duro corazón</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hebreos 3:12, dice que el corazón malo es incrédulo y nos aparta del Dios vivo.
(Hebreos 3:15). Afirma que el corazón duro es sordo y provoca a Dios, disgusta a Dios, es desobediente. “… Si oyereis hoy su voz, no endurezcáis vuestros corazones como en la provocación”. ¿quiénes fueron los que, habiendo oído le provocaron?</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>6. El oidor creyente</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El oír ha orientado nuestra fe y traído como consecuencia la obediencia. Aunque la obediencia no nos justifica ante Dios, sí demuestra que somos justificados. Pablo declara que la salvación es un don de Dios que produce buenas obras, Efesios 2:8-10.
De la misma manera, Santiago menciona las obras de obediencia que provienen de la fe, Santiago 2:14-26.
Por lo tanto, nuestra obediencia a Dios es el resultado de haber puesto nuestra fe en Él. 
 “y por quien recibimos la gracia y el apostolado, para la obediencia a la fe en todas las naciones por amor de su nombre” (Romanos 1:5).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>7. El oidor bienaventurado</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Mas el que mira atentamente en la perfecta ley, la de la libertad, y persevera en ella, no siendo oidor olvidadizo, sino hacedor de la obra, este será bienaventurado en lo que hace” (Santiago 1:25).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>8. El oidor por excelencia</strong>
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El modelo, el ejemplo, el mejor oidor, Jesús dio el ejemplo acerca de lo que significa la verdadera obediencia. La noche en que fue traicionado dijo a los discípulos que su amor se demostraba a través de la obediencia.
Jesús se despojó a sí mismo tomando forma de siervo; se humilló y se hizo obediente hasta la muerte y muerte de cruz. Filipenses 2:7-8.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Una invitación</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hay una invitación a graduarnos en la escuela de la obediencia, según Romanos 13 hay
cuatro niveles de la obediencia:
1. Por razón del castigo.
2. Por deber.
3. Por causa de la conciencia (conocimiento). 
4. Por amor.
Si alguien tiene cerca la Palabra somos nosotros; la Biblia dice, “… cerca de ti está la Palabra, en tu boca y en tu corazón…” (Romanos 10:8); si la estudiamos, la leemos a diario, la citamos, ella nos exhorta, corrige, instruye en justicia; que no nos falte Palabra, que no nos falte oír la Palabra y sobre todo la apliquemos a nuestra vida.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Fernando López Pimiento. Director Misiones Nacionales IPUC

</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>



<p style='font-size: 2em; text-align: center;'><strong>Como diz a Escritura…bem-aventurados os que ouvem e obedecem.</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Quem tem ouvidos, ouça o que o Espírito diz às igrejas”. (Apocalipse 3:22).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Segundo a Organização Mundial da Saúde, há quatrocentos e quarenta e seis milhões de surdos no mundo, dos quais quinhentos mil são colombianos, ou seja, para cada cem colombianos um é surdo.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se falamos de nós, a Bíblia nos apresenta um paradoxo, já que é possível ter ouvido, e não ouvir, o que nos leva a concluir que:</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>- Ouvir vai mais além da perceção acústica.
- Se pode escutar sem ouvir.
- A palavra obediência significa “ouvir o que alguém em autoridade pede e atuar em consequência”.
- Em outras palavras, ouvir é submeter-se a ordem de alguém em autoridade; é satisfazer os prazeres de alguém que está em cima de.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>O principal ensinamento para o povo hebreu está em Deuteronómio 6, “Ouve Israel” são as primeiras palavras e o nome de uma das principais orações judias na que se manifesta seu credo em um só Deus; recitam-na duas vezes por dia nas orações de madrugada e na tarde.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Qual foi a resposta humana a este ensinamento:</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>O ouvinte surdo.</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Salomão foi um ouvidor surdo sendo um dos homens mais famosos e ricos do mundo. Deveria escutar e observar três advertências da parte de Deus, expressadas com quinhentos anos de antecipação (medicina preventiva).
- Não aumentar cavalos para si.
- Não tomar para si muitas mulheres.
- Não amontoar em abundância prata e ouro, nem mulheres, nem riquezas .
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Não ouviu a admoestação de escrever também para si uma cópia do ensinamento Divino. Não aprendeu a lição que prolongaria seu reino, o livrariam mais de crer a seus irmãos, que o levariam a reconhecer e honrar ao Deus que o havia prosperado.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Agora se aparta de Deus… parece mentira, um homem tão sábio, e ao mesmo tempo tão surdo.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>O ouvinte esquecediço.
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Porque se alguém é ouvinte da Palavra, e não cumpridor, é semelhante ao homem que contempla ao espelho o seu rosto natural; porque se contempla a si mesmo, e vai-se, e logo se esquece de como era.” (Santiago 1 :23-24)
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>“O ouvinte que engana a si mesmo”.</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“E sede cumpridores da Palavra, e não somente ouvintes, enganando-vos a vós mesmos “. (Santiago 1:22).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>O ouvidor sem entendimento.
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Por que não entendeis a minha linguagem? Por não poder ouvir a minha palavra. (João 8:43).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>O ouvinte de coração duro.</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>(Hebreus 3:12), diz que o coração mau é incrédulo e nos aparta do Deus vivo. 
(Hebreus 3:15). Afirma que o coração duro é surdo e provoca a Deus, aborrece a Deus, é desobediente. “… Hoje, se ouvirdes a sua voz, não endureçais os vossos corações, como na provocação”. Quem foram os que havendo ouvido o provocaram?
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>O ouvinte crente.</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>O ouvir orientou nossa fé e trouxe como consequência a obediência. Ainda que a obediência não nos justifica diante de Deus, todavia demonstra que somos justificados. Paulo declara que a salvação é um dom de Deus que produz boas obras, (Efésios 2:8-10.) Da mesma maneira, Santiago menciona as obras de obediência que provém da fé, (Santiago 2:14-26). 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por tanto, nossa obediência a Deus é o resultado de ter colocado nossa fé nele.  “Pelo qual recebamos a graça e o apostolado, para a obediência da fé entre todas as gentes pelo seu nome (Romanos 1:5)
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>O ouvinte bem-aventurado.
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Aquele, porém, que atenta bem para a lei perfeita da liberdade, e nisso persevera, não sendo ouvinte esquecediço, mas fazedor da obra, esse tal será bem-aventurado no seu feito”. (Santiago 1:25).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>O ouvinte por excelência.
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>O modelo, o exemplo, o melhor ouvidor. Jesus deu o exemplo acerca do que significa a verdadeira obediência. Na noite em que foi traído, disse aos seus discípulos que seu amor se demonstrava através da obediência. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Jesus despojou-se a si mesmo, tomando a forma de servo; se humilhou e se fez obediente até a morte e morte de cruz. (Filipenses 2:7-8).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong> Um convite.
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Há um convite para que graduemos na escola da obediência. Segundo Romanos 13, há quatro níveis de obediência:
Por razão do castigo.
Por dever.
Por causa da consciência (conhecimento).
Por amor
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se há alguém que está próximo da palavra, esse alguém somos nós; a Bíblia diz: “… A palavra está junto de ti, na tua boca e no teu coração; … “ (Romanos 10:8). Se a estudarmos, e a lermos todos os dias, a citarmos, ela nos exorta, corrige, instrui em justiça; que não nos falte a Palavra, que não nos falte ouvir a Palavra e sobretudo a sua aplicação a nossa vida. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por: Fernando López Pimento. Diretor Missões Nacionais.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>

<p style='font-size: 2em; text-align: center;'><strong>ZOALS DE SCHRIFT ZEGT... GEZEGEND ZIJN ZIJ DIE HOREN EN GEHOORZAMEN.
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Wie oren heeft, laat hij horen wat de Geest tegen de gemeenten zegt” (Openbaring 3:22).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Volgens de Wereldgezondheidsorganisatie zijn er vierhonderdzesenveertig miljoen doven in de wereld, waarvan vijfhonderdduizend Colombianen, dat wil zeggen dat voor elke honderd Colombianen er één doof is. Als we het over ons hebben, stelt de Bijbel een tegenstelling, want het is mogelijk om gehoor te hebben en niet te horen, waaruit we afleiden dat:
- Horen gaat verder dan alleen akoestische waarneming. 
- Het is mogelijk om te luisteren zonder te horen.
- Het woord gehoorzaamheid betekent “horen wat iemand met gezag vraagt en daarnaar handelen”.
- Met andere woorden, horen is zich onderwerpen aan het bevel van iemand met gezag; het is voldoen aan de eisen van iemand die boven hem staat.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Het belangrijkste onderwijs voor het Hebreeuwse volk staat in Deuteronomium 6, “Hoor, o Israël” zijn de eerste woorden en de naam van een van de belangrijkste Joodse Geboden waarin zij hun geloof in één God manifesteren; zij reciteren het tweemaal per dag in het vroege ochtend- en avondgebed.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Wat is het menselijke antwoord op deze leer:</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>1. De dove hoorder</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Salomo was een dove hoorder, een van de beroemdste en rijkste mannen ter wereld. Hij moest luisteren naar drie waarschuwingen van God, die vijfhonderd jaar van tevoren waren uitgesproken (preventieve geneeskunde).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hij luistert niet naar de vermaning om ook voor zichzelf een kopie van de Godsleer te schrijven. 
Hij leert de les niet die zijn koninkrijk zou verlengen, die hem zou bevrijden van de gedachte dat hij meer is dan zijn broeders, die hem ertoe zou brengen de God die hem voorspoed heeft gebracht te erkennen en te eren. Nu keert hij zich af van God... het lijkt ongelooflijk, een man zo wijs en toch zo doof.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>2. De vergeetachtige hoorder</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Want wie het woord hoort, maar het niet doet, is als iemand die zijn natuurlijke gezicht in een spiegel bekijkt. Want hij beschouwt zichzelf, en gaat weg, en vergeet dan hoe hij was” (Jakobus 1:23-24).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>3. De luisteraar zonder begrip
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Waarom begrijpt u niet wat Ik zeg? Omdat u Mijn woord niet kunt horen. (Johannes 8:43).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>4. De luisteraar die zichzelf misleidt
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En wees daders van het Woord en niet alleen hoorders. Anders bedriegt u uzelf (Jakobus 1:22).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>5. De koppige luisteraar
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hebreeën 3:12 Zie erop toe, broeders, dat er nooit in iemand van u een verdorven hart zal zijn, vol ongeloof, om daardoor afvallig te worden van de levende God;
Hebreeën 3:15 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hij bevestigt dat het harde hart doof is en God kwelt, God niet bevalt, ongehoorzaam is. “ terwijl er wordt gezegd: Heden, als u Zijn stem hoort, verhard dan uw hart niet, zoals in de verbittering. 
Wie waren degenen die, toen ze hem hoorden, hem uitlokten?
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>6. De gelovige luisteraar
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Het horen heeft ons geloof georiënteerd en als gevolg daarvan gehoorzaamheid gebracht. Hoewel gehoorzaamheid ons niet rechtvaardigt voor God, toont zij wel aan dat wij gerechtvaardigd zijn. Paulus verklaart dat verlossing een gave van God is die goede werken voortbrengt,
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Efeziërs 2:8-10.
Op dezelfde manier noemt Jakobus de werken van gehoorzaamheid die voortkomen uit het geloof, Jakobus 2:14-26.
Daarom is onze gehoorzaamheid aan God het resultaat van ons geloof in Hem. 
 “en door wie wij genade en apostelschap hebben ontvangen, tot gehoorzaamheid aan het geloof in alle volken omwille van zijn naam” (Romeinen 1:5).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>7. De gezegende hoorder
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Maar wie ijverig kijkt naar de volmaakte wet, de wet der vrijheid, en daarin volhardt, en niet vergeetachtig hoort, maar het werk doet, die zal gezegend worden in wat hij doet” (Jakobus 1:25).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>8. De uitstekende luisteraar</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Het model, het voorbeeld, de beste hoorder, Jezus gaf het voorbeeld van wat ware gehoorzaamheid betekent. In de nacht van zijn verraad vertelde hij de discipelen dat zijn liefde werd getoond door gehoorzaamheid.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Jezus maakte zichzelf leeg en nam de vorm aan van een dienaar; Hij vernederde zichzelf en werd gehoorzaam tot de dood, zelfs de dood aan een kruis. Filippenzen 2:7-8.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Een uitnodiging</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Er is een uitnodiging om af te studeren aan de school van gehoorzaamheid, volgens Romeinen 13 zijn er
vier niveaus van gehoorzaamheid:
1. door straf.
2. Door de plicht.
3. Door het geweten (kennis). 
4. Voor de liefde.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Als iemand het Woord dicht bij zich heeft, zijn wij het; de Bijbel zegt: “... het Woord is dicht bij u, in uw mond en in uw hart...” (Romeinen 10:8); als we het bestuderen, dagelijks lezen, citeren, vermaant het ons, corrigeert het ons, onderwijst het ons in gerechtigheid; moge het ons niet ontbreken aan het Woord, moge het ons niet ontbreken om het Woord te horen en bovenal moge het ons van toepassing zijn op ons leven.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Door Fernando López Pimiento. Directeur Nationale Missies IPUC
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>



<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA… LIMPIOS POR LA PALABRA</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hay una declaración maravillosa en la Palabra de Dios, la encontramos en el Evangelio según Juan, que nos abre camino para entender el por qué podemos ahora disfrutar de una vida nueva, de una magnífica vida nueva en Cristo Jesús; el Señor nos declara “Ya vosotros estáis limpios por la palabra que os he hablado” (Juan 15: 3). Haciendo referencia a esto cuando alguien se le acercó y le dijo en medio de la multitud “… Tu madre y tus hermanos están aquí, y quieren verte, Jesús le respondió: “… Mi madre y mis hermanos son los que oyen la palabra de Dios y la ponen por obra” (Lucas 8:19-21). Nos damos cuenta la manera como el Espíritu Santo obra en nosotros, y comienza desde que oímos la Palabra de Dios y la recibimos, es decir, la creemos. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La fe es lo que permite que el Espíritu Santo transforme nuestra vida mundana en una vida agradable a Dios, ya que el que cree de todo corazón, siempre estará dispuesto a obedecer, por eso Jesús dijo “mi madre y mis hermanos son los que oyen la palabra de Dios y la ponen por obra”, es decir, la obedecen, y nadie puede obedecer a Dios si no cree a lo que Él dice, de ahí que el Espíritu de la fe es la obediencia. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La Palabra de Dios es suficientemente poderosa para transformar la mente de una persona y llenarla de buenos pensamientos, que finalmente son llevados por la obra del Espíritu Santo, a través de la fe de la persona a la obediencia a Cristo; si yo entiendo la obra del Espíritu Santo a través de la Palabra, dejaré de luchar inútilmente con mis propias fuerzas por sobreponerme al pecado y mantenerme perseverante en el camino de salvación, ya que es directamente a través de este maravilloso instrumento, la espada del Espíritu, que Dios hace su obra en mí. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En (Efesios 5:25-26), en la analogía que el apóstol Pablo hace de la relación de Él con su Iglesia y lo que es el matrimonio, nos dice “Maridos, amad a vuestras mujeres, así como Cristo amó a la iglesia, y se entregó así mismo por ella, para santificarla, habiéndola purificado en el lavamiento del agua por la palabra”.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En (Santiago 1:18). El Señor nos dice: “Él, de su voluntad, nos hizo nacer por la palabra de verdad, para que seamos primicias de sus criaturas”, nos podemos dar cuenta apreciados hermanos, cómo hay un proceso de comienzo a fin, a través de la Palabra, la presencia de ella es infaltable en nuestra vida, es permanente, activa, poderosa y definitiva.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En la vida del Hijo de Dios, la obra del Espíritu Santo a través de la Palabra está presente de comienzo a fin; note usted cómo Santiago nos hace mención de ese maravilloso comienzo en nuestro caminar con Dios, “…Nos hizo nacer por la palabra de verdad…”</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>¡Oh!, qué maravillosa verdad es saber que Dios ha dispuesto a nuestro favor su Palabra, la cual nos debe guiar siempre y ser nuestra compañera de viaje permanente, en este caminar que llevamos a la vida eterna, es infaltable en nuestras vidas.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El apóstol Pablo nos exhorta en (Colosenses 3:16). “la palabra de Cristo more en abundancia en vosotros… ” observe que dice: “more”, es decir, que habite, que viva, no se trata de simplemente oír la Palabra de Dios y dejarla pasar de largo sino de abrigarla en nuestro corazón, en nuestra mente; en (Apocalipsis 1: 3). Juan el teólogo nos dice: “Bienaventurado el que lee, y los que oyen las palabras de esta profecía, y guardan las cosas en ella escritas; porque el tiempo está cerca”, en este pasaje el Señor nos está hablando de tres aspectos importantes:
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El primero tiene que ver con leer la Palabra, pero el leer al que hace referencia aquí tiene que ver con estudiar y comprender, pues no se trata simplemente de leer por ojear sino escudriñando la Escritura, indica que debemos ir más allá de la simple lectura.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El segundo aspecto, es oír, pero no se trata de un oír de manera descuidada, sin prestar atención, cómo fue el oír de Saúl que finalmente por eso fue desechado, el profeta lo amonestó fuertemente de parte de Dios diciéndole que ciertamente el obedecer es mayor que los sacrificios y el prestar atención que la grosura de los carneros; nos damos cuenta ahí que Saúl fue desechado ciertamente por desobedecer a Dios, pero, ¿por qué desobedeció a Dios? Y la respuesta es simple, por no prestar atención a las indicaciones que Dios le estaba dando a través del profeta. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Lo tercero que vemos en el pasaje de apocalipsis, es la importancia de guardar las cosas que oímos y que leemos de parte de Dios, y ¿para qué guardamos las palabras de Dios?, la respuesta es sencilla, para que la palabra de Cristo more en abundancia en nosotros, es importante entonces que la palabra de Dios no simplemente “nos visite” por decirlo de alguna manera, cuando ocasionalmente la escuchamos en los cultos, o cuando ocasionalmente la leemos, sino que al oírla o escucharla tengamos una actitud de sencillez, humildad y sobre todo de fe para abrigarla en nuestra mente y corazón, de manera que se quede con nosotros, ya que a diario la necesitamos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Finalmente vemos, cómo el Señor nos dice en (1 Pedro 1:23-24). “siendo renacidos, no de simiente corruptible, sino de incorruptible, por la palabra de Dios que vive y permanece para siempre. Porque: Toda carne es como hierba, Y toda la gloria del hombre como flor de la hierba. La hierba se seca, y la flor se cae; más la palabra del Señor permanece para siempre”.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Apreciados hermanos, esta es una batalla que libramos día a día las veinticuatro horas sin descanso, pero ánimo, no estamos solos, Dios está con nosotros y nos ha dado su Palabra, el Señor nos asegura en el Evangelio (Juan 6: 63) “… las palabras que Yo os he hablado son espíritu y son vida”,  si todo esto es verdad como en efecto lo es, debemos con urgencia atender a la Palabra de Dios, darle entrada permanente en nuestra vida para que como ya dije con anterioridad no simplemente la escuchemos por ocasiones en el culto, o cuando la leemos, sino para que ella habite abundantemente en nosotros, el apóstol Juan en (1 Juan 2: 14), dice “Os he escrito a vosotros, padres, porque habéis conocido al que es desde el principio. Os he escrito a vosotros, jóvenes, porque sois fuertes, y la palabra de Dios permanece en vosotros, y habéis vencido al maligno”, podríamos parafrasear este pasaje de la siguiente manera: jóvenes habéis vencido al maligno porque soy fuertes, pero ¿cuál es la razón de vencer? ¿Por qué sois fuertes? ¿Porque sois jóvenes? ¡No! Habéis vencido al maligno porque la Palabra de Dios permanece en vosotros. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Vicente Arango Varela. Director de Misiones Extranjeras
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>



<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA… PREDICA A TIEMPO Y FUERA DE TIEMPO</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Te encarezco delante de Dios y del Señor Jesucristo, que juzgará a los muertos en su manifestación y en su reino, que prediques la palabra; que instes a tiempo y fuera de tiempo; redarguye, reprende, exhorta con toda paciencia y doctrina. Porque vendrá tiempo cuando no sufrirán la sana doctrina, sino que, teniendo comezón de oír, se amontonarán maestros conforme a sus propias concupiscencias, apartarán de la verdad el oído y se volverán a las fábulas” (2 Timoteo 2:1-4).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Predicar a tiempo y fuera de tiempo</strong></p>
<p  style='padding-top: 0.7em; font-size: 0.7em;'><strong>Introducción</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Una y otra vez el mundo es bombardeado con mensajes que ofrecen esperanza, pero por encima de todos los mensajes y todas las esperanzas, hay una que es la que el hombre necesita, que sobrepasa a todas combinadas. Es el mensaje de la Palabra de Dios; la Palabra de Dios es la única esperanza duradera para el hombre.</p>
<p  style='padding-top: 0.7em; font-size: 0.7em;'><strong>¿Cómo predicar?</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>A. Porque Dios juzgará a vivos y muertos.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>B. El Señor aparecerá en su manifestación, se refiere a la segunda venida de Cristo; en su Reino, se refiere al reino milenial que será para siempre. Pablo habla de cinco imperativos.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>1. Predicar. Porque este es el método que Dios escogió para salvar a los hombres. Predicar la Palabra no es exponerla simplemente o enseñarla sistemáticamente, sino darla como un mensaje que Dios ordena a un servidor para ello, 2 Corintios 5:20. Las gentes se agolpaban, no tanto para oír un predicador sino para oír la Palabra de Dios, Lucas 5:1, 8:1. Lo que Cristo predicaba y enseñaba, era la Palabra de Dios, Juan 17:6, 14, 17. Pablo dijo que su mensaje era conforme a la Escrituras, 1 Corintios 15:1-11. Predicar conforme a las Escrituras no es cuestión de charlas, ni reflexiones, ni de vanas palabrerías; la Iglesia no está para ser entretenida sino para ser instruida. Algunos predicadores consideran que la Iglesia hay que entretenerla con historias, chistes, jocosidades, metáforas, testimonios que en muchos casos no son ciertos, que solo distraen y entretienen, pero no edifican en nada.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Un predicador decía que vendrán días en que en lugar de un pastor estar enseñando a ovejas, habrá un payaso entreteniendo cabras. La enseñanza de la sana doctrina está siendo reducida a la mínima expresión, mientras progresan en la misma medida otras cosas que, aun siendo aptas para el culto, no son en modo alguno sustitutivas de la exposición bíblica.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La corriente actual trata de fundamentar el culto en la alabanza de los creyentes, enseñando verdades a medias que no dejan de ser mentiras peligrosas; que la alabanza es el trono sobre el cual Dios manifiesta su presencia en el culto, olvidándose que la alabanza no es otra cosa que la respuesta del pueblo a la voz de Dios. Es la Palabra y no otra cosa la que debería abrir el culto cristiano. El pueblo de Dios se reúne para oír lo que Dios tiene que decirle y no para decirle a él lo que desea Dios de nosotros. No es el pueblo el que invita a Dios para estar en el culto, sino justamente lo contrario, es Dios quien convoca a su pueblo para que acudan a alabarle. Lo que convenció a las gentes no fue el ruido de la alabanza, ni los aplausos ni el ruido estridente de los instrumentos que se usan hoy en las iglesias sin ningún control. Fue la predicación de la Palabra lo que convenció a la gente. Hechos 2:37-42, 3:19-21, 8:12, 10:43-47, 19:1-5. Ese fue el mensaje apostólico que revolucionó al mundo de entonces   y que no puede cambiar ahora.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>2. Instar. Otro imperativo, nos enseña que el predicador hace necesario instar, que quiere decir venir, llegar, aparecer, acercarse, en la voz activa, también quiere decir, arremeter, instar, insistencia; por eso debe hacerlo a tiempo y fuera de tiempo, no se trata de ser inoportuno, sino de aprovechar toda oportunidad. “Aprovechando bien el tiempo…” (Efesios 6:16).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>3. Redargüir. Otro imperativo que tiene el significado de convencer, redargüir, poner en evidencia. La tarea de redargüir es una operación del Espíritu en la aplicación de la Palabra, Hebreos 4:12-13. No habrá actividad de convicción si no hay exposición de la Escritura, 2 Timoteo 3:16, Nehemías 8:8-9.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>4. Reprender. Otro imperativo, establece el mandamiento, esto significa encargar, reconvenir, reprender, se traduce en ocasiones por encargar rigurosamente; esto se refiere a quienes se desvían de la verdad. En ocasiones se reprende a los creyentes por no guardar estrictamente las formas tradicionales del culto, las costumbres de la iglesia, la música, las canciones, el modo de practicar las ordenanzas de la organización que son solo religión y no doctrina bíblica. Por eso hay que reprender solo con la Palabra de Dios.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>5. Exhortación. Equivale a alentar, amonestar, confortar, animar, consolar; esto es, dar aliento de Dios a la vida cristiana. Aquí hay dos ingredientes importantes que son:
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>a. Paciencia. Literalmente longanimidad, que pone de manifiesto la condición tolerante   y paciente, que no se rinde ante las circunstancias ni sucumbe ante la prueba. Es una virtud distintivamente cristiana, Efesios 4:2, Romanos 2:4.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>b. Doctrina. Cualquier exhortación que no descanse en la Escritura, no es una exhortación correcta y espiritual, no se trata de exhortar, reprender, amonestar con algo de paciencia y doctrina, sino con toda, es decir, algo que no se debilita en el tiempo.
</p>
<p  style='padding-top: 0.7em; font-size: 0.7em;'><strong>¿Porque qué predicar?</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>1. Vendrá tiempo cuando no sufrirán la sana doctrina, es decir, no soportarán, aguantarán, tolerarán, sufrirán. Pablo dice que no tolerarán la sana doctrina, se trata de un tiempo de evidente desprecio por las demandas en la Sagradas Escrituras; tiempo en que no querrán vivir conforme a la Biblia. La razón por la que no atenderán o soportarán la buena enseñanza, es a causa de que tendrán comezón de oír; el sentido del verbo es el rascar, cosquillear. Estas gentes aceptarán oír solo aquellas cosas que les satisfaga o acaricie sus oídos, el anhelo de ellos es elegir predicadores que les prediquen lo que quieren oír y no lo que necesitan; Dios amonestó a Israel por estas cosas. Leer Jeremías 5:30-31, Ezequiel 33:32.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>2. Se apartarán de la verdad y se volverán a las fábulas. Lamentablemente hay muchos que desean oír novedades cada día y que se cansan de lo que es verdadero y cierto, religiones que solo buscan satisfacer el ego de sus oyentes, el mal llamado Evangelio de la prosperidad; Evangelio sin arrepentimiento, sin santidad y demás. 2 Timoteo 3:16, 1 Timoteo 4:13-16, Apocalipsis 1:3. Apartarán el oído de la verdad, no resistirán la sana doctrina apostólica. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>3. 
Se amontonarán maestros que conforme a sus propias rechazarán la verdad después de haberla conocido.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El desprecio por la Palabra de Dios, es la tendencia del mundo de hoy; estas cosas nos muestran, nos indican un tiempo de gran apostasía en las iglesias modernas. Tenga en cuenta los siguientes capítulos de la Biblia, Hechos 20:28-30, 1 Timoteo 4:1-5, 2 Timoteo 3:1-9, 2 Pedro 2, Judas 1. Estas Escrituras nos indican las señales que preceden el arrebatamiento de la Iglesia, que son de tipo moral, espiritual y doctrinal. Es lo que hoy se ve en las iglesias.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Reflexión final
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>a. Los creyentes quienes quiera que sean, deben vivir conforme a las Escrituras. Timoteo abrazó las Escrituras desde niño.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>b. Las Escrituras hacen sabia a una persona para ser salva.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>c. Las Escrituras son inspiradas por Dios, incluido todo el Antiguo Testamento.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>d. El Espíritu Santo es el Autor de las Escrituras. 2 Pedro 1:19-21. Los escritores del Antiguo Testamento aseveran que la Biblia es la Palabra de Dios, se refieren a las Escrituras como la Palabra de Dios, Salmos 119:1.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>e. El Salmo 119 presenta las Sagradas Escrituras como la Ley de Dios, los Testimonios de Dios, los Caminos de Dios, los Mandamientos de Dios, los Preceptos de Dios, los Estatutos de Dios, los Juicios de Dios, la Palabra de Dios, los Dichos de Dios.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>f. Jesucristo afirmó que la Biblia es la Palabra de Dios, Lucas 24:44-45.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>g. Las Escrituras son útiles para enseñar, redargüir, corregir, perfeccionar al hombre.     Recuerda esto, lo que lees, lo que ves, lo que oyes, lo que hablas, son las autopistas que llevan a la mente y que afectan al hombre para bien o para mal. La gracia de Dios sea con todos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Jairo Antonio Marín Leiva. Pastor IPUC</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>




<p style='font-size: 2em; text-align: center;'><strong>PREPARADOS PARA TODA BUENA OBRA
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
 “Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia, a fin de que el hombre de Dios sea perfecto, enteramente preparado para toda buena obra” 2 Timoteo 3:16-17
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Consideración
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Las buenas obras no salvan, pero todo salvo debe realizar buenas obras. La vida cristiana no consiste en hacer algo que convenga y un montón de cosas que no agraden a Dios. Al ser afectado todo el ser, será afectado el hacer. “No puede el buen árbol dar malos frutos, ni el árbol malo dar frutos buenos” (Mateo 7:18).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>No es normal que los árboles actúen o se comporten de esa manera, cada uno mostrará de que está hecho, y eso lo reflejan sus frutos. En este sentido debe haber un equilibrio entre lo que se es, se piensa y se hace, sin esas condiciones no se podrá ser coherente. El Dios de esta Iglesia es muy coherente y sus hijos deben serlo también.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Él dijo: “… Yo soy la luz mundo; el que me sigue, no andará en tinieblas…” (Juan 8:12). Y verdad que su luz nos ha alumbrado…
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Él dijo: “…Yo soy la resurrección y la vida…” (Juan 11:25). Y verdad, porque resucitó a un hombre de cuatro días de muerto, se levantó Él mismo de la tumba y levantará a todos los que mueren en Cristo.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Ambiente en el que se mueve la Palabra de Dios
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La Palabra de Dios se mueve en un escenario de debilidades e imperfecciones humanas, donde el hombre sin Dios se ha acostumbrado a vivir de cualquier manera, o sea se ha apoyado en sus propios conceptos y opiniones.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El problema radica en que el hombre quiere ser el arquitecto de su propia vida, cuando no se ha dado cuenta que se le perdió el plano. Es por eso que la Biblia dice: “No seas sabio en tu propia opinión…” (Proverbios 3:7).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En otro pasaje dice algo que es muy grave con respecto al mal actuar del hombre, “Profesando ser sabios, se hicieron necios” (Romanos 1:22). Al irse tras sus necedades fue cuando cambiaron la gloria de Dios por las imágenes, además de envanecerse en sus razonamientos y por eso su necio corazón fue entenebrecido.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La Palabra, entonces aparece como esa herramienta fundamental para realizar un trabajo de perfección. Por eso, ella es útil para…enseñar, para… redargüir, para …corregir, para… instruir en justicia, con la finalidad, con el propósito de que el hombre de Dios sea perfecto y preparado para toda buena obra.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hay una meta trazada con nosotros y es de presentar perfecto en Cristo Jesús a todo hombre, por eso que el texto bíblico dice, “hasta que todos lleguemos a la unidad de la fe y del conocimiento del Hijo de Dios, a un varón perfecto, a la medida de la estatura de la plenitud de Cristo” (Efesios 4:13).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>¿Podrá un pecador convertirse en santo?</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Convertir un pecador en santo no es tarea fácil, ni tampoco se hace de la noche a la mañana. Pero Dios a través de su Palabra, tiene la capacidad de hacerlo y además de sostenerlo como un testimonio de su poder y su grandeza.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>No hay una palabra que brinde tanto beneficio al hombre, como lo es la Palabra de Dios…ella… limpia, ilumina, guía, transforma y perfecciona. No lo dice la iglesia, no lo dicen los pastores, lo dice el Santo, y nosotros lo reafirmamos, porque somos testigos de su gran operación en nuestras vidas.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Mas el Dios de toda gracia, que nos llamó a su gloria eterna en Jesucristo…él mismo os perfeccione, afirme, fortalezca y establezca” (1 Pedro 5:10).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“La ley de Jehová es perfecta, que convierte el alma; el testimonio de Jehová es fiel, que hace sabio al sencillo” (Salmos 19:7).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Según el pensamiento Divino revelado en estos textos, esa es la condición que necesitamos para poder estar preparados para toda buena obra. Por eso no se concibe a un buen cristiano siendo mal esposo, ni mal padre, ni mal hijo, ni mal trabajador, ni mal estudiante y mucho menos un mal cristiano; la idea entonces, es que podamos mostrar a Cristo y su obra en nosotros en cada acción de la vida.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Mas a Dios gracias, el cual nos lleva siempre en triunfo en Cristo Jesús, y por medio de nosotros manifiesta en todo lugar el olor de su conocimiento” (2 Corintios 2:14).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Lo que Cristo ha hecho con nosotros, primero, nadie lo haría y aunque quisiera hacerlo no podría; y segundo, ha sido una obra tan perfecta que nosotros mismos hemos quedados estupefactos ante tan maravilloso cambio. ¡A Él la gloria! Esta obra de perfección tiene un comienzo y tendrá un final, y todo lo hace Él mismo. “Estando persuadido de esto, que comenzó en ustedes la buena obra, la perfeccionará hasta el día de Jesucristo” (Filipenses 1:6).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hoy podemos decir que, sí vale la pena vivir para Dios, sí es valioso contar con un Libro Sagrado que ha permitido un cambio profundo en nuestras vidas, de tal forma que se ve reflejado en cada accionar. Podemos vivir en cualquier parte del mundo, podemos estar dentro de cualquier cultura, podemos movernos en cualquier sociedad y mostrar nuestras buenas obras.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Así alumbre vuestra luz delante de todos los hombres, para que vean vuestras buenas obras, y glorifiquen a vuestro Padre celestial que está en los cielos” (Mateo 5:16).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Dios nos ha colocado en este mundo como su tesoro más preciado y quiere que a través de nuestra conducta, con nuestro comportamiento, mejor dicho, con toda nuestra vida mostremos que esto de la vida cristiana no es un mero acto religioso de Cristo en nosotros, sino que es un cambio operado en nuestras vidas, desde adentro hacia afuera y desde arriba hacia abajo.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Sigamos sumergidos en su Palabra, dejémonos llevar por el río de sus razonamientos, permitamos que la llovizna celestial irrigue nuestras vidas, de tal forma que podamos ver lo que vio el salmista en (Salmos 1: 3).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Será como árbol plantado junto a corrientes de aguas, que da su fruto en su tiempo, y su hoja no cae; y todo lo que hace, prosperará”.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Willman Marín Parra. Pastor IPUC
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>


<p style='font-size: 2em; text-align: center;'><strong>Preparados para toda a boa obra
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Toda a escritura é divinamente inspirada e proveitosa para ensinar, para repreender, para corrigir e para instruir em justiça para que o homem de Deus seja perfeito e perfeitamente instruído para toda a boa obra”. (2 Timóteo 3:16-17).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Consideração</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>As boas obras não salvam, mas todo aquele que é salvo deve realizar boas obras. A vida crista não consiste em fazer algo que convenha e uma quantidade de coisas que não agradem a Deus. Ao ser afetado todo o ser, será afetado todo o fazer. Não pode a árvore boa dar maus frutos; nem a árvore má dar frutos bons. (Mateus 7: 18)
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Não e normal que as arvores actuem ou se comportem dessa maneira, cada uma mostrarar do que esta feito,e isso e refelectido em seus frutos. Neste sentido deve haver um equilibrio entre o que se e ,se pensa e se faz. Sem essas condições não se poderá  ser coerente.O Deus desta igreja é muito coerente e seus filhos devem sê-lo também.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Ele disse; Eu sou a luz do mundo; quem me segue não andará em  trevas …(João 8:12). E a verdade é que a sua luz iluminou-nos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Ele disse: …Eu sou a ressurreição e a  vida …(João 11:25). E a verdade é que ressuscitou a um homem depois de estar quatro dias morto, se levantou a si mesmo da cova e levantará  a todos os que morrem em Cristo.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>O ambiente no qual se move a palavra de Deus.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>A Palavra de Deus se move num cenário de debilidades e imperfeições humanas, onde o homem sem Deus se acostumou a viver de qualquer maneira, ou seja, se apoiou em seus próprios conceitos e opiniões.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>O problema está em que o homem quer ser o arquiteto de sua  própria vida, quando  se deu conta de que se lhe perdeu o plano. É por isso que a Biblia diz: “Não sejas sábio a teus próprios  olhos…” (Provérbios 3:7).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Noutra passagem diz algo que é muito grave com respeito ao mal actuar do homem, “Dizendo-se sábios tornaram-se loucos” .(Romanos 1:22). Ao ir atrás das suas loucuras, mudaram a glória de Deus por imagens, além de encherem-se de orgulho em seus raciocínios e por isso seus insensatos corações se entenebreceram.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>A palavra, aparece, então, como essa ferramenta fundamental para realizar um trabalho de perfeição. Por isso, ela é útil para…ensinar,para…repreender,para…corrigir,para…instruir em justiça, com o propósito ou a finalidade de que o homem de Deus seja perfeito e perfeitamente instruido para a toda a boa obra.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Há uma meta traçada conosco e é de apresentar a todo o homem perfeito em Cristo Jesus, por isso que o texto Bíblico diz: ”Até que todos cheguemos a unidade da fé, e ao conhecimento do Filho de Deus, a homem perfeito, a medida da estatura completa de Cristo”. (Efésios  4:13).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Poderá um pecador converter-se num santo?
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Converter um pecador em santo não é tarefa fácil, e  nem tão pouco sucede da noite para a manhã. Mas Deus através da sua Palavra,  tem a capacidade de fazê-lo e mais do que isso, tem a capacidade de sustê-lo como um testemunho do seu poder e da sua grandeza. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Não há uma palavra que proporcione tanto benefício ao homem, como a Palavra de Deus o faz  …ela…limpa, ilumina, guia, transforma e aperfeiçoa. Não o diz a igreja, não o dizem os pastores, o diz o Santo, e nós o reafirmamos, porque somos testemunhos da sua grande operação em nossas vidas.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“E o Deus de toda a graça, que em Cristo Jesus nos chamou à sua eterna glória, depois de havermos padecido um pouco, Ele mesmo vos aperfeiçoe, confirme, fortifique e estabeleça. ”(1 Pedro 5:10).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“A lei de Deus é perfeita, e refrigera a alma; O testemunho do Senhor é fiel e dá sabedoria aos símplices.” (Salmos 19:7).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Segundo o pensamento Divino revelado nestes textos, essa é a condição que necessitamos para poder estar preparados para toda a boa obra. É por isso que um bom cristão  não se concebe  sendo um mau esposo, nem mau pai, nem mau filho, nem mau trabalhador, nem mau estudante e muito menos um mau cristão; a ideia então, é que possamos mostrar a Cristo e sua obra em nós, em cada ação da nossa vida.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“E graças a Deus, que sempre nos faz triunfar em Cristo, e por meio de nós manifesta em todo o lugar a fragrância do Seu conhecimento”  .(2 Coríntios 2:14).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>O que Cristo fez conosco, primeiro, ninguém o faria e ainda que quisesse não poderia fazê-lo; e segundo, foi uma obra tão perfeita que nós mesmos ficamos estupefatos diante de uma mudança tão maravilhosa. A Ele seja toda a Glória! Esta obra de perfeição tem um começo e terá um fim, e é Ele quem faz tudo. “Tendo por certo isto memso que, Aquele que em vós começou a boa obra a aperfeiçoará até   ao dia de Jesus Cristo”. (Filipenses 1:6).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hoje podemos dizer que, sim vale a pena viver para Deus, que sim é valioso contar com o Livro Sagrado que permitiu uma mudança profunda em nossas vidas, de tal forma que se vê refletido no nosso agir. Podemos viver em qualquer parte do mundo, podemos estar dentro de qualquer culltura, podemos mover em qualquer sociedade e mostrar as nossas boas obras. “Assim resplandeça  a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai, que está nos céus.” (Mateus 5:16).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Deus nos colocou neste mundo como seu tesouro mais apreciado e quer que através da nossa conduta, com nosso comportamento, ou melhor  dizendo, com toda a nossa vida mostremos que isto da vida cristã não é um mero ato religioso de Cristo em nós, senão que é uma mudança operado em nossas vidas, de dentro para fora e de cima para baixo.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Sigamos submergidos em sua Palavra, deixemos levar pelo rio de seus pensamentos, permitamos que o chuvisco celestial irrigue nossas vidas de tal forma que possamos ver o que vê o salmista. “Pois será como a árvore plantada junto a ribeiros de águas, a qual dá o seu fruto no seu tempo; as suas folhas não cairão, e tudo quanto fizer prosperará.” (Salmos 1:3).

</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por: Willman Marin  Parra. Pastor IPUC</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>



<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA… VARÓN Y HEMBRA LOS CREÓ
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Porque toda casa es hecha por alguno; pero el que hizo todas las cosas es Dios” (Hebreos 3:4). Una casa no existe por casualidad, su diseño y construcción apuntan al diseñador y constructor.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En cierta ocasión Jesús fue confrontado acerca de la relación entre el hombre y la mujer. Los fariseos discutían sobre las creencias culturales del divorcio, Mateo 19:3-9, Jesús llevó la discusión a un nivel más alto; Él les dijo que necesitaban ver más allá de sus prácticas culturales, sociales y las deformaciones ocasionadas por el pecado. Ellos como nosotros, necesitamos entender la intención original y sublime de Dios para con el varón y la mujer. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Es necesario entender que Dios es el inicio de todo. “En el principio Dios…”. En Él fue el origen de todo, lo visible y lo invisible fue creado por Él.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'> “Y creó Dios al hombre a su imagen, a imagen de Dios lo creó; varón y hembra los creó” (Génesis 1:27).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'> “Varón y hembra los creó; y los bendijo, y llamó el nombre de ellos Adán, el día en que fueron creados” (Génesis 5: 2).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Dios escogió el nombre común “Adán” para referirse al varón y hembra, al elegir la palabra “Adán” como un nombre común para ambos, resaltando así la profunda unidad e igualdad que existe entre ellos, la mujer proviene del hombre y no es independiente de él. Ambos existen para contar la historia de Dios. El nombre común “Adán” resalta que la historia no tiene que ver con el varón o la mujer; está señalando al postrer “Adán”, Jesucristo, cuya obra salvadora está dirigida a ambos por igual.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La palabra Adán, proviene del hebreo adamah y su significado es tierra, es un término genérico para los seres humanos, ya sea varón o hembra. Después de la caída de la humanidad, ADÁN (con mayúscula) es el nombre propio para el primer varón, anticipando a Jesucristo, quien es “el postrer ADÁN”, Él vino a redimir a “Adán” (humanidad) “…para que Él sea el primogénito entre muchos hermanos” (Romanos 8:29 LBLA).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hombres y mujeres, pueden rastrear sus inicios al polvo de la tierra, receptores de la imagen de Dios, tienen el mismo honor y valor. Dios les hizo portadores de su diseño masculino y femenino. Lo que hace al hombre y a la mujer distinguirse sobre el resto de la creación es su igualdad en honor, valor, dignidad, personalidad, respeto mutuo, armonía, complementación y destino; estos atributos fueron otorgados a aquellos creados a su imagen y semejanza.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Al ser introducido el pecado, ellos necesitaban de un Salvador. La buena noticia del Evangelio es que están representados por el postrer ADÁN, Jesucristo. Los hombres y mujeres redimidos conforman la Iglesia que Él ama, la novia por la que Él se sacrificó, “a fin de presentársela a sí mismo, una iglesia gloriosa, que no tuviese mancha ni arruga ni cosa semejante, sino que fuese santa y sin mancha” (Efesios 5:27).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La humanidad fue creada para reflejar el carácter de nuestro Salvador, no para ser un lienzo en blanco y moldeable ante la corriente de este mundo, el engañador ha hecho uso de mentiras para desdibujar el diseño original del hombre y la mujer, logrando que olvidemos los parámetros Divinos destinados a reflejar la relación entre el Creador y su creación. Dios nos hizo diferentes, de igual valor y dignidad, a fin de complementarnos el uno al otro. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Al hombre lo llamó a cultivar, proteger, a obedecer su Palabra, a que fuera un dador, y a la mujer la llamó a ser receptora, cuidadora, a ser ayuda imprescindible, estas cualidades se complementan al momento de formar una familia, estas características que el mundo ha tratado de volver diferencias que nos separen, son en realidad hilos que unen ese cordón de tres dobleces con el objetivo de construir una familia sana emocionalmente, que pueda ser luminar en un mundo plagado de mentiras.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Desde el inicio el plan de la serpiente fue separar al hombre y la mujer, esperando que Eva estuviera sola para inducirla a probar del fruto, para luego inducir a Adán a levantar el dedo acusador contra su esposa, esa misma estrategia la ha usado a través de los siglos apoyándose en nuestras diferencias para dividirnos pues él sabe que “…Uno solo puede ser vencido, pero dos pueden resistir (Eclesiastés 4:12 NVI).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Esta gran mentira nos ha llevado a una guerra de géneros donde los hombres tratan a las mujeres como seres inferiores, o viceversa. La manipulación, la rivalidad, las palabras que degradan y un comportamiento abusivo constituyen un ataque a la misma imagen de Dios. (Santiago 3:9-10) nos dice: “maldecimos a los hombres que están hechos a la semejanza de Dios”, pero concluye diciendo que “esto no debe ser así” </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El enemigo sabe que al desdibujar el diseño de Dios para la familia, corrompe los propósitos de Dios para la raza humana, “Por tanto, dejará el hombre a su padre y a su madre, y se unirá a su mujer, y serán una sola carne” (Génesis 2:24).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>No olvidemos que Jesucristo es la imagen perfecta de Dios “Él es la imagen del Dios invisible…” (Colosenses 1:15). Es por medio de Jesucristo que la imagen de Dios se puede restaurar “para que fuesen hechos conformes a la imagen de su Hijo” (Romanos 8:29). Ahora en Cristo podemos reflejar y manifestar la imagen de Dios. Solo Él puede contestar a preguntas como estas: ¿Quién eres? ¿Cuál es tu propósito? ¿Por qué has sido creado?</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Si la respuesta a estas preguntas nos lleva a Dios, nuestra existencia cobra sentido, como fieles de Dios que viven en la tierra con el fin de glorificar a su creador (Isaías 43:7) dice: “todos los llamados de mi nombre; para gloria mía los he creado, los formé y los hice”.  Fuimos creados para reflejar su gloria, “Le has hecho poco menor que los ángeles, y lo coronaste de gloria y de honra” (Salmos 8:5). Los hombres reflejan la fuerza, el amor y la abnegación de un Dios Redentor; la mujer la sensibilidad, la gracia y la belleza de una novia redimida y el matrimonio como el pacto que une a Cristo y su esposa.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En el relato de la creación observamos que Dios no solo crea y da vida a la humanidad, sino que se toma su tiempo para formar en ellos una clara identidad como hombre y mujer “Entonces Jehová Dios formó al hombre del polvo de la tierra… ” (Génesis 2:7); esta diferencia entre crear y formar, también la podemos encontrar en el pasaje bíblico: “…todos los llamados de mi nombre; para gloria mía los he creado, los formé y los hice”  (Isaías 43:7).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Dios sabe que el enemigo ha robado nuestra identidad, por eso Él extiende su mano con el deseo de restaurar en la humanidad el diseño original, de la misma manera en la que de un Jacob mentiroso, Dios forma y da vida a un Israel redimido, “Mas ahora, así dice el Señor tu Creador, oh Jacob, y el que te formó, oh Israel: No temas, porque yo te he redimido, te he llamado por tu nombre; mío eres tú” (Isaías 43:1 LBLA). Así mismo Dios busca restaurar en la humanidad la correcta identidad de hombre y mujer, la cual nos lleva a entender el gran amor de Dios por los hombres.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Eduardo Tejada. Pastor IPUC
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>




<p style='font-size: 2em; text-align: center;'><strong>COMO DIZ A ESCRITURA…HOMEM E MULHER OS CRIOU</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Porque toda a casa é edificada por alguém, mas quem edificou todas as coisas é Deus. (Hebreus 3:4).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Em certa ocasião Jesus foi confrontado acerca da relação entre o homem e a mulher. Os fariseus discutiam sobre as crenças culturais do divórcio (Mateus 19:3-9).  Jesus levou a discussão a um nível mais alto; Ele disse-lhes que necessitavam ver mais além das suas práticas culturais, sociais e as deformações provocadas pelo pecado. Nós  como eles, necessitamos entender a original e sublime intenção de Deus para com o homem e a mulher.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>E necessário entender que Deus é o início de tudo. “No princípio Deus…” Nele foi a origem de tudo, o visível e o invisível foram criados por Ele.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“E criou Deus o homem a sua imagem, a imagem de Deus o criou;  homem e mulher os criou” (Génesis 1:27).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Homem e mulher os criou; e os abençoou e chamou o seu nome Adão, no dia em que foram criados” (Génesis 5:2).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Deus escolheu o nome comum “Adão” para referir-se ao homem e a mulher. Ao eleger a palavra “Adão” como um nome comum para ambos, ressaltou assim a profunda unidade e igualdade que existe entre eles. A  mulher provem do homem e não é independente dele. Ambos existem para contar a história de Deus. O nome comum “Adão” ressalta que a história não tem a  ver com o homem ou a mulher; está assinalando ao último “Adão”, Jesus Cristo, cuja obra salvadora está dirigida a ambos de  igual forma.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>A palavra Adão  provem do hebreu “Adamah” e seu significado é terra, é um termo genérico para os seres humanos, já sejam homem ou mulher. Depois da queda da humanidade, ADÃO (com maiúscula) é o nome próprio para o primeiro homem, antecipando a Jesus Cristo, quem é “o último ADÃO”, Ele veio a redimir “Adão”(humanidade) “…a fim de que Ele seja o primogénito entre muitos irmãos”(Romanos 8:29).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Homens e mulheres,  podem traçar os seus primórdios até ao pó da terra, receptores da imagem de Deus, têm a mesma honra e valor. Deus os fez portadores do seu projeto masculino e femenino. O que faz ao homem e a mulher distinguir-se sobre o resto da criação é sua igualdade em honra, valor, dignidade, personalidade, respeito mútuo, harmonia, complementaridade e destino; estes atributos foram concedidos àqueles criados a sua imagem e semelhança.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Ao ser introduzido o pecado, eles necessitavam de um Salvador. A boa notícia do evangelho é que eles estão representados pelo último ADÃO - Jesus Cristo.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Os homens e mulheres redimidos constituem a igreja que Ele ama,  a noiva pela qual Ele se sacrificou, “...para a apresentar a si mesmo igreja gloriosa, sem mácula, sem ruga nem coisa semelhante, mas santo e irrepreensível .” (Efésios 5:27).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>A humanidade foi criada para refletir o carater do nosso salvador. Não para ser  uma tela branca e maleável diante da corrente deste mundo. O enganador fez uso de mentiras para borrar o projeto original do homem e a mulher, conseguindo que o homem esquecesse os parâmetros Divinos destinados a refletir a relação entre o Criador e a sua criação. Deus nos fez diferentes, de igual valor e dignidade, a fim de complementar-nos um ao outro.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Ao homem o chamou a cultivar, a proteger, a obedecer a sua Palavra, a que fosse um dador e a mulher a chamou de receptora, cuidadora e ser ajuda imprescindivel. Estas qualidades se complementam no momento de formar uma família, estas características que o mundo tentou devolver as diferenças  que nos separam, são em realidade fios que unem esse cordão de três dobras com o objetivo de construir uma família sã emocionalmente, para que possa ser luz num mundo cheio de mentiras.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Desde o começo o plano da serpente foi separar o homem e a mulher, esperando que Eva estivesse só para induzi-la a provar do fruto, para em seguida induzir a Adão a levantar o dedo acusador contra a sua esposa. Essa mesma estratégia tem usado através dos séculos apoiando-se em nossas diferenças para dividir-nos, pois ele sabe que  “…Um só pode ser vencido, mas dois podem resistir” (Eclesiastes 4:12).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Esta grande mentira nos levou a uma guerra de gêneros  onde os homens tratam as mulheres como seres inferiores, ou vice-versa. A manipulação, a rivalidade, as palavras degradantes e um comportamento abusivo constituem um ataque a mesma imagem de Deus. “Com ela bendizemos a Deus e Pai, e com ela amaldiçoamos os homens feitos a semelhança de Deus. De uma mesma boca  procede  benção e maldição. Meus irmãos, não convém que isto se faça assim”. (Tiago 3:9-10).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>O inimigo sabe que ao borrar o projeto de Deus para a família, corrompe os propósitos de Deus para a raça humana, ”Portanto deixará o homem o seu pai e sua mãe, e apegar-se-á a sua mulher, e serão   ambos uma carne” (Genesis 2:24).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Não esqueçamos que Jesus Cristo é a imagem perfeita de Deus “Ele é a imagem do Deus invisível… ”(Colossenses 1:15). É por meio de Jesus Cristo que a imagem de Deus se pode restaurar “ …Para que fôssemos feitos conforme a imagem de seu Filho…”(Romanos 8:29). Agora em Cristo podemos refletir e manifestar a imagem de Deus. Só Ele pode responder as perguntas como estas: Quem és? Qual é o teu propósito? Por que você foi criado?
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se a resposta a estas perguntas nos leva a Deus, nossa existência faz sentido, como fieis de Deus que vivem na terra com o fim de glorificar ao seu Criador. (Isaías 43:7) diz: ”A todos os que são chamados pelo meu Nome, e os criei para minha glória: eu os formei, e também eu os fiz”. Fomos criados para refletir sua glória. “Pois pouco menor o fizeste do que os anjos, e de glória e de honra os coroaste.” (Salmos 8:5). Os homens refletem a força, o amor e a abnegação de um Deus Redentor; a mulher a sensibilidade, a graça e a beleza de uma noiva redimida e o matrimónio como pacto que une a Cristo e a sua esposa.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>No relato da criação observamos que Deus não só cria e da vida a humanidade, senão que toma o seu tempo para formar neles uma clara identidade como homem e mulher “E formou o Senhor Deus o homem do pó da terra, e soprou em suas narinas o fôlego da vida; e o homem foi feito alma vivente” (Génesis 2:7). Esta diferenca entre criar e formar também a podemos encontrar na passagem Bíblica (Isaias 43:7) que diz :”A todos os que são chamados pelo meu Nome, e os criei para minha glória: eu os formei,e também eu os fiz”.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Deus sabe que o inimigo roubou nossa identidade, por isso Ele estende sua mão com o desejo de restaurar na humanidade o projeto original, da mesma forma na que Jacó mentiroso, Deus forma e dá vida a um Israel redimido “Mas agora, assim diz o Senhor que te criou, ó Jacó, e que te formou ó Israel: não temas porque eu te remi, chamei-te pelo teu nome, tu és meu” (Isaias 43:1). Assim mesmo Deus busca restaurar na humanidade a correta identidade do homem e da mulher, a qual nos leva a entender o grande amor de Deus pelos homens.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por: Eduardo Tejada. Pastor IPUC</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>




<p style='font-size: 2em; text-align: center;'><strong>ÉL ES, EL QUE PRODUCE EL QUERER COMO EL HACER</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“porque Dios es el que en vosotros produce así el querer como el hacer, por su buena voluntad” (Filipenses 2:13).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El apóstol Pablo en la Carta a los Filipenses anima y motiva a la Iglesia a vivir una vida plena en Cristo, el utiliza algunas expresiones en el curso de la epístola, que hacen que los convertidos en Filipos sientan que ellos han encontrado la verdadera fuerza motora de todo cuanto existe; “estando persuadido de esto, que el que comenzó en vosotros la buena obra, la perfeccionará hasta el día de Jesucristo” (Filipenses 1:6). Lo que el apóstol quiere hacer saber con la expresión: “Él es, el que produce el querer como el hacer” es, que nuestra permanencia y todo lo que tiene que ver con una vida cristiana plena en Cristo, no depende de nosotros ni es por nuestra fuerza, ni tiene alguna gloria que nosotros merezcamos, antes bien, como está escrito “No a nosotros, oh Jehová, no a nosotros, Sino a tu nombre da GLORIA…”  (Salmos 115:1). Jesús lo expresó claramente cuando dijo: “…separados de mí nada podéis hacer” (Juan 15:5). Hecho el análisis de lo dicho anteriormente, se puede claramente comparar con un circuito eléctrico, el cual está compuesto por los siguientes elementos que son indispensables para que funcione. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Lo primero que encontramos en este orden es un generador, ese es Jesús, según Pablo. Él es el que produce, genera en nosotros, el “querer como el hacer” a través de un hilo conductor llamado Espíritu Santo,  es  Este el que nos mueve, Juan 16:13; nos guía, Romanos 8:14; nos enseña, Juan 14:26; El que intercede; El que gime, Romanos 8:26; El que nos perfecciona, Filipenses 1:6 y el que al final de la jornada nos transformará en un instante, en un abrir y cerrar de ojos, a la final trompeta; Filipenses 3:21.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Posteriormente encontraremos en este circuito maravilloso el interruptor, que no es otra cosa que la perfecta voluntad de Dios, ella nos santifica, 1 Tesalonicenses 4:3. La voluntad de Dios es agradable y perfecta, Romanos 12:2; y por último  encontraremos el objetivo de este gran proceso, Dios quiere  que cada uno de sus hijos  alumbre por ese poder, esa maravillosa gracia que el Señor Jesús imparte por medio de su Espíritu Santo, llenando e impartiendo dones preciosos por su perfecta voluntad, Mateo 5:16; esto implica permanencia en El Señor Jesús, Juan 15:5. Recordemos lo que dice Jesús; “Separados de mi nada podéis hacer” Juan en el capítulo 15, en los primeros diez versículos describe lo que Jesús claramente habló acerca de la dependencia y permanencia, que el creyente (el pámpano) debe tener de la raíz.  </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>1. El pámpano que no lleva fruto lo quita, Juan 15:1, esto implica que estando en Cristo “el querer como el hacer” se cumple, no es posible una vida sin fruto si permanece en Cristo, el salmista lo dijo más claro aún: “Será como árbol plantado junto a corrientes de aguas, Que da su fruto en su tiempo, Y su hoja no cae; Y todo lo que hace, prosperará” (Salmos 1:3).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>2. El pámpano que sí lleva fruto, lo limpia para que lleve más fruto, Juan 15:1; es claro que es Él, quien produce (nos limpia) para que el hacer sea una realidad. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>3. ¿Cómo se logra? Teniendo dependencia y permanecía. “Yo soy la vid, vosotros los pámpanos; el que PERMANECE en mí, y yo en él, éste lleva mucho fruto; porque separados (dependencia) de mí nada podéis hacer” (Juan 15:5). Entender esto es supremamente importante, no hay nada que el hombre pueda hacer, que le agrade a Dios separado de Él, nada es nada; es indispensable estar en Jesús, el apóstol Pablo constantemente refuerza la idea con la expresión en Cristo, “Más por él estáis vosotros en Cristo Jesús…” (1 Corintios 1:30). “…nos bendijo con toda bendición espiritual en los lugares celestiales en Cristo” (Efesios 1:3). “…creados en Cristo Jesús para buenas obras...” (Efesios 2:10). “De modo que si alguno está en Cristo...” (2 Corintios 5:17). Son muchas más las veces que el apóstol usa esta expresión, para hacer saber que estar en Cristo es la verdadera clave de una vida de éxito.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>4. No permanecer y no depender de Jesús, es seguro fracaso “El que en mí no permanece, será echado fuera como pámpano, y se secará; y los recogen, y los echan en el fuego, y arden” (Juan 15:6). Que deliciosa es la Palabra de Dios, entendida y aplicada a nuestras vidas, bien dijo el Señor: “El espíritu es el que da vida; la carne para nada aprovecha; las palabras que yo os he hablado son espíritu y SON VIDA” (Juan 6:63).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>5. La verdad absoluta, “… Dios es el que en vosotros produce así el querer como el hacer…”  (Filipenses 2:13). Juan ahora nos revela la clave del éxito en palabras de Jesús: “Si permanecéis en mí, y mis palabras permanecen en vosotros, pedid todo lo que queréis, y os será hecho. En esto es glorificado mi Padre, en que llevéis mucho fruto, y seáis así mis discípulos” (Juan 15:7-8). 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>¿Qué se puede concluir entonces de lo dicho por el apóstol Pablo cuando dijo: “Él es el que produce el querer como el hacer”? Que nada es nuestro, que todo es de Dios, Él es la fuente de toda gracia, bien lo ratificó el apóstol al decir: “Por medio de él, Dios creó todo lo que hay en el cielo y en la tierra, lo que puede verse y lo que no se puede ver, y también los espíritus poderosos que tienen dominio y autoridad. En pocas palabras: Dios creó todo por medio de Cristo y para Cristo” (Colosenses 1:16 TLA).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Rodrigo Muñoz. Pastor IPUC
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


<p style='font-size: 2em; text-align: center;'><strong>COMO DICE LA ESCRITURA… LA PALABRA PROFÉTICA MÁS SEGURA</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>'Seguid el amor; y procurad los dones espirituales, pero sobre todo que profeticéis. Porque el que habla en lenguas no habla a los hombres, sino a Dios; pues nadie le entiende, aunque por el Espíritu habla misterios. Pero el que profetiza habla a los hombres para edificación, exhortación y consolación' (1 Corintios 14:1-3).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Cuando hablamos de profecía, de una vez pensamos en los profetas del Antiguo Testamento, hombres que de una forma eventual y espontánea, eran tomados por el  Espíritu de Dios que venía sobre ellos y los tomaba mostrándoles una visión o hablándoles de una forma clara y audible, dándoles un mensaje para el pueblo de Israel, o para el rey o alguien en particular; hombres siervos de Dios que cuando hablaban iban acompañados de actos sobrenaturales, tal como Moisés frente al Faraón o Elias frente a los baales, o Elíseo con Naaman, también eran hombres que debían soportar persecuciones e incluso  pagar un precio aun con su propia vida, como fue el caso de Isaías y muchos más.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El ministerio profético en el Antiguo Testamento no era permanente, venía de forma eventual, no podemos confundir la profecía del Antiguo Testamento con la del Nuevo Testamento. Como en el caso Isaías frente el rey Uzías, cuando escuchó su ruego y vio sus lágrimas, 'Entonces vino palabra de Jehová a Isaías, diciendo: Ve y di a Ezequías: Jehová Dios de David tu padre dice así: He oído tu oración, y visto tus lágrimas; he aquí que yo añado a tus días quince años' (Isaías 38:4-5).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Falsas concepciones acerca de la profecía:</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Algunos han creído que la profecía es de uso particular, otros dicen ser profetas porque predicen el futuro con detalles que convencen, otros cobran por su servicio espiritual pues se han atribuido la profecía como un don exclusivo para ellos; se proclaman y auto proclaman como profetas del milenio con un mensaje contemporáneo, cometiendo graves errores, por lo cual es necesario aclarar lo siguiente: </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El Espíritu Santo no vino para adivinar a nadie. 
La profecía no es para avergonzar a alguien, sacando a la luz lo que está oculto en el corazón del hombre.
El don de profecía jamás es irrespetuoso con los demás, no va contra la dignidad de la persona.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Nada de eso es la profecía, nosotros creemos en la profecía como dice la Escritura, 1 (Corintios 14: 3). Nos muestra claramente el propósito de la profecía. “Pero el que profetiza habla a los hombres para edificación, exhortación y consolación'.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La profecía, como dice la Escritura tiene tres propósitos:
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'> Edificar
2. Consolar
3. Exhortar 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>1. Edificar: Por eso la profecía fue dada, ligada al ministerio de la doctrina apostólica, para edificarnos como el cuerpo de Cristo en la unidad de la fe y del conocimiento de Cristo, 'Y él mismo constituyó a unos, apóstoles; a otros, profetas; a otros, evangelistas; a otros, pastores y maestros, a fin de perfeccionar a los santos para la obra del ministerio, para la edificación del cuerpo de Cristo, hasta que todos lleguemos a la unidad de la fe y del conocimiento del Hijo de Dios, a un varón perfecto, a la medida de la estatura de la plenitud de Cristo; para que ya no seamos niños fluctuantes, llevados por doquiera de todo viento de doctrina, por estratagema de hombres que para engañar emplean con astucia las artimañas del error' (Efesios 4: 11-14).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Consolar: La Palabra de Dios nos habla de la profecía como don del Espíritu Santo, con el propósito de fortalecer a través de la predicación de la Palabra para consolar y fortalecer nuestra vida cristiana, en los momentos difíciles que pasamos, teniendo firme y viva la esperanza a través de la Palabra profética.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>'Al otro día, saliendo Pablo y los que con él estábamos, fuimos a Cesarea; y entrando en casa de Felipe el evangelista, que era uno de los siete, posamos con él. Este tenía cuatro hijas doncellas que profetizaban. Y permaneciendo nosotros allí algunos días, descendió de Judea un profeta llamado Agabo, quien viniendo a vernos, tomó el cinto de Pablo, y atándose los pies y las manos, dijo: Esto dice el Espíritu Santo: Así atarán los judíos en Jerusalén al varón de quien es este cinto, y le entregarán en manos de los gentiles. Al oír esto, le rogamos nosotros y los de aquel lugar, que no subiese a Jerusalén. Entonces Pablo respondió: ¿Qué hacéis llorando y quebrantándome el corazón? Porque yo estoy dispuesto no sólo a ser atado, mas aun a morir en Jerusalén por el nombre del Señor Jesús. Y como no le pudimos persuadir, desistimos, diciendo: Hágase la voluntad del Señor' (Hechos 21:8-14).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El apóstol Pablo, aunque recibió la palabra donde iba a sufrir por causa de la predicación de la Palabra, él se encontraba firme, pues el Espíritu ya le había consolado y fortalecido para soportar lo que fuese necesario con tal de cumplir el propósito de Dios en su vida.
'De manera que, teniendo diferentes dones, según la gracia que nos es dada, si el de profecía, úsese conforme a la medida de la fe' (Romanos 12:6).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Exhortar: Una de las funciones más hermosas de la Palabra de Dios es la de exhortarnos, motivarnos, animarnos a través de la palabra profética más segura, que nos afirma en la luz de su verdad; predicada por hombres inspirados por el Espíritu Santo con la finalidad de darnos confianza en Él.

</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>'Tenemos también la palabra profética más segura, a la cual hacéis bien en estar atentos como a una antorcha que alumbra en lugar oscuro, hasta que el día esclarezca y el lucero de la mañana salga en vuestros corazones; entendiendo primero esto, que ninguna profecía de la Escritura es de interpretación privada, porque nunca la profecía fue traída por voluntad humana, sino que los santos hombres de Dios hablaron siendo inspirados por el Espíritu Santo' (2 Pedro 1:19-21).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por Miguel Ángel Lozano. Pastor IPUC
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>



<p style='font-size: 2em; text-align: center;'><strong>CAPACITACIÓN MISIONERA</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento evangelístico
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Cada misionero ha realizado campañas, trabajo evangelístico y Refam tanto virtual como presencial; además han realizado ayunos, vigilias, devocionales y programas espirituales, que fortalezcan la visión del misionero y su familia.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento espiritual
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Se han tenido enseñanzas con invitados, de acuerdo a la necesidad en las reuniones con los misioneros y esposas, como también se han tenido enseñanzas con invitados de acuerdo a la necesidad de los hijos de misioneros.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento formativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Capacitación y orientación al misionero, generando y brindando herramientas, por medio de seminarios y talleres de formación, con diversas temáticas de forma integral.  
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento social</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Fortalecemos la obra social como mecanismo de participación en la obra misionera, mediante jornadas socio-evangelísticas. Realizando visitas a varios misioneros y sus familias por parte del Director Nacional, coordinador y su esposa, dando apoyo y fortaleza; y se enseñó a las iglesias. Hubo felicitaciones a misioneros y esposas, a través de los grupos por motivo de cumpleaños entre otros. Los misioneros nacionales realizaron actividades participativas en el campamento de Melgar, realizaron la dinámica del amigo secreto con entrega de detalles unos a otros. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'><strong>Objetivo segmento administrativo
</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Asesoramos a los misioneros dando técnicas de administración ministerial, logrando la consolidación y estructuración de proyectos e ideas mediante conferencias. Las esposas de los misioneros se reunieron en la Asamblea de Pastores en Medellín para recibir formación, y se publicaron artículos formativos por parte de ellas en la revista digital de Misiones Nacionales.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>De las familias misioneras nacionales se han escogido dos, para el campo misionero internacional: Edilberto Díaz y familia (Misionero en Duitama, Boyacá, Distrito 14) para Cabo Verde; y Rafael Gómez y familia (Misionero en San Andrés Islas, Distrito 8) para Trinidad y Tobago.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>



<p style='font-size: 2em; text-align: center;'><strong>EDUCACIÓN CRISTIANA: Innovación y transformación con proyección eterna</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>
“…a quien anunciamos, amonestando a todo hombre, y enseñando a todo hombre en toda sabiduría, a fin de presentar perfecto en Cristo Jesús a todo hombre” 
(Colosenses 1:28).
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>La Fundación Educación Cristiana Pentecostal FECP se ha venido desarrollando de forma escalada de acuerdo a las mismas necesidades que ha presentado la Iglesia. En este sentido, cada área aporta a la formación del creyente desde diferentes ámbitos de su desarrollo integral y en cada una de los grupos que atiende. Adicionalmente, ha encontrado en la sinergia y el desarrollo de los proyectos institucionales, la posibilidad de unir esfuerzos y optimizar recursos para alcanzar mayores y mejores resultados.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por su parte, Escuela Dominical, desarrolla planes y programas que favorecen el desarrollo espiritual de forma integral en los niños y padres de familia, y en la formación teológica y ministerial de los maestros. Entre sus programas más relevantes durante el 2022 se encuentra:
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>“Bibliolandia 3”, que promueve las enseñanzas de las doctrinas fundamentales en un modelo lúdico-pedagógico inmersivo. Cuenta con dos cartillas, coro lema, coro de lecciones, videos tutoriales del uso del kit y manualidades; del cual se han distribuido doce mil ejemplares. Además, el proyecto musical “Verdaderos adoradores del gran Rey”, que acompañó la parte musical de Bibliolandia y la puesta a disposición de la cartilla para maestros de adolescentes, “Mi gran reto, permanecer en tu Palabra”.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Gracias a Dios se ha llevado a cabo, la celebración de los días institucionales del niño en abril 30. “Jesús el motivo de mi adoración”; del maestro, el 15 de mayo “Un maestro que conoce, vive y enseña la Palabra de Dios”; y del adolescente en junio 18 “Firmes en tu Palabra”.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Otro programa de gran valor ha sido “El acompañamiento bíblico y pedagógico en zonas vulnerables”, desarrollado en los departamentos del Amazonas y Chocó, en febrero y marzo respectivamente. Allí se tuvo la oportunidad de visitar varios corregimientos y barrios, llevando enseñanzas bíblicas a niños, atención con meriendas, entrega de kits bíblicos, enseñanzas a maestros y padres de familia.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Adicionalmente, se ha realizado acompañamiento a los distritos 32 y 9 en sus congresos, y se ha asesorado a todo el país en el desarrollo de la “ESFOMED” (Escuela de Formación a Maestros) y certificando a sesenta y un estudiantes. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>A Escuela Dominical le apoya significativamente el área de Recursos Educativos y Tecnología (RET), proveyéndoles materiales didácticos y desarrollos tecnológicos que han mejorado el aprendizaje; por ejemplo, diseño de aulas virtuales, juegos tanto en físico como digitales, cartillas, manuales y materiales de aprendizaje experiencial que apoya el proceso lúdico de aprender la Palabra de Dios.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Adicionalmente, Recursos Educativos y Tecnología (RET) desarrolló durante este primer semestre los “Encuentros regionales de líderes de recursos educativos y de tecnología”, en las ciudades de Santa Marta, Medellín, Bogotá y Popayán; con el objetivo de capacitar a los líderes distritales en herramientas tecnológicas educativas, StoryTelling, influencers en la educación y en la implementación de la tecnología como herramienta para fortalecer el proceso educativo en los distritos. A nivel interno RET (Recursos Educativos y Tecnología) ha asesorado a seis distritos en los procesos tecnológicos que vienen adelantando.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En este aspecto es importante mencionar, que la FECP en sus procesos de innovación ha venido desarrollando un proyecto de “Transformación digital”, según el direccionamiento estratégico a 2025 con sentido eclesial y educativo, orientado a mejorar los procesos de atención a todos los usuarios de los servicios educativos: Pastores, líderes, maestros, profesionales, músicos, entre otros. Esto ha incluido el desarrollo del Software “SI_FECP” para consolidar la información de las áreas de música, Educación Teológica (IBP), educación secular y ESFOM, en un solo sistema de información, de manera que se pueda gestionar la  solicitud de licencias para músicos de la IPUC, consolidar la información académica de todos los institutos bíblicos del país, conocer la información de todos los profesionales que hay en la IPUC, consolidar el módulo de registros de notas de todos los pastores y esposas, de la escuela de formación ministerial y desarrollar una aplicación móvil que permita la administración del sistema de información SI-FECP. 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Esta articulación se logra gracias al interés de elaborar productos de alta calidad pedagógica y técnica, en contenido y diseño, aportando a otras áreas de la IPUC si lo requieren.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El área de Educación Teológica hace parte fundamental de este proceso educativo integral, pues a través de esta se vienen cimentando las bases del conocimiento doctrinal que se extiende a las demás áreas. Su labor se ha desarrollado a través de las asesorías pedagógicas y administrativas a los IBP de cada distrito, la ejecución del programa “Educando con calidad” en tres distritos y la participación en seminarios teológicos. A la fecha se han entregado ciento cincuenta y ocho Diplomas de IBP, cuarenta y tres carnets de idoneidad docente, cuarenta diplomas de “Educando con calidad 1” y cinco diplomas de “Educando con calidad 2”.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>De igual manera, el IBP Virtual realizó el tercer seminario de educación virtual con más de noventa docentes y aspirantes. Actualmente tenemos un promedio de quinientos treinta estudiantes activos y de doscientos doce mensuales en catorce países, tres grupos en teología básica de misiones extranjeras (Guatemala, Chile y España) y dos grupos en estudios pastorales en convenio con la Universidad Bautista.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>El área de Educación Secular- Investigación y Desarrollo- por su parte, viene diseñando programas y materiales educativos para estimular el avance académico de los creyentes y su crecimiento integral.  Un ejemplo de esto es el programa “Tu llave al éxito” solicitado por dos distritos, que orienta a los adolescentes de la congregación en la construcción de su proyecto de vida, y el programa “Siervo saludable, módulo II” que brinda conocimiento en la salud auditiva y vocal de los pastores, solicitado en cinco distritos.  De igual manera, el proyecto “Biblio lectores” con el objetivo de identificar el nivel de lectura de la Palabra de Dios y mejorar la comprensión. En este mismo sentido, se han venido ejecutando talleres para el desarrollo de competencias en ofimática, desarrollo de proyectos, redacción de textos, emprendimiento y tecnología, y módulos de gramática y administración eclesial, los cuales se han puesto en marcha a través de la escuela que lleva este mismo nombre, y que ha sido de gran bendición para los siete distritos que han solicitado asesoría.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Es importante mencionar el gran aporte que viene haciendo el área de Ed. Secular (I&D) en la asesoría a iniciativas en los distritos para el desarrollo de competencias eclesiales, administrativas, investigativas, académicas y en general, para el avance de la educación cristiana en el país.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Por su parte, el área de Música realiza una importante labor en todo el país, acompañando los diferentes eventos y programas que en materia de formación musical y alabanza se realiza en los distritos. De igual manera, ha contribuido en la implementación de la ESCAM- Escuela de formación para músicos- activa en treinta y tres distritos. Durante el primer semestre de 2022 se certificaron cuatrocientos setenta músicos en todo el país. Esto ha traído como consecuencia la necesidad de agilizar el licenciamiento de los niveles distrital y nacional, desarrollando un proceso de digitalización de licencias y certificados ESCAM, y que cuente con aplicación para celulares que permite realizar consultas de los músicos por parte del pastorado. A la fecha se han entregado seiscientas treinta licencias y quedan setenta y dos pendientes para su revisión.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En otros proyectos, Música Nacional viene promoviendo el conocimiento de nuestro Himnario Manantial de Inspiración, mediante el Gran Concierto Manantial, realizado el mes de mayo con quince canciones y una gran aceptación entre el pueblo cristiano. De igual manera, realizó la producción del coro lema de Bibliolandia 3, y trabaja en nuevas composiciones temáticas para entregar a la Iglesia del Señor un cántico nuevo.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En cuanto al área de Artística, los programas de formación y materiales se han orientado hacia el fortalecimiento de los comités distritales, al desarrollo de escuelas de arte y a la construcción  del 2° módulo de arte escénico, el 1° de Arte Audiovisual y la Cartilla de Manualidades tomo 1 y 2. En cuanto a los eventos, el área de Artística fue invitada a participar en el segundo taller nacional de artística en España, con el tema 'Descubriendo mi talento' y en sus actividades de promoción llevó a cabo el Día Nacional del Arte Cristiano” en la congregación central de Tunja.  Actualmente se están llevando a cabo los concursos de guiones de teatro y poesía con treinta y seis participantes de varios distritos, y el concurso de cortometrajes abierto al público en general de la Iglesia 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Finalmente, se llevó a cabo la Escuela de Formación Ministerial ESFOM en los treinta y cuadro distritos y con la participación del 98% del pastorado, con el módulo La obra del Espíritu Santo. Esta escuela de formación es dirigida por el Consistorio de Ancianos y apoyada por la FECP en sus aspectos logísticos y pedagógicos, haciendo uso de las herramientas tecnológicas para optimizar los recursos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>A nivel administrativo, la FECP apoya toda la gestión educativa a través de la ejecución de sus procesos de difusión, distribución y en el cumplimiento de los requerimientos que establece la legislación colombiana. Se cuenta con ocho empleados de planta y se han mejorado notablemente los procesos de digitalización avanzando hacia la transformación digital, la estructuración de sus procesos y la formación de competencias hacia el Liderazgo 4.0.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En la FECP queremos facilitar el cumplimiento de la misión de la Iglesia, a través de una educación cristiana transformadora con esfuerzos en innovación y transformación digital, respondiendo con calidad y agilidad, a los propósitos eclesiales de toda la Iglesia en Colombia y en el extranjero.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Todo este trabajo se ejecuta “a fin de perfeccionar a los santos para la obra del ministerio, para la edificación del cuerpo de Cristo,  hasta que todos lleguemos a la unidad de la fe y del conocimiento del Hijo de Dios, a un varón perfecto, a la medida de la estatura de la plenitud de Cristo; (Efesios 4:12-13) … “a quien anunciamos, amonestando a todo hombre, y enseñando a todo hombre en toda sabiduría, a fin de presentar perfecto en Cristo Jesús a todo hombre” (Colosenses 1:28).</p>
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


<p style='font-size: 2em; text-align: center;'><strong>MISIONES EXTRANJERAS IPUC</strong></p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hablar de misiones extranjeras, es hablar de algo con lo que ha crecido nuestra Iglesia Pentecostal Unida de Colombia, es algo que va en el ADN de la amada del Señor, tanto que hoy por hoy nuestros Pastores tienen como un gran logro ir a las misiones y darse del todo por cumplir con la gran comisión, es como ver realizado un sueño.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Es por eso que muchos de los cinco mil treinta pastores de la IPUC estamos listos a dejar una iglesia por grande que sea y una buena economía, no interesa, lo más grande son las misiones. Un niño le preguntó a su maestro de escuela dominical “¿qué quieres ser cuando seas grande?” La respuesta no se hizo esperar “misiónelo”: Misionero, pero así respondió el niño y así los jóvenes y adultos.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Aquí en la congregación le pregunté a una joven que cumplió los quince años ¿qué es lo que más desea usted? “Ser una misionera” me respondió, servir al Dios de las misiones por ese sentir que ha puesto en su pueblo.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Hoy deseamos compartir con todos algo que estamos haciendo en Centro y sur América, las islas del caribe, África, Europa y Asia, nuestro director el hermano Vicente Arango tiene una visión extraordinaria de las misiones y buena experiencia en este campo, y él como los coordinadores nacionales de misiones extranjeras nos aportarán un informe muy hermoso de lo que allí en estos lugares viene sucediendo. </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Y como dice el texto Sagrado: “Como el agua fría al alma sedienta, Así son las buenas nuevas de lejanas tierras”. (Proverbios 25:25). </p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Video 1. Hno. Vicente Arango, Director de Misiones Extranjeras.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En África, por la gracia del Señor ya se han abierto cinco obras misioneras Guinea Bissau, Cabo Verde, Tanzania, Mozambique y Guinea Ecuatorial, en la actualidad hay una membresía de doscientos setenta y tres hermanos, y catorce pastores predicando el mensaje de salvación 
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Video 2. África (Grupo de alabanza en Guinea Ecuatorial, octubre 2021, misionero Juan Carlos Soto).</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Video 3. (Palabras de dos hermanos caboverdianos, Cabo Verde, julio de 2022, misionero Jeremías Velásquez) en el video hablan idioma portugués pero traducido al español dicen “Que Dios bendiga a toda la iglesia en Colombia, el Consistorio de Ancianos, todos los Pastores, las obras misioneras. Somos agradecidos por todos los misioneros que han sido enviados a todo el mundo, principalmente a Cabo verde y también agradecidos por los que apoyan la obra con sus ofrendas misioneras”
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Video 4. Bautismo de cuatro hermanos en Tanzania, cantan una alabanza que dice en español “Le digo a Satanás, ¡no más!, y voy a Dios mi Padre”.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Audio 1. El misionero de Guinea Bissau, el hermano. Manuel Cassiani narra el momento que el Señor le confirmó su llamado como misionero a Guinea Bissau.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Cuán grandes maravillas ha hecho el Alto y Sublime Dios, sus Palabras siguen siendo espíritu y vida, vida para los pueblos encadenados en densa oscuridad. Tenemos buenas nuevas desde Europa y Asia, damos gracias al Señor por cada una de ellas, una de las naciones más bendecidas por el Señor en Europa es la iglesia del Señor en España, actualmente hay más de cinco mil quinientos hermanos bautizados en el Nombre de Jesús, y cerca de ciento cincuenta pastores a los que Colombia apoya económicamente.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>Video 5. Misionero Marcos Pabón, Madrid, España 12 de noviembre de 2021.</p>
<p  style='padding-top: 0.7em; font-size: 1em;'>En Europa la Iglesia Pentecostal Unida de Colombia también hace presencia en Portugal, Francia, Italia, Bélgica, Alemania, Suecia, Suiza, Austria, Reino Unido y Holanda. El Señor este año nos ha permitido un avance especial en cada una de las obras misioneras, dentro de ellas la posesión del primer Pastor italiano nativo, su nombre es el hermano Nuccio Arcidiacono, en el lugar de La Sicilia, pedimos sus oraciones por él y su familia, que el Señor sea ayudándoles y guiándoles.
</p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>
<p  style='padding-top: 0.7em; font-size: 1em;'></p>

*/
