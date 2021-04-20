const options = {
    color: '#1e1f1c',
    hoofdtekst: {
        split: 200,
        font_size: 16,
        x: 150,
        y: 35,
        step: 21
    },
    subtekst: {
        split: 200,
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

const hoofd_tekst_input = document.querySelector('#hoofd-tekst-input');
const sub_tekst_input = document.querySelector('#sub-tekst-input');
const combineren_input = document.querySelector('#combineren-input');

const actie_tekst_input = document.querySelector('#actie-tekst-input');
const actie_prijs_input = document.querySelector('#actie-prijs-input');
const regular_prijs_hoog_input = document.querySelector('#regular-prijs-hoog-input');
const regular_prijs_laag_input = document.querySelector('#regular-prijs-laag-input');

const nix18_input = document.querySelector('#nix18-input');

PDFObject.embed(createPDF(), '#output')
PDFObject.embed("template.pdf", '#output2')

function createPDF() {
    const hoofd_tekst = hoofd_tekst_input.value;
    const sub_tekst = sub_tekst_input.value;
    const combineren = combineren_input.checked;

    const actie_tekst = actie_tekst_input.value.toUpperCase();
    const actie_prijs_e = Math.floor(actie_prijs_input.value) + ".";
    const actie_prijs_c = Math.round(((actie_prijs_input.value - Math.floor(actie_prijs_input.value)) + Number.EPSILON) * 100) <= 0 ?
        "_" :
        ("" + Math.round(((actie_prijs_input.value - Math.floor(actie_prijs_input.value)) + Number.EPSILON) * 100)).padStart(2, '0');

    const regular_prijs_hoog = regular_prijs_hoog_input.value >= 0.01
    const regular_prijs_hoog_e = Math.floor(regular_prijs_hoog_input.value) + ".";
    const regular_prijs_hoog_c = ("" + Math.round(((regular_prijs_hoog_input.value - Math.floor(regular_prijs_hoog_input.value)) + Number.EPSILON) * 100)).padStart(2, '0');

    const regular_prijs_laag = regular_prijs_laag_input.value >= 0.01
    const regular_prijs_laag_e = Math.floor(regular_prijs_laag_input.value) + ".";
    const regular_prijs_laag_c = ("" + Math.round(((regular_prijs_laag_input.value - Math.floor(regular_prijs_laag_input.value)) + Number.EPSILON) * 100)).padStart(2, '0');

    const nix18 = nix18_input.checked;

    // Setup Doc / Canvas Ctx
    const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4', hotfixes: ['px_scaling']});
    const ctx = doc.context2d;
    doc.setFillColor(options.color);
    doc.setTextColor(options.color);
    ctx.strokeStyle = options.color;
    ctx.lineWidth = 2.3;
    ctx.lineCap = "round";

    // Hoofd Tekst
    const hoofd_tekst_split = doc.splitTextToSize(hoofd_tekst, options.hoofdtekst.split);
    doc.setFont('Museo-700', 'normal', 'normal');
    doc.setFontSize(options.hoofdtekst.font_size);
    for (let i = 0; i < hoofd_tekst_split.length; i++)
        doc.text(options.hoofdtekst.x, options.hoofdtekst.y + (options.hoofdtekst.step * i), hoofd_tekst_split[i]);

    // Sub Tekst
    const sub_tekst_split = doc.splitTextToSize(sub_tekst, options.subtekst.split);
    if (combineren) sub_tekst_split.push("combineren mogelijk");
    doc.setFont('Museo-300', 'normal', 'normal');
    doc.setFontSize(options.subtekst.font_size);
    for (let i = 0; i < sub_tekst_split.length; i++)
        doc.text(options.hoofdtekst.x, options.hoofdtekst.y + (options.hoofdtekst.step * hoofd_tekst_split.length) + options.subtekst.offset_y + (options.subtekst.step * i), sub_tekst_split[i]);

    // Actie Prijs
    doc.setFont('Gunplay-Regular', 'normal', 'normal');
    doc.setFontSize(options.actie_prijs.cents.font_size);
    doc.text(options.actie_prijs.x, options.actie_prijs.y, actie_prijs_c, 'right') // Centen

    const offset_euros = -doc.getCharWidthsArray(actie_prijs_c).reduce((a, b) => a + b) * 31.0849;
    doc.setFontSize(options.actie_prijs.euros.font_size);
    doc.text(options.actie_prijs.x + offset_euros, options.actie_prijs.y + options.actie_prijs.cents.offset_y, actie_prijs_e, 'right') // Centen

    // Regular Prijzen
    const offset_regular = -doc.getCharWidthsArray(actie_prijs_c + actie_prijs_e).reduce((a, b) => a + b) * 60;
    doc.setFont('Museo-Sans-500', 'normal', 'normal');

    // Regular Prijs Hoog
    doc.setFontSize(options.regular_prijs.cents.font_size);
    doc.text(options.actie_prijs.x + offset_regular, options.actie_prijs.y + options.regular_prijs.offset_y + options.regular_prijs.cents.offset_y, regular_prijs_hoog_c, 'right'); // Centen

    doc.setFontSize(options.regular_prijs.euros.font_size);
    doc.text(options.actie_prijs.x + offset_regular + options.regular_prijs.euros.offset_x, options.actie_prijs.y + options.regular_prijs.offset_y, regular_prijs_hoog_e, 'right'); // Euros

    const regular_high_width = doc.getCharWidthsArray(regular_prijs_hoog_e + regular_prijs_hoog_c).reduce((a, b) => a + b) * 21;
    ctx.beginPath();
    ctx.moveTo(options.actie_prijs.x + offset_regular + 1, options.actie_prijs.y + 1);
    ctx.lineTo(options.actie_prijs.x + offset_regular - regular_high_width, options.actie_prijs.y + 23);
    ctx.stroke();

    // Regular Prijs Laag
    doc.setFontSize(options.regular_prijs.cents.font_size);
    doc.text(options.actie_prijs.x + offset_regular, options.actie_prijs.y + options.regular_prijs.offset_y + options.regular_prijs.cents.offset_y + options.regular_prijs.offset_y_laag, regular_prijs_laag_c, 'right'); // Centen

    doc.setFontSize(options.regular_prijs.euros.font_size);
    doc.text(options.actie_prijs.x + offset_regular + options.regular_prijs.euros.offset_x, options.actie_prijs.y + options.regular_prijs.offset_y + options.regular_prijs.offset_y_laag, regular_prijs_laag_e, 'right'); // Euros

    const regular_laag_width = doc.getCharWidthsArray(regular_prijs_laag_e + regular_prijs_laag_c).reduce((a, b) => a + b) * 21;
    ctx.beginPath();
    ctx.moveTo(options.actie_prijs.x + offset_regular + 1, options.actie_prijs.y + options.regular_prijs.offset_y_laag + 1);
    ctx.lineTo(options.actie_prijs.x + offset_regular - regular_laag_width, options.actie_prijs.y + options.regular_prijs.offset_y_laag + 23);
    ctx.stroke();

    doc.setFont('Gunplay-Skew', 'normal', 'normal');
    doc.setFontSize(15);

    addActie(doc, actie_tekst, options.actie_prijs.x, options.actie_prijs.y + options.actie_tekst.offset_y);

    // Nix18
    if (nix18) {
        const img = new Image();
        img.src = 'assets/nix18-logo.png';
        doc.addImage(img, 'PNG', options.nix18.x, options.nix18.y, 42, 21);
    }

    return doc.output('datauristring');
}

function addActie(doc, text, x, y) {
    const ctx = doc.context2d;

    ctx.fillStyle = options.color;
    ctx.setTransform(1, -0.14, 0, 1, 0, 0); // to skew
    ctx.fillRect(x, y, -ctx.measureText(text).width - 3, -20);

    ctx.setTransform(1, 0, 0, 1, 0, 0); // to normal
    ctx.translate(x, y);
    ctx.rotate(-Math.PI / 23);
    ctx.textAlign = 'right'
    ctx.fillStyle = '#fff';

    const yy = 0.13393232868922378 * ctx.measureText(text).width - 54.55382428205857;

    ctx.fillText(text, 5, yy);
}

document.querySelector('#generate').addEventListener('click', () => {
    PDFObject.embed(createPDF(), "#output")
});
