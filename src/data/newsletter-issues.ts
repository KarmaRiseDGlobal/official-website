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
  /** Published website Story slug when the issue expands on a Story page. */
  storySlug?: string;
  /** Root-relative destination paths when the issue links to a core site page instead of a Story. */
  ctaPathEn?: string;
  ctaPathEs?: string;
  localHeroImage: string;
  heroImageAltEn: string;
  heroImageAltEs: string;
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
  // =========================================================================
  // SEASON 1: ISSUES #01 TO #08 (REFRESHED TO V7 TERMINOLOGY & COPY STANDARDS)
  // =========================================================================
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
    narratorLocationEn: "Our studio near Mumbai",
    narratorLocationEs: "Desde nuestro estudio cerca de Bombay",
    titleEn: "Three states for one leather bag",
    subjectEn: "Three states for one leather bag",
    previewTextEn:
      "Our first trial samples missed the soft hand-feel completely, so we split tanning and stitching across India.",
    introEn: `When a leather-goods boutique in Donostia asked us to produce four bag styles in black and tan, the founder did not hand us a tannery code. He gave us a Basque phrase: he wanted leather that felt *goxo-goxo*. Silky, warm, and soft enough that you want to keep touching it on the counter.

Over the phone, almost every production unit in India says yes to that brief. In person, the story changes fast.`,
    bodyEn: `Alma and I travelled across leather hubs and paid out of our own pocket for trial samples. The first bags looked fine in photographs. The second we held them in our hands, they felt stiff, dry, and lifeless. They were not *goxo-goxo*.

Whenever a production snag refuses to budge, I go back to a simple rule: stop forcing one roof to do two different crafts. India's manufacturing strength lives in specialist craft hubs, from Kolkata and Kanpur to Agra and Chennai, rather than inside one single city.

**We split the bag across states.** We had the hides vegetable-tanned in Kolkata, where the tanneries know how to hit that supple hand-feel, then moved the finished leather to Uttar Pradesh for cleaner stitching and soft-bag assembly. From our studio near Mumbai, we handled hide checks, agreements, and on-site oversight.

Even the smallest pieces demanded patience. When Alma asked for Spanish care hangtags on unbleached chemical-free recycled cardboard instead of bright bleached paper, our Manufacturing Partner spent fifteen days hunting down the exact board. Before a single tan hide was cut, Alma flew in and spent a full week beside the makers checking the dye lot in daylight, running live video calls so the boutique founder could meet the people stitching his bags.

And no, the airport run was not smooth either. Without a corporate courier account on our first independent export, initial freight quotes came back at six to seven lakh rupees, higher than the entire production cost. We found a freight contact willing to learn alongside a customs specialist in Delhi, survived three sleepless nights over a false Spanish customs hold notice, and watched all eleven cartons land right outside the boutique door in Donostia. Two days later, all eight bags filled his main downtown window.`,
    replyPromptEn:
      "Where does sampling or production usually break down first when you test a new maker?",
    psEn: "Next issue, Alma takes over with the story of unzipping a suitcase of upcycled Indian sarees in Madrid and finishing a shoot after dark at Estación de Príncipe Pío.",
    ctaTextEn: "Read the full production Story on our website",
    titleEs: "Tres estados para un solo bolso",
    subjectEs: "Tres estados para un solo bolso",
    previewTextEs:
      "Las primeras pruebas fallaron al tacto, así que dividimos curtido vegetal y confección entre regiones de la India.",
    introEs: `Cuando una tienda de marroquinería de Donostia nos encargó cuatro modelos de bolso en negro y en tono tan, su dueño no nos dio un código de curtiduría. Nos dio una expresión en euskera: quería una piel *goxo-goxo*. Sedosa, cálida y tan suave que apetezca seguir tocándola en el mostrador.

Por teléfono, casi cualquier fábrica en la India dice que sí a ese encargo. En persona, la película cambia en cinco minutos.`,
    bodyEs: `Alma y yo recorrimos varios polos peleteros y pagamos de nuestro bolsillo las primeras pruebas. En foto daban el pego. En cuanto las cogimos con las manos, resultaron rígidas, secas y sin caída. Aquello no era *goxo-goxo*.

Cuando un fallo técnico se enquista, aplico una regla sencilla: deja de obligar a un solo techo a dominar dos oficios distintos. La fuerza productiva de la India está repartida en polos especialistas, desde Calcuta y Kanpur hasta Agra y Chennai, y nunca concentrada en una sola ciudad.

**Dividimos el bolso entre estados.** Mandamos hacer el curtido vegetal de las pieles en Calcuta, donde las curtidurías dominan ese tacto blando y natural, y llevamos el cuero terminado a Uttar Pradesh, donde la unidad de producción tenía líneas más limpias para coser y armar bolsos blandos. Desde nuestro estudio cerca de Bombay coordinamos los contratos, las revisiones y los plazos.

Hasta los detalles pequeños pidieron paciencia. Cuando Alma pidió etiquetas en español sobre cartón reciclado sin blanquear, libre de químicos, nuestra fábrica colaboradora pasó quince días buscando exactamente ese cartón en vez de colocar lo que tenía a mano. Y antes de comenzar con el corte de una sola piel en tono tan, Alma viajó para pasar una semana entera codo con codo a pie de obra revisando la partida a luz natural, mientras conectaba por videollamada al dueño de la tienda con quienes cosían sus bolsos.

Tampoco voy a maquillar la salida al aeropuerto. Al ser nuestra primera exportación directa sin tarifa corporativa, los primeros presupuestos de envío aéreo subieron a seis o siete lakhs de rupias, más que toda la producción. Buscamos un agente dispuesto a remangarse junto a un contacto de aduanas en Delhi, pasé tres noches en vela por un falso aviso de retención en España y, por fin, las once cajas llegaron a la puerta de la tienda en Donostia. Dos días después, los ocho modelos llenaban su escaparate principal.`,
    replyPromptEs:
      "Cuando pruebas una fábrica nueva, ¿en qué punto suele atascarse antes el proceso de muestras o producción?",
    psEs: "En la próxima carta toma el relevo Alma para contarte qué pasó al abrir una maleta llena de saris transformados en Madrid y terminar una sesión de noche en Príncipe Pío.",
    ctaTextEs: "Leer la historia completa sobre este encargo",
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
    narratorLocationEn: "Between Madrid and our studio near Mumbai",
    narratorLocationEs: "Entre Madrid y nuestro estudio cerca de Bombay",
    titleEn: "Nobody pictured it until I opened the bag",
    subjectEn: "Nobody pictured it until I opened the bag",
    previewTextEn:
      "Explaining AlmaRise D Reborn in words got me nowhere, so I zipped up a suitcase and took Maria into old Madrid.",
    introEn: `Back in Spain, trying to explain **AlmaRise D Brand** in words got me nowhere. Family, friends, and even Maria, who agreed to model for me, stared politely with zero picture in their heads of what an upcycled Indian saree looked like.

So I stopped explaining. I booked an afternoon in old Madrid, hid every garment inside my suitcase, and gave Maria one rule: wear plain black, white, or denim you already own.`,
    bodyEn: `**AlmaRise D Reborn** never started as a neat business-school slide deck. When Shirish and I first talked about making clothes in India, we wanted organic fabrics, and frankly we did not have the capital to commission fresh fabric rolls from a mill. At the same time, stepping into Indian homes, we kept seeing *thevnitlya sadya*: treasured wedding and festival sarees Indian women have kept folded in cupboards for years, each carrying a story to tell.

Instead of buying new cloth, we started acquiring those sarees for a fair payment or by donation and cutting **one single pattern per saree**. Each piece has to go on cleanly in ten seconds before you catch the metro, local train, or bus in Spain.

The second I unzipped that suitcase in Madrid and pulled out the shrugs, Maria just went, "Ooh! Ooh!" She slipped them over her own faded jeans, shorts, and a simple black dress. As soon as she started walking naturally down the street, passersby stopped and stared. Every time someone lingered, I walked up and asked what they thought. Almost everyone said the same thing: "Oh wow, that is a good idea."

We ended that September evening at Estación de Príncipe Pío without a permit. Male guards stopped us immediately near the old platforms until a female security guard stepped forward, told her colleague, "I handle this," and quietly coached us to move to the far end and switch to a regular everyday camera so nobody bothered us. We wrapped past ten at night in the dark.

That day proved what Shirish puts in one line: when you pair a saree nobody wears anymore in India with plain basics sitting in the back of a closet in Spain, you give **two wardrobes a second life at once**.`,
    replyPromptEn:
      "What is one piece hanging in your wardrobe right now that you stopped wearing because nothing pairs with it?",
    psEn: "In our next issue, I will share why I send weak production samples straight back before a Client ever sees them, and why I talked a boutique owner out of metal zippers.",
    ctaTextEn: "Read the full AlmaRise D Brand Story on our website",
    titleEs: "Nadie lo veía hasta que abrí la maleta",
    subjectEs: "Nadie lo veía hasta que abrí la maleta",
    previewTextEs:
      "Explicar AlmaRise D Reborn de palabra no servía de nada, así que cerré la maleta y nos fuimos al Madrid antiguo.",
    introEs: `De vuelta en España, explicar **AlmaRise D Brand** de palabra no me servía de nada. Familia, amigos y hasta María, que se ofreció a posar, asentían con educación sin lograr imaginarse cómo quedaba un sari indio convertido en una prenda para el día a día.

Así que dejé de dar explicaciones. Quedé una tarde de septiembre en el Madrid antiguo sin enseñar ni una sola pieza antes y le puse a María una única condición: trae ropa lisa tuya en negro, blanco o vaquero.`,
    bodyEs: `**AlmaRise D Reborn** tampoco nació de un plan perfecto en un despacho. Al principio Shirish y yo queríamos empezar con algodón orgánico, y siendo sincera, no teníamos capital para encargar rollos nuevos a una fábrica textil. Al mismo tiempo, entrando en casas en la India, veíamos una y otra vez los *thevnitlya sadya*: saris de boda y celebraciones que mujeres indias han guardado durante años y que tienen una historia que contar.

En vez de comprar tela nueva, empezamos a adquirir esos saris con un pago justo o por donación y a sacar **un único patrón de cada sari**. Todo con una regla práctica para España y el resto de Europa: tiene que poderse poner en diez segundos antes de salir corriendo hacia el metro, el cercanías o el autobús.

En cuanto abrí la cremallera de la maleta en Madrid y empecé a sacar los shrugs, María solo decía: "¡Oh! ¡Oh!". Se los probó encima de sus propios vaqueros, unos pantalones cortos y un vestido negro básico. Al caminar con naturalidad por la acera, la gente se giraba y se paraba a preguntar. Cada vez que alguien se quedaba mirando me acercaba a charlar un minuto, y casi todo el mundo respondía lo mismo: "Oye, pues es muy buena idea".

Terminamos la tarde en la Estación de Príncipe Pío, ya casi de noche y sin permiso de rodaje. Unos vigilantes nos pararon en seco cerca de los andenes hasta que se acercó una vigilante, le dijo a su compañero "yo me encargo" y, en voz baja, nos indicó que bajáramos al fondo y guardáramos la cámara analógica para hacer fotos normales como un grupo de amigos. Recogimos pasadas las diez de la noche.

Aquella tarde confirmó lo que siempre dice Shirish: cuando te pones un sari sin uso de la India sobre ropa olvidada en tu armario en España, les das **una segunda vida a dos armarios a la vez**.`,
    replyPromptEs:
      "¿Qué prenda tienes colgada en el armario que dejaste de ponerte porque ya no sabes con qué combinarla?",
    psEs: "En la próxima carta te contaré por qué devuelvo las muestras flojas antes de enseñárselas a un cliente y por qué convencí a un dueño de tienda de cambiar unas cremalleras metálicas.",
    ctaTextEs: "Leer la historia completa de AlmaRise D Brand",
  },
  {
    id: "newsletter-issue-a2",
    issueNumber: "Issue #03",
    internalName: "Issue #03 · The samples I never show you",
    track: "all",
    narrator: "alma",
    storySlug: "why-sample-approval-decides-bulk",
    localHeroImage:
      "/images/workshops/brown-black-leather-panels-brass-hardware.jpg",
    heroImageAltEn:
      "Cut brown and black vegetable-tanned leather panels fitted with antique brass D-rings beside folded striped cotton lining fabric",
    heroImageAltEs:
      "Piezas cortadas de piel de curtido vegetal en marrón y negro con anillas de latón envejecido junto a tejido de forro de algodón a rayas",
    narratorLocationEn: "Our studio near Mumbai",
    narratorLocationEs: "Desde nuestro estudio cerca de Bombay",
    titleEn: "The samples I never show you",
    subjectEn: "The samples I never show you",
    previewTextEn:
      "Why I inspect every sample first, point out tiny flaws you missed, and swap metal teeth for Japanese plastic YKK zippers.",
    introEn: `Whenever an Indian production unit finishes a prototype for one of our Clients, I inspect it in my own hands first. If the strap drop pulls awkwardly, the lining drags, or the silhouette feels heavy, our Client never wastes time on it. It goes straight back for rework.

Even when a sample passes our review and the Client loves it on a video call, I still point out every tiny detail they missed.`,
    bodyEn: `"I am not 100% happy with this, and this will be changed." I say that sentence on purpose, from day one. If something ever slips past me in the future that I genuinely did not catch, no Client will ever wonder whether I tried to hide it.

Real sample review is rarely about rubber-stamping a drawing. On a recent leather backpack collection for a boutique in Donostia, the starting sketch was literally four rough lines. We reshaped the boxy rectangle into a subtle pyramid so it sits cleanly on a woman's back, added a top grab handle, swapped dark lining for light striped cotton so you can actually find your keys, and fitted antique brass hardware.

**Then came the practical pushback that saves returns six months later.** I urged the owner to use **high-quality Japanese plastic YKK zippers** instead of metal teeth. Metal teeth look sharp on a showroom shelf, right up until a shopper reaches inside and scratches her knuckles, or the back pocket rubs against her wool winter coat all season.

Another hard lesson gave us a rule we follow on every single project: **never trust a dye colour through a screen.** Because getting a physical tan reference into the tannery dragged until August, dyeing was delayed by months. Today, we guide you upfront on what each dye batch requires and create a physical colour swatch for your approval before a single hide enters the drum.

I never promise that monsoon rain or air freight will never shift a date by a week. What I promise is checking every stage two, three, and five times so that when the cartons open at your business door in Spain or the rest of Europe, there are zero surprises inside.`,
    replyPromptEn:
      "Have you ever approved a sample on sight, only to regret a small detail once the finished order arrived?",
    psEn: "After every video call, I send clear meeting notes within minutes so nothing gets lost between Spain and India. You can read the full sampling Story below.",
    ctaTextEn: "Read the full sampling Story on our website",
    titleEs: "Las muestras que nunca te enseño",
    subjectEs: "Las muestras que nunca te enseño",
    previewTextEs:
      "Por qué reviso cada prototipo en mano, señalo pequeños ajustes que ni habías visto y elijo cremalleras YKK de plástico.",
    introEs: `Cada vez que una unidad de producción en la India termina un prototipo para uno de nuestros clientes, lo reviso primero con mis propias manos. Si la caída del asa tira mal, el forro se engancha o la silueta pesa más de la cuenta, el cliente ni pierde tiempo en verlo. Vuelve directo a corregirse.

E incluso cuando una muestra para valoración pasa nuestra primera revisión y al cliente le encanta en la videollamada, señalo yo misma cualquier pequeño ajuste que se le haya escapado.`,
    bodyEs: `"No estoy al cien por cien contenta con esto, y esto se va a cambiar." Digo esa frase a propósito desde el primer día. Así, si mañana se me escapa algo que de verdad no vi, ningún cliente pensará jamás que intenté taparlo.

Aprobar una muestra de verdad casi nunca consiste en copiar un dibujo a ciegas. En una colección de mochilas de piel para una tienda de Donostia, el boceto inicial eran literalmente cuatro líneas. Suavizamos el rectángulo en una ligera pirámide para que apoye bien en la espalda, añadimos un asa superior, cambiamos el forro oscuro por algodón claro a rayas para ver las llaves dentro y montamos herrajes de latón envejecido.

**Luego llegó la recomendación práctica que evita devoluciones seis meses después.** Le aconsejé montar **cremalleras japonesas YKK de plástico de alta calidad** en lugar de dientes metálicos. El metal queda precioso en el escaparate, hasta que una clienta mete la mano y se araña los nudillos o el bolsillo trasero le estropea el abrigo de lana en invierno.

Otro tropiezo nos dejó una norma fija para cualquier pedido de producción: **nunca igualar un color a través de una pantalla.** Como no pudimos cerrar una referencia física del tono tan exacto hasta agosto, el teñido se retrasó meses. Hoy te indicamos desde el principio qué hace falta para cada partida y preparamos una muestra física de color para tu aprobación antes de teñir una sola piel.

Nunca prometo que una lluvia o un flete no muevan una fecha una semana. Lo que sí prometo es revisar cada fase dos, tres y hasta cinco veces para que, al abrir las cajas en la puerta de tu negocio, no haya ni un solo susto dentro.`,
    replyPromptEs:
      "¿Alguna vez aprobaste una muestra a primera vista y te arrepentiste de un pequeño detalle al recibir el pedido?",
    psEs: "Después de cada videollamada te envío las conclusiones de la reunión por escrito enseguida para que nada se quede en el aire entre España y la India. Debajo tienes la historia completa.",
    ctaTextEs: "Leer la historia completa sobre muestras físicas",
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
    narratorLocationEn: "Our office in India",
    narratorLocationEs: "Desde nuestra oficina en la India",
    titleEn: "Three biryanis on Eid",
    subjectEn: "Three biryanis on Eid",
    previewTextEn:
      "Indian hospitality nearly beat my Spanish stomach, and reminded me of my mum rolling giant croquetas for eight.",
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
    previewTextEs:
      "La hospitalidad india casi puede con mi estómago español, y me devolvió de golpe a las croquetas enormes de mi madre.",
    introEs: `El año pasado en Eid nos invitaron a comer en varias casas el mismo día. Me tomé tres platos completos de biryani seguidos, con todos sus entrantes.

En la tercera casa estaba prácticamente enferma. Yo repetía: "No, no, gracias, no puedo más", y me contestaban al segundo: "¡Pero cómo! ¿No te gusta? ¡Come más!".`,
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
    internalName: "Issue #05 · Why we sit beside the stitching lines",
    track: "all",
    narrator: "shirish",
    storySlug: "matching-a-workshop-to-the-product",
    localHeroImage:
      "/images/workshops/shirish-artisan-cotton-lining-bench-india.jpeg",
    heroImageAltEn:
      "Smiling woman artisan at a production bench with yellow-and-white striped cotton linings and leather straps beside Shirish",
    heroImageAltEs:
      "Artesana sonriendo en su puesto de costura con forros de algodón a rayas amarillas y blancas y correas de piel junto a Shirish",
    narratorLocationEn: "On the road across India",
    narratorLocationEs: "De ruta por unidades de producción en la India",
    titleEn: "Why we sit beside the stitching lines",
    subjectEn: "Why we sit beside the stitching lines",
    previewTextEn:
      "A polite yes inside an owner's office hides a lot until you walk into the production site and talk with the makers.",
    introEn: `Most foreign buyers fly into India, shake hands inside the factory owner's air-conditioned office, inspect a neat tray of samples, and head back to the airport.

They never say a single word to the person skiving the hide, gluing the cotton lining, or running the heavy strap machine.`,
    bodyEn: `Alma and I do the opposite. When we audit a production site, we walk past the office, sit beside the makers on the stitching lines, and ask plain questions about their craft. "Is this seam tricky? Show me how you guide it."

The atmosphere in the room changes within minutes. People used to being ignored behind a glass partition straighten up, smile, and point out how a thick strap feeds under the needle or how striped cotton linings are trimmed clean. **When a maker is treated as a skilled craftsperson rather than invisible labour, quality turns into personal pride.**

That habit is also our sharpest transparency filter. On a first visit, hesitation about letting strangers near the benches is completely fair; owners of family-run factories worry about competitors copying their setup, and we respect that while building trust. If a production unit still keeps its doors shut once a relationship is built, they are hiding something. At that point the conversation stops and we walk away.

As a registered Bar Council lawyer in India, I back every open visit with clear, balanced written contracts. Spoken promises hurt both sides: founders in Spain and the rest of Europe worry about paying a deposit and receiving weak cartons, and honest Indian makers worry about specs shifting halfway through a run. Written terms protect everyone, and even then, no signed page is a lifetime pass. Every Manufacturing Partner earns their place run after run.`,
    replyPromptEn:
      "When did seeing a process in person change a decision you thought was already settled?",
    psEn: "We keep auditing new family-run factories and women artisan collectives every month across India across leather goods, natural-fabric clothing, textile accessories, and home decor.",
    ctaTextEn: "Read how we audit Indian makers in person",
    titleEs: "Por qué nos sentamos junto a las máquinas",
    subjectEs: "Por qué nos sentamos junto a las máquinas",
    previewTextEs:
      "Un sí amable en el despacho oculta mucho hasta que entras a pie de obra y hablas directamente con quienes cosen.",
    introEs: `La mayoría de los compradores extranjeros aterrizan en la India, dan la mano en el despacho con aire acondicionado del dueño, miran una bandeja de muestras y vuelven al aeropuerto.

No cruzan ni una palabra con quien rebaja la piel, prepara los forros de algodón o cose las correas en la máquina pesada.`,
    bodyEs: `Alma y yo hacemos justo lo contrario. Cuando auditamos una unidad de producción, pasamos de largo el despacho, nos sentamos a pie de obra junto a los artesanos y les preguntamos por su trabajo. "¿Es complicado este paso? Enséñame cómo lo guías".

El ambiente cambia en cuestión de minutos. Personas acostumbradas a que nadie las mire detrás de un tabique se enderezan, sonríen y te muestran cómo entra una correa gruesa bajo la aguja o cómo dejan limpios los forros de algodón a rayas. **Cuando tratas a quien cose como a un profesional con oficio, la calidad se convierte en orgullo propio.**

Esa costumbre es además nuestra mejor prueba de transparencia. En una primera visita es normal que una fábrica de corte familiar dude antes de abrir sus puertas a desconocidos por miedo a copias, y lo respetamos mientras construimos confianza. Pero si una vez avanzada la relación siguen cerrándonos la puerta del punto de producción, ocultan algo. Ahí termina la conversación y nos marchamos.

Como abogado colegiado en el Bar Council de la India, respaldo cada visita con acuerdos claros y justos por escrito. Las promesas de palabra perjudican a los dos lados: quienes emprenden en España y el resto de Europa temen adelantar una señal y recibir cajas flojas, y las fábricas serias temen que les cambien las condiciones a mitad de pedido. Un contrato claro protege a ambos, aunque nunca sea un cheque en blanco: cada unidad de producción demuestra su nivel pedido tras pedido.`,
    replyPromptEs:
      "¿Cuándo te hizo cambiar de decisión una visita en persona sobre algo que dabas por cerrado?",
    psEs: "Seguimos auditando cada mes fábricas de corte familiar y colectivos de artesanas por toda la India en piel, ropa de tejidos naturales, complementos textiles y decoración del hogar.",
    ctaTextEs: "Leer cómo auditamos unidades de producción en la India",
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
      "Sunlit studio room in India with industrial sewing benches and a dressmaker form under protective plastic covers and an open travel suitcase",
    heroImageAltEs:
      "Habitación soleada de nuestro estudio en la India con máquinas de coser industriales y un maniquí bajo fundas protectoras y una maleta abierta",
    narratorLocationEn: "Our studio near Mumbai",
    narratorLocationEs: "Desde nuestro estudio cerca de Bombay",
    titleEn: "Why we walked away from charity",
    subjectEn: "Why we walked away from charity",
    previewTextEn:
      "What a 100-rupee milk bottle in Rajasthan taught me about dignity, real skills, and our planned training work.",
    introEn: `First, let me be completely plain about something you may have read on our website: **our planned Women's Training Initiative has not started yet.** Not a single trainee has walked through our door for a class.

Right now, the sewing machines in that sunlit room sit under dust covers between AlmaRise D Brand sample runs while we build our commercial work and finish the legal paperwork.`,
    bodyEn: `Too many projects talk about a future plan as if it were already running. Shirish and I refuse to do that, because I already saw what happens when good intentions outrun reality.

Years ago in Spain, I volunteered with an organisation running three transitional houses for single immigrant mothers. What worked there was unsentimental: a roof for a year, language classes, a practical trade, and help stepping into a real job. Nobody kept anyone dependent.

Then in January 2023, I spent a month in Pushkar, in Rajasthan, visiting my friend Virginia's rural project. I arrived in full teacher mode ready to write an English syllabus, and hit a wall fast. I saw a newly refurbished rural school stripped bare shortly afterward, and Virginia taught me a street rule I never forgot: never buy milk for someone carrying a baby outside a shop. You pay a hundred rupees feeling noble; five minutes later the milk goes straight back to the shopkeeper for ninety rupees in cash.

That month ended my patience for Western pity. **We want to teach adult women a commercial garment craft and make sure real, paid work is waiting when they finish.**

Two foundations have to stand firm before we invite a single woman to enrol: steady commercial demand from our Manufacturing Programmes and AlmaRise D Brand, and the formal Section 8 non-profit foundation Shirish is steering through Indian and apostilled Spanish compliance. The day we pull those dust covers off for our first group, you will hear it straight from us.`,
    replyPromptEn:
      "What separates real skill-building from short-term charity in your own field?",
    psEn: "If you are a garment trainer, pattern master, or advisor in India who wants to share experience while we prepare the curriculum, reply directly to this email.",
    ctaTextEn: "Read the full honest update on our website",
    titleEs: "Por qué dijimos no a la caridad",
    subjectEs: "Por qué dijimos no a la caridad",
    previewTextEs:
      "Lo que aprendí con un bote de leche en Rajastán sobre dignidad, oficio real y nuestra futura formación textil.",
    introEs: `Primero quiero dejarte algo muy claro por si lo has visto en nuestra web: **nuestra futura Iniciativa de formación para mujeres todavía no ha empezado.** A día de hoy no ha entrado ninguna alumna a clase.

Ahora mismo, las máquinas de coser de esa sala siguen tapadas con fundas entre prueba y prueba de AlmaRise D Brand mientras consolidamos los pedidos comerciales y terminamos el papeleo legal.`,
    bodyEs: `Demasiados proyectos hablan de un plan futuro como si ya estuviera en marcha. Shirish y yo nos negamos, porque yo ya vi de cerca qué ocurre cuando las buenas intenciones corren más que la realidad.

Hace años, en España, fui voluntaria en una asociación que llevaba tres pisos de acogida para madres solteras inmigrantes. Allí funcionaba algo sencillo y sin dramatismos: un año de techo, clases de español, un oficio práctico y acompañamiento hasta un empleo real. Nadie fomentaba la dependencia.

Luego, en enero de 2023, pasé un mes en Pushkar, en Rajastán, con mi amiga Virginia en un proyecto rural. Llegué con mi gorra de profesora lista para montar un temario de inglés y choqué de frente con la realidad. Vi una escuela recién rehabilitada desmantelada al poco tiempo, y Virginia me dio una norma callejera que no he olvidado: nunca compres leche para alguien que te la pida con un bebé a la puerta de una tienda. Pagas cien rupias sintiéndote bien y cinco minutos después devuelven la leche al tendero a cambio de noventa rupias en efectivo.

Aquel mes me quitó para siempre la paciencia con la lástima occidental. **Queremos enseñar un oficio textil de nivel profesional y asegurarnos de que haya trabajo real y pagado al terminar.**

Antes de abrir una sola plaza tienen que estar firmes dos pilares: demanda comercial estable en nuestros Programas de producción y en AlmaRise D Brand, y la fundación sin ánimo de lucro Section 8 que Shirish está tramitando entre la India y la documentación apostillada de España. El día que quitemos las fundas para el primer grupo, te lo contaremos aquí mismo.`,
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
    localHeroImage: "/images/workshops/shirish-at-leather-warehouse-desk.jpeg",
    heroImageAltEn:
      "Shirish seated at the review desk inside an Indian leather production unit surrounded by hanging hides and finished bags",
    heroImageAltEs:
      "Shirish sentado en la mesa de revisión dentro de una unidad de producción de marroquinería en la India rodeado de pieles y bolsos terminados",
    narratorLocationEn: "Our studio near Mumbai",
    narratorLocationEs: "Desde nuestro estudio cerca de Bombay",
    titleEn: "Where twenty percent disappears",
    subjectEn: "Where twenty percent disappears",
    previewTextEn:
      "How layered commissions squeeze a maker until linings thin out and a leather bag sags three months after arrival.",
    introEn: `When a growing brand in Spain or Portugal looks beyond Ubrique, Alicante, or northern Portugal toward India, the trouble rarely begins with the craftsperson holding the cutting knife.

It starts with the chain of intermediaries taking a percentage before the order ever reaches the production unit.`,
    bodyEn: `In a typical export setup, a European sales agent takes five to eight percent and forwards your drawings to an Indian buying house. The buying house takes another eight to ten percent and passes a stripped-down sheet to a factory owner.

Once nearly **twenty percent of the budget has vanished** into hands that never touch the hide, nobody sends an email warning that the specification changed. A crisp 220-gram cotton twill lining quietly becomes a 140-gram poly-cotton blend. Solid brass buckles turn into barrel-plated rings that shine in a sample photo and pit during a three-week sea crossing from Nhava Sheva to Valencia or Barcelona.

Worse still happens at the cutting bench. A leather hide is tight and strong along the spine and butt, and soft and stretchy along the outer belly. When a squeezed production unit receives a vague slip saying "leather bag as per sample," the cutter pushes pattern templates out into the belly to save rupees. **A front panel cut from the belly looks identical on Tuesday. Three months later on a rail in Madrid, it sags out of shape.**

That is why Alma and I stay directly on both sides of the Product Brief. We negotiate a fair per-piece rate directly with the facility owner in Marathi or Hindi so the production site can cut strictly from prime zones, put lining weight, hardware alloy, and EU REACH limits in writing, and lock identical counter-samples with a tamper-evident wire seal. One sealed twin stays hanging at the production site; the other stays with us for AQL 2.5 pre-shipment inspection.`,
    replyPromptEn:
      "Have you ever received a production run where a hidden swap in lining, hardware, or fabric only showed up after delivery?",
    psEn: "If you are weighing your first run in India and want plain answers on material specs and REACH checks, hit reply with your product category and rough idea.",
    ctaTextEn: "Read the full production Story on our website",
    titleEs: "Dónde se esfuma un veinte por ciento",
    subjectEs: "Dónde se esfuma un veinte por ciento",
    previewTextEs:
      "Cómo las comisiones encadenadas ahogan a la fábrica hasta que cambia el forro y el bolso cede a los tres meses.",
    introEs: `Cuando una marca de España o Portugal crece más allá de Ubrique, Alicante o el norte de Portugal y mira hacia la India, el fallo rara vez nace en quien sostiene la cuchilla de corte.

Nace en la cadena de intermediarios que recorta el margen antes de que el encargo llegue a la unidad de producción.`,
    bodyEs: `En el circuito habitual de exportación, un agente comercial en Europa se lleva entre un cinco y un ocho por ciento y reenvía los bocetos a una oficina de compras en la India. Esa oficina añade otro ocho o diez por ciento y entrega una hoja escueta al dueño de la fábrica.

Cuando casi **un veinte por ciento del presupuesto ha desaparecido** por el camino, nadie escribe un correo avisando de que la ficha va a cambiar. Una sarga de algodón de 220 gramos pasa en silencio a un forro fino de 140 gramos. Las hebillas de latón macizo se sustituyen por herrajes bañados que brillan igual en foto, pero se pican tras tres semanas de barco desde Nhava Sheva hasta Valencia o Barcelona.

Lo peor ocurre al cortar la piel. Las fibras más firmes de un cuero están en el lomo y el crupón, mientras que la falda es blanda y elástica. Cuando una unidad de producción ahogada en precio recibe un albarán vago que solo dice "bolso según muestra", el cortador estira las plantillas hasta la falda para arañar cada centímetro. **Un frontal cortado de la falda parece idéntico el martes; tres meses después en una tienda de Madrid, se deforma.**

Por eso Alma y yo trabajamos directamente a ambos lados del briefing de producto. Pactamos un precio justo por pieza directamente con el propietario en maratí o hindi para que corte solo de las zonas nobles, dejamos por escrito gramajes, aleaciones y límites europeos REACH, y cerramos contramuestras gemelas con precinto de alambre inviolable: una queda colgada en la planta y la otra con nosotros para la inspección AQL 2.5 antes de embarcar.`,
    replyPromptEs:
      "¿Te ha llegado alguna vez un pedido de producción donde un cambio silencioso de forro o herraje solo salió a la luz después de recibirlo?",
    psEs: "Si estás valorando tu primera producción en la India y quieres claridad sobre materiales y requisitos REACH, responde a este correo con tu categoría y tu idea aproximada.",
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
    narratorLocationEn: "Near Mumbai, India",
    narratorLocationEs: "Cerca de Bombay, India",
    titleEn: "My grandfather's Modi signature",
    subjectEn: "My grandfather's Modi signature",
    previewTextEn:
      "What Sahyadri basalt forts, Sant Namdev's bowl of ghee, Modi script, and kept family sarees all share.",
    introEn: `When people outside India hear Maharashtra, they usually picture Mumbai's skyline or a postcard of a hill fort. Climb the basalt steps of Raigad or Shivneri, though, and you find almost zero palace vanity. Every stone wall and water cistern was cut to hold ground.

In the seventh century, the Chinese traveller Xuanzang crossed the Deccan and wrote that people here are fierce when wronged, yet will give their lives for a friend.`,
    bodyEn: `That quiet stubbornness runs straight through our language and craft. Long before modern bureaucracy, Chhatrapati Shivaji Maharaj gave Marathi full standing in state affairs, signing royal seals in *Modi*, a flowing cursive script used across centuries. **My own grandfather still signed his name in Modi script.**

What makes me proudest of home is how our spiritual and social tradition puts human dignity ahead of ceremony. We grow up hearing how the saint-poet Sant Namdev chased a stray dog with a small bowl of ghee because the dog had run off with his dry *bhakri* flatbread and he could not bear for it to eat dry bread. Or how Pundalik tossed a brick outside his door so Lord Vitthal would wait while he finished pressing his elderly parents' feet.

That same discipline lives on the handloom. In Paithan and Yeola, weavers work Paithani silk warps by hand without a mechanical jacquard, locking metallic *zari* threads into borders physically heavier than the body of the cloth.

Eventually, most treasured sarees end up folded inside family cupboards: *thevnitlya sadya*. A father, brother, or husband gifted that cloth; a mother wore it in the family photograph still sitting in the living room. You cannot throw cloth like that away. When **AlmaRise D Brand** takes a kept saree with its owner's consent and recuts it into an everyday garment for a woman in Spain or the rest of Europe, that history keeps breathing instead of staying locked in the dark.`,
    replyPromptEn:
      "Is there a piece of cloth, a handwriting habit, or a craft tradition from your grandparents that still shapes how you work?",
    psEn: "The full Story goes deeper into Paithani and Karvati looms, Kusumagraj's verse, and the hill forts carved into the Sahyadri basalt.",
    ctaTextEn: "Read the full heritage Story on our website",
    titleEs: "La firma en modi de mi abuelo",
    subjectEs: "La firma en modi de mi abuelo",
    previewTextEs:
      "Qué comparten nuestros fuertes de basalto, el cuenco de ghee de Sant Namdev y los saris guardados en familia.",
    introEs: `Cuando fuera de la India alguien oye hablar de Maharashtra, suele imaginar Bombay o una postal de un fuerte en la montaña. Sin embargo, al subir las escalinatas de basalto de Raigad o Shivneri no ves vanidad palaciega: cada muralla y cada aljibe se talló para resistir.

En el siglo VII, el viajero chino Xuanzang cruzó el Decán y escribió que aquí la gente es brava ante una injusticia, pero capaz de dar la vida por un amigo.`,
    bodyEs: `Esa tenacidad discreta atraviesa tanto nuestra lengua como nuestros oficios. Chhatrapati Shivaji Maharaj dio rango oficial al maratí en los asuntos de Estado y firmaba sus sellos reales en *modi*, una escritura cursiva usada durante siglos. **Mi propio abuelo todavía firmaba con su nombre en escritura modi.**

De lo que más orgulloso me siento de mi tierra es de una tradición que pone la dignidad humana por delante del rito. Crecemos escuchando cómo el poeta santo Sant Namdev corrió detrás de un perro callejero con un cuenco de *ghee* porque el animal se había llevado su pan *bhakri* seco y no soportaba verlo comer pan sin mantequilla. O cómo Pundalik lanzó un ladrillo a la puerta para que el dios Vitthal esperara mientras terminaba de masajear los pies a sus padres ancianos.

Esa misma disciplina sigue viva en los telares manuales. En Paithan y Yeola, los tejedores trabajan la seda Paithani a mano sin jacquard mecánico, entretejiendo hilos metálicos *zari* que hacen la cenefa físicamente más pesada que el resto de la tela.

Con los años, casi todos esos saris queridos acaban doblados en los armarios familiares: los *thevnitlya sadya*. Los regaló un padre, un hermano o un marido; una madre los llevó en la foto que sigue en el salón. No puedes tirar una tela así. Cuando **AlmaRise D Brand** recibe uno de esos saris con el permiso de su dueña y lo transforma en una prenda fácil de llevar en España o el resto de Europa, esa historia sigue viva en lugar de quedarse encerrada a oscuras.`,
    replyPromptEs:
      "¿Hay alguna tela, forma de escribir o costumbre de tus abuelos que siga influyendo en cómo trabajas hoy?",
    psEs: "En la historia completa profundizo en los telares Paithani y Karvati, los versos de Kusumagraj y los fuertes tallados en el basalto del Sahyadri.",
    ctaTextEs: "Leer la historia completa en la web",
  },

  // =========================================================================
  // SEASON 2: ISSUES #09 TO #16 (4 CORE CATEGORIES, ALMARISE D ORGANIC,
  // ALMARISE D HOME DECOR, 4 INDIAN HUBS, NDA/LEGAL, EU LABELLING, PLANNING)
  // =========================================================================
  {
    id: "newsletter-issue-s2-09",
    issueNumber: "Issue #09",
    internalName: "Issue #09 · Lifting the shutter every morning",
    track: "all",
    narrator: "alma",
    ctaPathEn: "/manufacturing",
    ctaPathEs: "/es/manufacturing",
    localHeroImage: "/images/workshops/alma-black-leather-tote-inspection.jpeg",
    heroImageAltEn:
      "Alma inspecting the strap drop, stitching, and softness of a black leather tote bag in an Indian production unit",
    heroImageAltEs:
      "Alma comprobando la caída del asa, las costuras y la suavidad de un bolsón de piel negra en una unidad de producción en la India",
    narratorLocationEn: "Between Madrid and our studio near Mumbai",
    narratorLocationEs: "Entre Madrid y nuestro estudio cerca de Bombay",
    titleEn: "Lifting the shutter every morning",
    subjectEn: "Lifting the shutter every morning",
    previewTextEn:
      "Why independent shops win when they turn counter conversations into tailor-made own-brand pieces instead of wholesale stock.",
    introEn: `Anyone who lifts the metal shutter of an independent shop every morning knows the feeling. You open the door, switch on the lights, steam the display pieces, and hear a shopper say, "Oh, this bag is lovely, but..."

That tiny "but" is pure gold, and wholesale catalogues almost never let you fix it.`,
    bodyEn: `Independent boutiques across Spain and the rest of Europe are squeezed from both sides right now. Big online platforms compete on speed and discounts, while traditional wholesale showrooms sell the exact same handbags and dresses to three shops in the same postcode.

When you buy ready-made wholesale stock, you have to swallow every compromise built into the piece. The strap sits two centimetres too high over a winter coat. The dark lining turns the bag into a black hole when you reach for your phone. The cotton dress looks gorgeous on the hanger, yet pulls slightly across the shoulder.

**Only you, standing beside your shoppers every day, hear those real clues.** And the minute you turn one of those clues into your own piece, the whole mood in the shop window changes.

Creating your own collection through **KarmaRise D Global** lets you offer tailor-made fashion with your own label inside, without losing months chasing factories across time zones. You bring the observation from your store or a rough sketch. Shirish and I turn it into a written Product Brief, match the right specialist makers in India across leather goods, clothing in natural fabrics, textile accessories, or textile home decor, and send you a reviewed physical sample to hold in your hands before cutting begins.

I still smile remembering the WhatsApp voice note from our Client in Donostia the morning his eleven export cartons arrived outside his door: "We got it! They're here!" He cleared his main street window and displayed all eight own-brand leather bags straight away.`,
    replyPromptEn:
      "What is the most common 'I love it, but...' comment you hear from customers in your shop or brand?",
    psEn: "Next issue, I am opening the cupboard on AlmaRise D Organic and the fruit- and plant-waste fabrics we have been testing in India.",
    ctaTextEn: "See how our Manufacturing Programme works",
    titleEs: "Subir el cierre cada mañana",
    subjectEs: "Subir el cierre cada mañana",
    previewTextEs:
      "Por qué los comercios independientes ganan margen y personalidad cuando convierten lo que oyen en tienda en moda a medida.",
    introEs: `Quien sube el cierre de su tienda cada mañana conoce esa escena al dedillo. Abres la puerta, enciendes las luces, colocas el escaparate y a media mañana entra una clienta, toca un bolso o una blusa y dice: "Es precioso, pero...".

Ese pequeño "pero" vale oro, y cuando compras a un mayorista casi nunca puedes corregirlo.`,
    bodyEs: `Los comercios independientes de España y el resto de Europa viven hoy entre dos fuegos. Por un lado, la facilidad de comprar online aprieta por precio; por otro, los catálogos mayoristas repiten los mismos modelos en tres calles a la redonda.

Cuando compras stock cerrado a un mayorista, te tragas cada fallo de diseño tal cual viene. La caída del asa se queda corta encima del abrigo de invierno. El forro oscuro no te deja encontrar las llaves. El vestido de lino luce en la percha, pero tira un poco de hombro al caminar.

**Solo tú, que subes el cierre de tu tienda cada día, conoces esos pequeños detalles que ocurren sobre el terreno.** Y en cuanto conviertes uno de esos detalles en una pieza propia con tu etiqueta, tu escaparate juega en otra liga.

Crear tu colección con **KarmaRise D Global** es ofrecer moda a medida para tus clientas sin comerte sola todo el trabajo de fábrica. Tú pones el ojo comercial y la idea, aunque sea un boceto rápido o una prenda que ya vendes. Shirish y yo lo convertimos en un briefing de producto claro, buscamos la unidad de producción adecuada en la India (en piel, ropa de tejidos naturales, complementos textiles o decoración del hogar) y seguimos tu pedido hasta las cajas en la puerta de tu negocio.

Todavía me emociono recordando el mensaje de nuestro cliente en Donostia el mismo día que le llegaron sus once cajas: "¡Ya están aquí!". Vació su escaparate principal y colocó los ocho modelos directamente a la calle.`,
    replyPromptEs:
      "¿Cuál es ese 'me encanta, pero...' que más veces escuchas de tus clientas en la tienda?",
    psEs: "En la próxima carta te cuento todo lo que estamos probando con AlmaRise D Organic y los tejidos de residuos de fruta y plantas en la India.",
    ctaTextEs: "Ver cómo funciona nuestro Programa de producción",
  },
  {
    id: "newsletter-issue-s2-10",
    issueNumber: "Issue #10",
    internalName: "Issue #10 · Cloth from sugarcane, orange, and banana",
    track: "all",
    narrator: "alma",
    ctaPathEn: "/almarise",
    ctaPathEs: "/es/almarise",
    localHeroImage: "/images/capabilities/natural-fabrics.jpg",
    heroImageAltEn:
      "Natural breathable woven textiles and organic dyed fabrics prepared for garment sampling in India",
    heroImageAltEs:
      "Tejidos naturales transpirables y telas con tintes orgánicos preparados para pruebas de confección en la India",
    narratorLocationEn: "Our studio near Mumbai",
    narratorLocationEs: "Desde nuestro estudio cerca de Bombay",
    titleEn: "Cloth from sugarcane, orange, and banana",
    subjectEn: "Cloth from sugarcane, orange, and banana",
    previewTextEn:
      "Inside AlmaRise D Organic: why plant- and fruit-waste textiles only earn their place when they feel wonderful on your skin.",
    introEn: `People know **AlmaRise D Brand** first for **AlmaRise D Reborn**, the one-of-a-kind garments we cut from kept Indian sarees. Right beside it sits a line that excites me just as much: **AlmaRise D Organic**.

When I tell friends in Spain that we are testing cloth spun from sugarcane, orange, banana, and pineapple waste, among others, they look at me as if I were making up a recipe.`,
    bodyEn: `Then they touch the fabric. Instead of feeling stiff or experimental, good plant- and fruit-waste textiles have a calm, fluid drape that moves easily in spring and summer heat. Paired with organic dyes, the colours feel soft and lived-in rather than neon bright.

I am very strict about one rule across every line of **AlmaRise D Brand**: sustainability is never an excuse for an uncomfortable garment. If a fabric feels scratchy on the neck, traps heat on a crowded Madrid metro, or sits awkwardly over jeans, it does not make the cut.

**Every textile we bring into AlmaRise D Organic goes through the same hands-on checks we run for our B2B Clients.** We wash swatches, hold them in daylight to inspect how the organic dye settles, drape them on the dressmaker form, and test how the garment behaves when you reach, sit, and walk for hours.

Working on **AlmaRise D Reborn**, **AlmaRise D Organic**, and **AlmaRise D Home Decor** side by side also makes Shirish and me sharper manufacturing partners. When a European brand asks how linen shifts after washing or how a natural dye behaves across batches, we are answering from the fabrics lying on our own studio table that same morning.`,
    replyPromptEn:
      "Have you ever worn a garment made from fruit or plant-waste fibres, and what surprised you most about the feel?",
    psEn: "In two weeks, Shirish takes you across four specialist Indian craft cities: Kolkata, Kanpur, Agra, and Chennai.",
    ctaTextEn: "Explore AlmaRise D Brand and its three lines",
    titleEs: "Tejidos de caña, naranja y plátano",
    subjectEs: "Tejidos de caña, naranja y plátano",
    previewTextEs:
      "Dentro de AlmaRise D Organic: por qué las fibras de residuos vegetales solo entran en colección cuando sientan de maravilla.",
    introEs: `Mucha gente conoce **AlmaRise D Brand** primero por **AlmaRise D Reborn**, nuestras prendas únicas cortadas a partir de saris guardados. Justo al lado crece otra línea que me entusiasma igual: **AlmaRise D Organic**.

Cuando les cuento a mis amigas en España que aquí probamos telas hechas con residuos de caña de azúcar, naranja, plátano y piña, entre otros, me miran como si estuviera recitando una receta de cocina.`,
    bodyEs: `Hasta que tocan la tela. Lejos de quedar rígidos o raros, los buenos tejidos vegetales tienen una caída maravillosa, fresca y ligera para el calor de primavera y verano. Combinados con tintes orgánicos, dan tonos suaves y naturales con mucha vida.

En todas las líneas de **AlmaRise D Brand** soy muy exigente con una norma: la sostenibilidad jamás justifica una prenda incómoda. Si un tejido pica en el cuello, da calor en el metro de Madrid o tiene un corte incómodo encima de unos vaqueros, se queda fuera sin discusión.

**Cada tejido que valoramos para AlmaRise D Organic pasa exactamente las mismas pruebas que hacemos para nuestros clientes.** Lavamos muestras para ver cómo encogen, miramos el tinte orgánico a luz natural, probamos la caída sobre el maniquí y comprobamos cómo responde la prenda al sentarte, caminar y moverte durante horas.

Levantar a la vez **AlmaRise D Reborn**, **AlmaRise D Organic** y **AlmaRise D Home Decor** nos hace además mucho más finos fabricando para otras marcas. Cuando una tienda europea nos pregunta cómo se comporta un tinte natural o un lino ligero, respondemos con la tela recién probada en nuestras propias manos.`,
    replyPromptEs:
      "¿Has probado alguna vez ropa hecha con fibras de residuos vegetales o de fruta? ¿Qué fue lo que más te llamó la atención al tacto?",
    psEs: "Dentro de dos semanas toma el relevo Shirish para llevarte de ruta por cuatro ciudades especialistas de la India: Calcuta, Kanpur, Agra y Chennai.",
    ctaTextEs: "Descubrir AlmaRise D Brand y sus tres líneas",
  },
  {
    id: "newsletter-issue-s2-11",
    issueNumber: "Issue #11",
    internalName: "Issue #11 · Kolkata, Kanpur, Agra, and Chennai",
    track: "all",
    narrator: "shirish",
    ctaPathEn: "/how-we-work",
    ctaPathEs: "/es/how-we-work",
    localHeroImage: "/images/founders/shirish-india-railway-station.jpeg",
    heroImageAltEn:
      "Shirish holding rolled papers on an Indian railway station platform between site visits",
    heroImageAltEs:
      "Shirish sosteniendo papeles enrollados en el andén de una estación de tren en la India entre visitas a unidades de producción",
    narratorLocationEn: "On the road across India",
    narratorLocationEs: "De ruta por la India",
    titleEn: "Kolkata, Kanpur, Agra, and Chennai",
    subjectEn: "Kolkata, Kanpur, Agra, and Chennai",
    previewTextEn:
      "Why India is a map of specialist craft cities, and how matching the right hub decides quality before sampling starts.",
    introEn: `A label saying "Made in India" hides an entire continent of specialist cities. Asking one single factory to handle every material, finish, and stitch is the fastest way to get an average product.

When a Product Brief lands on our desk, the first thing Alma and I look at is geography.`,
    bodyEn: `Across India, craft skill settled into regional clusters over generations. In leather goods alone, **Kolkata**, **Kanpur**, **Agra**, and **Chennai** each carry distinct tanning recipes, hide finishes, and stitching strengths. Some hubs shine at buttery vegetable-tanned soft bags; others excel at structured belts, small wallets, or crisp edge painting.

The same holds true when we move into **clothing in natural and varied fabrics**, **textile accessories**, and **textile home decor**. Hand-block prints, Kantha quilting, recycled-cotton flat-weave dhurries, linen dressmaking, and embroidered clutches each belong to makers who have refined that exact technique for decades.

**Because KarmaRise D Global is never tied to one factory, we match the city to your Product Brief rather than squeezing your brief into whoever sits closest.** We audit family-run factories and women artisan collectives in person, split tanning and assembly across states whenever quality asks for it, and coordinate contracts, colour swatches, and pre-shipment inspections from our base in Maharashtra near Mumbai.

You stay focused on your brand and your buyers in Spain or the rest of Europe. We handle the trains, the site visits, and the checks across India so every piece is made where the skill actually lives.`,
    replyPromptEn:
      "Which Indian textile or leather craft have you always been curious to explore for your own brand?",
    psEn: "Next letter, Alma introduces our fourth manufacturing category: textile home decor, from Kantha bedspreads to recycled-cotton dhurries.",
    ctaTextEn: "See how we match makers across India",
    titleEs: "Calcuta, Kanpur, Agra y Chennai",
    subjectEs: "Calcuta, Kanpur, Agra y Chennai",
    previewTextEs:
      "Por qué la India es un mapa de ciudades especialistas y cómo elegir el polo adecuado decide la calidad desde el primer día.",
    introEs: `Una etiqueta que pone "Hecho en la India" esconde todo un continente de ciudades especialistas. Pedirle a una sola fábrica que domine cada piel, cada tejido y cada acabado es la vía más rápida para acabar con un resultado mediocre.

Cuando entra un briefing de producto en nuestra mesa, lo primero que miramos Alma y yo es el mapa.`,
    bodyEs: `En la India, los oficios se han concentrado por regiones durante generaciones. Solo en marroquinería, **Calcuta**, **Kanpur**, **Agra** y **Chennai** tienen formas muy distintas de curtir, teñir y rematar. Unas zonas destacan en pieles de curtido vegetal blandas y sedosas; otras bordan cinturones estructurados, pequeña marroquinería o cantos muy limpios.

Pasa exactamente lo mismo con la **ropa de diversos tejidos**, los **complementos textiles** y la **decoración textil del hogar**. Las colchas estilo Kantha, las alfombras dhurrie de algodón reciclado, los vestidos de lino, los bolsos acolchados o los bolsos de mano bordados pertenecen a unidades de producción que llevan décadas perfeccionando ese oficio concreto.

**Como en KarmaRise D Global no estamos atados a una sola fábrica, elegimos la ciudad según tu briefing de producto en vez de forzar tu idea en el primer sitio que pilla cerca.** Auditamos en persona fábricas de corte familiar y colectivos de artesanas, dividimos fases entre estados cuando la calidad lo pide y coordinamos contratos, muestras físicas y controles en planta desde nuestra base en Maharashtra, cerca de Bombay.

Tú te centras en tu tienda, tu marca y tus ventas en España o el resto de Europa. Nosotros nos encargamos de los viajes, las visitas a planta y las revisiones por toda la India.`,
    replyPromptEs:
      "¿Qué oficio textil o de piel de la India te despierta más curiosidad explorar para tu marca?",
    psEs: "En la próxima carta Alma te presenta nuestra cuarta categoría de fabricación: decoración textil del hogar, de colchas Kantha a alfombras dhurrie.",
    ctaTextEs: "Ver cómo seleccionamos unidades de producción",
  },
  {
    id: "newsletter-issue-s2-12",
    issueNumber: "Issue #12",
    internalName: "Issue #12 · From Kantha quilts to flat-weave dhurries",
    track: "all",
    narrator: "alma",
    ctaPathEn: "/manufacturing",
    ctaPathEs: "/es/manufacturing",
    localHeroImage:
      "/images/almarise/design-students-saree-stacks-mumbai-studio.jpeg",
    heroImageAltEn:
      "Alma sorting folded stacks of embroidered and woven Indian textiles across a studio table alongside design students",
    heroImageAltEs:
      "Alma clasificando pilas dobladas de tejidos indios bordados y tramados sobre una mesa de estudio junto a estudiantes de diseño",
    narratorLocationEn: "Between Spain and India",
    narratorLocationEs: "Entre España y la India",
    titleEn: "From Kantha quilts to flat-weave dhurries",
    subjectEn: "From Kantha quilts to flat-weave dhurries",
    previewTextEn:
      "Why textile home decor is our fourth core category and a natural bridge between Indian craft and European homes.",
    introEn: `Anyone who has spent an afternoon in a Spanish home knows how much warmth lives in a dressed table and a stack of good cushions. Spend a week inside homes across India and you feel the exact same love for cloth you live with every day.

That shared habit is why **textile home decor** is now our fourth core manufacturing category at KarmaRise D Global, and an expanding line inside **AlmaRise D Home Decor**.`,
    bodyEn: `For independent boutiques and lifestyle brands across Spain and the rest of Europe, home textiles are a joy to merchandise alongside bags and clothing. They bring instant texture into a shop window and give loyal shoppers something easy to gift or carry home without worrying about dress sizes.

Here is what our Indian Manufacturing Partners produce across this category:

- **Bed and sofa textiles:** cushion covers, wall hangings, and Kantha-style bedspreads stitched with real character.\n- **Floor coverings:** recycled-cotton flat-weave dhurries light enough to shake out on a sunny balcony.\n- **Table dressing:** table runners, tablecloths, and placemats that turn an ordinary Sunday lunch into an occasion.

Just like our leather goods and clothing runs, every home decor piece follows the same calm discipline: we create physical colour swatches so tones match your palette in natural daylight, check weave density and washing tolerances on physical samples before cutting starts, and pack everything with clear EU fibre composition and care labels straight to your business door.`,
    replyPromptEn:
      "If you could add one textile home piece to your shop window or your own home this season, which would you pick first?",
    psEn: "Two weeks from today, Shirish walks plainly through mutual NDAs, Indian supplier contracts, and how legal clarity protects small brands.",
    ctaTextEn: "Explore our textile home decor capabilities",
    titleEs: "De colchas Kantha a alfombras dhurrie",
    subjectEs: "De colchas Kantha a alfombras dhurrie",
    previewTextEs:
      "Por qué la decoración textil del hogar es nuestra cuarta categoría y un puente natural entre la artesanía india y las casas europeas.",
    introEs: `Quien haya pasado una sobremesa larga en una casa española sabe el calor que da una mesa bien vestida y unos buenos cojines en el sofá. Pasa una semana entrando en casas de la India y notas exactamente el mismo cariño por los tejidos que acompañan la vida en casa.

Por eso la **decoración textil del hogar** es hoy nuestra cuarta gran categoría en KarmaRise D Global, además de crecer dentro de **AlmaRise D Home Decor**.`,
    bodyEs: `Para tiendas independientes y marcas de estilo de vida de España y el resto de Europa, los textiles de hogar son una maravilla en el escaparate junto a bolsos y ropa. Aportan textura al instante y permiten a tus clientas llevarse un regalo o un capricho para casa sin depender de tallas.

Esto es lo que desarrollamos con nuestras unidades de producción en la India dentro de esta categoría:

- **Cama y salón:** fundas de cojín, tapices de pared y colchas estilo Kantha con puntada llena de carácter.\n- **Suelos:** alfombras dhurrie de algodón reciclado, ligeras y prácticas para sacudir al sol.\n- **Mesa:** caminos de mesa, manteles y manteles individuales que convierten cualquier comida de domingo en una pequeña celebración.

Igual que en marroquinería y moda, cada pieza de hogar sigue las mismas reglas: preparamos muestra física de color para validar tonos a luz natural, comprobamos densidad del tejido y lavado en una muestra física aprobada antes de empezar a cortar y entregamos todo con su etiquetado europeo de composición y cuidado en la puerta de tu negocio.`,
    replyPromptEs:
      "Si pudieras sumar una pieza textil de hogar a tu escaparate o a tu propia casa esta temporada, ¿por cuál empezarías?",
    psEs: "Dentro de dos semanas Shirish te explica sin jerga legal cómo funcionan los acuerdos NDA y los contratos bajo ley india para proteger tu marca.",
    ctaTextEs: "Ver nuestra categoría de decoración textil del hogar",
  },
  {
    id: "newsletter-issue-s2-13",
    issueNumber: "Issue #13",
    internalName: "Issue #13 · What an Indian contract actually protects",
    track: "all",
    narrator: "shirish",
    ctaPathEn: "/how-we-work",
    ctaPathEs: "/es/how-we-work",
    localHeroImage: "/images/workshops/alma-shirish-india-office-meeting.jpg",
    heroImageAltEn:
      "Alma, Shirish, and their team seated around the meeting table with contract folders and notebooks in the India office",
    heroImageAltEs:
      "Alma, Shirish y su equipo reunidos alrededor de la mesa con carpetas de contratos y cuadernos en la oficina de la India",
    narratorLocationEn: "Our studio near Mumbai",
    narratorLocationEs: "Desde nuestro estudio cerca de Bombay",
    titleEn: "What an Indian contract actually protects",
    subjectEn: "What an Indian contract actually protects",
    previewTextEn:
      "Facing the biggest fear about producing in India: how mutual NDAs and Indian supplier contracts work in practice.",
    introEn: `Nearly every European founder I speak with carries the same quiet fear in the back of their mind, even when they are too polite to say it in the first five minutes:

"I heard about someone who paid a factory in India, and the work never showed up."`,
    bodyEn: `I never brush that fear aside, because bad stories do happen when people wire money to unverified listings based on WhatsApp promises.

As a registered Bar Council advocate in India, my job inside **KarmaRise D Global** is turning goodwill into clear, enforceable structure on Indian soil before a single rupee moves into production.

Here is what that looks like on every Manufacturing Programme:

- **Mutual NDA and NNN confidentiality:** Your sketches, patterns, and brand details remain strictly yours. Only Alma and I see your files during initial evaluation, and mutual NDA protection is available right from the start.\n- **Enforceable Indian supplier contracts:** Vague pro-forma invoices invite misunderstandings. Our written agreements with Manufacturing Partners lock material specs, approved physical swatch references, quality tolerances, and delivery schedules under Indian law.\n- **Physical gates before cutting starts:** Nobody rushes straight into cutting fabric or leather. You approve the physical sample in your own hands first, and twin counter-samples keep both sides honest through final inspection.

Good contracts protect honest Indian family-run factories just as much as European Clients. When expectations sit plainly on paper, everyone sleeps better and focuses on making a remarkable product.`,
    replyPromptEn:
      "What is the single biggest question you would want answered in writing before starting a first run in India?",
    psEn: "In our next letter, Alma walks through the practical construction details that make cotton dresses, denim, and textile accessories sell out.",
    ctaTextEn: "Read how we protect every stage of production",
    titleEs: "Qué protege un contrato en la India",
    subjectEs: "Qué protege un contrato en la India",
    previewTextEs:
      "Hablamos claro del mayor miedo al fabricar en la India: cómo funcionan nuestros acuerdos NDA y contratos bajo ley india.",
    introEs: `Casi cualquier persona en Europa con la que hablo guarda el mismo temor en la cabeza, aunque por educación tarde unos minutos en decirlo en voz alta:

"He oído historias de gente que pagó a una fábrica en la India y el pedido nunca llegó."`,
    bodyEs: `Jamás quito hierro a ese miedo, porque esos sustos ocurren de verdad cuando alguien adelanta dinero a un contacto encontrado en un directorio a base de promesas por chat.

Como abogado colegiado en el Bar Council de la India, mi papel en **KarmaRise D Global** es convertir la buena fe en un marco claro y exigible sobre suelo indio antes de que salga ni un solo euro hacia producción.

Así es como lo aterrizamos en cada Programa de producción:

- **Acuerdos mutuos NDA y NNN:** Tus bocetos, patrones e ideas siguen siendo tuyos. Durante la valoración inicial solo Alma y yo vemos tus archivos, y dispones de acuerdo de confidencialidad NDA desde el primer momento.\n- **Contratos escritos bajo ley india:** Una factura proforma vaga es la receta perfecta para malentendidos. Nuestros contratos con las unidades de producción fijan materiales exactos, referencia de muestra física de color, tolerancias de calidad y plazos reales.\n- **Control físico antes de cortar:** Nadie corre a cortar tela ni piel sin tu visto bueno. Apruebas primero la muestra física en tu mano y sellamos contramuestras gemelas para revisar el pedido antes del embarque.

Un contrato limpio y justo protege tanto a las fábricas de corte familiar serias como a las marcas europeas. Cuando las reglas están claras por escrito, todo el mundo trabaja tranquilo y centrado en el oficio.`,
    replyPromptEs:
      "¿Qué cláusula o garantía querrías ver siempre por escrito antes de lanzar una primera producción en la India?",
    psEs: "En la próxima carta Alma repasa los detalles de confección que hacen que vestidos de algodón, prendas vaqueras y complementos textiles enamoren en tienda.",
    ctaTextEs: "Ver cómo protegemos cada fase de la producción",
  },
  {
    id: "newsletter-issue-s2-14",
    issueNumber: "Issue #14",
    internalName: "Issue #14 · Why natural cloth needs more than a swatch",
    track: "all",
    narrator: "alma",
    ctaPathEn: "/product-brief",
    ctaPathEs: "/es/product-brief",
    localHeroImage:
      "/images/workshops/alma-natural-canvas-fabric-cutting-table.jpeg",
    heroImageAltEn:
      "Alma examining thick natural cotton canvas fabric laid out for cutting at an Indian production site",
    heroImageAltEs:
      "Alma revisando lona gruesa de algodón natural extendida antes del corte en una unidad de producción de la India",
    narratorLocationEn: "Our studio near Mumbai",
    narratorLocationEs: "Desde nuestro estudio cerca de Bombay",
    titleEn: "Why natural cloth needs more than a swatch",
    subjectEn: "Why natural cloth needs more than a swatch",
    previewTextEn:
      "Practical checks across cotton and linen dresses, denim, quilted totes, scarves, and padded headbands before production.",
    introEn: `A small fabric swatch feels lovely between two fingers. Yet a swatch never tells you how a cotton midi dress moves when you climb metro stairs, or how a quilted canvas tote hangs once you drop a laptop and water bottle inside.

When we develop **clothing in natural and varied fabrics** or **textile accessories** in India, the real magic lives in testing how the whole piece behaves in real life.`,
    bodyEn: `Across our garment and accessory Manufacturing Programmes, clients come to us with wonderful ideas: breezy cotton and linen midi dresses and skirts, distinctive denim jackets and jumpsuits, soft pashminas and shawls, thick canvas totes, embroidered clutches, toiletry cases, padded headbands, kimono sashes, and fabric laptop sleeves.

Before we ever approve a prototype, I run through a very down-to-earth woman's checklist:

- **Shrinkage and wash tests:** Natural cotton and linen relax or shrink differently depending on the weave. Checking a washed swatch early prevents a midi dress turning two centimetres short after its first wash at home.\n- **Comfortable cuts:** Armholes, waistbands, and shoulders need breathing room so shoppers smile the second they step out of the fitting room.\n- **Everyday ergonomics on textile bags:** Handle width and strap drop decide whether a canvas or quilted tote feels effortless or digs into your shoulder ten minutes down the street. Adding light cotton linings and smooth high-quality Japanese plastic YKK zippers makes clutches and travel pouches a joy to open.

You never need technical garment drawings to start a conversation like this. Hold up a dress or tote from your shop on a quick call, tell us what works and what annoys your shoppers, and we will build the Product Brief together.`,
    replyPromptEn:
      "Which garment or textile accessory detail drives you craziest when you try it on in a shop?",
    psEn: "In two weeks, Shirish covers the quiet EU compliance details that keep export cartons moving smoothly to your doorstep.",
    ctaTextEn: "Share your clothing or accessory idea",
    titleEs: "Por qué un tejido pide más que un retal",
    subjectEs: "Por qué un tejido pide más que un retal",
    previewTextEs:
      "Pruebas reales en vestidos de algodón y lino, denim, bolsos acolchados y complementos textiles antes de producir.",
    introEs: `Un pequeño retal de tela enamora entre dos dedos. Pero un retal nunca te cuenta cómo se mueve un vestido midi de algodón al subir las escaleras del metro, ni cómo cuelga un bolso de lona gruesa cuando metes el ordenador y una botella dentro.

Cuando desarrollamos **ropa de diversos tejidos** o **complementos textiles** en la India, la diferencia real está en probar cómo vive la pieza entera.`,
    bodyEs: `En nuestros Programas de producción de moda y complementos llegan ideas preciosas: vestidos midi y faldas de algodón y lino, prendas vaqueras diferentes, blusas, monos, pashminas, bolsas de lona y lino grueso, bolsos acolchados, bolsos de mano bordados, neceseres, diademas acolchadas, fajines tipo obi y fundas de tela para portátil o gafas.

Antes de dar el visto bueno a un prototipo, repaso siempre una lista muy práctica de uso real:

- **Lavado y encogimiento:** El algodón y el lino naturales cambian según la trama. Probar una muestra lavada a tiempo evita que un vestido quede dos centímetros más corto tras el primer lavado en casa.\n- **Corte cómodo:** Sisas, hombros y cinturas necesitan margen para que la clienta sonría nada más salir del probador.\n- **Ergonomía en bolsos textiles y neceseres:** El ancho y la caída del asa deciden si un bolso acolchado resulta comodísimo o se clava en el hombro a los diez minutos. Y un forro claro de algodón junto a cremalleras japonesas YKK de plástico de alta calidad hace que abrir un neceser o un bolso de mano sea un gusto.

No te hace falta ninguna ficha técnica cerrada para empezar. En una llamada rápida nos enseñas una prenda o un complemento que te guste, nos cuentas qué mejorarías y armamos juntos el briefing de producto.`,
    replyPromptEs:
      "¿Qué pequeño fallo de confección o de tejido te hace devolver una prenda a la percha al probártela?",
    psEs: "En dos semanas Shirish te cuenta esos detalles silenciosos de etiquetado europeo y aduanas que aseguran que tus cajas lleguen sin sustos.",
    ctaTextEs: "Contarnos tu idea de prendas o complementos",
  },
  {
    id: "newsletter-issue-s2-15",
    issueNumber: "Issue #15",
    internalName: "Issue #15 · The tiny label that stops customs delays",
    track: "all",
    narrator: "shirish",
    ctaPathEn: "/manufacturing#faq",
    ctaPathEs: "/es/manufacturing#faq",
    localHeroImage: "/images/capabilities/unbleached-cotton-pouches.jpg",
    heroImageAltEn:
      "Unbleached natural cotton and washed linen drawstring pouches laid in warm daylight",
    heroImageAltEs:
      "Bolsas guardapolvo de algodón natural sin blanquear y lino lavado bajo luz cálida",
    narratorLocationEn: "Our studio near Mumbai",
    narratorLocationEs: "Desde nuestro estudio cerca de Bombay",
    titleEn: "The tiny label that stops customs delays",
    subjectEn: "The tiny label that stops customs delays",
    previewTextEn:
      "Sewn-in EU care and composition tags, REACH checks, recycled hangtags, and doorstep delivery planned before production.",
    introEn: `Most brands spend months perfecting leather softness, dress drape, and colour swatches, then remember export labelling three days before dispatch.

That last-minute rush is where surprise repacking fees and customs holds are born.`,
    bodyEn: `When you import own-brand leather goods, clothing, textile accessories, or textile home decor into Spain or the rest of Europe, customs inspectors and retail buyers look for very specific marks right on the product.

At **KarmaRise D Global**, we plan EU readiness into the Product Brief before cutting starts so dispatch feels calm instead of frantic:

- **Sewn-in EU labelling:** Proper fibre composition, genuine leather markings where required, country-of-origin marks, and clear Spanish or bilingual care instructions stitched cleanly inside every piece.\n- **REACH compliance:** Checking dyes, tanning agents, and metal fittings upfront against European chemical limits.\n- **Brand presentation ready for your shelves:** Woven brand labels, custom cotton dust bags, and unbleached chemical-free recycled cardboard care hangtags finished in India so you can place pieces straight into your shop window.\n- **Doorstep export packing:** Moisture-protected, numbered, stretch-wrapped export cartons plus complete commercial invoices and packing lists cleared all the way to your business door.

You should spend launch week unpacking beautiful cartons and welcoming customers, never scrambling to reprint hangtags or answer unexpected customs emails.`,
    replyPromptEn:
      "What part of importing from outside the EU feels most confusing or daunting right now?",
    psEn: "In our next letter, Alma and I share our honest calendar guide for working backward from your target launch season.",
    ctaTextEn: "Read our manufacturing and export FAQs",
    titleEs: "La etiqueta que evita bloqueos en aduana",
    subjectEs: "La etiqueta que evita bloqueos en aduana",
    previewTextEs:
      "Etiquetado europeo cosido, límites REACH, etiquetas de cartón reciclado y entrega puerta a puerta previstos desde el principio.",
    introEs: `Muchas marcas pasan meses afinando la suavidad de la piel, la caída de un vestido y las muestras de color, y se acuerdan del etiquetado europeo tres días antes de embarcar.

En esas prisas de última hora es donde nacen los bloqueos en aduana y los costes imprevistos de reembalaje.`,
    bodyEs: `Cuando importas bolsos de piel, ropa, complementos textiles o decoración textil del hogar hacia España o el resto de Europa, tanto aduanas como tus clientas esperan encontrar datos muy concretos directamente en cada pieza.

En **KarmaRise D Global** dejamos la preparación europea cerrada dentro del briefing de producto antes de comenzar con el corte de las piezas:

- **Etiquetado europeo cosido:** Composición exacta de fibras, indicación de piel auténtica cuando aplica, origen e instrucciones de cuidado claras en español o bilingüe, bien rematadas en el interior.\n- **Requisitos REACH:** Verificación previa de tintes, curtido y herrajes según la normativa química europea.\n- **Presentación lista para el escaparate:** Etiquetas tejidas con tu marca, bolsas guardapolvo de algodón y etiquetas de cartón reciclado sin blanquear, libre de químicos, terminadas en la India para colocar directamente en el escaparate.\n- **Cajas hasta la puerta de tu negocio:** Cajas de exportación numeradas, protegidas contra humedad y retractiladas, con toda la documentación de exportación revisada hasta tu puerta.

La semana de lanzamiento tiene que ser para abrir cajas con ilusión y recibir clientas, nunca para correr detrás de aduanas ni reetiquetar a mano.`,
    replyPromptEs:
      "¿Qué parte de importar desde fuera de la Unión Europea te genera hoy más dudas?",
    psEs: "En la próxima carta Alma y yo compartimos cómo planificar tu calendario hacia atrás desde la fecha en la que quieres ver la colección en el escaparate.",
    ctaTextEs: "Ver preguntas frecuentes sobre fabricación y envío",
  },
  {
    id: "newsletter-issue-s2-16",
    issueNumber: "Issue #16",
    internalName: "Issue #16 · Working backward from your shop window",
    track: "all",
    narrator: "both",
    ctaPathEn: "/product-brief",
    ctaPathEs: "/es/product-brief",
    localHeroImage:
      "/images/workshops/alma-leather-manufacturing-partner-team-india.jpg",
    heroImageAltEn:
      "Alma smiling alongside our Indian leather production partner team in front of sample racks",
    heroImageAltEs:
      "Alma sonriendo junto al equipo de nuestra unidad de producción de piel en la India frente a los expositores de muestras",
    narratorLocationEn: "Spain & India",
    narratorLocationEs: "España e India",
    titleEn: "Working backward from your shop window",
    subjectEn: "Working backward from your shop window",
    previewTextEn:
      "An honest step-by-step look at how a rough idea turns into boxes at your door without rushing samples or colours.",
    introEn: `One of the best gifts you can give your next collection is starting the conversation a little earlier than you think you need to.

Good craft hates panic. When you leave room to test a physical colour swatch properly and hold two sample revisions if needed, every decision gets calmer and every piece lands stronger.`,
    bodyEn: `Every Manufacturing Programme we run is scoped individually around your Product Brief, materials, and target season. Here is the simple, honest path we walk together from first hello to delivery at your door:

- **1. Start with what sits on your desk:** A four-line sketch, phone photos, or an item from your shop is plenty. We confirm your notes in writing and put a mutual NDA in place whenever you wish.\n- **2. Lock materials and physical colour swatches:** We match your brief to vetted family-run factories or women artisan collectives across India and create physical colour swatches for your sign-off.\n- **3. Hold the reviewed physical sample in hand:** We inspect prototypes ourselves in India first, flag even minor refinements openly, and start production cutting only after you hold and approve the physical sample.\n- **4. Supervised production to your business door:** We follow your order in person beside the stitching lines, send live updates, verify EU labels and export cartons, and coordinate delivery straight to your shop in Spain or elsewhere in Europe.

If you have been sketching a leather bag line, a natural-fabric dress capsule, textile accessories, or home decor pieces for the coming season, we would love to hear what is on your mind. Start a 1-minute Product Brief below, or book a free 15-minute video call with Alma in English, Spanish, or Portuguese.`,
    replyPromptEn:
      "Which season or launch window are you starting to plan right now?",
    psEn: "Thank you for reading along across these letters from Spain and India. Whether you are ready to build a piece or simply enjoy following our craft Stories, we are glad you are here.",
    ctaTextEn: "Start your Product Brief",
    titleEs: "Planificar hacia atrás desde tu escaparate",
    subjectEs: "Planificar hacia atrás desde tu escaparate",
    previewTextEs:
      "Un recorrido claro y realista de cómo una idea sencilla llega en cajas a la puerta de tu negocio sin prisas en las muestras.",
    introEs: `Uno de los mejores favores que puedes hacerle a tu próxima colección es abrir la conversación un poco antes de lo que crees.

El buen oficio se lleva mal con las prisas. Cuando dejas margen para validar una muestra física de color con calma y ajustar un prototipo si hace falta, cada decisión sale redonda.`,
    bodyEs: `Cada Programa de producción se valora a medida según tu briefing de producto, los materiales elegidos y la campaña a la que quieres llegar. Este es el camino claro que recorremos juntos de principio a fin:

- **1. Empezamos con lo que ya tienes:** Un boceto de cuatro líneas, fotos en el móvil o una pieza de tu tienda bastan. Cerramos las conclusiones de la reunión por escrito y activamos acuerdo mutuo NDA en cuanto lo pidas.\n- **2. Materiales y muestra física de color:** Emparejamos tu briefing con fábricas de corte familiar o colectivos de artesanas auditados en la India y preparamos muestras físicas de color para tu aprobación.\n- **3. Muestra física revisada en tu mano:** Revisamos cada prototipo primero sobre el terreno, te avisamos con franqueza de cualquier pequeño ajuste y solo comenzamos con el corte de las piezas cuando apruebas la muestra física en mano.\n- **4. Seguimos tu pedido hasta tu puerta:** Supervisamos la producción en planta, compartimos avances reales, verificamos el etiquetado europeo y entregamos las cajas en la puerta de tu negocio en España o en el resto de Europa.

Si te ronda la cabeza lanzar bolsos de piel, una colección cápsula de tejidos naturales, complementos textiles o piezas de decoración del hogar para la próxima campaña, nos encantará escucharte. Puedes empezar tu briefing de producto en un minuto aquí debajo o reservar una videollamada gratuita de 15 minutos con Alma en español, inglés o portugués.`,
    replyPromptEs:
      "¿Qué campaña o temporada estás empezando a imaginar ya para tu tienda o marca?",
    psEs: "Gracias por acompañarnos carta tras carta entre España y la India. Tanto si estás lista para lanzar una colección como si simplemente disfrutas leyendo nuestras historias, qué gusto tenerte aquí.",
    ctaTextEs: "Empezar tu briefing de producto",
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

  const ctaUrlEn = draft.ctaPathEn
    ? `${canonicalBase}${draft.ctaPathEn}`
    : draft.storySlug
      ? `${canonicalBase}/stories/${draft.storySlug}`
      : `${canonicalBase}/stories`;
  const ctaUrlEs = draft.ctaPathEs
    ? `${canonicalBase}${draft.ctaPathEs}`
    : draft.storySlug
      ? `${canonicalBase}/es/stories/${draft.storySlug}`
      : `${canonicalBase}/es/stories`;

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
    ctaUrl: ctaUrlEn,
    ctaUrlEs: ctaUrlEs,
    heroImageUrl: options?.heroImageUrl || draft.localHeroImage,
    heroImageAltEn: draft.heroImageAltEn,
    heroImageAltEs: draft.heroImageAltEs,
    brevoCampaignIdEn: options?.brevoCampaignIdEn,
    brevoCampaignIdEs: options?.brevoCampaignIdEs,
    ...(draft.storySlug
      ? { selectedStories: [{ slug: draft.storySlug }] }
      : {}),
  };
}
