// Document Options
const options = {
    color: '#1e1f1c',
    hoofdtekst: {
        split: 230,
        font_size: 16,
        x: 150,
        y: 35,
        step: 21
    },
    subtekst: {
        split: 350,
        offset_y: -7,
        font_size: 8,
        step: 14
    },
    actie_container: {
        height: 20,
        offset_y: -33
    },
    actie_tekst : {
        offset_y: -17
    },
    actie_prijs: {
        x: 378,
        y: 203,
        cents: {
            font_size: 36,
            offset_y: 24,
        },
        euros: {
            font_size: 62
        },
    },
    regular_prijs: {
        offset_y: 24,
        offset_y_laag: -30,
        euros: {
            offset_x: -13,
            font_size: 22
        },
        cents: {
            offset_y: -9,
            font_size: 13
        }
    },
    nix18: {
        x: 150,
        y: 238
    }
};

// API Methods
jsPDF.API.drawRegularHoog = function(prijs, offset_regular, offset_x, offset_y) {
    const regular_prijs_hoog_e = Math.floor(prijs) + ".",
        regular_prijs_hoog_c = ("" + Math.round(((prijs - Math.floor(prijs)) + Number.EPSILON) * 100)).padStart(2, '0');

    this.setFont('Museo-Sans-500', 'normal', 'normal');

    this.setFontSize(options.regular_prijs.cents.font_size);
    this.text(offset_x + options.actie_prijs.x + offset_regular, offset_y + options.actie_prijs.y + options.regular_prijs.offset_y + options.regular_prijs.cents.offset_y, regular_prijs_hoog_c, 'right'); // Centen

    this.setFontSize(options.regular_prijs.euros.font_size);
    this.text(offset_x + options.actie_prijs.x + offset_regular + options.regular_prijs.euros.offset_x, offset_y + options.actie_prijs.y + options.regular_prijs.offset_y, regular_prijs_hoog_e, 'right'); // Euros

    const regular_high_width = this.getCharWidthsArray(regular_prijs_hoog_e + regular_prijs_hoog_c).reduce((a, b) => a + b) * 21;
    ctx.beginPath();
    ctx.moveTo(offset_x + options.actie_prijs.x + offset_regular + 1, offset_y + options.actie_prijs.y + 1);
    ctx.lineTo(offset_x + options.actie_prijs.x + offset_regular - regular_high_width, offset_y + options.actie_prijs.y + 23);
    ctx.stroke();
}

jsPDF.API.drawRegularLaag = function(prijs, offset_regular, offset_x, offset_y) {
    const regular_prijs_laag_e = Math.floor(prijs) + ".",
        regular_prijs_laag_c = ("" + Math.round(((prijs - Math.floor(prijs)) + Number.EPSILON) * 100)).padStart(2, '0');

    this.setFont('Museo-Sans-500', 'normal', 'normal');

    this.setFontSize(options.regular_prijs.cents.font_size);
    this.text(offset_x + options.actie_prijs.x + offset_regular, offset_y + options.actie_prijs.y + options.regular_prijs.offset_y + options.regular_prijs.cents.offset_y + options.regular_prijs.offset_y_laag, regular_prijs_laag_c, 'right'); // Centen

    this.setFontSize(options.regular_prijs.euros.font_size);
    this.text(offset_x + options.actie_prijs.x + offset_regular + options.regular_prijs.euros.offset_x, offset_y + options.actie_prijs.y + options.regular_prijs.offset_y + options.regular_prijs.offset_y_laag, regular_prijs_laag_e, 'right'); // Euros

    const regular_laag_width = this.getCharWidthsArray(regular_prijs_laag_e + regular_prijs_laag_c).reduce((a, b) => a + b) * 21;
    ctx.beginPath();
    ctx.moveTo(offset_x + options.actie_prijs.x + offset_regular + 1, offset_y + options.actie_prijs.y + options.regular_prijs.offset_y_laag + 1);
    ctx.lineTo(offset_x + options.actie_prijs.x + offset_regular - regular_laag_width, offset_y + options.actie_prijs.y + options.regular_prijs.offset_y_laag + 23);
    ctx.stroke();
}

