const home_page = document.querySelector('#home-page'),
    search_page = document.querySelector('#search-page'),
    print_page = document.querySelector('#print-page'),
    scanner_page = document.querySelector('#scanner-page'),
    result_page = document.querySelector('#result-page');

const capacity = 20;
let collector;

const kaartjes = [];

function startScanner() {

    document.querySelector('.determinate').style.width = "0%";

    display_page(scanner_page);

    collector = Quagga.ResultCollector.create({
        capture: false, // keep track of the image producing this result
        capacity: capacity
    });

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#camera-stream'),
            constraints: {
                width: 500,
                height: 500,
                facingMode: "environment"
            },
            config: {
                locate: false
            }
        },
        decoder: {
            readers: [ "ean_reader" ]
        },

    }, function (err) {
        if (err) {
            console.log(err);
            return
        }

        Quagga.registerResultCollector(collector);
        Quagga.start();

    });
}

Quagga.onDetected(() => {
    document.querySelector('.determinate').style.width = `${collector.getResults().length / capacity * 100}%`;
    //M.toast({html: `${collector.getResults().length}/${capacity}`});
    if (collector.getResults().length === capacity) {
        const codes = [];
        collector.getResults().forEach(code => codes.push(code.codeResult.code));
        Quagga.stop();
        load_results(mode(codes));
    }
});

// Start scanner
document.querySelector("#scan-btn").addEventListener("click", () => {
    startScanner();
});

// Stop scanner
document.querySelector("#exit-camera-btn").addEventListener("click", () => {
    Quagga.stop();
    display_page(home_page);
});

// Nav Buttons
document.querySelector("#home-btn").addEventListener("click", () => {
    display_page(home_page);
});
document.querySelector("#search-btn").addEventListener("click", () => {
    display_page(search_page);
});
document.querySelector("#print-btn").addEventListener("click", () => {
    //display_page(print_page);
    generatePDF(kaartjes);
});
document.querySelector("#results-btn").addEventListener("click", () => {
    display_page(result_page);
});

// Searching
document.querySelector("#do-search-btn").addEventListener('click', () => {
    const search_term = document.querySelector('#search-input').value;
    if (search_term != null && search_term !== "" && search_term.length >= 3) {
        load_results(search_term);
    } else document.querySelector('#search-feedback').textContent = "Ongeldige zoekopdracht!";
});

function load_results(search_term) {
    while (result_page.firstChild)
        result_page.removeChild(result_page.lastChild);
    result_page.appendChild(loading());
    display_page(result_page);
    fetch_products(search_term);
}

function loading() {
    const elem = document.createElement('div');
    elem.classList.add('loading')
    elem.innerHTML =
        `<div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-yellow-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div><div class="gap-patch">
                    <div class="circle"></div>
                </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
        </div>`
    return elem;
}

function mode(array)
{
    if(array.length === 0)
        return null;
    const modeMap = {};
    let maxEl = array[0], maxCount = 1;
    for(let i = 0; i < array.length; i++)
    {
        const el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

function display_page(element) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.hidden = page.id !== element.id;
    });
}

function fetch_products(ean_code) {
    const URL = "https://api.coop.nl/INTERSHOP/rest/WFS/COOP-COOPBase-Site/-;loc=nl_NL;cur=EUR/culios/products?searchTerm=" + ean_code + "&amount=9&attrs=sku,salePrice,listPrice,availability,manufacturer,image,minOrderQuantity,inStock,promotions,packingUnit,mastered,productMaster,productMasterSKU,roundedAverageRating,longtail,sticker,maxXLabel,Inhoud&attributeGroup=PRODUCT_LIST_DETAIL_ATTRIBUTES&productFilter=fallback_searchquerydefinition&offset=0";
    fetch(URL, { method: 'GET' })
        .then(respone => respone.json())
        .then(json => {
            if (json.total <= 0) {
                display_page(home_page);
                M.toast({html: 'Geen resultaten gevonden!'})
            } else {
                json.elements.forEach(product => {
                    fill_card(product);
                });
            }
        }).finally(() => {
            const childs = result_page.querySelectorAll('.loading')
            childs.forEach(child => result_page.removeChild(child));
    });
}

