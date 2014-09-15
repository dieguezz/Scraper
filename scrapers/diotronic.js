// Modules
var Promise = require("bluebird");
var request = Promise.promisify(require('request'));
var cheerio = require('cheerio');
var flatten = function(xs){return xs.reduce(function(a, b){return a.concat(b)}, []);}
var urls = ['http://www.diotronic.com/semiconductores/memorias/s-rams-nvrams_p_50.aspx', 
'http://www.diotronic.com/semiconductores/memorias/ram-dinamicas_p_51.aspx', 
'http://www.diotronic.com/semiconductores/memorias/prom_p_53.aspx', 
'http://www.diotronic.com/semiconductores/memorias/eprom_p_54.aspx', 
'http://www.diotronic.com/semiconductores/memorias/e2prom_p_55.aspx', 
'http://www.diotronic.com/semiconductores/memorias/flash_p_56.aspx', 
'http://www.diotronic.com/semiconductores/valvulas-lamparas-electronicas/valvulas-electronicas_p_969.aspx', 
'http://www.diotronic.com/semiconductores/modulos-semikron/modulos-igbt_p_973.aspx', 
'http://www.diotronic.com/semiconductores/modulos-semikron/modulos-thyristor-diodo_p_974.aspx', 
'http://www.diotronic.com/semiconductores/modulos-semikron/bridge-rectifier-puentes_p_975.aspx', 
'http://www.diotronic.com/semiconductores/modulos-semikron/diodos_p_976.aspx', 
'http://www.diotronic.com/semiconductores/modulos-semikron/thyristores_p_977.aspx', 
'http://www.diotronic.com/semiconductores/modulos-semikron/varios_p_978.aspx', 
'http://www.diotronic.com/semiconductores/diodos/diodos-transil_p_590.aspx', 
'http://www.diotronic.com/semiconductores/diodos/diacs_p_21.aspx', 
'http://www.diotronic.com/semiconductores/diodos/zeners-referencias_p_22.aspx', 
'http://www.diotronic.com/semiconductores/diodos/diodos-schottky_p_18.aspx', 
'http://www.diotronic.com/semiconductores/diodos/diodos-de-germanio_p_20.aspx', 
'http://www.diotronic.com/semiconductores/diodos/diodos-de-proposito-general-de-baja-potencia_p_984.aspx', 
'http://www.diotronic.com/semiconductores/diodos/diodos-de-potencia_p_985.aspx', 
'http://www.diotronic.com/semiconductores/diodos/puentes-rectificadores_p_986.aspx', 
'http://www.diotronic.com/semiconductores/diodos/diodos-avalancha_p_988.aspx', 
'http://www.diotronic.com/semiconductores/transistores/proposito-general_p_23.aspx', 
'http://www.diotronic.com/semiconductores/transistores/darlington_p_989.aspx', 
'http://www.diotronic.com/semiconductores/transistores/fet_p_990.aspx', 
'http://www.diotronic.com/semiconductores/transistores/igbt-s_p_991.aspx', 
'http://www.diotronic.com/semiconductores/triacs-thyristores/triacs_p_24.aspx', 
'http://www.diotronic.com/semiconductores/triacs-thyristores/thyristores_p_7.aspx', 
'http://www.diotronic.com/semiconductores/ci-s-logicos/serie-74-74f-74c_p_992.aspx', 
'http://www.diotronic.com/semiconductores/ci-s-logicos/serie-74als-74ls_p_993.aspx', 
'http://www.diotronic.com/semiconductores/ci-s-logicos/serie-74hc_p_994.aspx', 
'http://www.diotronic.com/semiconductores/ci-s-logicos/pals-gals-logica-programable_p_997.aspx', 
'http://www.diotronic.com/semiconductores/ci-s-logicos/varios_p_998.aspx', 
'http://www.diotronic.com/semiconductores/ci-s-logicos/serie-40xx-45xx_p_999.aspx', 
'http://www.diotronic.com/semiconductores/micros-perifericos/perifericos-interface_p_59.aspx', 
'http://www.diotronic.com/semiconductores/micros-perifericos/microcontroladores_p_58.aspx', 
'http://www.diotronic.com/semiconductores/micros-perifericos/microprocesadores_p_57.aspx', 
'http://www.diotronic.com/semiconductores/conversores/conversores-a-d-y-d-a_p_1000.aspx', 
'http://www.diotronic.com/semiconductores/conversores/conversores-v-f-y-f-v_p_1001.aspx', 
'http://www.diotronic.com/semiconductores/conversores/conversores-varios_p_1002.aspx', 
'http://www.diotronic.com/semiconductores/amplificadores-comparadores-timers-contadores/amplificadores-precision-instrumentacion_p_1003.aspx', 
'http://www.diotronic.com/semiconductores/amplificadores-comparadores-timers-contadores/amplificadores-operacionales-uso-general_p_1004.aspx', 
'http://www.diotronic.com/semiconductores/amplificadores-comparadores-timers-contadores/comparadores-detectores-de-tension_p_1005.aspx', 
'http://www.diotronic.com/semiconductores/amplificadores-comparadores-timers-contadores/amplificadores-audio-video_p_1006.aspx', 
'http://www.diotronic.com/semiconductores/amplificadores-comparadores-timers-contadores/timers-osciladores-generadores-de-funcion_p_1007.aspx', 
'http://www.diotronic.com/semiconductores/amplificadores-comparadores-timers-contadores/contadores_p_1008.aspx', 
'http://www.diotronic.com/semiconductores/reguladores-y-referencias/reguladores_p_1009.aspx', 
'http://www.diotronic.com/semiconductores/reguladores-y-referencias/referencias_p_1010.aspx', 
'http://www.diotronic.com/semiconductores/circuitos-de-control-drivers-acondicionadores/drivers-para-motores_p_1011.aspx', 
'http://www.diotronic.com/semiconductores/circuitos-de-control-drivers-acondicionadores/arrays-de-transistores-y-diodos_p_1012.aspx', 
'http://www.diotronic.com/semiconductores/circuitos-de-control-drivers-acondicionadores/drivers-contadores-decos-para-leds-y-lcds_p_1013.aspx', 
'http://www.diotronic.com/semiconductores/circuitos-de-control-drivers-acondicionadores/drivers-acondicionadores-receptores-linea_p_1014.aspx', 
'http://www.diotronic.com/semiconductores/circuitos-de-control-drivers-acondicionadores/encoders-decoders-pll-filtros_p_1015.aspx', 
'http://www.diotronic.com/semiconductores/circuitos-audio-radio-video-tv-consumo/grabadores-sintetizadores-audio_p_1016.aspx', 
'http://www.diotronic.com/semiconductores/circuitos-audio-radio-video-tv-consumo/taxx-taaxx-tbaxx-tcaxx-tdaxx_p_1017.aspx', 
'http://www.diotronic.com/semiconductores/circuitos-audio-radio-video-tv-consumo/circuitos-consumo-varios_p_1018.aspx', 
'http://www.diotronic.com/semiconductores/sensores/de-temperatura_p_1019.aspx', 
'http://www.diotronic.com/semiconductores/sensores/sensores-varios_p_1022.aspx', 
'http://www.diotronic.com/semiconductores/programadores-grabadores-kits-desarrollo/kits-de-desarrollo_p_62.aspx', 
'http://www.diotronic.com/semiconductores/programadores-grabadores-kits-desarrollo/programadores-grabadores-borradores_p_64.aspx', 
'http://www.diotronic.com/semiconductores/reles-estaticos-capsulas-ultrasonicas-varios/reles-estaticos_p_65.aspx', 
'http://www.diotronic.com/semiconductores/reles-estaticos-capsulas-ultrasonicas-varios/capsulas-ultrasonicas_p_1026.aspx', 
'http://www.diotronic.com/semiconductores/reles-estaticos-capsulas-ultrasonicas-varios/juegos-de-integrados_p_1027.aspx', 
'http://www.diotronic.com/optoelectronica/optoacopladores/optoacopladores_p_76.aspx', 
'http://www.diotronic.com/optoelectronica/fibra-optica/enlaces-agilent-bajo-coste_p_78.aspx', 
'http://www.diotronic.com/optoelectronica/fibra-optica/conversores-electronica_p_79.aspx', 
'http://www.diotronic.com/optoelectronica/fibra-optica/latiguillos-y-pigtails_p_80.aspx', 
'http://www.diotronic.com/optoelectronica/fibra-optica/herramientas-instrumentos_p_81.aspx', 
'http://www.diotronic.com/optoelectronica/fibra-optica/conectores-adaptadores_p_82.aspx', 
'http://www.diotronic.com/optoelectronica/fibra-optica/paneles-y-cajas_p_84.aspx', 
'http://www.diotronic.com/optoelectronica/fibra-optica/fibra-optica-audio_p_538.aspx', 
'http://www.diotronic.com/optoelectronica/leds/leds-smd_p_622.aspx', 
'http://www.diotronic.com/optoelectronica/leds/pilotos-led_p_623.aspx', 
'http://www.diotronic.com/optoelectronica/leds/leds-potencia_p_624.aspx', 
'http://www.diotronic.com/optoelectronica/leds/leds-pirana_p_625.aspx', 
'http://www.diotronic.com/optoelectronica/leds/leds-5-mm_p_626.aspx', 
'http://www.diotronic.com/optoelectronica/leds/leds-2-y-3-mm_p_627.aspx', 
'http://www.diotronic.com/optoelectronica/leds/leds-8-10-20-mm_p_628.aspx', 
'http://www.diotronic.com/optoelectronica/leds/leds-bicolor_p_629.aspx', 
'http://www.diotronic.com/optoelectronica/leds/accesorios_p_630.aspx', 
'http://www.diotronic.com/optoelectronica/leds/cintas-de-leds-modulos-de-led_p_639.aspx', 
'http://www.diotronic.com/optoelectronica/display-a-led/7-segmentos_p_631.aspx', 
'http://www.diotronic.com/optoelectronica/display-a-led/matrices_p_632.aspx', 
'http://www.diotronic.com/optoelectronica/display-a-led/barras-de-led_p_633.aspx'];

// Scraping urls
function scrapeDio(urls) {
    var urlPromises = urls.map(function(url) {
        return request(url).spread(function(response, html){
            if (response.statusCode == 200) {
                var $ = cheerio.load(html);
                var elements = $('.IframePrincipal > table > tr:not(:first-child)').toArray();
                // Items to scrape
                return elements.map(function(el, index){
                    var title = $(el).find('h2').text().trim();
                    var stock = $(el).find('td > table > tr > td:nth-child(2) > table > tr:nth-child(3)').text().trim();
                    var price = parseFloat($(el).find('td > table > tr > td:nth-child(2) > table > tr:nth-child(4) > td > table > tr:first-child').text().replace(/\€|,/g, '.'));
                    // Push items into data array
                    return {Title: title, Stock: stock, Price: price};
                });
            }
            else {
                return [];
            }
        }, function(error){
            console.log("Error");
            return [];
        });
    });
    return Promise.all(urlPromises).then(flatten);
}

module.exports.scrapeDio = scrapeDio(urls);