jsPDF.API.drawActie = function(text, x, y, in_second_column){
    this.setFont('Gunplay-Skew', 'normal', 'normal');
    this.setFontSize(15);

    const ctx = this.context2d;

    ctx.fillStyle = options.color;
    ctx.setTransform(1, -0.14, 0, 1, 0, in_second_column ? 56 : 0); // to skew
    ctx.fillRect(x, y, -ctx.measureText(text).width - 3, -20);

    ctx.setTransform(1, 0, 0, 1, 0, 0); // to normal
    ctx.translate(x, y);
    ctx.rotate(-Math.PI / 23);
    ctx.textAlign = 'right'
    ctx.fillStyle = '#fff';

    const yy = 0.13393232868922378 * ctx.measureText(text).width - 54.55382428205857;

    ctx.fillText(text, 5, yy);
}

jsPDF.API.drawNix18 = function (x, y) {
    const img = new Image();
    img.src = 'assets/nix18-logo.png';
    doc.addImage(img, 'PNG', x, y, 42, 21);
}

// Setup the document
const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4', hotfixes: ['px_scaling']});
const ctx = doc.context2d;

// Test Data
const skk1 = {
    hoofd_tekst: "Tor del colle Montepulciano",
    sub_tekst: "3 flessen à 750 ml",
    combineren: true,
    actie_tekst: "3 halen = 2 betalen",
    actie_prijs: 11.98,
    normaal_hoog: 17.97,
    normaal_laag: 0,
    nix18: true
}
const skk2 = {
    hoofd_tekst: "Tor del colle Sauvignon",
    sub_tekst: "3 flessen à 750 ml",
    combineren: true,
    actie_tekst: "3 halen = 2 betalen",
    actie_prijs: 11.98,
    normaal_hoog: 17.97,
    normaal_laag: 0,
    nix18: true
}
const skk3 = {
    hoofd_tekst: "Grolsch pils",
    sub_tekst: "2 multipacks à 6 blikken à 330 ml",
    combineren: true,
    actie_tekst: "1+1 gratis",
    actie_prijs: 5.85,
    normaal_hoog: 11.70,
    normaal_laag: 0,
    nix18: true
}
const skk4 = {
    hoofd_tekst: "Bavaria pils",
    sub_tekst: "2 multipacks à 6 blikken à 330 ml",
    combineren: true,
    actie_tekst: "1+1 gratis",
    actie_prijs: 4.39,
    normaal_hoog: 8.78,
    normaal_laag: 0,
    nix18: true
}
const skk5 = {
    hoofd_tekst: "Grand Italia Farfalle Traditionali",
    sub_tekst: "2 pakken à 500 gram",
    combineren: true,
    actie_tekst: "1+1 gratis",
    actie_prijs: 1.35,
    normaal_hoog: 2.70,
    normaal_laag: 2.70,
    nix18: false
}
const skk6 = {
    hoofd_tekst: "Chocomel vol",
    sub_tekst: "3 pakken à 1000 ml",
    combineren: true,
    actie_tekst: "2+1 gratis",
    actie_prijs: 3.58,
    normaal_hoog: 5.37,
    normaal_laag: 0,
    nix18: false
}
const skk7 = {
    hoofd_tekst: "Frist drinkyoghurt",
    sub_tekst: "3 pakken à 1000 ml",
    combineren: true,
    actie_tekst: "2+1 gratis",
    actie_prijs: 2.90,
    normaal_hoog: 4.35,
    normaal_laag: 0,
    nix18: false
}
const skk8 = {
    hoofd_tekst: "Hoofdtekst",
    sub_tekst: "Subtekst\nVerkoop EH\nExtra Tekst 2",
    combineren: true,
    actie_tekst: "50% Korting",
    actie_prijs: 8.88,
    normaal_hoog: 8.88,
    normaal_laag: 8.88,
    nix18: true
}

