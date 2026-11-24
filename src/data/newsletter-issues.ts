import type {
  NewsletterIssueTrack,
  NewsletterNarrator,
} from "@/lib/newsletter-tracks";
import type { SanityNewsletterIssue } from "@/lib/sanity";

export interface NewsletterIssueDraft {
  id: string;
  issueNumber: string;
  internalName: string;
  track: NewsletterIssueTrack;
  narrator: NewsletterNarrator;
  storySlug: string;
  localHeroImage: string;
  heroImageAltEn: string;
  heroImageAltEs: string;
  heroImageCaptionEn: string;
  heroImageCaptionEs: string;
  narratorLocationEn: string;
  narratorLocationEs: string;
  titleEn: string;
  subjectEn: string;
  previewTextEn: string;
  introEn: string;
  bodyEn: string;
  replyPromptEn: string;
  psEn: string;
  ctaTextEn: string;
  titleEs: string;
  subjectEs: string;
  previewTextEs: string;
  introEs: string;
  bodyEs: string;
  replyPromptEs: string;
  psEs: string;
  ctaTextEs: string;
}

export const newsletterIssueDrafts: readonly NewsletterIssueDraft[] = [
  {
    id: "newsletter-issue-a1",
    issueNumber: "Issue #01",
    internalName: "Issue #01 · Three states for one leather bag",
    track: "all",
    narrator: "shirish",
    storySlug: "matching-a-workshop-to-the-product",
    localHeroImage: "/images/workshops/leather-bags-export-cartons.jpeg",
    heroImageAltEn:
      "Eleven stretch-wrapped export cartons numbered and labelled by bag style and colour ready for air freight from India to Spain",
    heroImageAltEs:
      "Once cajas de exportación flejadas, numeradas y etiquetadas por modelo y color listas para su envío aéreo de la India a España",
    heroImageCaptionEn:
      "Eleven cartons wrapped and labelled by black and tan style codes right before our eventful first air shipment to Spain.",
    heroImageCaptionEs:
      "Once cajas embaladas y etiquetadas por modelo en negro y tono tan justo antes de nuestro movido primer envío aéreo a España.",
    narratorLocationEn: "Our studio near Mumbai",
    narratorLocationEs: "Desde nuestro estudio cerca de Bombay",
    titleEn: "Three states for one leather bag",
    subjectEn: "Three states for one leather bag",
    previewTextEn: "Our first samples missed the feel completely.",
    introEn: `When a leather-goods boutique in Donostia asked us to produce four bag styles in black and tan, the founder did not hand us a tannery code. He gave us a Basque phrase: he wanted leather that felt *goxo-goxo*. Silky, warm, and soft enough that you want to keep touching it on the counter.

Over the phone, almost every workshop in India says yes to that brief. In person, the story changes fast.`,
    bodyEn: `Alma and I travelled across leather clusters and paid out of our own pocket for trial samples. The first bags looked fine in photographs. The second we held them in our hands, they felt stiff, dry, and lifeless. They were not *goxo-goxo*.

Whenever a production snag refuses to budge, I go back to a simple rule: stop forcing one roof to do two different crafts. India's manufacturing strength lives in specialist clusters, not inside one single city.

**We split the bag across states.** We had the hides vegetable-tanned in Kolkata, where the tanneries know how to hit that supple hand-feel, then moved the finished leather to Uttar Pradesh for cleaner stitching and soft-bag assembly. From our studio near Mumbai, we handled hide checks, agreements, and production oversight.

Even the smallest pieces demanded patience. When Alma asked for Spanish hangtags on unbleached recycled board instead of bright bleached paper, our Manufacturing Partner spent fifteen days hunting down the exact cardboard. Before a single tan hide was cut, Alma flew in and spent a full week beside the makers checking the dye lot in daylight, running live video calls so the boutique founder could meet the people stitching his bags.

And no, the airport run was not smooth either. Without a corporate courier account on our first independent export, initial freight quotes came back at six to seven lakh rupees, higher than the entire production cost. We found a freight contact willing to learn alongside a customs specialist in Delhi, survived three sleepless nights over a false Spanish customs hold notice, and watched all eleven cartons land outside the boutique door in Donostia. Two days later, all eight bags filled his entire downtown window.`,
    replyPromptEn:
      "Where does sampling or production usually break down first when you test a new maker?",
    psEn: "Next issue, Alma takes over with the story of unzipping a suitcase of upcycled Indian sarees in Madrid and finishing a shoot after dark at Estación de Príncipe Pío.",
    ctaTextEn: "Read the full workshop Story on our website",
    titleEs: "Tres estados para un solo bolso",
    subjectEs: "Tres estados para un solo bolso",
    previewTextEs: "Las primeras muestras fallaron por completo al tacto.",
    introEs: `Cuando una tienda de marroquinería de Donostia nos encargó cuatro modelos de bolso en negro y en tono tan, su dueño no nos dio un código de curtiduría. Nos dio una expresión en euskera: quería una piel *goxo-goxo*. Sedosa, cálida y tan suave que apetezca seguir tocándola en el mostrador.

Por teléfono, casi cualquier taller de la India dice que sí a ese encargo. En persona, la película cambia en cinco minutos.`,
    bodyEs: `Alma y yo recorrimos varios polos peleteros y pagamos de nuestro bolsillo las primeras pruebas. En foto daban el pego. En cuanto las cogimos con las manos, resultaron rígidas, secas y sin caída. Aquello no era *goxo-goxo*.

Cuando un fallo técnico se enquista, aplico una regla sencilla: deja de obligar a un solo techo a dominar dos oficios distintos. La fuerza productiva de la India está repartida en regiones especializadas, no concentrada en una sola ciudad.

**Dividimos el bolso entre estados.** Mandamos curtir las pieles en Calcuta, donde las curtidurías dominan ese tacto blando y natural, y llevamos el cuero terminado a Uttar Pradesh, donde el taller tenía líneas más limpias para coser y armar bolsos blandos. Desde nuestro estudio cerca de Bombay coordinamos los acuerdos, las revisiones y los plazos.

Hasta los detalles pequeños pidieron paciencia. Cuando Alma pidió etiquetas en español sobre cartón reciclado sin blanquear, libre de químicos, nuestro taller colaborador pasó quince días buscando exactamente ese cartón en vez de colocar lo que tenía a mano. Y antes de cortar una sola piel en tono tan, Alma viajó para pasar una semana entera codo con codo con el taller revisando la partida a luz natural, mientras conectaba por videollamada al dueño de la tienda con quienes cosían sus bolsos.

Tampoco voy a maquillar la salida al aeropuerto. Al ser nuestra primera exportación directa sin tarifa corporativa, los primeros presupuestos de envío aéreo subieron a seis o siete lakhs de rupias, más que toda la producción. Buscamos un agente dispuesto a remangarse junto a un contacto de aduanas en Delhi, pasé tres noches en vela por un falso aviso de retención en España y, por fin, las once cajas llegaron a la puerta de la tienda en Donostia. Dos días después, los ocho modelos llenaban su escaparate principal.`,
    replyPromptEs:
      "Cuando pruebas un taller nuevo, ¿en qué punto suele atascarse antes el proceso de muestras o producción?",
    psEs: "En la próxima carta toma el relevo Alma para contarte qué pasó al abrir una maleta llena de saris transformados en Madrid y terminar una sesión de noche en Príncipe Pío.",
    ctaTextEs: "Leer la historia completa sobre este taller",
  },
  {
    id: "newsletter-issue-b1",
    issueNumber: "Issue #02",
    internalName: "Issue #02 · Nobody pictured it until I opened the bag",
    track: "all",
    narrator: "alma",
    storySlug: "giving-maharashtrian-sarees-a-second-life",
    localHeroImage:
      "/images/almarise/almarise-reborn-olive-pallu-shrug-madrid-street.jpeg",
    heroImageAltEn:
      "Maria walking across a sunlit brick street in Madrid wearing an olive floral saree shrug with purple striped pallu sleeves over a black dress",
    heroImageAltEs:
      "María caminando por una calle soleada de Madrid con un shrug floral oliva de sari con mangas listadas del pallu sobre un vestido negro",
    heroImageCaptionEn:
      "Maria walking in Madrid during our September shoot: cut from one saree so the striped pallu forms the sleeves and the paisley border runs along the hem.",
    heroImageCaptionEs:
      "María caminando por Madrid en nuestra sesión de septiembre: cortado de un único sari para que el pallu a rayas dibuje las mangas y la cenefa remate el bajo.",
    narratorLocationEn: "Between Madrid and our studio near Mumbai",
    narratorLocationEs: "Entre Madrid y nuestro estudio cerca de Bombay",
    titleEn: "Nobody pictured it until I opened the bag",
    subjectEn: "Nobody pictured it until I opened the bag",
    previewTextEn: "Shooting saree shrugs at an old Madrid station.",
    introEn: `Back in Spain, trying to explain AlmaRise D Brand in words got me nowhere. Family, friends, and even Maria, who agreed to model for me, stared politely with zero picture in their heads of what an upcycled Indian saree looked like.

So I stopped explaining. I booked an afternoon in old Madrid, hid every garment inside my suitcase, and gave Maria one rule: wear plain black, white, or denim you already own.`,
    bodyEn: `AlmaRise D Brand never started as a neat business-school idea. When Shirish and I first talked about making clothes in India, we wanted organic cotton, and frankly we did not have the money to commission fresh fabric rolls from a mill. At the same time, stepping into Indian homes, we kept seeing *thevnitlya sadya*: treasured wedding and festival sarees folded inside cupboards long after women stopped wearing them.

Instead of buying new cloth, we started acquiring those sarees for a fair payment or by donation and cutting **one single pattern per saree**. Each piece has to go on cleanly in ten seconds before you catch the metro, train, or bus in Spain.

The second I unzipped that suitcase in Madrid and pulled out the shrugs, Maria just went, "Ooh! Ooh!" She slipped them over her own faded jeans, shorts, and a simple black dress. As soon as she started walking naturally down the street, passersby stopped and stared. Every time someone lingered, I walked up and asked what they thought. Almost everyone said the same thing: "Oh wow, that is a good idea."

We ended that September evening at Estación de Príncipe Pío without a permit. Male guards stopped us immediately near the old platforms until a female security guard stepped forward, told her colleague, "I handle this," and quietly coached us to move to the far end and switch to a regular everyday camera so nobody bothered us. We wrapped past ten at night in the dark.

That day proved what Shirish puts in one line: when you pair a saree nobody wears anymore in India with plain basics sitting in the back of a closet in Spain, you give **two wardrobes a second life at once**.`,
    replyPromptEn:
      "What is one piece hanging in your wardrobe right now that you stopped wearing because nothing pairs with it?",
    psEn: "In our next issue, I will share why I hide bad production samples before a Client ever sees them, and why I talked a boutique owner out of metal zippers.",
    ctaTextEn: "Read the full AlmaRise D Brand Story on our website",
    titleEs: "Nadie lo veía hasta que abrí la maleta",
    subjectEs: "Nadie lo veía hasta que abrí la maleta",
    previewTextEs: "Fotos con saris transformados en Príncipe Pío.",
    introEs: `De vuelta en España, explicar AlmaRise D Brand de palabra no me servía de nada. Familia, amigos y hasta María, que se ofreció a posar, asentían con educación sin lograr imaginarse cómo quedaba un sari indio convertido en una prenda para el día a día.

Así que dejé de dar explicaciones. Quedé una tarde de septiembre en el Madrid antiguo sin enseñar ni una sola pieza antes y le puse a María una única condición: trae ropa lisa tuya en negro, blanco o vaquero.`,
    bodyEs: `AlmaRise D Brand tampoco nació de un plan perfecto en un despacho. Al principio Shirish y yo queríamos empezar con algodón orgánico, y siendo sincera, no teníamos capital para encargar rollos nuevos a una fábrica textil. Al mismo tiempo, entrando en casas en la India, veíamos una y otra vez los *thevnitlya sadya*: saris de boda y celebraciones guardados con cariño en los armarios años después de dejar de usarlos.

En vez de comprar tela nueva, empezamos a adquirir esos saris con un pago justo o por donación y a sacar **un único patrón de cada sari**. Todo con una regla práctica para España y Europa: tiene que poderse poner en diez segundos antes de salir corriendo hacia el metro, el cercanías o el autobús.

En cuanto abrí la cremallera de la maleta en Madrid y empecé a sacar los shrugs, María solo decía: "¡Oh! ¡Oh!". Se los probó encima de sus propios vaqueros, unos pantalones cortos y un vestido negro básico. Al caminar con naturalidad por la acera, la gente se giraba y se paraba a preguntar. Cada vez que alguien se quedaba mirando me acercaba a charlar un minuto, y casi todo el mundo respondía lo mismo: "Oye, pues es muy buena idea".

Terminamos la tarde en la Estación de Príncipe Pío, ya casi de noche y sin permiso de rodaje. Unos vigilantes nos pararon en seco cerca de los andenes hasta que se acercó una vigilante, le dijo a su compañero "yo me encargo" y, en voz baja, nos indicó que bajáramos al fondo y guardáramos la cámara analógica para hacer fotos normales como un grupo de amigos. Recogimos pasadas las diez de la noche.

Aquella tarde confirmó lo que siempre dice Shirish: cuando te pones un sari sin uso de la India sobre ropa olvidada en tu armario en España, les das **una segunda vida a dos armarios a la vez**.`,
    replyPromptEs:
      "¿Qué prenda tienes colgada en el armario que dejaste de ponerte porque ya no sabes con qué combinarla?",
    psEs: "En la próxima carta te contaré por qué escondo las muestras malas antes de enseñárselas a un cliente y por qué convencí a un dueño de tienda de cambiar unas cremalleras metálicas.",
    ctaTextEs: "Leer la historia completa de AlmaRise D Brand",
  },
  {
    id: "newsletter-issue-a2",
    issueNumber: "Issue #03",
    internalName: "Issue #03 · The samples I never show you",
    track: "all",
    narrator: "alma",
    storySlug: "why-sample-approval-decides-bulk",
    localHeroImage: "/images/workshops/alma-cognac-leather-cutting-table.jpeg",
    heroImageAltEn:
      "Alma checking brown leather hides beside a finished brown crossbody bag sample with antique brass hardware in an Indian workshop",
    heroImageAltEs:
      "Alma comprobando pieles marrones junto a un bolso bandolera de muestra terminado con herrajes en latón envejecido en un taller de la India",
    heroImageCaptionEn:
      "Checking brown hides beside a finished crossbody sample with brass hardware. Even when a piece looks ready, I hunt for what needs fixing before bulk.",
    heroImageCaptionEs:
      "Revisando pieles marrones junto a una bandolera de muestra con herrajes en latón. Aunque la pieza parezca lista, busco qué corregir antes de producir en serie.",
    narratorLocationEn: "Our studio near Mumbai",
    narratorLocationEs: "Desde nuestro estudio cerca de Bombay",
    titleEn: "The samples I never show you",
    subjectEn: "The samples I never show you",
    previewTextEn: "Why I point out flaws you did not even notice.",
    introEn: `Whenever an Indian workshop finishes a prototype for one of our Clients, I inspect it in my own hands first. If the strap pulls, the lining drags, or the silhouette feels heavy, our Client never sees it. It goes straight back to the bench.

Even when a sample passes and the Client loves it on a video call, I still point out every tiny flaw they missed.`,
    bodyEn: `"I am not 100% happy with this, and this will be changed." I say that sentence on purpose, from day one. If something ever slips past me in the future that I genuinely did not catch, no Client will ever wonder whether I tried to hide it.

Real sample approval is rarely about rubber-stamping a drawing. On a recent leather backpack collection for a boutique in Donostia, the starting sketch was literally four rough lines. We reshaped the boxy rectangle into a subtle pyramid so it sits cleanly on a woman's back, swapped dark lining for light striped cotton so you can actually find your keys, and upgraded the hardware to antique brass.

**Then came the pushback that saves returns six months later.** Even with top-tier Japanese zippers, I told the owner to switch from metal teeth to moulded plastic teeth. Metal teeth look sharp on a showroom shelf, right up until a shopper reaches inside and scratches her knuckles, or the back pocket rubs against her wool winter coat all season.

Another mistake taught us a rule we now enforce with every new Client: **never match a dye colour through a screen.** Because we could not get a physical tan sample into the tannery until August, dyeing was delayed by months. Today, before a single hide hits a dye drum, every Client sends us a physical piece in their target shade, whether an old belt, a purse, or a swatch from home.

I never promise that weather or freight will never shift a week on a calendar. What I promise is checking every stage double, triple, and five times over so that when the cartons open in Europe, there are zero surprises inside.`,
    replyPromptEn:
      "Have you ever approved a sample on sight, only to regret a small detail once bulk arrived?",
    psEn: "For every Product Brief call, we send written minutes within ten minutes so nothing gets lost between Europe and India. You can read the full sampling Story below.",
    ctaTextEn: "Read the full sampling Story on our website",
    titleEs: "Las muestras que nunca te enseño",
    subjectEs: "Las muestras que nunca te enseño",
    previewTextEs: "Por qué saco a la luz fallos que ni habías visto.",
    introEs: `Cada vez que un taller en la India termina un prototipo para uno de nuestros clientes, lo reviso primero con mis propias manos. Si una correa tira, el forro se engancha o la silueta pesa más de la cuenta, el cliente ni llega a verlo. Vuelve directo al banco de trabajo.

E incluso cuando una muestra pasa el filtro y al cliente le encanta en la videollamada, señalo yo misma cualquier pequeño detalle que se le haya escapado.`,
    bodyEs: `"No estoy al cien por cien contenta con esto, y esto se va a cambiar." Digo esa frase a propósito desde el primer día. Así, si mañana se me escapa algo que de verdad no vi, ningún cliente pensará jamás que intenté taparlo.

Aprobar una muestra de verdad casi nunca consiste en copiar un dibujo a ciegas. En una colección de mochilas de piel para una tienda de Donostia, el boceto inicial eran literalmente cuatro líneas. Suavizamos el rectángulo en una ligera pirámide para que apoye bien en la espalda, cambiamos el forro oscuro por algodón claro a rayas para ver las llaves dentro y subimos los herrajes a latón envejecido.

**Luego llegó la conversación incómoda que evita devoluciones seis meses después.** Aunque montábamos cremalleras japonesas de primera, le aconsejé cambiar los dientes metálicos por dientes de plástico moldeado. El metal queda precioso en el escaparate, hasta que una clienta mete la mano y se araña los nudillos o el bolsillo trasero le estropea el abrigo de lana en invierno.

Otro tropiezo nos dejó una norma fija para cualquier pedido nuevo: **nunca igualar un color a través de una pantalla.** Como no pudimos entregar una referencia física del tono tan exacto hasta agosto, el teñido se retrasó meses. Hoy, antes de que una sola piel entre en el bombo, pedimos siempre una pieza física de referencia, ya sea un cinturón viejo, un monedero o un retal.

Nunca prometo que una lluvia o un flete no muevan una fecha una semana. Lo que sí prometo es revisar cada fase dos, tres y hasta cinco veces para que, al abrir las cajas en Europa, no haya ni un solo susto dentro.`,
    replyPromptEs:
      "¿Alguna vez aprobaste una muestra a primera vista y te arrepentiste de un pequeño detalle al recibir la producción?",
    psEs: "Después de cada videollamada enviamos un resumen escrito en diez minutos para que nada se quede en el aire entre España y la India. Debajo tienes la historia completa.",
    ctaTextEs: "Leer la historia completa sobre muestras",
  },
  {
    id: "newsletter-issue-b2",
    issueNumber: "Issue #04",
    internalName: "Issue #04 · Three biryanis on Eid",
    track: "all",
    narrator: "alma",
    storySlug: "three-biryanis-on-eid",
    localHeroImage: "/images/culture/alma-brown-idli-sambar-india-table.jpg",
    heroImageAltEn:
      "Alma smiling over a steel thali of steamed brown idlis, sambar, and chutney at the office in India",
    heroImageAltEs:
      "Alma sonriendo frente a un plato metálico con idlis oscuros al vapor, sambar y chutney en nuestra oficina en la India",
    heroImageCaptionEn:
      "Eating brown idlis with sambar and chutney in our office in India. My first time trying brown idli, and it tastes nothing like the white ones.",
    heroImageCaptionEs:
      "Comiendo idlis oscuros con sambar y chutney en nuestra oficina en la India. Era mi primera vez con idlis oscuros y no saben nada parecido a los blancos.",
    narratorLocationEn: "Our office in India",
    narratorLocationEs: "Desde nuestra oficina en la India",
    titleEn: "Three biryanis on Eid",
    subjectEn: "Three biryanis on Eid",
    previewTextEn: "Indian hospitality nearly beat my Spanish stomach.",
    introEn: `Last year on Eid, everybody invited us home. I ate three full biryani meals in a single day, plus every snack placed in front of me.

By the third house I was practically sick. I kept saying, "No, no, thank you, no more," and they kept answering, "Oh no, you do not like it? Eat more!"`,
    bodyEn: `People in India often ask me to compare European and Indian food as if Europe were one kitchen. You really cannot group it together. Southern Europe shares a habit of cooking and gathering, while France shuts lunch kitchens strictly around twelve-thirty and England eats heavy, non-spicy dinners by six or seven at night.

What surprised me most about living in India is that proper hot food exists at every hour, even midnight or one in the morning. In Spain you see a house, a shop, a bar on every block, yet we stop in for coffee or a cold drink rather than full plates round the clock. Still, the moment someone crosses our doorstep in Spain, out come drinks and biscuits, or wine and snacks. **We do not understand gathering without food.**

Inside Indian homes, the biggest shock was how the exact same dish changes completely from one door to the next. Around Diwali I fell in love with *chakli*, the spiral crunchy snack whose Marathi name I still forget, and *shankarpali*, like small sweet croutons. In one home a snack is fiery hot; in the next it is mild and crisp. The same goes for biryani. The best chicken biryani I have ever eaten was at the home of Shirish's Muslim friend's sister, where every spice lived inside the rice grain itself.

At first, Shirish's mum kept piling spicy dinner onto my plate at night while I repeated, "No thank you, baba, I have had enough," until one night my stomach gave up and Shirish scolded her. I stopped him straight away because they do it out of love. Now it is a running joke whenever we sit down: "Do not feel we are forcing you!"

Watching mothers cook here always takes me back to my mum in Spain. She hated cooking, swore she was bad at it, and yet rolled giant oblong minced-meat croquetas in thick béchamel for a household of eight. Nobody has matched them since.`,
    replyPromptEn:
      "What was the first home-cooked meal in another country that completely surprised you?",
    psEn: "The full Story includes photos of those brown idlis, Diwali chakli, home biryani, and the exact kind of oblong croquetas my mum used to fry in Spain.",
    ctaTextEn: "Read Three biryanis on Eid on our website",
    titleEs: "Tres biryanis en un solo Eid",
    subjectEs: "Tres biryanis en un solo Eid",
    previewTextEs: "La hospitalidad india casi puede con mi estómago español.",
    introEs: `El año pasado en Eid nos invitaron a comer en varias casas el mismo día. Me tomé tres platos completos de biryani seguidos, con todos sus entrantes.

En la tercera casa estaba prácticamente enferma. Yo repetía: "No, no, gracias, no puedo más", y me contestaban al segundo: "¡Pero cómo, no te gusta? ¡Come más!".`,
    bodyEs: `Aquí en la India me piden muchas veces que compare la comida europea con la india como si Europa fuera una sola cocina. Imposible. Los países del sur compartimos cierta manera de cocinar y juntarnos, pero en Francia cierran las cocinas a las doce y media o la una en punto y en Inglaterra cenan fuerte y sin picante a las seis o las siete de la tarde.

Lo que más me sorprendió viviendo en la India es encontrar comida recién hecha a cualquier hora, incluso a medianoche o a la una de la madrugada. En España ves una casa, una tienda y un bar en cada calle, pero entramos a por un café o una caña, no a comer platos enteros a todas horas. Eso sí, en cuanto alguien cruza la puerta de una casa española, lo primero que sale es algo de beber y de picar. **No entendemos juntarnos sin comida.**

Donde más noté la riqueza de la cocina india fue dentro de las casas, porque una misma receta cambia por completo de una puerta a otra. En Diwali me enganché a los *chakli*, esos aperitivos crujientes en espiral cuyo nombre aún olvido, y a los *shankarpali*, que parecen picatostes dulces. En una casa pican una barbaridad y en la siguiente son suaves. Con el biryani pasa igual: el mejor biryani de pollo que he probado fue en casa de la hermana de un amigo musulmán de Shirish, con todo el sabor metido dentro del grano de arroz.

Al principio, la madre de Shirish me servía y me volvía a servir cena picante mientras yo decía "no, gracias, baba, ya tengo bastante", hasta que una noche me puse mala y Shirish la regañó. Le frené enseguida porque lo hacen con todo el cariño. Hoy ya es nuestra broma habitual: "¡Pero no sientas que te estamos obligando!".

Ver cocinar a las madres aquí siempre me lleva a la mía en España. Detestaba cocinar, juraba que no sabía, y aun así hacía unas croquetas enormes de carne picada con bechamel espesa para los ocho de casa que nadie ha igualado todavía.`,
    replyPromptEs:
      "¿Cuál fue la primera comida casera en otro país que te sorprendió de verdad?",
    psEs: "En la historia completa tienes las fotos de los idlis oscuros, los chakli de Diwali, el biryani casero y el estilo exacto de croquetas que hacía mi madre en España.",
    ctaTextEs: "Leer Tres biryanis en Eid en la web",
  },
  {
    id: "newsletter-issue-a3",
    issueNumber: "Issue #05",
    internalName: "Issue #05 · Why we sit on the factory floor",
    track: "all",
    narrator: "shirish",
    storySlug: "matching-a-workshop-to-the-product",
    localHeroImage:
      "/images/workshops/shirish-artisan-cotton-lining-bench-india.jpeg",
    heroImageAltEn:
      "Smiling woman artisan at a workshop bench with yellow-and-white striped cotton linings, glue bottle, and leather straps beside Shirish",
    heroImageAltEs:
      "Artesana sonriendo en su banco de trabajo con forros de algodón a rayas amarillas y blancas y correas de piel junto a Shirish",
    heroImageCaptionEn:
      "Stopping at the lining and strap bench to talk through the day's assembly instead of staying inside the owner's office.",
    heroImageCaptionEs:
      "Parándome en el banco de forros y correas para comentar el montaje del día en lugar de quedarme en el despacho del propietario.",
    narratorLocationEn: "On the road across India",
    narratorLocationEs: "De ruta por talleres en la India",
    titleEn: "Why we sit on the factory floor",
    subjectEn: "Why we sit on the factory floor",
    previewTextEn: "A polite yes hides a lot until you watch the line.",
    introEn: `Most foreign buyers fly into India, shake hands inside the factory owner's air-conditioned office, inspect a neat tray of samples, and head back to the airport.

They never say a single word to the person skiving the hide, gluing the lining, or running the heavy strap machine.`,
    bodyEn: `Alma and I do the opposite. When we evaluate a workshop, we walk past the office, sit beside the operators on the floor, and ask plain questions about their craft. "Is this seam tricky? Show me how you guide it."

The atmosphere in the room changes within minutes. People used to being ignored behind a glass partition straighten up, smile, and point out how a thick strap feeds under the needle or how striped cotton linings are trimmed clean. **When a maker is treated as a craftsman instead of invisible labour, quality turns into personal pride.**

That habit is also our fastest honesty filter. On a first visit, hesitation about letting strangers near the benches is completely fair; owners worry about competitors copying their setup, and we respect that while earning trust. If a workshop still keeps its production doors shut once a relationship is built, they are hiding something. At that point the conversation stops and we walk away.

As a registered Bar Council lawyer in India, I back every open visit with clear, balanced written agreements. Spoken promises hurt both sides: European founders worry about paying a deposit and receiving weak cartons, and honest Indian makers worry about buyers changing specs halfway through a run. Written terms protect everyone, and even then, no signed page is a lifetime pass. Every Manufacturing Partner proves themselves run after run.`,
    replyPromptEn:
      "When did seeing a process in person change a decision you thought was already settled?",
    psEn: "We keep auditing new family-run factories every month across India, including the Indian vegan-leather makers we are currently testing for upcoming Client briefs.",
    ctaTextEn: "Read how we audit Indian makers in person",
    titleEs: "Por qué nos sentamos en la nave",
    subjectEs: "Por qué nos sentamos en la nave",
    previewTextEs: "Un sí amable oculta mucho hasta que miras las máquinas.",
    introEs: `La mayoría de los compradores extranjeros aterrizan en la India, dan la mano en el despacho con aire acondicionado del dueño, miran una bandeja de muestras y vuelven al aeropuerto.

No cruzan ni una palabra con quien rebaja la piel, prepara los forros o cose las correas en la máquina pesada.`,
    bodyEs: `Alma y yo hacemos justo lo contrario. Cuando auditamos un taller, pasamos de largo el despacho, nos sentamos junto a los artesanos en la nave y les preguntamos por su trabajo. "¿Es complicado este paso? Enséñame cómo lo guías".

El ambiente cambia en cuestión de minutos. Personas acostumbradas a que nadie las mire detrás de un tabique se enderezan, sonríen y te muestran cómo entra una correa gruesa bajo la aguja o cómo dejan limpios los forros de algodón a rayas. **Cuando tratas a quien cose como a un profesional y no como a mano de obra invisible, la calidad se convierte en orgullo propio.**

Esa costumbre es además nuestro mejor filtro de transparencia. En una primera visita es normal que un propietario dude antes de abrir la nave a desconocidos por miedo a copias, y lo respetamos mientras construimos confianza. Pero si una vez avanzada la relación siguen cerrándonos la puerta del taller, ocultan algo. Ahí termina la conversación y nos marchamos.

Como abogado colegiado en la India, respaldo cada visita con acuerdos claros y justos por escrito. Las promesas de palabra perjudican a los dos lados: los fundadores europeos temen adelantar una señal y recibir cajas flojas, y los talleres serios temen que les cambien las condiciones a mitad de pedido. Un contrato claro protege a ambos, aunque nunca sea un cheque en blanco: cada taller colaborador demuestra su nivel pedido tras pedido.`,
    replyPromptEs:
      "¿Cuándo te hizo cambiar de decisión una visita en persona sobre algo que dabas por cerrado?",
    psEs: "Seguimos visitando talleres nuevos cada mes por toda la India, incluidos varios fabricantes locales de piel vegana que estamos probando ahora mismo para próximos encargos.",
    ctaTextEs: "Leer cómo auditamos talleres en la India",
  },
  {
    id: "newsletter-issue-b3",
    issueNumber: "Issue #06",
    internalName: "Issue #06 · Why we walked away from charity",
    track: "all",
    narrator: "alma",
    storySlug: "preparing-womens-garment-training-maharashtra",
    localHeroImage:
      "/images/almarise/karmarise-studio-sewing-tables-preparation-india.jpeg",
    heroImageAltEn:
      "Sunlit studio room in India with industrial sewing benches and a dress form under protective plastic covers and an open travel suitcase",
    heroImageAltEs:
      "Habitación soleada de nuestro estudio en la India con máquinas de coser industriales y un maniquí bajo plásticos protectores y una maleta abierta",
    heroImageCaptionEn:
      "Our studio room in India while everything is still in preparation: sewing benches and a dress form under dust covers, and my suitcase still open on the floor.",
    heroImageCaptionEs:
      "Nuestro estudio en la India todavía en preparación: las máquinas de coser y el maniquí bajo fundas, y mi maleta aún abierta en el suelo.",
    narratorLocationEn: "Our studio near Mumbai",
    narratorLocationEs: "Desde nuestro estudio cerca de Bombay",
    titleEn: "Why we walked away from charity",
    subjectEn: "Why we walked away from charity",
    previewTextEn: "What a 100-rupee milk bottle in Rajasthan taught me.",
    introEn: `First, let me be completely plain about something you may have read on our website: **our planned Women's Training Initiative has not started yet.** Not a single trainee has walked through our door for a class.

Right now, the sewing machines in that sunlit room sit under dust covers between AlmaRise D Brand sample runs while we build our commercial work and finish the legal paperwork.`,
    bodyEn: `Too many projects talk about a future plan as if it were already running. Shirish and I refuse to do that, because I already saw what happens when good intentions outrun reality.

Years ago in Spain, I volunteered with an organisation running three transitional houses for single immigrant mothers. What worked there was unsentimental: a roof for a year, language classes, a practical trade, and help stepping into a real job. Nobody kept anyone dependent.

Then in January 2023, I spent a month in Pushkar, in Rajasthan, visiting my friend Virginia's rural project. I arrived in full teacher mode ready to write an English syllabus, and hit a wall fast. I saw a newly refurbished rural school stripped bare shortly afterward, and Virginia taught me a street rule I never forgot: never buy milk for someone carrying a baby outside a shop. You pay a hundred rupees feeling noble; five minutes later the milk goes straight back to the shopkeeper for ninety rupees in cash.

That month ended my patience for Western pity. **We are not here to hand out food to anyone. We are here to teach adult women a commercial craft, and make sure paid work is waiting when they finish.**

Two foundations have to stand firm before we invite a single woman to enrol: steady commercial demand from our Manufacturing Programmes and AlmaRise D Brand, and the formal Section 8 non-profit foundation Shirish is steering through Indian and apostilled Spanish compliance. The day we pull those dust covers off for our first group, you will hear it straight from us.`,
    replyPromptEn:
      "What separates real skill-building from short-term charity in your own field?",
    psEn: "If you are a garment trainer, pattern master, or advisor in India who wants to share experience while we prepare the curriculum, reply directly to this email.",
    ctaTextEn: "Read the full honest update on our website",
    titleEs: "Por qué dijimos no a la caridad",
    subjectEs: "Por qué dijimos no a la caridad",
    previewTextEs: "Lo que aprendí con un bote de leche en Rajastán.",
    introEs: `Primero quiero dejarte algo muy claro por si lo has visto en nuestra web: **nuestra futura iniciativa de formación para mujeres todavía no ha empezado.** A día de hoy no ha entrado ninguna alumna a clase.

Ahora mismo, las máquinas de coser de esa sala siguen tapadas con fundas entre prueba y prueba de AlmaRise D Brand mientras consolidamos los pedidos comerciales y terminamos el papeleo legal.`,
    bodyEs: `Demasiados proyectos hablan de un plan futuro como si ya estuviera en marcha. Shirish y yo nos negamos, porque yo ya vi de cerca qué ocurre cuando las buenas intenciones corren más que la realidad.

Hace años, en España, fui voluntaria en una asociación que llevaba tres pisos de acogida para madres solteras inmigrantes. Allí funcionaba algo sencillo y sin dramatismos: un año de techo, clases de español, un oficio práctico y acompañamiento hasta un empleo real. Nadie fomentaba la dependencia.

Luego, en enero de 2023, pasé un mes en Pushkar, en Rajastán, con mi amiga Virginia en un proyecto rural. Llegué con mi gorra de profesora lista para montar un temario de inglés y choqué de frente con la realidad. Vi una escuela recién rehabilitada desmantelada al poco tiempo, y Virginia me dio una norma callejera que no he olvidado: nunca compres leche para alguien que te la pida con un bebé a la puerta de una tienda. Pagas cien rupias sintiéndote bien y cinco minutos después devuelven la leche al tendero a cambio de noventa rupias en efectivo.

Aquel mes me quitó para siempre la paciencia con la lástima occidental. **No estamos aquí para repartir comida a nadie; queremos enseñar un oficio textil de nivel profesional y asegurarnos de que haya trabajo real y pagado al terminar.**

Antes de abrir una sola plaza tienen que estar firmes dos pilares: demanda comercial estable en nuestros programas de fabricación y en AlmaRise D Brand, y la fundación sin ánimo de lucro Section 8 que Shirish está tramitando entre la India y la documentación apostillada de España. El día que quitemos las fundas para el primer grupo, te lo contaremos aquí mismo.`,
    replyPromptEs:
      "En tu sector, ¿qué distingue una formación útil de verdad de una ayuda pasajera?",
    psEs: "Si eres formadora textil, patronista o profesional de la confección en la India y quieres aportar experiencia mientras preparamos el programa, responde directamente a este correo.",
    ctaTextEs: "Leer la actualización completa en la web",
  },
  {
    id: "newsletter-issue-a4",
    issueNumber: "Issue #07",
    internalName: "Issue #07 · Where twenty percent disappears",
    track: "all",
    narrator: "shirish",
    storySlug: "from-spain-to-a-cutting-table-in-india",
    localHeroImage: "/images/workshops/alma-cognac-crossbody-hide-table.jpeg",
    heroImageAltEn:
      "Alma comparing an approved brown leather sample bag directly against a whole hide in an Indian workshop",
    heroImageAltEs:
      "Alma comparando una muestra aprobada de bolso en piel marrón directamente sobre una piel entera en un taller de la India",
    heroImageCaptionEn:
      "Alma laying an approved brown leather bag sample straight over a whole hide before cutting begins.",
    heroImageCaptionEs:
      "Alma apoyando una muestra aprobada de bolso en piel marrón directamente sobre una piel entera antes de empezar a cortar.",
    narratorLocationEn: "Our studio near Mumbai",
    narratorLocationEs: "Desde nuestro estudio cerca de Bombay",
    titleEn: "Where twenty percent disappears",
    subjectEn: "Where twenty percent disappears",
    previewTextEn: "Why a bag looks fine Tuesday and sags in Madrid.",
    introEn: `When a growing brand in Spain or Portugal looks beyond Ubrique, Alicante, or northern Portugal toward India, the trouble rarely begins with the craftsman holding the knife.

It starts with the chain of people taking a percentage before the order ever reaches the workshop.`,
    bodyEn: `In a typical export setup, a European sales agent takes five to eight percent and forwards your drawings to an Indian buying house. The buying house takes another eight to ten percent and passes a stripped-down sheet to a workshop owner.

Once nearly **twenty percent of the price has vanished** into hands that never touch the hide, nobody sends an email warning that the specification changed. A crisp 220-gram cotton twill lining quietly becomes a 140-gram poly-cotton blend. Solid brass buckles turn into barrel-plated rings that shine in a sample photo and pit during a three-week sea crossing from Nhava Sheva to Valencia or Barcelona.

Worse still happens on the cutting bench. A leather hide is tight and strong along the spine and butt, and soft and stretchy along the outer belly. When a squeezed workshop receives a vague slip saying "leather bag as per sample," the cutter pushes pattern templates out into the belly to save rupees. **A front panel cut from the belly looks identical on Tuesday. Three months later on a rail in Madrid, it sags out of shape.**

That is why Alma and I stay directly on both sides of the Product Brief. We negotiate a fair per-piece rate directly with the workshop owner in Marathi or Hindi so the factory can cut strictly from prime zones, put lining weight, hardware alloy, and EU REACH limits in writing, and lock identical counter-samples with a tamper-evident wire seal. One sealed twin stays hanging on the factory floor; the other stays with us for AQL 2.5 pre-shipment inspection.`,
    replyPromptEn:
      "Have you ever received a bulk batch where a hidden swap in lining, hardware, or fabric only showed up after delivery?",
    psEn: "If you are weighing your first run in India and want a plain look at realistic unit economics and REACH checks, hit reply with your rough quantity and category.",
    ctaTextEn: "Read the full cutting-bench Story on our website",
    titleEs: "Dónde se esfuma un veinte por ciento",
    subjectEs: "Dónde se esfuma un veinte por ciento",
    previewTextEs: "Por qué un bolso perfecto el martes cede en Madrid.",
    introEs: `Cuando una marca de España o Portugal crece más allá de los mínimos de Ubrique, Alicante o el norte de Portugal y mira hacia la India, el fallo rara vez nace en quien sostiene la cuchilla de corte.

Nace en la cadena de intermediarios que recorta el margen antes de que el encargo llegue al taller.`,
    bodyEs: `En el circuito habitual de exportación, un agente comercial en Europa se lleva entre un cinco y un ocho por ciento y reenvía los bocetos a una oficina de compras en la India. Esa oficina añade otro ocho o diez por ciento y entrega una hoja escueta al dueño del taller.

Cuando casi **un veinte por ciento del presupuesto ha desaparecido** por el camino, nadie escribe un correo avisando de que la ficha va a cambiar. Una sarga de algodón de 220 gramos pasa en silencio a un forro fino de 140 gramos. Las hebillas de latón macizo se sustituyen por herrajes bañados que brillan igual en foto, pero se pican tras tres semanas de barco desde Nhava Sheva hasta Valencia o Barcelona.

Lo peor ocurre al cortar la piel. Las fibras más firmes de un cuero están en el lomo y el crupón, mientras que la falda es blanda y elástica. Cuando un taller ahogado en precio recibe un albarán vago que solo dice "bolso según muestra", el cortador estira las plantillas hasta la falda para arañar cada centímetro. **Un frontal cortado de la falda parece idéntico el martes; tres meses después en una tienda de Madrid, se deforma.**

Por eso Alma y yo trabajamos directamente a ambos lados del briefing de producto. Pactamos un precio justo por unidad con el propietario en maratí o hindi para que corte solo de las zonas nobles, dejamos por escrito gramajes, aleaciones y límites europeos REACH, y cerramos muestras gemelas con precinto de alambre inviolable: una queda colgada en el taller y la otra con nosotros para la inspección AQL 2.5 antes de embarcar.`,
    replyPromptEs:
      "¿Te ha llegado alguna vez un pedido en serie donde un cambio silencioso de forro o herraje solo salió a la luz después de recibirlo?",
    psEs: "Si estás valorando tu primera producción en la India y quieres números claros sobre costes reales y requisitos REACH, responde a este correo con tu producto y tirada aproximada.",
    ctaTextEs: "Leer la historia completa en la web",
  },
  {
    id: "newsletter-issue-b4",
    issueNumber: "Issue #08",
    internalName: "Issue #08 · My grandfather's Modi signature",
    track: "all",
    narrator: "shirish",
    storySlug: "stone-forts-and-woven-borders-in-maharashtra",
    localHeroImage: "/images/culture/shirish-at-maharashtra-fort.jpg",
    heroImageAltEn:
      "Shirish standing inside a dressed dark basalt archway at a historic hill fort in Maharashtra",
    heroImageAltEs:
      "Shirish bajo un arco de basalto oscuro labrado en un fuerte histórico de montaña en Maharashtra",
    heroImageCaptionEn:
      "Standing inside a dressed basalt archway at a fort here in Maharashtra, with the curved stone bastion rising behind me.",
    heroImageCaptionEs:
      "Bajo un arco de basalto labrado en un fuerte aquí en Maharashtra, con el bastión curvo de piedra alzándose detrás de mí.",
    narratorLocationEn: "Near Mumbai, India",
    narratorLocationEs: "Cerca de Bombay, India",
    titleEn: "My grandfather's Modi signature",
    subjectEn: "My grandfather's Modi signature",
    previewTextEn: "What basalt forts and kept sarees share.",
    introEn: `When people outside India hear Maharashtra, they usually picture Mumbai's skyline or a postcard of a hill fort. Climb the basalt steps of Raigad or Shivneri, though, and you find almost zero palace vanity. Every stone wall and water cistern was cut to hold ground.

In the seventh century, the Chinese traveller Xuanzang crossed the Deccan and wrote that people here are fierce when wronged, yet will give their lives for a friend.`,
    bodyEn: `That quiet stubbornness runs straight through our language and craft. Long before modern bureaucracy, Chhatrapati Shivaji Maharaj gave Marathi full standing in state affairs, signing royal seals in *Modi*, a flowing cursive script used across centuries. **My own grandfather still signed his name in Modi script.**

What makes me proudest of home is how our spiritual and social tradition puts human dignity ahead of ceremony. We grow up hearing how the saint-poet Sant Namdev chased a stray dog with a small bowl of ghee because the dog had run off with his dry *bhakri* flatbread and he could not bear for it to eat dry bread. Or how Pundalik tossed a brick outside his door so Lord Vitthal would wait while he finished pressing his elderly parents' feet.

That same discipline lives on the handloom. In Paithan and Yeola, weavers work Paithani silk warps by hand without a mechanical jacquard, locking metallic *zari* threads into borders physically heavier than the body of the cloth.

Eventually, most treasured sarees end up folded inside family cupboards: *thevnitlya sadya*. A father, brother, or husband gifted that cloth; a mother wore it in the family photograph still sitting in the living room. You cannot throw cloth like that away. When AlmaRise D Brand takes a kept saree with its owner's consent and recuts it into an easy layer for a woman in Spain or the rest of Europe, that history keeps breathing instead of staying locked in the dark.`,
    replyPromptEn:
      "Is there a piece of cloth, a handwriting habit, or a craft tradition from your grandparents that still shapes how you work?",
    psEn: "The full Story goes deeper into Paithani and Karvati looms, Kusumagraj's verse, and the hill forts carved into the Sahyadri basalt.",
    ctaTextEn: "Read the full heritage Story on our website",
    titleEs: "La firma en modi de mi abuelo",
    subjectEs: "La firma en modi de mi abuelo",
    previewTextEs: "Qué comparten nuestros fuertes y un sari guardado.",
    introEs: `Cuando fuera de la India alguien oye hablar de Maharashtra, suele imaginar Bombay o una postal de un fuerte en la montaña. Sin embargo, al subir las escalinatas de basalto de Raigad o Shivneri no ves vanidad palaciega: cada muralla y cada aljibe se talló para resistir.

En el siglo VII, el viajero chino Xuanzang cruzó el Decán y escribió que aquí la gente es brava ante una injusticia, pero capaz de dar la vida por un amigo.`,
    bodyEs: `Esa tenacidad discreta atraviesa tanto nuestra lengua como nuestros oficios. Chhatrapati Shivaji Maharaj dio rango oficial al maratí en los asuntos de Estado y firmaba sus sellos reales en *modi*, una escritura cursiva usada durante siglos. **Mi propio abuelo todavía firmaba con su nombre en escritura modi.**

De lo que más orgulloso me siento de mi tierra es de una tradición que pone la dignidad humana por delante del rito. Crecemos escuchando cómo el poeta santo Sant Namdev corrió detrás de un perro callejero con un cuenco de *ghee* porque el animal se había llevado su pan *bhakri* seco y no soportaba verlo comer pan sin mantequilla. O cómo Pundalik lanzó un ladrillo a la puerta para que el dios Vitthal esperara mientras terminaba de masajear los pies a sus padres ancianos.

Esa misma disciplina sigue viva en los telares manuales. En Paithan y Yeola, los tejedores trabajan la seda Paithani a mano sin jacquard mecánico, entretejiendo hilos metálicos *zari* que hacen la cenefa físicamente más pesada que el resto de la tela.

Con los años, casi todos esos saris queridos acaban doblados en los armarios familiares: los *thevnitlya sadya*. Los regaló un padre, un hermano o un marido; una madre los llevó en la foto que sigue en el salón. No puedes tirar una tela así. Cuando AlmaRise D Brand recibe uno de esos saris con el permiso de su dueña y lo transforma en una prenda fácil de llevar en España o el resto de Europa, esa historia sigue viva en lugar de quedarse encerrada a oscuras.`,
    replyPromptEs:
      "¿Hay alguna tela, forma de escribir o costumbre de tus abuelos que siga influyendo en cómo trabajas hoy?",
    psEs: "En la historia completa profundizo en los telares Paithani y Karvati, los versos de Kusumagraj y los fuertes tallados en el basalto del Sahyadri.",
    ctaTextEs: "Leer la historia completa en la web",
  },
];

