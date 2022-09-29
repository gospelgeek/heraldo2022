const addComponents = (region, lang) => {

    var element;

    switch (region.tag) {
        case 'p':
            element = addSVG('<p style="font-size:' + region.fontSize + '" xmlns="http://www.w3.org/1999/xhtml">' + region.data.content + '</p>', region)
            break;

        case 'h1':
            element = addSVG('<h1 style="font-size:' + region.fontSize + '" xmlns="http://www.w3.org/1999/xhtml">' + region.data.content + '</h1>', region)
            break;

        case 'img':
            element = '<img src=' + region.data.src + '>'
            break;

        case 'modal':
            element = $('<div/>', { class: 'content-modal' }).append(
                $('<div/>', { id: region.id, class: 'modal' }).append(
                    $('<div/>', { class: 'header-modal' }).append($('<h1/>', {}).html(region.data.title)),
                    $('<div/>', { class: 'body-modal' }).append($('<p/>', { class: region.class }).html(region.data.content))),
                addSVG('<a href="#' + region.id + '" rel="modal:open" class="button-magazine" xmlns="http://www.w3.org/1999/xhtml"><p style="font-size:' + region.fontSize + '">' + region.text + '</p><img src="' + region.icon + '"><a/>', region))

            break;


        case 'audio':
            element = $('<div/>', { class: 'content-audio' }).append(
                addSVG('<a class="button-magazine button-audio" id="button-' + region.id + '" xmlns="http://www.w3.org/1999/xhtml" onclick="showAudio(' + region.id + ')"><p style="font-size:' + region.fontSize + '">' + region.text + '</p><img src="' + region.icon + '"><a/>', region),
                '<audio id="' + region.id + '" class="audioPage" controls = true src="' + region.data.src + '"></audio>')
            break;

        case 'print':
            element = addSVG('<a href="' + region.data.url + '" class="button-magazine" target=1 xmlns="http://www.w3.org/1999/xhtml"><p style="font-size:' + region.fontSize + '">' + region.text + '</p><img src="' + region.icon + '"><a/>', region)
            break;

        case 'share':
            element = '<a href="' + region.data.url + "" + doClick(region.data.page, lang) + '" target="blank" class="button-magazine" id="' + region.id + '" xmlns="http://www.w3.org/1999/xhtml"><div id="' + region.id + '"><img src="' + region.icon + '"></div></a>'
            break;
        case 'btn-normal':
            element = (`<div class="div-center-ubication-responsive"> <a onClick="clickReadMore()" style="background-color: ${region['background-color']}; z-index: 1000;" class='btn-normal-23'   target="_blank" id="${region.id}"><span style="color: ${region.color}; font-size: ${region['font-size']}" class="boton-normal-text-23">${(region.data).text}</span></a> </div>`)
            break;
        case 'btn-normal-2':
            element = (`<div class="div-center-ubication-responsive"> <div class="div-center-two-icons-responsive" > ${`<a href="${ (region.data)[0].url }"><img src="${(region.data)[0].icon}" ></a> <a href="${ (region.data)[1].url }"><img src="${(region.data)[1].icon}" ></a>`} </div> </div>`)
            break;
        case 'title-content':
            element = (`<div class="div-center-ubication-responsive"><span class="responsive-font" style="${region.style}" >${(region.data).text}</span></div>`)
            break;
        case 'content-text':
            element = (`<div class="div-center-ubication-responsive"><div style="width: 80%; heiht: 80%"> <span class="responsive-font-content" style="${region.style}" >${(region.data).text}</span> </div> </div>`)
            break;
        case 'botones-idomas':
            element = (`<div class="div-center-ubication-responsive"> <div style="gap: 0.5em;grid-template-columns: 33.3% 33.3% 33.3%;" class="div-center-two-icons-responsive" > ${`<a href="${ (region.data)[0].url }"><img src="${(region.data)[0].icon}" ></a> <a href="${ (region.data)[1].url }"><img src="${(region.data)[1].icon}" ></a> <a href="${ (region.data)[2].url }"><img src="${(region.data)[2].icon}" ></a>`} </div> </div>`)
            break;
        default:
            break;
    }

    return element
}

const addSVG = (content, region) => {
    return "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 " + region.viewX + " " + region.viewY + "' style='overflow: visible;' xml:space=''><foreignObject  width='100%' height='100%' style='overflow:visible;'>" + content + "</foreignObject></svg>"
}
