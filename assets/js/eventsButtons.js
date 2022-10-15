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


*/
