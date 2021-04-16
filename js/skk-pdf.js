const options = {
    hoofdtekst: {
        x: 39,
        y: 9,
        step: 6
    },
    subtekst: {
        x: 39,
        y: 8,
        step: 3
    },
    combineren: {
        x: 39,
        y: 8
    },
    actie_tekst : {
        x: 100,
        y: 30
    },
    actie_prijs: {
        x: 100,
        y: 60
    },
    nix18: {
        x: 39,
        y: 100
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
    const doc = new jsPDF();

    const hoofd_tekst = hoofd_tekst_input.value;
    const sub_tekst = sub_tekst_input.value;
    const combineren = combineren_input.checked;

    const actie_tekst = actie_tekst_input.value.toUpperCase();
    const actie_prijs_e = Math.floor(actie_prijs_input.value) + ".";
    const actie_prijs_c = "" + Math.round(((actie_prijs_input.value - Math.floor(actie_prijs_input.value)) + Number.EPSILON) * 100);

    const regular_prijs_hoog = regular_prijs_hoog_input.value >= 0.01
    const regular_prijs_hoog_e = Math.floor(regular_prijs_hoog_input.value) + ".";
    const regular_prijs_hoog_c = ("" + Math.round(((regular_prijs_hoog_input.value - Math.floor(regular_prijs_hoog_input.value)) + Number.EPSILON) * 100)).padStart(2, '0');

    const regular_prijs_laag = regular_prijs_laag_input.value >= 0.01
    const regular_prijs_laag_e = Math.floor(regular_prijs_laag_input.value) + ".";
    const regular_prijs_laag_c = ("" + Math.round(((regular_prijs_laag_input.value - Math.floor(regular_prijs_laag_input.value)) + Number.EPSILON) * 100)).padStart(2, '0');

    const nix18 = nix18_input.checked;

    // Hoofd Tekst
    const hoofd_tekst_split = doc.splitTextToSize(hoofd_tekst, 55);

    doc.setFont('Museo-700', 'normal', 'normal');
    doc.setFontSize(16);
    for (let i = 0; i < hoofd_tekst_split.length; i++)
        doc.text(options.hoofdtekst.x, options.hoofdtekst.y + (options.hoofdtekst.step * i), hoofd_tekst_split[i]);

    // Sub Tekst
    const sub_tekst_split = doc.splitTextToSize(sub_tekst, 90);
    if (combineren) sub_tekst_split.push("combineren mogelijk");
    doc.setFont('Museo-300', 'normal', 'normal');
    doc.setFontSize(8);
    for (let i = 0; i < sub_tekst_split.length; i++)
        doc.text(options.subtekst.x, options.subtekst.y + (options.hoofdtekst.step * hoofd_tekst_split.length - 1) + (options.subtekst.step * i), sub_tekst_split[i]);

    // Actie Mechanisme
    // Actie Lijn
    const ctx = doc.context2d;
    let width = doc.getCharWidthsArray(actie_tekst).reduce((a, b) => a + b) * 4.5;

    ctx.fillStyle = "#000";
    ctx.fillRect(100, 30, -width - .5, 6);

    // Actie Tekst
    doc.setFont('Gunplay-Regular', 'normal', 'normal');
    doc.setFontSize(14);
    ctx.fillStyle = "#fff"
    ctx.textAlign = "end";
    ctx.setTransform(.99, 0, 0, 1.16, 0, 0);
    ctx.fillText(actie_tekst, options.actie_tekst.x, options.actie_tekst.y);

    // Actie Prijs
    ctx.fillStyle = "#000"
    doc.setFontSize(36);
    ctx.setTransform(1, 0, 0, .895, 0, 0);
    ctx.fillText(actie_prijs_c, options.actie_prijs.x, options.actie_prijs.y); // Centen

    width = doc.getCharWidthsArray(actie_prijs_c).reduce((a, b) => a + b) * 8;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    doc.setFontSize(62);
    ctx.fillText(actie_prijs_e, options.actie_prijs.x - width, options.actie_prijs.y); // Euros

    // Regulier Hoog
    doc.setFont('Museo-Sans-500', 'normal', 'normal');

    width = doc.getCharWidthsArray(actie_prijs_c + actie_prijs_e).reduce((a, b) => a + b) * 14;

    doc.setFontSize(13);
    ctx.setTransform(1, 0, 0, .96, 0, 0);
    if (regular_prijs_hoog) ctx.fillText(regular_prijs_hoog_c, options.actie_prijs.x - width, options.actie_prijs.y); // Centen

    let inner_width = doc.getCharWidthsArray(actie_prijs_c).reduce((a, b) => a + b) * 2.7;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    doc.setFontSize(22);
    if (regular_prijs_hoog) ctx.fillText(regular_prijs_hoog_e, options.actie_prijs.x - width - inner_width, options.actie_prijs.y); // Euros

    // Regulier Laag
    doc.setFontSize(13);
    ctx.setTransform(1, 0, 0, .96, 0, 0);
    if (regular_prijs_laag) ctx.fillText(regular_prijs_laag_c, options.actie_prijs.x - width, options.actie_prijs.y - 8); // Centen

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    doc.setFontSize(22);
    if (regular_prijs_laag) ctx.fillText(regular_prijs_laag_e, options.actie_prijs.x - width - inner_width, options.actie_prijs.y - 8); // Euros

    // Lijn Prijs Hoog
    let self_width = doc.getCharWidthsArray(regular_prijs_hoog_e + regular_prijs_hoog_c).reduce((a, b) => a + b) * 5.5;
    ctx.lineWidth = .7;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(options.actie_prijs.x - width, options.actie_prijs.y - 6.5);
    ctx.lineTo(options.actie_prijs.x - width - self_width, options.actie_prijs.y);
    if (regular_prijs_hoog) ctx.stroke();

    // Lijn Prijs Laag
    self_width = doc.getCharWidthsArray(regular_prijs_laag_e + regular_prijs_laag_c).reduce((a, b) => a + b) * 5.5;

    ctx.beginPath();
    ctx.moveTo(options.actie_prijs.x - width, options.actie_prijs.y - 14);
    ctx.lineTo(options.actie_prijs.x - width - self_width, options.actie_prijs.y - 8);
    if (regular_prijs_laag) ctx.stroke();

    // Nix18
    if (nix18) {
        const img = new Image();
        img.src = 'assets/nix18-logo.png';
        doc.addImage(img, 'PNG', options.nix18.x, 62.5, 11, 5.5);
    }

    return doc.output('datauristring');
}

document.querySelector('#generate').addEventListener('click', () => {
   PDFObject.embed(createPDF(), "#output")
});
