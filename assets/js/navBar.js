//THUMBNAILS OPTION
const createThumb = (pages) => {

    if (!$('.container-thumbs').is(":visible")) {

        //Create struct to thumnails
        var div = $('<div />', { class: 'container-thumbs options' }).appendTo('body')
        var listThumbs = $('<div/>', { id: 'thumb', class: 'list-thumbs options' })

        for (let i = 1; i <= pages; i++) {

            if (i == 1 || i == pages) {
                listThumbs.append($('<div/>', { id: 'page-thumb', class: 'page-thumb single-page options' }).append($('<p/>', { class: 'options' }).html("" + i), $('<div/>', { class: 'page-img options', 'onclick': 'goPage(' + i + ')' }).append($('<img/>', { class: 'options' + i, src: './assets/pages-img/' + i + '.jpg' }))))
            } else if (i % 2 == 0) {
                listThumbs.append($('<div/>', { id: 'page-thumb', class: 'page-thumb left-page options' }).append($('<p/>', { class: 'options' }).html("" + i), $('<div/>', { class: 'page-img options', 'onclick': 'goPage(' + i + ')' }).append($('<img/>', { class: 'options' + i, src: './assets/pages-img/' + i + '.jpg' }))))
            } else {
                listThumbs.append($('<div/>', { id: 'page-thumb', class: 'page-thumb right-page options' }).append($('<p/>', { class: 'options' }).html("" + i), $('<div/>', { class: 'page-img options', 'onclick': 'goPage(' + i + ')' }).append($('<img/>', { class: 'options' + i, src: './assets/pages-img/' + i + '.jpg' }))))
            }
        }

        div.append($('<div/>', { id: 'carousel', class: 'container-carousel options' }).append($('<button/>', { id: 'previous', class: 'button-carousel prev-button options' }).append($('<img/>', { src: './assets/pics/icons/left.png', class: 'options' })), listThumbs, $('<button/>', { id: 'next', class: 'button-carousel next-button options' }).append($('<img/>', { src: './assets/pics/icons/right.png', class: 'options' }))))

        //Events to scroll carousel
        const buttonPrev = document.getElementById('previous')
        const buttonNext = document.getElementById('next')
        const containerCarousel = document.getElementById('carousel')

        //Event to next Button to scroll carousel
        buttonNext.addEventListener('click', () => { containerCarousel.scrollLeft += containerCarousel.offsetWidth })

        //Event to previous Button to scroll carousel
        buttonPrev.addEventListener('click', () => { containerCarousel.scrollLeft -= containerCarousel.offsetWidth })

        $('.container-language').removeClass("visible");
        $('.container-search').removeClass("visible");

    } else {
        $('.container-thumbs').remove()
    }
}

//SEARCH OPTION
const createSearch = () => {
    hideOption('.container-search', '.container-thumbs', '.container-language')
}

//Functionality to search content in the magazine:
var buttonSearch = document.getElementById('button-search'),
    wordSearch = document.getElementById('word-search')

//1. Event over button to search the words
function searchButton(lang) {
    var inputValue = wordSearch.value

    if (inputValue.length > 0) {
        $('.result-search').css({ display: 'block' });

        if ($(".content-results").length > 0) {
            $(".result-search").empty()
            addContent(inputValue, lang);
        } else {
            addContent(inputValue, lang);
        }
    }
}

//2. Shows search results
function addContent(inputValue, lang) {

    for (let page = 1; page <= $('.magazine').turn('pages'); page++) {

        $.getJSON('./assets/pages-' + lang + '/' + page + '-page.json').
        done(function(data) {
            $.each(data, function(key, region) {

                if (region.tag != 'modal' && region.data.content != undefined) {

                    var dataContent = region.data.content.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    var dataInput = inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

                    if (dataContent.includes(dataInput)) {
                        content = true;
                        var startWord = dataContent.toLowerCase().indexOf(dataInput);
                        var word = region.data.content.substring(startWord, (startWord + dataInput.length));
                        var highlight = new RegExp(word, 'g')

                        $('.result-search').append($('<div/>', { class: 'content-results', 'onclick': 'goPage(' + page + ')' }).append($('<p/>', { class: 'page-search' }).html('Pag ' + page + '.'), $('<p/>', { class: 'content-search' }).html(region.data.content.replace(highlight, '<span class="span">' + `${word}` + '</span>'))))
                    }
                }
            });
        });
    }
}

//LANGUAGE OPTION
const changeLanguage = () => {
    hideOption('.container-language', '.container-thumbs', '.container-search')
}

//Hide options when one specific option is visible
function hideOption(container, opt1, opt2) {
    $(container).toggleClass("visible");
    if ($(opt1).hasClass("visible") || $(opt2).hasClass("visible") || $('.container-thumbs').is(":visible")) {
        $(opt1).removeClass("visible");
        $(opt2).removeClass("visible");
        $('.container-thumbs').remove()
    }
}

//Hide carousel when click out of it
document.addEventListener('click', function(event) {
    var text = $(event.target).attr('class')
    if (text != 'options') {
        $('.container-language').removeClass("visible");
        $('.container-search').removeClass("visible");
        $('.container-thumbs').remove()
        wordSearch.value = ""
        $(".result-search").css({ display: 'none' });
    }
});