function fill_card(product) {
    const template = document.querySelector('#product-card');
    const card = template.content.cloneNode(true);

    const detail_title = card.querySelector('.detail-title'),
        detail_short = card.querySelector('.detail-short'),
        detail_volume = card.querySelector('.detail-volume'),
        detail_price_regular = card.querySelector('.detail-price-regular'),
        detail_price_sale = card.querySelector('.detail-price-sale'),
        detail_price_predH = card.querySelector('.detail-price-predicted-high'),
        detail_price_predL = card.querySelector('.detail-price-predicted-low'),
        detail_ean = card.querySelector('.detail-ean'),
        detail_link = card.querySelector('.detail-link'),
        detail_image = card.querySelector('.detail-image'),
        detail_amount = card.querySelector('.detail-amount');

    const details = generate_details(product);

    detail_title.textContent = details.name;
    detail_short.textContent = details.shortDesc;
    detail_volume.textContent = details.volume;
    detail_ean.textContent = details.ean;

    detail_price_regular.textContent = details.listPrice;

    if (details.actieArtikel) {
        detail_price_sale.textContent = details.salePrice;
        detail_price_predH.textContent = details.predictedPrice.high;
        detail_price_predL.textContent = details.predictedPrice.low;
        detail_amount.textContent = details.actieGetal + " stuk(s)";
    } else {
        detail_price_sale.hidden = true;
        detail_price_predH.hidden = true;
        detail_price_predL.hidden = true;
        detail_amount.hidden = true;
        card.querySelector('.title-price-sale').hidden = true;
        card.querySelector('.title-price-predicted-high').hidden = true;
        card.querySelector('.title-price-predicted-low').hidden = true;
        card.querySelector('.title-amount').hidden = true;
    }

    detail_link.href = details.siteUrl;
    detail_image.src = details.imageUrl;

    if (details.sticker) card.querySelector('.badge').textContent = details.sticker;
    else card.querySelector('.sticker-wrapper').hidden = true;

    card.querySelector('.skk').addEventListener('click', () => {
        kaartjes.push(generateSKKContent(details));
    });
    if (!details.actieArtikel) card.querySelector('.open-btn').classList.add('disabled')

    result_page.appendChild(card);

    if (details.actieArtikel) {
        var elems = document.querySelectorAll('.pdf-action-btn');
        var instances = M.FloatingActionButton.init(elems, {
            direction: 'left',
            hoverEnabled: false
        });
    }

}

function generate_details(product) {
    const details = { };

    details['name'] = product.productName;
    details['ean'] = product.sku;
    details['shortDesc'] = product.shortDescription;

    let img_url_M = "", img_url = "";
    product.images.forEach(img => {
        if (img.typeID === "M") img_url_M = img.effectiveUrl;
        if (img.typeID === "540x540") img_url = img.effectiveUrl;
    });
    details['imageUrl'] = img_url !== "" ? img_url : img_url_M;

    details['siteUrl'] = "https://www.coop.nl/product/" + product.sku;

    details['listPrice'] = product.listPrice.value;
    details['salePrice'] = product.salePrice.value;

    details['predictedPrice'] = {};
    let actie_artikel = false;
    product.attributes.forEach(att => {
        if (att.name === "sticker" && att.value !== null && att.value !== "" && att.value !== undefined) {
            actie_artikel = true;
            const sticker = att.value.toUpperCase()
            details['sticker'] = sticker;
            details['actieGetal'] = ""

            if (sticker === "ACTIE") {
                details['predictedPrice'].high = product.listPrice.value;
                details['predictedPrice'].low = product.salePrice.value;
                details['actieGetal'] = 1;
            }
            else if (sticker.includes("GRATIS")) {
                const digits = sticker.slice(0, -7).split(" + ");
                details['predictedPrice'].high = parseInt(digits[0]) * product.listPrice.value + parseInt(digits[1]) * product.listPrice.value;
                details['predictedPrice'].low = parseInt(digits[0]) * product.listPrice.value;
                details['actieGetal'] = parseInt(digits[0]) + parseInt(digits[1]);
            }
            else if (sticker.includes("VOOR")) {
                const digits = sticker.split(" VOOR ");
                details['predictedPrice'].high = parseInt(digits[0]) * product.listPrice.value;
                details['predictedPrice'].low = parseFloat(digits[1]);
                details['actieGetal'] = parseInt(digits[0]);
            }
            else if (sticker.includes("%")) {
                const digits = sticker.split("%");
                details['predictedPrice'].high = product.listPrice.value;
                details['predictedPrice'].low = product.listPrice.value * (1 - parseInt(digits[0]) / 100);
                details['actieGetal'] = 1;
            }
            else if (sticker.includes("KORTING") && !sticker.includes("%")) {
                const digits = sticker.split(" ");
                details['predictedPrice'].high = product.listPrice.value;
                details['predictedPrice'].low = product.listPrice.value - parseFloat(digits[0]);
                details['actieGetal'] = 1;
            }
            else if (sticker.includes("HALVE PRIJS")) {
                const digit = sticker.slice(0, -13);
                details['predictedPrice'].high = product.listPrice.value * parseInt(digit);
                details['predictedPrice'].low = product.listPrice.value * parseInt(digit) - product.listPrice.value / 2;
                details['actieGetal'] = parseInt(digit);
            }
            else if (sticker.includes("HALEN")) {
                const terms = sticker.split(" = ");
                const get = terms[0].slice(0, -6);
                const pay = terms[1].slice(0, -8);

                details['predictedPrice'].high = product.listPrice.value * parseInt(get);
                details['predictedPrice'].low = product.listPrice.value * parseInt(pay);
                details['actieGetal'] = parseInt(get);
            }
            else {
                details['predictedPrice'].high = "N/A";
                details['predictedPrice'].low = "N/A";
                details['actieGetal'] = "";
            }
        } else if (att.name === "Inhoud" && att.value !== null && att.value !== "" && att.value !== undefined) {
            details['volume'] = att.value;
        }
    });

    details['actieArtikel'] = actie_artikel;

    /*
        ACTIE

        #+# GRATIS

        # VOOR ...

        #% KORTING

        # KORTING

        #E HALVE PRIJS

        # HALEN = # BETALEN
    */

    return details;
}