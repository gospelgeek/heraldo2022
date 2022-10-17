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


"<p style='padding-top: 1em; font-size: 1em;'><span style='color: #b41015; font-size: 2em'>E</span>l Señor Jesús resucitó y durante cuarenta días dio testimonio de su resurrección, apareciéndoles a más de quinientas personas, y antes de ascender a los cielos encomendó a sus discípulos la responsabilidad de ir por todo el mundo para anunciar a toda persona el Evangelio de la salvación y la vida eterna.</p> <p style='padding-top: 0.7em; font-size: 1em;'>El Evangelio es la buena noticia de Dios para todos los hombres, y este consiste en que el diablo, quien tenía cautivo a los seres humanos, fue vencido en la cruz del Calvario. Ahora todos los hombres tienen la oportunidad de salir de su dominio y conocer la salvación de Dios. </p>"

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















<p style='font-size: 2em; text-align: center;'><strong></strong></p>
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

*/