export function toSanityNewsletterIssue(
  draft: NewsletterIssueDraft,
  options?: {
    heroImageUrl?: string;
    siteBaseUrl?: string;
    brevoCampaignIdEn?: number;
    brevoCampaignIdEs?: number;
  },
): SanityNewsletterIssue {
  const siteBase = (
    options?.siteBaseUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://karmarisedglobal.com"
  )
    .trim()
    .replace(/\/$/, "");
  const canonicalBase = siteBase.includes("localhost")
    ? "https://karmarisedglobal.com"
    : siteBase;

  return {
    _id: draft.id,
    internalName: draft.internalName,
    issueNumber: draft.issueNumber,
    track: draft.track,
    format: "letter",
    narrator: draft.narrator,
    status: "draft",
    targetAudience: "both",
    titleEn: draft.titleEn,
    subjectEn: draft.subjectEn,
    previewTextEn: draft.previewTextEn,
    narratorLocationEn: draft.narratorLocationEn,
    introEn: draft.introEn,
    bodyEn: draft.bodyEn,
    replyPromptEn: draft.replyPromptEn,
    psEn: draft.psEn,
    ctaTextEn: draft.ctaTextEn,
    titleEs: draft.titleEs,
    subjectEs: draft.subjectEs,
    previewTextEs: draft.previewTextEs,
    narratorLocationEs: draft.narratorLocationEs,
    introEs: draft.introEs,
    bodyEs: draft.bodyEs,
    replyPromptEs: draft.replyPromptEs,
    psEs: draft.psEs,
    ctaTextEs: draft.ctaTextEs,
    ctaUrl: `${canonicalBase}/stories/${draft.storySlug}`,
    ctaUrlEs: `${canonicalBase}/es/stories/${draft.storySlug}`,
    heroImageUrl: options?.heroImageUrl || draft.localHeroImage,
    heroImageAltEn: draft.heroImageAltEn,
    heroImageAltEs: draft.heroImageAltEs,
    heroImageCaptionEn: draft.heroImageCaptionEn,
    heroImageCaptionEs: draft.heroImageCaptionEs,
    brevoCampaignIdEn: options?.brevoCampaignIdEn,
    brevoCampaignIdEs: options?.brevoCampaignIdEs,
    selectedStories: [{ slug: draft.storySlug }],
  };
}