function drawSkk(skk, index) {

    const offset_x = index % 2 === 0 ? 0 : 400,
        offset_y = index % 2 === 0 ? index / 2 * 280 : (index - 1) / 2 * 280;

    const hoofd_tekst = skk.hoofd_tekst,
        sub_tekst = skk.sub_tekst,
        combineren = skk.combineren,

        actie_tekst = skk.actie_tekst.toUpperCase(),
        actie_prijs_e = Math.floor(skk.actie_prijs) + ".",
        actie_prijs_c = Math.round(((skk.actie_prijs - Math.floor(skk.actie_prijs)) + Number.EPSILON) * 100) <= 0 ?
            "_" :
            ("" + Math.round(((skk.actie_prijs - Math.floor(skk.actie_prijs)) + Number.EPSILON) * 100)).padStart(2, '0'),

        regular_prijs_hoog = skk.normaal_hoog,
        regular_prijs_laag = skk.normaal_laag,


        nix18 = skk.nix18;

    ctx.save();

    doc.setFillColor(options.color);
    doc.setTextColor(options.color);
    ctx.strokeStyle = options.color;
    ctx.lineWidth = 2.3;
    ctx.lineCap = "round";

    // Hoofd Tekst
    doc.setFont('Museo-700', 'normal', 'normal');
    doc.setFontSize(options.hoofdtekst.font_size);
    const hoofd_tekst_split = doc.splitTextToSize(hoofd_tekst, options.hoofdtekst.split);
    console.log(hoofd_tekst, doc.getStringUnitWidth(hoofd_tekst) * 16)
    for (let i = 0; i < hoofd_tekst_split.length; i++)
        doc.text(offset_x + options.hoofdtekst.x, offset_y + options.hoofdtekst.y + (options.hoofdtekst.step * i), hoofd_tekst_split[i]);

    // Sub Tekst
    doc.setFont('Museo-300', 'normal', 'normal');
    doc.setFontSize(options.subtekst.font_size);
    const sub_tekst_split = doc.splitTextToSize(sub_tekst, options.subtekst.split);
    if (combineren) sub_tekst_split.push("combineren mogelijk");
    for (let i = 0; i < sub_tekst_split.length; i++)
        doc.text(offset_x + options.hoofdtekst.x, offset_y + options.hoofdtekst.y + (options.hoofdtekst.step * hoofd_tekst_split.length) + options.subtekst.offset_y + (options.subtekst.step * i), sub_tekst_split[i]);

    // Actie Prijs
    doc.setFont('Gunplay-Regular', 'normal', 'normal');
    doc.setFontSize(options.actie_prijs.cents.font_size);
    doc.text(offset_x + options.actie_prijs.x, offset_y + options.actie_prijs.y, actie_prijs_c, 'right') // Centen

    const offset_euros = -doc.getCharWidthsArray(actie_prijs_c).reduce((a, b) => a + b) * 31.0849;
    doc.setFontSize(options.actie_prijs.euros.font_size);
    doc.text(offset_x + options.actie_prijs.x + offset_euros, offset_y + options.actie_prijs.y + options.actie_prijs.cents.offset_y, actie_prijs_e, 'right') // Centen

    // Regular Prijzen
    const offset_regular = -doc.getCharWidthsArray(actie_prijs_c + actie_prijs_e).reduce((a, b) => a + b) * 60;

    // Regular Prijs Hoog
    if (regular_prijs_hoog >= 0.01)
        doc.drawRegularHoog(regular_prijs_hoog, offset_regular, offset_x, offset_y);

    // Regular Prijs Laag
    if (regular_prijs_laag >= 0.01)
        doc.drawRegularLaag(regular_prijs_laag, offset_regular, offset_x, offset_y);

    // Actie Text Block
    doc.drawActie(actie_tekst, offset_x + options.actie_prijs.x, offset_y + options.actie_prijs.y + options.actie_tekst.offset_y, index % 2 !== 0);

    // Nix18
    if (nix18)
        doc.drawNix18(offset_x + options.nix18.x, offset_y + options.nix18.y);

    ctx.restore();
}

// document.querySelector('#generate').addEventListener('click', () => {
//     PDFObject.embed(createPDF(), "#output")
// });

function generatePDF(kaartjes) {
    for (let i = 0; i < kaartjes.length; i++) {
        drawSkk(kaartjes[i], i);
    }
    const blob = doc.output('bloburl');
    window.open(blob, "_blank");
}

// drawSkk(skk1, 0);
// drawSkk(skk2, 1);
// drawSkk(skk3, 2);
// drawSkk(skk4, 3);
// drawSkk(skk5, 4);
// drawSkk(skk6, 5);
// drawSkk(skk7, 6);
// drawSkk(skk8, 7);

// Preview
// PDFObject.embed(doc.output('datauristring'), '#output')
// PDFObject.embed("template.pdf", '#output2')

function generateSKKContent(details) {
    return {
        hoofd_tekst: details.name,
        sub_tekst: details.volume,
        combineren: false,
        actie_tekst: details.sticker,
        actie_prijs: details.predictedPrice.low,
        normaal_hoog: details.predictedPrice.high,
        normaal_laag: 0,
        nix18: false
    };
}