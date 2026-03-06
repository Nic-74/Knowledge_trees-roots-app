/* ═══════════════════════════════════════════════
   ROOTS v4 — Knowledge Trees
   Application Engine — Full Feature Expansion
   ═══════════════════════════════════════════════ */

// ── BOOT SEQUENCE ──
const bootSteps = ['INITIALIZING ROOTS','LOADING CURRICULUM DB','SCANNING MESH NETWORK','INDEXING TEXTBOOKS','ACTIVATING AI TEACHER','WELCOME'];
let bi = 0;
const bt = setInterval(() => {
    bi++;
    if (bi < bootSteps.length) {
        document.getElementById('bootLbl').textContent = bootSteps[bi];
        document.getElementById('bootBar').style.width = (bi / (bootSteps.length - 1) * 100) + '%';
    } else {
        clearInterval(bt);
        setTimeout(() => {
            document.getElementById('boot').classList.add('gone');
            toast('ok', 'Connected', 'Mesh active \u2014 12 peers nearby');
        }, 300);
    }
}, 400);

// ── NAVIGATION ──
function go(s, el) {
    document.querySelectorAll('.scr').forEach(x => x.classList.remove('on'));
    document.getElementById('s-' + s).classList.add('on');
    document.querySelectorAll('.bnav-item').forEach(x => x.classList.remove('on'));
    if (el) el.classList.add('on');
    document.getElementById('s-' + s).scrollTop = 0;
}

// ── TOAST ──
function toast(type, title, msg) {
    const w = document.getElementById('toasts');
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    const icon = type === 'ok'
        ? '<svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.5"><use href="#i-check"/></svg>'
        : '<svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><use href="#i-broadcast"/></svg>';
    t.innerHTML = '<div class="toast-i">' + icon + '</div><div class="toast-txt"><b>' + title + '</b><br>' + msg + '</div>';
    w.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(-8px)'; t.style.transition = 'all 0.3s'; setTimeout(() => t.remove(), 300); }, 3500);
}

// ── GREETING ──
(function () {
    const h = new Date().getHours();
    document.getElementById('greeting').textContent = h < 12 ? 'Good morning,' : h < 17 ? 'Good afternoon,' : 'Good evening,';
})();


/* ══════════════════════════════════════════
   45-MINUTE SESSION TIMER
   ══════════════════════════════════════════ */
const SESSION_DURATION = 45 * 60;
let sessionRemaining = SESSION_DURATION;
const CIRCUMFERENCE = 2 * Math.PI * 17;
(function startSession() {
    const sessionInterval = setInterval(() => {
        sessionRemaining--;
        if (sessionRemaining <= 0) {
            sessionRemaining = 0;
            clearInterval(sessionInterval);
            toast('ok', 'Session Complete', '45 minutes done. Take a break, then start another.');
        }
        const ringEl = document.getElementById('sessionRing');
        const timeEl = document.getElementById('sessionTime');
        const mins = Math.floor(sessionRemaining / 60);
        const secs = sessionRemaining % 60;
        timeEl.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
        ringEl.style.strokeDashoffset = CIRCUMFERENCE * (1 - sessionRemaining / SESSION_DURATION);
        if (sessionRemaining <= 300 && sessionRemaining > 60) { ringEl.style.stroke = 'var(--c-amber)'; timeEl.style.color = 'var(--c-amber)'; }
        else if (sessionRemaining <= 60) { ringEl.style.stroke = 'var(--c-red)'; timeEl.style.color = 'var(--c-red)'; }
    }, 1000);
})();


/* ══════════════════════════════════════════
   SUBJECT COLOR MAP
   ══════════════════════════════════════════ */
const SC = {
    mathematics:   { bg:'var(--c-primary-soft)', c:'var(--c-primary)', cv:'geometric' },
    english:       { bg:'var(--c-purple-soft)',  c:'var(--c-purple)',  cv:'lines' },
    science:       { bg:'var(--c-green-soft)',   c:'var(--c-green)',   cv:'grid' },
    physics:       { bg:'var(--c-blue-soft)',    c:'var(--c-blue)',    cv:'geometric' },
    chemistry:     { bg:'var(--c-red-soft)',     c:'var(--c-red)',     cv:'grid' },
    biology:       { bg:'var(--c-green-soft)',   c:'var(--c-green)',   cv:'grid' },
    social_studies:{ bg:'var(--c-amber-soft)',   c:'var(--c-amber)',   cv:'waves' },
    history:       { bg:'var(--c-primary-soft)', c:'var(--c-primary)', cv:'waves' },
    geography:     { bg:'var(--c-amber-soft)',   c:'var(--c-amber)',   cv:'waves' },
    ict:           { bg:'var(--c-blue-soft)',    c:'var(--c-blue)',    cv:'dots' },
    agriculture:   { bg:'var(--c-green-soft)',   c:'var(--c-green)',   cv:'dots' },
    religious_ed:  { bg:'var(--c-amber-soft)',   c:'var(--c-amber)',   cv:'waves' },
    creative_arts: { bg:'var(--c-purple-soft)',  c:'var(--c-purple)',  cv:'dots' },
    commerce:      { bg:'var(--c-amber-soft)',   c:'var(--c-amber)',   cv:'dots' },
    literature:    { bg:'var(--c-purple-soft)',  c:'var(--c-purple)',  cv:'lines' },
    economics:     { bg:'var(--c-amber-soft)',   c:'var(--c-amber)',   cv:'blocks' },
    entrepreneurship:{ bg:'var(--c-primary-soft)',c:'var(--c-primary)',cv:'blocks' },
    comp_science:  { bg:'var(--c-blue-soft)',    c:'var(--c-blue)',    cv:'blocks' },
};


/* ══════════════════════════════════════════
   CLASS-BASED TEXTBOOK LIBRARY
   ══════════════════════════════════════════ */
const CLASS_LEVELS = ['P1','P2','P3','P4','P5','P6','P7','S1','S2','S3','S4','S5','S6'];
let selectedClass = 'P4';
let libSearchQuery = '';

// Generate textbooks for all class-subject combos
function mkTb(id, abbr, title, sub, author, pages, cls, subj, tag, tc, chName, chBody) {
    const s = SC[subj] || SC.mathematics;
    return { id, abbr, title, subtitle: sub, author, pages, classes: cls, subject: subj, tag, tagClass: tc,
        coverStyle: s.cv, bg: s.bg, color: s.c,
        content: { title, chapters: [{ name: chName, body: chBody }] } };
}

const textbooks = [
    // ── PRIMARY 1 ──
    mkTb('math-p1','Ma','Mathematics Book 1','Counting, Shapes & Patterns','NCDC Uganda',120,['P1'],'mathematics','Core','tag-o','Chapter 1: Counting 1-100','<h3>Counting Numbers</h3><p>Let us learn to count from 1 to 100! Counting is the first step in mathematics. Point to each object and say the number out loud.</p><div class="r-exercise"><div class="re-t">Activity</div><p>Count the number of desks in your classroom. Count the number of windows. Which is more?</p></div>'),
    mkTb('eng-p1','En','English Book 1','Letters, Sounds & Words','NCDC Uganda',110,['P1'],'english','Core','tag-p','Chapter 1: The Alphabet','<h3>Learning the Alphabet</h3><p>The English alphabet has 26 letters: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z. Each letter has a big form (capital) and a small form (lowercase).</p><div class="r-exercise"><div class="re-t">Activity</div><p>Write each letter of the alphabet. Say the sound each letter makes.</p></div>'),
    mkTb('sci-p1','Sc','Science Book 1','My Body & Environment','NCDC Uganda',100,['P1'],'science','Core','tag-g','Chapter 1: Parts of My Body','<h3>Our Amazing Bodies</h3><p>Your body has many parts. Your head, arms, legs, hands, and feet all help you do different things. Your eyes help you see, your ears help you hear, and your nose helps you smell.</p>'),
    mkTb('ss-p1','SS','Social Studies Book 1','My Home & School','NCDC Uganda',90,['P1'],'social_studies','Core','tag-o','Chapter 1: My Family','<h3>My Family</h3><p>Everyone has a family. Your family includes your mother, father, brothers, sisters, and other relatives. Families love and care for each other.</p>'),
    // ── PRIMARY 2 ──
    mkTb('math-p2','Ma','Mathematics Book 2','Addition & Subtraction','NCDC Uganda',140,['P2'],'mathematics','Core','tag-o','Chapter 1: Addition','<h3>Adding Numbers</h3><p>Addition means putting numbers together. When you have 3 mangoes and someone gives you 2 more, you have 3 + 2 = 5 mangoes.</p><div class="r-formula">3 + 2 = 5</div><div class="r-exercise"><div class="re-t">Practice</div><p>a) 4 + 3 = ?<br>b) 7 + 5 = ?<br>c) 8 + 6 = ?</p></div>'),
    mkTb('eng-p2','En','English Book 2','Reading & Writing','NCDC Uganda',130,['P2'],'english','Core','tag-p','Chapter 1: Simple Words','<h3>Building Words</h3><p>Words are made from letters put together. The word CAT has three letters: C-A-T. Let us learn to read and write simple words.</p>'),
    mkTb('sci-p2','Sc','Science Book 2','Plants & Animals','NCDC Uganda',120,['P2'],'science','Core','tag-g','Chapter 1: Living Things Around Us','<h3>Living and Non-Living Things</h3><p>Living things grow, breathe, eat, and reproduce. Plants and animals are living things. Stones, water, and desks are non-living things.</p>'),
    mkTb('ss-p2','SS','Social Studies Book 2','My Community','NCDC Uganda',100,['P2'],'social_studies','Core','tag-o','Chapter 1: People Who Help Us','<h3>Community Helpers</h3><p>Many people in our community help us every day: teachers, doctors, police officers, farmers, and boda-boda drivers.</p>'),
    // ── PRIMARY 3 ──
    mkTb('math-p3','Ma','Mathematics Book 3','Multiplication & Division','NCDC Uganda',160,['P3'],'mathematics','Core','tag-o','Chapter 1: Multiplication','<h3>Understanding Multiplication</h3><p>Multiplication is a quick way to add the same number many times. 3 x 4 means "3 groups of 4" = 4 + 4 + 4 = 12.</p><div class="r-formula">3 x 4 = 12</div>'),
    mkTb('eng-p3','En','English Book 3','Sentences & Stories','NCDC Uganda',150,['P3'],'english','Core','tag-p','Chapter 1: Types of Sentences','<h3>Four Types of Sentences</h3><p><strong>Statements</strong> tell us something: "The sun is hot."<br><strong>Questions</strong> ask something: "Is the sun hot?"<br><strong>Commands</strong> tell someone to do something: "Close the door."<br><strong>Exclamations</strong> show surprise: "What a beautiful day!"</p>'),
    mkTb('sci-p3','Sc','Science Book 3','Matter & Energy','NCDC Uganda',140,['P3'],'science','Core','tag-g','Chapter 1: States of Matter','<h3>Solid, Liquid, Gas</h3><p>Everything around us is made of matter. Matter exists in three states: <strong>Solid</strong> (has a fixed shape like a desk), <strong>Liquid</strong> (flows like water), and <strong>Gas</strong> (spreads everywhere like air).</p>'),
    mkTb('ss-p3','SS','Social Studies Book 3','Uganda: Our Country','NCDC Uganda',130,['P3'],'social_studies','Core','tag-o','Chapter 1: Map of Uganda','<h3>Our Beautiful Country</h3><p>Uganda is located in East Africa. It borders Kenya, Tanzania, South Sudan, DRC, and Rwanda. Kampala is our capital city. Uganda is called "The Pearl of Africa."</p>'),
    // ── PRIMARY 4 ──
    mkTb('math-p4','Ma','Mathematics Book 4','Fractions & Decimals','NCDC Uganda',180,['P4'],'mathematics','Core','tag-o','Chapter 1: Understanding Fractions','<h3>What is a Fraction?</h3><p>A fraction represents part of a whole. If you cut a chapati into 4 equal pieces and eat 1 piece, you have eaten 1/4 of the chapati.</p><div class="r-formula">1/4 means 1 out of 4 equal parts</div><div class="r-example"><strong>Example:</strong> If a class of 30 students has 15 girls, what fraction are girls?<br>15/30 = 1/2 (half the class)</div>'),
    mkTb('eng-p4','En','English Book 4','Grammar & Composition','NCDC Uganda',170,['P4'],'english','Core','tag-p','Chapter 1: Nouns & Pronouns','<h3>Nouns Name Everything</h3><p>A noun is a word that names a person, place, thing, or idea. <strong>Proper nouns</strong> name specific things (Kampala, Nicholas) and start with capital letters. <strong>Common nouns</strong> name general things (city, boy).</p>'),
    mkTb('sci-p4','Sc','Science Book 4','Force & Motion','NCDC Uganda',160,['P4'],'science','Core','tag-g','Chapter 1: What is Force?','<h3>Forces Around Us</h3><p>A force is a push or pull that can make things move, stop, or change direction. When you kick a football, you apply force. Gravity is a force that pulls everything toward the ground.</p>'),
    mkTb('ss-p4','SS','Social Studies Book 4','African Geography','NCDC Uganda',150,['P4'],'social_studies','Core','tag-o','Chapter 1: East Africa','<h3>The East African Region</h3><p>East Africa includes Uganda, Kenya, Tanzania, Rwanda, Burundi, and South Sudan. The region shares Lake Victoria \u2014 the largest lake in Africa and source of the River Nile.</p>'),
    mkTb('ict-p4','IC','ICT Book 4','Computer Basics','NCDC Uganda',100,['P4'],'ict','Digital','tag-b','Chapter 1: What is a Computer?','<h3>Introduction to Computers</h3><p>A computer is an electronic device that processes information. It follows the Input \u2192 Process \u2192 Output cycle. The keyboard and mouse are input devices. The screen is an output device.</p>'),
    mkTb('agr-p4','Ag','Agriculture Book 4','Growing Food','NCDC Uganda',120,['P4'],'agriculture','Vocational','tag-g','Chapter 1: Soil Types','<h3>Understanding Soil</h3><p>Plants need good soil to grow. There are three main soil types: <strong>Sandy soil</strong> (drains fast), <strong>Clay soil</strong> (holds water), and <strong>Loam soil</strong> (best for farming \u2014 a mix of sand and clay).</p>'),
    // ── PRIMARY 5 ──
    mkTb('math-p5','Ma','Mathematics Book 5','Percentages & Geometry','NCDC Uganda',200,['P5'],'mathematics','Core','tag-o','Chapter 1: Percentages','<h3>Understanding Percentages</h3><p>Percent means "out of 100." If you score 80 out of 100 on a test, your score is 80%. To convert a fraction to a percentage: multiply by 100.</p><div class="r-formula">Percentage = (Part / Whole) x 100</div>'),
    mkTb('eng-p5','En','English Book 5','Essay Writing','NCDC Uganda',190,['P5'],'english','Core','tag-p','Chapter 1: Paragraph Structure','<h3>Writing Strong Paragraphs</h3><p>A good paragraph has three parts: <strong>Topic sentence</strong> (the main idea), <strong>Supporting sentences</strong> (details and examples), and a <strong>Closing sentence</strong> (wraps up the idea).</p>'),
    mkTb('sci-p5','Sc','Science Book 5','Human Body Systems','NCDC Uganda',180,['P5'],'science','Core','tag-g','Chapter 1: The Digestive System','<h3>How We Process Food</h3><p>The digestive system breaks down food so our body can use it for energy. Food travels: Mouth \u2192 Esophagus \u2192 Stomach \u2192 Small Intestine \u2192 Large Intestine.</p>'),
    mkTb('ss-p5','SS','Social Studies Book 5','Government & Economy','NCDC Uganda',170,['P5'],'social_studies','Core','tag-o','Chapter 1: How Uganda is Governed','<h3>Our Government</h3><p>Uganda is a republic led by a President. The government has three branches: Executive (President & Cabinet), Legislature (Parliament), and Judiciary (Courts).</p>'),
    // ── PRIMARY 6 ──
    mkTb('math-p6','Ma','Mathematics Book 6','Algebra Introduction','NCDC Uganda',220,['P6'],'mathematics','Core','tag-o','Chapter 1: Using Letters for Numbers','<h3>Introduction to Algebra</h3><p>In algebra, we use letters to represent unknown numbers. If "x" represents a number and x + 3 = 7, then x must be 4, because 4 + 3 = 7.</p><div class="r-formula">x + 3 = 7, therefore x = 4</div>'),
    mkTb('eng-p6','En','English Book 6','Comprehension & Vocabulary','NCDC Uganda',210,['P6'],'english','Core','tag-p','Chapter 1: Reading Strategies','<h3>How to Understand What You Read</h3><p>Good readers use strategies: <strong>Preview</strong> (look at headings and pictures first), <strong>Question</strong> (ask yourself what the text is about), <strong>Summarize</strong> (retell the main ideas in your own words).</p>'),
    mkTb('sci-p6','Sc','Science Book 6','Electricity & Magnetism','NCDC Uganda',200,['P6'],'science','Core','tag-g','Chapter 1: Electric Circuits','<h3>How Electricity Flows</h3><p>Electricity flows through conductors (like copper wire) in a circuit. A complete circuit needs: a power source (battery), conductors (wires), and a load (light bulb). If the circuit is broken, electricity stops flowing.</p>'),
    // ── PRIMARY 7 ──
    mkTb('math-p7','Ma','Mathematics Book 7','PLE Preparation','NCDC Uganda',250,['P7'],'mathematics','Core','tag-o','Chapter 1: Number Operations Review','<h3>Mastering Operations</h3><p>Before PLE, you must be confident with all four operations: addition, subtraction, multiplication, and division \u2014 including with fractions, decimals, and percentages.</p>'),
    mkTb('eng-p7','En','English Book 7','PLE English Prep','NCDC Uganda',240,['P7'],'english','Core','tag-p','Chapter 1: Tenses Review','<h3>Mastering Tenses</h3><p>English has three main tenses: <strong>Past</strong> (I studied), <strong>Present</strong> (I study), and <strong>Future</strong> (I will study). Each has simple, continuous, and perfect forms.</p>'),
    mkTb('sci-p7','Sc','Science Book 7','PLE Science Prep','NCDC Uganda',230,['P7'],'science','Core','tag-g','Chapter 1: Health & Nutrition','<h3>Keeping Healthy</h3><p>Good health requires balanced nutrition, clean water, exercise, and hygiene. A balanced diet includes carbohydrates (energy), proteins (growth), vitamins and minerals (protection), and water.</p>'),
    mkTb('ss-p7','SS','Social Studies Book 7','PLE SST Prep','NCDC Uganda',220,['P7'],'social_studies','Core','tag-o','Chapter 1: History of Uganda','<h3>Pre-Colonial Uganda</h3><p>Before European colonization, Uganda had several organized kingdoms: Buganda, Bunyoro, Ankole, Toro, and Busoga. These kingdoms had their own governments, cultures, and trading systems.</p>'),
    // ── SECONDARY 1 ──
    mkTb('math-s1','Ma','Mathematics S1','Number Theory & Algebra','NCDC Uganda',280,['S1'],'mathematics','Core','tag-o','Chapter 1: Sets','<h3>Set Theory</h3><p>A set is a well-defined collection of objects called elements or members. We use curly brackets: A = {1, 2, 3, 4, 5}. Two sets are equal if they have exactly the same elements.</p><div class="r-formula">A \u222a B (union) = all elements in A or B<br>A \u2229 B (intersection) = elements in both A and B</div>'),
    mkTb('eng-s1','En','English Language S1','Grammar Foundations','NCDC Uganda',260,['S1'],'english','Core','tag-p','Chapter 1: Parts of Speech','<h3>The Eight Parts of Speech</h3><p>Every English word belongs to one of eight categories: Nouns, Verbs, Adjectives, Adverbs, Pronouns, Prepositions, Conjunctions, and Interjections.</p>'),
    mkTb('phy-s1','Ph','Physics S1','Measurement & Forces','NCDC Uganda',240,['S1'],'physics','Core','tag-b','Chapter 1: Measurement','<h3>Scientific Measurement</h3><p>In physics, we measure quantities using SI units: Length (meters), Mass (kilograms), Time (seconds), Temperature (Kelvin). Always include units in your answers!</p>'),
    mkTb('che-s1','Ch','Chemistry S1','Introduction to Chemistry','NCDC Uganda',230,['S1'],'chemistry','Core','tag-o','Chapter 1: What is Chemistry?','<h3>The Science of Matter</h3><p>Chemistry studies what substances are made of, how they behave, and how they change. Everything you can touch, see, or smell is made of chemicals \u2014 including you!</p>'),
    mkTb('bio-s1','Bi','Biology S1','Cell Biology','NCDC Uganda',250,['S1'],'biology','Core','tag-g','Chapter 1: The Cell','<h3>Building Blocks of Life</h3><p>Every living thing is made of cells. A cell is the smallest unit of life. There are two types: <strong>Prokaryotic</strong> (no nucleus, like bacteria) and <strong>Eukaryotic</strong> (has a nucleus, like human cells).</p>'),
    mkTb('geo-s1','Ge','Geography S1','Physical Geography','NCDC Uganda',220,['S1'],'geography','Core','tag-o','Chapter 1: The Earth','<h3>Our Planet</h3><p>Earth is the third planet from the Sun. It has four layers: inner core, outer core, mantle, and crust. The crust is where we live \u2014 it is only about 35km thick!</p>'),
    mkTb('his-s1','Hi','History S1','East African History','NCDC Uganda',210,['S1'],'history','Core','tag-o','Chapter 1: Early Societies','<h3>People of East Africa</h3><p>East Africa has been home to humans for millions of years. Archaeological evidence from Olduvai Gorge in Tanzania shows some of the earliest human ancestors lived here.</p>'),
    mkTb('ict-s1','IC','ICT S1','Digital Literacy','NCDC Uganda',180,['S1'],'ict','Digital','tag-b','Chapter 1: Hardware & Software','<h3>Inside a Computer</h3><p><strong>Hardware</strong> is the physical parts: CPU (the brain), RAM (short-term memory), Hard Drive (long-term storage), Monitor (display). <strong>Software</strong> is the programs that tell hardware what to do.</p>'),
    // ── SECONDARY 2 ──
    mkTb('math-s2','Ma','Mathematics S2','Equations & Graphs','NCDC Uganda',300,['S2'],'mathematics','Core','tag-o','Chapter 1: Linear Equations','<h3>Solving Linear Equations</h3><p>A linear equation has one unknown raised to the first power. To solve: isolate the variable on one side by performing the same operation on both sides.</p><div class="r-example"><strong>Solve:</strong> 3x + 7 = 22<br>3x = 22 - 7 = 15<br>x = 15/3 = 5</div>'),
    mkTb('eng-s2','En','English Language S2','Writing Skills','NCDC Uganda',270,['S2'],'english','Core','tag-p','Chapter 1: Essay Writing','<h3>Structure of an Essay</h3><p>A good essay has: <strong>Introduction</strong> (hook + thesis), <strong>Body paragraphs</strong> (each with one main point + evidence), and <strong>Conclusion</strong> (summary + final thought).</p>'),
    mkTb('phy-s2','Ph','Physics S2','Heat & Light','NCDC Uganda',260,['S2'],'physics','Core','tag-b','Chapter 1: Heat Transfer','<h3>How Heat Moves</h3><p>Heat transfers in three ways: <strong>Conduction</strong> (through solids), <strong>Convection</strong> (through liquids/gases), and <strong>Radiation</strong> (through space, like sunlight reaching Earth).</p>'),
    mkTb('che-s2','Ch','Chemistry S2','Chemical Reactions','NCDC Uganda',250,['S2'],'chemistry','Core','tag-o','Chapter 1: Types of Reactions','<h3>Chemical Change</h3><p>In a chemical reaction, substances rearrange their atoms to form new substances. Signs of a reaction: color change, gas production, temperature change, or precipitate formation.</p>'),
    mkTb('bio-s2','Bi','Biology S2','Plant Biology','NCDC Uganda',260,['S2'],'biology','Core','tag-g','Chapter 1: Photosynthesis','<h3>How Plants Make Food</h3><p>Plants use sunlight, carbon dioxide, and water to make glucose (food) and oxygen. This process is called photosynthesis.</p><div class="r-formula">6CO\u2082 + 6H\u2082O + Sunlight \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082</div>'),
    // ── SECONDARY 3 ──
    mkTb('math-s3','Ma','Mathematics S3','Trigonometry & Statistics','NCDC Uganda',320,['S3'],'mathematics','Core','tag-o','Chapter 1: Trigonometric Ratios','<h3>Sin, Cos, and Tan</h3><p>In a right-angled triangle: <strong>sin(\u03b8) = opposite/hypotenuse</strong>, <strong>cos(\u03b8) = adjacent/hypotenuse</strong>, <strong>tan(\u03b8) = opposite/adjacent</strong>. Remember: SOH CAH TOA!</p>'),
    mkTb('eng-s3','En','English Language S3','Advanced Grammar','NCDC Uganda',290,['S3'],'english','Core','tag-p','Chapter 1: Conditional Sentences','<h3>If Clauses</h3><p><strong>Zero conditional:</strong> If you heat water to 100\u00b0C, it boils.<br><strong>First conditional:</strong> If it rains, I will stay home.<br><strong>Second conditional:</strong> If I had money, I would buy a laptop.<br><strong>Third conditional:</strong> If I had studied, I would have passed.</p>'),
    mkTb('phy-s3','Ph','Physics S3','Electricity','NCDC Uganda',280,['S3'],'physics','Core','tag-b','Chapter 1: Electric Current','<h3>Current, Voltage, Resistance</h3><p><strong>Current (I)</strong> = flow of electrons, measured in Amperes. <strong>Voltage (V)</strong> = electrical pressure, measured in Volts. <strong>Resistance (R)</strong> = opposition to flow, measured in Ohms.</p><div class="r-formula">Ohm\'s Law: V = I x R</div>'),
    mkTb('che-s3','Ch','Chemistry S3','The Periodic Table','NCDC Uganda',270,['S3'],'chemistry','Core','tag-o','Chapter 1: Atomic Structure','<h3>Inside an Atom</h3><p>Every atom has a nucleus (containing protons and neutrons) surrounded by electrons in shells. The number of protons defines the element: Hydrogen has 1, Carbon has 6, Oxygen has 8.</p>'),
    mkTb('bio-s3','Bi','Biology S3','Human Biology','NCDC Uganda',300,['S3'],'biology','Core','tag-g','Chapter 1: The Circulatory System','<h3>Blood and the Heart</h3><p>Your heart pumps blood through two circuits: <strong>Pulmonary</strong> (heart to lungs and back) and <strong>Systemic</strong> (heart to body and back). An adult heart beats about 100,000 times per day!</p>'),
    // ── SECONDARY 4 ──
    mkTb('math-s4','Ma','Mathematics S4','UCE Preparation','NCDC Uganda',340,['S4'],'mathematics','Core','tag-o','Chapter 1: Quadratic Equations','<h3>Solving Quadratics</h3><p>A quadratic equation has the form ax\u00b2 + bx + c = 0. Solve using: factoring, completing the square, or the quadratic formula.</p><div class="r-formula">x = (-b \u00b1 \u221a(b\u00b2-4ac)) / 2a</div>'),
    mkTb('eng-s4','En','English Language S4','UCE English Prep','NCDC Uganda',310,['S4'],'english','Core','tag-p','Chapter 1: Comprehension Strategies','<h3>Tackling Comprehension</h3><p>Read the passage twice. First for general understanding, second for details. Underline key information. Answer in your own words unless told to quote.</p>'),
    mkTb('phy-s4','Ph','Physics S4','UCE Physics Prep','NCDC Uganda',300,['S4'],'physics','Core','tag-b','Chapter 1: Waves & Optics','<h3>Properties of Waves</h3><p>Waves transfer energy without transferring matter. Key properties: <strong>Wavelength</strong> (\u03bb), <strong>Frequency</strong> (f), <strong>Amplitude</strong> (A). Speed = frequency x wavelength: v = f\u03bb</p>'),
    mkTb('com-s4','Bz','Commerce S4','Business Studies','NCDC Uganda',260,['S4'],'commerce','Elective','tag-o','Chapter 1: Trade','<h3>Buying and Selling</h3><p>Trade is the exchange of goods and services. <strong>Home trade</strong> happens within a country. <strong>International trade</strong> happens between countries. Uganda exports coffee, tea, and fish.</p>'),
    mkTb('bio-s4','Bi','Biology S4','Genetics & Evolution','NCDC Uganda',290,['S4'],'biology','Core','tag-g','Chapter 1: Genetics','<h3>Understanding Inheritance</h3><p>Genetics is the study of heredity. Traits are passed from parents to offspring through genes. Gregor Mendel is known as the father of genetics.</p>'),
    mkTb('che-s4','Ch','Chemistry S4','Industrial Chemistry','NCDC Uganda',280,['S4'],'chemistry','Core','tag-o','Chapter 1: Chemical Industries','<h3>Chemistry in Industry</h3><p>Industrial chemistry applies chemical processes to produce useful materials like soap, plastics, and fertilizers on a large scale.</p>'),
    mkTb('his-s4','Hi','History S4','Nationalism in Africa','NCDC Uganda',260,['S4'],'history','Core','tag-o','Chapter 1: Rise of Nationalism','<h3>The Road to Independence</h3><p>Nationalism is the desire of a people to govern themselves. In Africa, it led to the struggle for independence from colonial rule in the 1950s and 60s.</p>'),
    mkTb('geo-s4','Ge','Geography S4','Population Studies','NCDC Uganda',270,['S4'],'geography','Core','tag-o','Chapter 1: Population Growth','<h3>Demography</h3><p>Population studies involve analyzing birth rates, death rates, and migration. High population growth can strain resources but also provide a large workforce.</p>'),
    // ── SECONDARY 5 (A-Level) ──
    mkTb('math-s5','Ma','Advanced Mathematics S5','Calculus & Vectors','NCDC Uganda',380,['S5'],'mathematics','A-Level','tag-o','Chapter 1: Differentiation','<h3>Rates of Change</h3><p>Differentiation finds the rate at which a function changes. If f(x) = x\u00b2, then f\'(x) = 2x. This tells us the slope of the curve at any point x.</p><div class="r-formula">d/dx [x\u207f] = nx\u207f\u207b\u00b9</div>'),
    mkTb('phy-s5','Ph','Advanced Physics S5','Mechanics & Fields','NCDC Uganda',350,['S5'],'physics','A-Level','tag-b','Chapter 1: Kinematics','<h3>Equations of Motion</h3><p>For constant acceleration: v = u + at, s = ut + \u00bdat\u00b2, v\u00b2 = u\u00b2 + 2as. Where u = initial velocity, v = final velocity, a = acceleration, t = time, s = displacement.</p>'),
    mkTb('che-s5','Ch','Advanced Chemistry S5','Organic Chemistry','NCDC Uganda',340,['S5'],'chemistry','A-Level','tag-o','Chapter 1: Hydrocarbons','<h3>Carbon Compounds</h3><p>Organic chemistry studies carbon-containing compounds. Hydrocarbons contain only carbon and hydrogen. <strong>Alkanes</strong> (single bonds: CH\u2084, C\u2082H\u2086), <strong>Alkenes</strong> (double bonds: C\u2082H\u2084).</p>'),
    mkTb('eco-s5','Ec','Economics S5','Microeconomics','NCDC Uganda',300,['S5'],'economics','A-Level','tag-o','Chapter 1: Demand & Supply','<h3>Market Forces</h3><p>Demand is how much people want to buy at different prices. Supply is how much sellers offer. Where demand and supply meet is the <strong>equilibrium price</strong>.</p>'),
    mkTb('cs-s5','CS','Computer Science S5','Algorithms & Data','NCDC Uganda',280,['S5'],'comp_science','A-Level','tag-b','Chapter 1: Algorithms','<h3>Problem Solving with Algorithms</h3><p>An algorithm is a step-by-step set of instructions to solve a problem. Good algorithms are: <strong>Correct</strong> (give right answer), <strong>Efficient</strong> (use minimal resources), <strong>Clear</strong> (easy to follow).</p>'),
    // ── SECONDARY 6 (A-Level) ──
    mkTb('math-s6','Ma','Advanced Mathematics S6','UACE Preparation','NCDC Uganda',400,['S6'],'mathematics','A-Level','tag-o','Chapter 1: Integration','<h3>The Reverse of Differentiation</h3><p>Integration finds the area under a curve. If f\'(x) = 2x, then \u222b2x dx = x\u00b2 + C. Integration is the reverse process of differentiation.</p><div class="r-formula">\u222bx\u207f dx = x\u207f\u207a\u00b9/(n+1) + C</div>'),
    mkTb('phy-s6','Ph','Advanced Physics S6','UACE Physics','NCDC Uganda',370,['S6'],'physics','A-Level','tag-b','Chapter 1: Nuclear Physics','<h3>Inside the Nucleus</h3><p>Nuclear physics studies the nucleus of atoms. <strong>Nuclear fission</strong> splits heavy atoms (used in power plants). <strong>Nuclear fusion</strong> joins light atoms (powers the Sun). E = mc\u00b2 relates mass to energy.</p>'),
    mkTb('ent-s6','Bz','Entrepreneurship S6','Building Ventures','NCDC Uganda',280,['S6'],'entrepreneurship','A-Level','tag-o','Chapter 1: Business Ideas','<h3>Identifying Opportunities</h3><p>Good business ideas solve problems. Look around your community: What do people need? What frustrates them? The best entrepreneurs find gaps in the market and fill them.</p>'),
    mkTb('bio-s6','Bi','Advanced Biology S6','Homeostasis & Coordination','NCDC Uganda',360,['S6'],'biology','A-Level','tag-g','Chapter 1: Homeostasis','<h3>Internal Balance</h3><p>Homeostasis is the maintenance of a constant internal environment (temperature, pH, glucose) despite external changes. The kidney and skin play major roles.</p>'),
    mkTb('che-s6','Ch','Advanced Chemistry S6','Physical Chemistry','NCDC Uganda',350,['S6'],'chemistry','A-Level','tag-o','Chapter 1: Chemical Equilibrium','<h3>Reversible Reactions</h3><p>In a reversible reaction, products can turn back into reactants. Equilibrium is reached when the forward and backward rates are equal.</p>'),
    mkTb('lit-s6','Li','Literature S6','African Literature','NCDC Uganda',310,['S6'],'literature','A-Level','tag-p','Chapter 1: The African Novel','<h3>Themes in African Lit</h3><p>African literature often explores themes of colonialism, tradition vs. modernity, and political corruption. Key authors include Chinua Achebe and Ngugi wa Thiong\'o.</p>'),
    // ── VOCATIONAL (cross-level) ──
    mkTb('solar-v','Se','Solar Energy Systems','Installation & Maintenance','Knowledge Trees',180,['S1','S2','S3','S4'],'ict','Vocational','tag-b','Chapter 1: How Solar Works','<h3>The Photovoltaic Effect</h3><p>Solar panels convert sunlight directly into electricity. When photons hit silicon cells, they knock electrons free, creating electric current. A Knowledge Tree uses 4x200W panels = 800W total.</p><div class="r-formula">Power = Voltage x Current (P = V x I)</div>'),
    mkTb('tailoring-v','Tl','Tailoring & Fashion','Patterns, Cutting & Sewing','Knowledge Trees',200,['S1','S2','S3','S4'],'creative_arts','Vocational','tag-p','Chapter 1: Tools & Materials','<h3>Essential Tailoring Tools</h3><p>Every tailor needs: measuring tape, fabric scissors, sewing machine, pins, needles, thread, chalk, and an iron. Quality tools make quality garments.</p>'),
    mkTb('finlit-v','Fl','Financial Literacy','Money, Budgeting & Saving','Knowledge Trees',160,['P5','P6','P7','S1','S2'],'commerce','Life Skills','tag-o','Chapter 1: Understanding Money','<h3>What is Money?</h3><p>Money is a medium of exchange. In Uganda, we use the Uganda Shilling (UGX). Understanding money is one of the most important life skills you can learn.</p><div class="r-formula">Income - Expenses = Savings</div>'),
    mkTb('agri-v','Ag','Modern Agriculture','Farming Techniques & Markets','Knowledge Trees',190,['S1','S2','S3','S4'],'agriculture','Vocational','tag-g','Chapter 1: Soil Preparation','<h3>Getting the Ground Ready</h3><p>Good farming starts with good soil. Steps: 1) Clear the land, 2) Plough to loosen soil, 3) Add organic matter (compost/manure), 4) Level the ground, 5) Create planting rows.</p>'),
];

function renderClassSelector() {
    const primary = CLASS_LEVELS.filter(c => c.startsWith('P'));
    const secondary = CLASS_LEVELS.filter(c => c.startsWith('S'));
    document.getElementById('clsPrimary').innerHTML = primary.map(c =>
        '<button class="cls-btn ' + (c === selectedClass ? 'on' : '') + '" onclick="selectClass(\'' + c + '\',this)">' + c + '</button>'
    ).join('');
    document.getElementById('clsSecondary').innerHTML = secondary.map(c =>
        '<button class="cls-btn ' + (c === selectedClass ? 'on' : '') + '" onclick="selectClass(\'' + c + '\',this)">' + c + '</button>'
    ).join('');
}

function selectClass(cls, el) {
    selectedClass = cls;
    document.querySelectorAll('.cls-btn').forEach(b => b.classList.remove('on'));
    el.classList.add('on');
    renderTextbooks();
}

function filterLibrary() {
    libSearchQuery = document.getElementById('libSearch').value.toLowerCase();
    renderTextbooks();
}

function renderTextbooks() {
    let filtered = textbooks;
    if (libSearchQuery) {
        filtered = textbooks.filter(tb => tb.title.toLowerCase().includes(libSearchQuery) || tb.subject.toLowerCase().includes(libSearchQuery));
        document.getElementById('clsCount').textContent = 'Found ' + filtered.length + ' result' + (filtered.length !== 1 ? 's' : '');
    } else {
        filtered = textbooks.filter(tb => tb.classes.includes(selectedClass));
        document.getElementById('clsCount').textContent = filtered.length + ' textbook' + (filtered.length !== 1 ? 's' : '') + ' for ' + selectedClass;
    }
    document.getElementById('tbGrid').innerHTML = filtered.length
        ? filtered.map(tb => {
            const gi = textbooks.indexOf(tb);
            return '<div class="tb" onclick="openTextbook(' + gi + ')">' +
                '<div class="tb-cover tb-cover--' + tb.coverStyle + '" style="--tb-c:' + tb.color + ';--tb-bg:' + tb.bg + '">' +
                '<div class="tb-cover-spine"></div><div class="tb-cover-art"><div class="tb-cover-abbr">' + tb.abbr + '</div><div class="tb-cover-class">' + tb.classes[0] + '</div></div>' +
                '<span class="tb-cover-tag"><span class="tag ' + tb.tagClass + '">' + tb.tag + '</span></span></div>' +
                '<div class="tb-body"><div class="tb-title">' + tb.title + '</div><div class="tb-sub">' + (tb.subtitle || '') + '</div>' +
                '<div class="tb-author">' + tb.author + '</div><div class="tb-foot"><span class="tb-pages">' + tb.pages + ' pages</span>' +
                '<span class="tag tag-g" style="font-size:8px">Offline</span></div></div></div>';
        }).join('')
        : '<p style="padding:20px 0;text-align:center;font-size:12px;color:var(--c-text-4)">No textbooks for this class yet. Sync at your Knowledge Tree.</p>';
}

function openTextbook(idx) {
    const tb = textbooks[idx];
    document.getElementById('readerTitle').textContent = tb.title;
    const body = document.getElementById('readerBody');
    body.innerHTML = '<h2>' + tb.content.title + '</h2>' +
        '<p style="color:var(--c-text-4);font-size:12px;margin-bottom:20px">' + tb.author + ' \u00b7 ' + tb.pages + ' pages \u00b7 Available offline</p>' +
        tb.content.chapters.map(ch =>
            '<div style="padding:12px 14px;background:var(--c-card);border:1px solid var(--c-border);border-radius:var(--r-md);margin-bottom:8px;cursor:pointer;display:flex;justify-content:space-between;align-items:center" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display===\'none\'?\'block\':\'none\'">' +
            '<span style="font-size:14px;font-weight:600">' + ch.name + '</span>' +
            '<svg style="width:14px;height:14px;stroke:var(--c-text-4);fill:none;stroke-width:2"><use href="#i-chevron"/></svg></div>' +
            '<div style="display:none;margin-bottom:16px">' + ch.body + '</div>'
        ).join('') +
        '<div style="text-align:center;padding:30px 0;color:var(--c-text-4);font-size:12px">More chapters available when synced at a Knowledge Tree node.</div>';
    document.getElementById('readerOverlay').classList.add('on');
    body.scrollTop = 0;
}
function closeReader() { document.getElementById('readerOverlay').classList.remove('on'); }

renderClassSelector();
renderTextbooks();


/* ══════════════════════════════════════════
   HOME SCREEN — COURSES
   ══════════════════════════════════════════ */
const courses = [
    { abbr:'Ma', title:'Advanced Mathematics', progress:65, mods:24, time:'48h', cat:'stem', bg:'var(--c-primary-soft)', color:'var(--c-primary)' },
    { abbr:'Py', title:'Python Programming', progress:30, mods:18, time:'36h', cat:'stem', bg:'var(--c-green-soft)', color:'var(--c-green)' },
    { abbr:'Ph', title:'Physics', progress:55, mods:22, time:'44h', cat:'stem', bg:'var(--c-blue-soft)', color:'var(--c-blue)' },
    { abbr:'En', title:'English Language', progress:45, mods:20, time:'40h', cat:'lang', bg:'var(--c-purple-soft)', color:'var(--c-purple)' },
    { abbr:'Bz', title:'Entrepreneurship', progress:12, mods:15, time:'30h', cat:'biz', bg:'var(--c-amber-soft)', color:'var(--c-amber)' },
    { abbr:'So', title:'Solar Energy Systems', progress:0, mods:14, time:'28h', cat:'voc', bg:'var(--c-green-soft)', color:'var(--c-green)' },
    { abbr:'Ch', title:'Chemistry', progress:0, mods:16, time:'32h', cat:'stem', bg:'var(--c-primary-soft)', color:'var(--c-primary)' },
    { abbr:'Tl', title:'Tailoring & Fashion', progress:0, mods:16, time:'32h', cat:'voc', bg:'var(--c-purple-soft)', color:'var(--c-purple)' },
    { abbr:'Fi', title:'Financial Literacy', progress:0, mods:10, time:'20h', cat:'biz', bg:'var(--c-amber-soft)', color:'var(--c-amber)' },
    { abbr:'Ag', title:'Modern Agriculture', progress:0, mods:18, time:'36h', cat:'voc', bg:'var(--c-green-soft)', color:'var(--c-green)' },
];
function courseRow(c) {
    return '<div class="crs" onclick="go(\'learn\',document.querySelectorAll(\'.bnav-item\')[1])"><div class="crs-icon" style="background:' + c.bg + ';color:' + c.color + '">' + c.abbr + '</div><div class="crs-body"><div class="crs-title">' + c.title + '</div><div class="crs-meta">' + c.mods + ' lessons \u00b7 ' + c.time + '</div>' + (c.progress > 0 ? '<div class="crs-prog"><div class="pbar"><div class="pfill" style="width:' + c.progress + '%"></div></div></div>' : '') + '</div>' + (c.progress > 0 ? '<span class="crs-pct">' + c.progress + '%</span>' : '<svg style="width:14px;height:14px;stroke:var(--c-text-5);fill:none;stroke-width:2"><use href="#i-chevron"/></svg>') + '</div>';
}
function renderHome(f) {
    const cont = courses.filter(c => c.progress > 0 && (f === 'all' || c.cat === f));
    const rec = courses.filter(c => c.progress === 0 && (f === 'all' || c.cat === f));
    document.getElementById('contList').innerHTML = cont.length ? cont.map(courseRow).join('') : '<p style="padding:10px 0;font-size:12px;color:var(--c-text-4)">No courses in this category.</p>';
    document.getElementById('recList').innerHTML = rec.length ? rec.map(courseRow).join('') : '';
}
function filterH(el, f) { document.querySelectorAll('#s-home .pill').forEach(p => p.classList.remove('on')); el.classList.add('on'); renderHome(f); }
renderHome('all');


/* ══════════════════════════════════════════
   CONTENT ARTICLES (Editorial Cards)
   ══════════════════════════════════════════ */
const contentArticles = [
    { kicker:'Featured', bg:'linear-gradient(135deg,var(--c-amber-soft),var(--c-primary-soft))', headline:'How Solar Panels Power the Knowledge Tree', excerpt:'Understanding photovoltaic cells and how they transform sunlight into electricity.', author:'Roots AI', time:'8 min', featured:true },
    { kicker:'Mathematics', kc:'var(--c-primary)', bg:'var(--c-primary-soft)', headline:'The Quadratic Formula Explained Simply', excerpt:'Step-by-step derivation and worked examples.', author:'Roots AI', time:'5 min' },
    { kicker:'Science', kc:'var(--c-green)', bg:'var(--c-green-soft)', headline:'Why Does Ice Float on Water?', excerpt:'The physics of hydrogen bonding and why life depends on it.', author:'Roots AI', time:'4 min' },
    { kicker:'Programming', kc:'var(--c-blue)', bg:'var(--c-blue-soft)', headline:'Build Your First Python App', excerpt:'A step-by-step guide to creating a budget calculator.', author:'Roots AI', time:'12 min' },
    { kicker:'Vocational', kc:'var(--c-amber)', bg:'var(--c-amber-soft)', headline:'Wiring a Solar Home System', excerpt:'From panel placement to load calculation.', author:'Roots AI', time:'15 min' },
];
function renderContent() {
    document.getElementById('contentFeed').innerHTML = contentArticles.map(a => {
        if (a.featured) return '<div class="article-featured" onclick="go(\'ai\',document.querySelectorAll(\'.bnav-item\')[2])"><div class="af-cover" style="background:' + a.bg + '"><div class="af-cover-label">' + a.kicker + '</div><svg style="width:40px;height:40px;stroke:var(--c-primary);fill:none;stroke-width:1.5;opacity:.5"><use href="#i-zap"/></svg></div><div class="af-body"><div class="af-headline">' + a.headline + '</div><div class="af-excerpt">' + a.excerpt + '</div><div class="af-byline"><span>' + a.author + '</span><span>\u00b7</span><span>' + a.time + '</span></div></div></div>';
        return '<div class="article-row" onclick="go(\'ai\',document.querySelectorAll(\'.bnav-item\')[2])"><div class="ar-thumb" style="background:' + a.bg + '"><svg style="width:22px;height:22px;stroke:' + a.kc + ';fill:none;stroke-width:1.5"><use href="#i-book"/></svg></div><div class="ar-body"><div class="ar-kicker" style="color:' + a.kc + '">' + a.kicker + '</div><div class="ar-title">' + a.headline + '</div><div class="ar-desc">' + a.excerpt + '</div><div class="ar-meta">' + a.author + ' \u00b7 ' + a.time + '</div></div></div>';
    }).join('');
}
renderContent();


/* ══════════════════════════════════════════
   AI TEACHER
   ══════════════════════════════════════════ */
const subjects = [
    { abbr:'Ma', name:'Mathematics', qs:['Explain the quadratic formula with a worked example','What is the difference between permutation and combination?','Solve step by step: 2x^2 + 5x - 3 = 0','Teach me integration by parts'] },
    { abbr:'Sc', name:'Science', qs:["Explain Newton's three laws with real-life examples","How does photosynthesis work?","What is the periodic table?","Describe the water cycle"] },
    { abbr:'Py', name:'Programming', qs:['Write a Python function to check if a number is prime','Explain OOP \u2014 classes, objects, inheritance','What is an API and how do I use one?','Teach me loops and conditionals'] },
    { abbr:'En', name:'English', qs:['What is active vs. passive voice?','Help me write a professional cover letter','Explain conditional sentences','How do I structure an argumentative essay?'] },
    { abbr:'Bz', name:'Business', qs:['How do I write a simple business plan?','Explain supply and demand with a local example',"What are the 4 P's of marketing?",'How does mobile money work as a business tool?'] },
    { abbr:'Ph', name:'Physics', qs:["Explain Ohm's law with a circuit diagram",'How do solar panels convert sunlight to electricity?','Difference between speed and velocity?','Laws of thermodynamics simply'] },
    { abbr:'Ch', name:'Chemistry', qs:['Covalent vs ionic bonds?','Balance chemical equations step by step','Explain acids, bases, and pH','What is the mole concept?'] },
    { abbr:'Vc', name:'Vocational', qs:['How do I wire a basic solar home system?','Basics of small engine repair','Tools to start a tailoring business?','How to calculate material costs?'] },
];
let activeSub = null, pendingImage = null;

function renderSubjects() {
    document.getElementById('subjGrid').innerHTML = subjects.map((s, i) => '<div class="subj ' + (i === 0 ? 'on' : '') + '" onclick="pickSubj(' + i + ',this)"><span class="subj-icon" style="font-size:16px;font-weight:800;display:block;color:var(--c-primary)">' + s.abbr + '</span><span class="subj-name">' + s.name + '</span></div>').join('');
    pickSubj(0, null);
}
function pickSubj(i, el) {
    activeSub = subjects[i];
    if (el) { document.querySelectorAll('.subj').forEach(c => c.classList.remove('on')); el.classList.add('on'); }
    document.getElementById('exLbl').textContent = activeSub.name + ' \u2014 Try asking';
    document.getElementById('chatLabel').textContent = activeSub.name + ' \u00b7 Online';
    document.getElementById('exQs').innerHTML = activeSub.qs.map(q => '<div class="exq" onclick="askEx(this,\'' + q.replace(/'/g, "\\'") + '\')"><span class="exq-arrow">\u2192</span>' + q + '</div>').join('');
}
function askEx(el, q) { document.getElementById('chatIn').value = q; sendAI(); el.style.opacity = '0.35'; el.style.pointerEvents = 'none'; }
renderSubjects();

function handleImageUpload(input) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) { pendingImage = { data: e.target.result, name: file.name }; showImagePreview(); };
    reader.readAsDataURL(file); input.value = '';
}
function showImagePreview() {
    const w = document.getElementById('imgPreviewWrap'); if (!w) return;
    w.innerHTML = '<div class="img-pv"><img src="' + pendingImage.data + '" alt="upload"><span class="img-pv-name">' + pendingImage.name + '</span><span class="img-pv-x" onclick="removeImage()">x</span></div>';
}
function removeImage() { pendingImage = null; const w = document.getElementById('imgPreviewWrap'); if (w) w.innerHTML = ''; }

/* ── AI Response Engine — comprehensive subject-aware responses ── */
const aiKnowledge = {
    'quadratic': '<strong>The Quadratic Formula</strong><br><br>For any equation <code>ax\u00b2 + bx + c = 0</code>:<br><br><code>x = (-b \u00b1 \u221a(b\u00b2 - 4ac)) / 2a</code><br><br><strong>Example:</strong> Solve 2x\u00b2 + 5x - 3 = 0<br>a=2, b=5, c=-3<br>D = 25 - 4(2)(-3) = 25 + 24 = 49<br>\u221aD = 7<br>x = (-5 \u00b1 7) / 4<br>x = 0.5 or x = -3<br><br><strong>Remember:</strong> The discriminant (b\u00b2-4ac) tells you the nature of roots.',
    'derivative': '<strong>Differentiation (Derivatives)</strong><br><br>The derivative measures the rate of change.<br><br><strong>Power Rule:</strong> <code>d/dx [x\u207f] = nx\u207f\u207b\u00b9</code><br><br><strong>Chain Rule:</strong> <code>d/dx [f(g(x))] = f\'(g(x)) \u00b7 g\'(x)</code><br><br><strong>Example:</strong> d/dx [sin(x\u00b2)] = cos(x\u00b2) \u00b7 2x<br><br><strong>Common derivatives:</strong><br>d/dx [sin x] = cos x<br>d/dx [cos x] = -sin x<br>d/dx [e\u02e3] = e\u02e3<br>d/dx [ln x] = 1/x',
    'integration': '<strong>Integration</strong><br><br>Integration is the reverse of differentiation. It finds the area under a curve.<br><br><strong>Power Rule:</strong> <code>\u222bx\u207f dx = x\u207f\u207a\u00b9/(n+1) + C</code><br><br><strong>Example:</strong> \u222b3x\u00b2 dx = x\u00b3 + C<br><br><strong>Common integrals:</strong><br>\u222bsin x dx = -cos x + C<br>\u222bcos x dx = sin x + C<br>\u222b1/x dx = ln|x| + C<br>\u222be\u02e3 dx = e\u02e3 + C',
    'ohm': '<strong>Ohm\'s Law: V = IR</strong><br><br>V = Voltage (Volts)<br>I = Current (Amperes)<br>R = Resistance (Ohms \u03a9)<br><br><strong>Example:</strong> A Knowledge Tree solar panel produces 24V. If the system resistance is 8\u03a9:<br>I = V/R = 24/8 = 3A<br>Power = V \u00d7 I = 24 \u00d7 3 = 72W<br><br><strong>Related formulas:</strong><br>P = IV = I\u00b2R = V\u00b2/R',
    'photosynthesis': '<strong>Photosynthesis</strong><br><br>The process by which plants convert light energy to chemical energy.<br><br><code>6CO\u2082 + 6H\u2082O + Light \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082</code><br><br><strong>Two stages:</strong><br>1. <strong>Light-dependent reactions</strong> \u2014 occur in thylakoids, produce ATP and NADPH<br>2. <strong>Calvin Cycle</strong> \u2014 occurs in stroma, uses ATP and NADPH to fix CO\u2082 into glucose<br><br><strong>Factors affecting rate:</strong> Light intensity, CO\u2082 concentration, temperature, water availability.',
    'newton': '<strong>Newton\'s Three Laws of Motion</strong><br><br><strong>1st Law (Inertia):</strong> An object stays at rest or in uniform motion unless acted upon by an external force. A book on a desk stays put until you push it.<br><br><strong>2nd Law (F = ma):</strong> Force equals mass times acceleration. A 10 kg box pushed with 50 N: a = 50/10 = 5 m/s\u00b2<br><br><strong>3rd Law (Action-Reaction):</strong> Every action has an equal and opposite reaction. When you walk, your foot pushes the ground backward, and the ground pushes you forward.',
    'prime': '<strong>Prime Number Check in Python</strong><br><br><code>def is_prime(n):<br>&nbsp;&nbsp;&nbsp;&nbsp;if n &lt; 2:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return False<br>&nbsp;&nbsp;&nbsp;&nbsp;for i in range(2, int(n**0.5) + 1):<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if n % i == 0:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return False<br>&nbsp;&nbsp;&nbsp;&nbsp;return True</code><br><br><strong>Why \u221an?</strong> If n has a factor larger than \u221an, it must also have one smaller than \u221an. So checking up to \u221an is sufficient.',
    'oop': '<strong>Object-Oriented Programming (OOP)</strong><br><br><strong>4 Pillars of OOP:</strong><br><br>1. <strong>Encapsulation</strong> \u2014 Bundling data and methods together. A class hides internal state.<br><br>2. <strong>Inheritance</strong> \u2014 A child class inherits from a parent class.<br><code>class Student(Person):<br>&nbsp;&nbsp;&nbsp;&nbsp;def __init__(self, name, grade):<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;super().__init__(name)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.grade = grade</code><br><br>3. <strong>Polymorphism</strong> \u2014 Same method name, different behavior.<br><br>4. <strong>Abstraction</strong> \u2014 Hiding complexity, showing only essentials.',
    'active passive': '<strong>Active vs Passive Voice</strong><br><br><strong>Active Voice:</strong> The subject performs the action.<br>"The student <strong>solved</strong> the equation."<br><br><strong>Passive Voice:</strong> The subject receives the action.<br>"The equation <strong>was solved</strong> by the student."<br><br><strong>Structure of Passive:</strong><br>Subject + form of "to be" + past participle<br><br><strong>When to use passive:</strong><br>\u2022 When the doer is unknown: "The window was broken."<br>\u2022 In scientific writing: "The sample was heated to 100\u00b0C."<br>\u2022 To emphasize the receiver: "The award was given to Grace."',
    'essay': '<strong>Essay Structure</strong><br><br><strong>Introduction:</strong><br>1. Hook \u2014 grab the reader\'s attention<br>2. Background \u2014 context/brief overview<br>3. Thesis statement \u2014 your main argument<br><br><strong>Body Paragraphs (3+):</strong><br>1. Topic sentence (main point)<br>2. Evidence/examples<br>3. Analysis/explanation<br>4. Link back to thesis<br><br><strong>Conclusion:</strong><br>1. Restate thesis (different words)<br>2. Summarize key points<br>3. Final thought/call to action<br><br><strong>Transitions:</strong> Furthermore, However, In contrast, Therefore, Consequently',
    'supply demand': '<strong>Supply and Demand</strong><br><br><strong>Demand:</strong> The quantity of a good that consumers are willing to buy at various prices. As price increases, demand typically decreases.<br><br><strong>Supply:</strong> The quantity that producers are willing to sell. As price increases, supply typically increases.<br><br><strong>Equilibrium:</strong> Where supply and demand curves meet \u2014 the market-clearing price.<br><br><strong>Local Example:</strong> In Nansana market, if tomato prices rise from 2,000 to 5,000 UGX/kg:<br>\u2022 Buyers purchase less (demand falls)<br>\u2022 Farmers bring more to sell (supply rises)<br>\u2022 Price settles at equilibrium',
    'solar': '<strong>How Solar Panels Work</strong><br><br>1. <strong>Photovoltaic Effect:</strong> Sunlight (photons) hits silicon cells and knocks electrons free, creating electric current.<br><br>2. <strong>The Knowledge Tree System:</strong><br>\u2022 4 \u00d7 200W panels = 800W total<br>\u2022 24V battery bank for storage<br>\u2022 MPPT charge controller for efficiency<br>\u2022 Inverter converts DC to AC power<br><br>3. <strong>Key Formula:</strong><br><code>Power (W) = Voltage (V) \u00d7 Current (A)</code><br><br>4. <strong>Uganda Solar Potential:</strong><br>5.1 kWh/m\u00b2/day average \u2014 one of the best in Africa for solar!',
    'business plan': '<strong>How to Write a Business Plan</strong><br><br><strong>1. Executive Summary</strong><br>Brief overview of your business idea, target market, and goals.<br><br><strong>2. Business Description</strong><br>What you sell, who you serve, what makes you different.<br><br><strong>3. Market Analysis</strong><br>Research your competitors and target customers.<br><br><strong>4. Products/Services</strong><br>Describe what you offer and pricing strategy.<br><br><strong>5. Marketing Plan</strong><br>How you will reach customers (social media, word of mouth, flyers).<br><br><strong>6. Financial Projections</strong><br>Revenue forecast, costs, break-even analysis.<br><br><strong>7. Funding Needs</strong><br>How much capital you need and how you will use it.',
    'periodic table': '<strong>The Periodic Table</strong><br><br><strong>Organization:</strong><br>\u2022 Rows (Periods) = energy levels (1-7)<br>\u2022 Columns (Groups) = similar properties<br>\u2022 Group 1: Alkali metals (Na, K, Li)<br>\u2022 Group 17: Halogens (F, Cl, Br)<br>\u2022 Group 18: Noble gases (He, Ne, Ar)<br><br><strong>Key Elements:</strong><br>\u2022 H (1) \u2014 Lightest, most abundant<br>\u2022 C (6) \u2014 Basis of organic chemistry<br>\u2022 O (8) \u2014 Essential for respiration<br>\u2022 Fe (26) \u2014 Most common on Earth by mass<br><br><strong>Atomic Number</strong> = number of protons = unique identity of each element.',
    'cell': '<strong>Cell Biology</strong><br><br><strong>Types:</strong><br>\u2022 Prokaryotic (bacteria) \u2014 no nucleus<br>\u2022 Eukaryotic (plants, animals) \u2014 has nucleus<br><br><strong>Key Organelles:</strong><br>\u2022 <strong>Nucleus</strong> \u2014 Control center, contains DNA<br>\u2022 <strong>Mitochondria</strong> \u2014 Powerhouse, makes ATP<br>\u2022 <strong>Ribosomes</strong> \u2014 Build proteins<br>\u2022 <strong>Cell membrane</strong> \u2014 Gatekeeper<br>\u2022 <strong>ER</strong> \u2014 Transport network<br>\u2022 <strong>Golgi</strong> \u2014 Packaging and shipping<br><br><strong>Plant cells also have:</strong> Cell wall, chloroplasts, large vacuole',
    'fraction': '<strong>Fractions</strong><br><br>A fraction represents part of a whole: <strong>numerator/denominator</strong><br><br><strong>Adding fractions:</strong><br>1/3 + 1/4 = 4/12 + 3/12 = 7/12<br>(Find common denominator first!)<br><br><strong>Multiplying:</strong><br>2/3 \u00d7 3/5 = 6/15 = 2/5<br>(Multiply tops and bottoms)<br><br><strong>Dividing:</strong><br>2/3 \u00f7 4/5 = 2/3 \u00d7 5/4 = 10/12 = 5/6<br>(Flip and multiply)<br><br><strong>Converting:</strong><br>3/4 = 0.75 = 75%',
    'conditional': '<strong>Conditional Sentences</strong><br><br><strong>Zero Conditional</strong> (general truths):<br>If you heat ice, it melts.<br>If + present simple, present simple<br><br><strong>First Conditional</strong> (real future):<br>If it rains, I will stay home.<br>If + present simple, will + infinitive<br><br><strong>Second Conditional</strong> (unreal present):<br>If I had money, I would buy a laptop.<br>If + past simple, would + infinitive<br><br><strong>Third Conditional</strong> (unreal past):<br>If I had studied, I would have passed.<br>If + past perfect, would have + past participle',
};

function aiReply(subject, question, hasImage) {
    if (hasImage) {
        return '<strong>Image Analysis</strong><br><br>I can see the image you uploaded. Let me analyze it in the context of <strong>' + subject + '</strong>.<br><br>' +
            'Based on what I observe, this appears to relate to key concepts we have covered. Here is my step-by-step breakdown:<br><br>' +
            '<strong>Step 1:</strong> Identify the core elements in the image.<br>' +
            '<strong>Step 2:</strong> Connect them to ' + subject.toLowerCase() + ' principles.<br>' +
            '<strong>Step 3:</strong> Apply the relevant formula or theory.<br><br>' +
            '<em>For more detailed analysis, bring this to the AI station at your nearest Knowledge Tree node where I have more processing power.</em>';
    }

    const q = (question || '').toLowerCase();

    // Search knowledge base for matching topic
    for (const [key, response] of Object.entries(aiKnowledge)) {
        const keywords = key.split(' ');
        if (keywords.every(k => q.includes(k)) || (keywords.length === 1 && q.includes(key))) {
            return '<div class="msg-subj">' + subject + '</div>' + response;
        }
    }

    // Fuzzy match — check if any keyword appears
    for (const [key, response] of Object.entries(aiKnowledge)) {
        const keywords = key.split(' ');
        if (keywords.some(k => k.length > 3 && q.includes(k))) {
            return '<div class="msg-subj">' + subject + '</div>' + response;
        }
    }

    // Subject-specific fallback responses
    const subjectResponses = {
        'Mathematics': '<strong>Let me help with that math problem.</strong><br><br>Here is my approach:<br><br><strong>Step 1 \u2014 Understand:</strong> First, let us identify what is given and what we need to find.<br><br><strong>Step 2 \u2014 Plan:</strong> Choose the right formula or method. For algebra, isolate the variable. For geometry, draw a diagram. For word problems, translate to an equation.<br><br><strong>Step 3 \u2014 Execute:</strong> Work through the calculation carefully, showing each step.<br><br><strong>Step 4 \u2014 Verify:</strong> Always check your answer by substituting back or using estimation.<br><br><em>Can you share the specific problem? I will solve it step by step for you.</em>',
        'Science': '<strong>Let us explore this scientifically.</strong><br><br>Good science follows the scientific method:<br><br>1. <strong>Observe</strong> \u2014 What do you notice?<br>2. <strong>Question</strong> \u2014 Why does this happen?<br>3. <strong>Hypothesize</strong> \u2014 Make an educated guess<br>4. <strong>Experiment</strong> \u2014 Test your hypothesis<br>5. <strong>Analyze</strong> \u2014 What do the results show?<br>6. <strong>Conclude</strong> \u2014 Was your hypothesis correct?<br><br>The Knowledge Tree\'s solar panels are a great example of science in action \u2014 converting light energy into electricity through the photovoltaic effect!<br><br><em>What specific science topic would you like to explore?</em>',
        'Programming': '<strong>Let me help you code that.</strong><br><br>Every programming task follows these steps:<br><br>1. <strong>Understand the problem</strong> \u2014 What input? What output?<br>2. <strong>Plan your approach</strong> \u2014 Write pseudocode first<br>3. <strong>Write the code</strong> \u2014 Start simple, then improve<br>4. <strong>Test</strong> \u2014 Try different inputs, including edge cases<br>5. <strong>Debug</strong> \u2014 Read error messages carefully<br><br><code>print("Hello, Knowledge Tree!")</code><br><br><em>What would you like to build? I can walk you through it step by step.</em>',
        'English': '<strong>Let me help with your English.</strong><br><br>Good English skills require practice in four areas:<br><br>1. <strong>Grammar</strong> \u2014 The rules of the language (tenses, parts of speech, sentence structure)<br>2. <strong>Vocabulary</strong> \u2014 Knowing and using a wide range of words<br>3. <strong>Reading</strong> \u2014 Comprehension and analysis<br>4. <strong>Writing</strong> \u2014 Clear, organized expression of ideas<br><br><strong>Tip:</strong> Read 20 minutes daily to naturally improve all four areas.<br><br><em>What specific English topic do you need help with? Grammar, writing, or comprehension?</em>',
        'Physics': '<strong>Let us think about the physics.</strong><br><br>Physics describes how the universe works through fundamental laws.<br><br><strong>Key areas:</strong><br>\u2022 Mechanics (forces, motion, energy)<br>\u2022 Electricity & Magnetism<br>\u2022 Waves & Optics<br>\u2022 Thermodynamics<br>\u2022 Nuclear Physics<br><br><strong>Problem-solving approach:</strong><br>1. Draw a diagram<br>2. List known quantities<br>3. Identify the relevant equation<br>4. Solve algebraically, then substitute numbers<br>5. Check units!<br><br><em>What physics concept would you like me to explain?</em>',
        'Chemistry': '<strong>Let us explore the chemistry.</strong><br><br><strong>Core concepts:</strong><br>\u2022 <strong>Atomic structure</strong> \u2014 Protons, neutrons, electrons<br>\u2022 <strong>Chemical bonding</strong> \u2014 Ionic, covalent, metallic<br>\u2022 <strong>Chemical reactions</strong> \u2014 Reactants \u2192 Products<br>\u2022 <strong>The mole concept</strong> \u2014 6.022 \u00d7 10\u00b2\u00b3 particles<br><br><strong>Balancing tip:</strong> Count atoms on each side. Adjust coefficients (not subscripts) until balanced.<br><br><em>What chemistry topic should we dive into?</em>',
        'Business': '<strong>Let us talk business strategy.</strong><br><br>Starting a successful business in Uganda requires:<br><br>1. <strong>Problem-Solution Fit</strong> \u2014 Find a real problem people will pay to solve<br>2. <strong>Market Research</strong> \u2014 Know your competitors and customers<br>3. <strong>Lean Start</strong> \u2014 Start small, test, iterate<br>4. <strong>Financial Literacy</strong> \u2014 Track every shilling in and out<br>5. <strong>Registration</strong> \u2014 Get proper licenses (available in our Gov Forms tool!)<br><br><em>Tell me more about your business idea and I will help you develop it.</em>',
        'Vocational': '<strong>Vocational skills open real doors.</strong><br><br>The Knowledge Trees project focuses on practical skills that lead directly to employment:<br><br>\u2022 <strong>Solar Installation</strong> \u2014 High demand, 800W system training<br>\u2022 <strong>Electronics Repair</strong> \u2014 Phones, radios, small appliances<br>\u2022 <strong>Tailoring</strong> \u2014 From patterns to finished garments<br>\u2022 <strong>Agriculture</strong> \u2014 Modern farming techniques<br>\u2022 <strong>Construction</strong> \u2014 Basic building skills<br><br><em>Which vocational area interests you? I will guide you from beginner to job-ready.</em>',
    };

    return subjectResponses[subject] || '<strong>I am here to help!</strong><br><br>I am your AI teacher at the Knowledge Trees learning hub. I can help you with:<br><br>\u2022 <strong>Mathematics</strong> \u2014 Step-by-step solutions<br>\u2022 <strong>Science</strong> \u2014 Experiments and explanations<br>\u2022 <strong>Programming</strong> \u2014 Code writing and debugging<br>\u2022 <strong>English</strong> \u2014 Grammar, writing, and comprehension<br>\u2022 <strong>Business</strong> \u2014 Plans, strategy, and registration<br>\u2022 <strong>Any subject</strong> \u2014 Just ask!<br><br>I work offline using content synced at your nearest Knowledge Tree. For advanced questions, visit a node for enhanced AI processing.<br><br><em>What would you like to learn today?</em>';
}

function sendAI() {
    const input = document.getElementById('chatIn'), msg = input.value.trim();
    if (!msg && !pendingImage) return; input.value = '';
    const msgs = document.getElementById('chatMsgs'), subj = activeSub ? activeSub.name : 'General', hasImg = !!pendingImage;
    let html = ''; if (hasImg) html += '<img class="msg-img" src="' + pendingImage.data + '" alt="upload">'; if (msg) html += msg;
    msgs.innerHTML += '<div class="msg me">' + html + '<div class="msg-time">Just now</div></div>';
    if (hasImg) removeImage();
    msgs.innerHTML += '<div class="typing" id="typ"><i></i><i></i><i></i></div>'; msgs.scrollTop = msgs.scrollHeight;

    // Try to fetch from Wikipedia API for enhanced answers (if online)
    const tryWikiFetch = msg && !hasImg && navigator.onLine;
    if (tryWikiFetch) {
        const wikiQ = encodeURIComponent(msg.replace(/[?!.,]/g, '').trim().split(' ').slice(0, 5).join(' '));
        fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + wikiQ)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                const t = document.getElementById('typ'); if (t) t.remove();
                let reply = aiReply(subj, msg, false);
                if (data && data.extract && data.extract.length > 50) {
                    reply += '<br><br><div style="margin-top:8px;padding:8px 10px;background:var(--c-bg);border:1px solid var(--c-border);border-radius:var(--r-sm)"><div style="font-size:8px;font-weight:700;color:var(--c-text-5);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">From Wikipedia (online)</div><div style="font-size:11px;color:var(--c-text-3);line-height:1.5">' + data.extract.substring(0, 300) + (data.extract.length > 300 ? '...' : '') + '</div></div>';
                }
                msgs.innerHTML += '<div class="msg bot"><div class="msg-subj">' + subj + '</div>' + reply + '<div class="msg-time">Just now</div></div>';
                msgs.scrollTop = msgs.scrollHeight;
            })
            .catch(() => {
                const t = document.getElementById('typ'); if (t) t.remove();
                msgs.innerHTML += '<div class="msg bot"><div class="msg-subj">' + subj + '</div>' + aiReply(subj, msg, false) + '<div class="msg-time">Just now</div></div>';
                msgs.scrollTop = msgs.scrollHeight;
            });
    } else {
        setTimeout(() => {
            const t = document.getElementById('typ'); if (t) t.remove();
            msgs.innerHTML += '<div class="msg bot"><div class="msg-subj">' + subj + '</div>' + aiReply(subj, msg, hasImg) + '<div class="msg-time">Just now</div></div>';
            msgs.scrollTop = msgs.scrollHeight;
        }, 800 + Math.random() * 600);
    }
}


/* ══════════════════════════════════════════
   CURRICULUM BY LEVEL
   ══════════════════════════════════════════ */
const curriculum = {
    primary: [
        { abbr:'Rd', title:'Reading & Writing', meta:'P1-P3 \u00b7 30 lessons', progress:80, bg:'var(--c-primary-soft)', color:'var(--c-primary)' },
        { abbr:'Ma', title:'Basic Mathematics', meta:'P1-P4 \u00b7 25 lessons', progress:65, bg:'var(--c-blue-soft)', color:'var(--c-blue)' },
        { abbr:'SS', title:'Social Studies', meta:'P3-P7 \u00b7 20 lessons', progress:40, bg:'var(--c-green-soft)', color:'var(--c-green)' },
        { abbr:'Sc', title:'Basic Science', meta:'P4-P7 \u00b7 22 lessons', progress:30, bg:'var(--c-amber-soft)', color:'var(--c-amber)' },
    ],
    secondary: [
        { abbr:'Al', title:'Algebra & Geometry', meta:'S1-S4 \u00b7 35 lessons', progress:55, bg:'var(--c-primary-soft)', color:'var(--c-primary)' },
        { abbr:'Ph', title:'Physics', meta:'S1-S6 \u00b7 30 lessons', progress:45, bg:'var(--c-blue-soft)', color:'var(--c-blue)' },
        { abbr:'Ch', title:'Chemistry', meta:'S1-S6 \u00b7 28 lessons', progress:20, bg:'var(--c-green-soft)', color:'var(--c-green)' },
        { abbr:'Bi', title:'Biology', meta:'S1-S6 \u00b7 26 lessons', progress:35, bg:'var(--c-purple-soft)', color:'var(--c-purple)' },
        { abbr:'En', title:'English Language', meta:'S1-S6 \u00b7 22 lessons', progress:70, bg:'var(--c-purple-soft)', color:'var(--c-purple)' },
    ],
    advanced: [
        { abbr:'Ca', title:'Advanced Calculus', meta:'40 lessons', progress:65, bg:'var(--c-primary-soft)', color:'var(--c-primary)' },
        { abbr:'Py', title:'Python Programming', meta:'35 lessons', progress:30, bg:'var(--c-green-soft)', color:'var(--c-green)' },
        { abbr:'CS', title:'Computer Science', meta:'32 lessons', progress:22, bg:'var(--c-purple-soft)', color:'var(--c-purple)' },
    ],
    university: [
        { abbr:'ML', title:'Machine Learning', meta:'45 lessons', progress:5, bg:'var(--c-primary-soft)', color:'var(--c-primary)' },
        { abbr:'SE', title:'Software Engineering', meta:'50 lessons', progress:0, bg:'var(--c-green-soft)', color:'var(--c-green)' },
        { abbr:'SD', title:'Sustainable Development', meta:'28 lessons', progress:0, bg:'var(--c-purple-soft)', color:'var(--c-purple)' },
    ],
};
function renderCurr(level) {
    document.getElementById('currList').innerHTML = (curriculum[level] || []).map(c => '<div class="crs" onclick="go(\'ai\',document.querySelectorAll(\'.bnav-item\')[2])"><div class="crs-icon" style="background:' + c.bg + ';color:' + c.color + '">' + c.abbr + '</div><div class="crs-body"><div class="crs-title">' + c.title + '</div><div class="crs-meta">' + c.meta + '</div>' + (c.progress > 0 ? '<div class="crs-prog"><div class="pbar"><div class="pfill" style="width:' + c.progress + '%"></div></div></div>' : '') + '</div>' + (c.progress > 0 ? '<span class="crs-pct">' + c.progress + '%</span>' : '<svg style="width:14px;height:14px;stroke:var(--c-text-5);fill:none;stroke-width:2"><use href="#i-chevron"/></svg>') + '</div>').join('');
}
function setLevel(el, level) { document.querySelectorAll('.lvl-tab').forEach(t => t.classList.remove('on')); el.classList.add('on'); renderCurr(level); }
renderCurr('primary');


/* ══════════════════════════════════════════
   ENHANCED STUDY GROUPS
   ══════════════════════════════════════════ */
const myGroups = [
    {
        name:'Math Warriors', desc:'Daily problem solving \u2014 calculus & algebra.',
        initials:['AS','BM','NK','LN'], count:12, tags:['Mathematics','Daily'],
        pinned: [
            { type:'note', title:'Chain Rule Cheat Sheet', by:'Brian', time:'2h ago' },
            { type:'resource', title:'Integration Formulas PDF', by:'Aisha', time:'1d ago' },
        ],
        resources: [
            { type:'textbook', title:'Mathematics for S3-S4', by:'Shared', pages:320 },
            { type:'notes', title:'Calculus Summary Notes', by:'Brian', pages:12 },
            { type:'quiz', title:'Weekly Quiz #14', questions:20, due:'Tomorrow' },
        ],
        sessions: [
            { title:'Calculus Review', host:'Brian', time:'Today 4:00 PM', attendees:8, status:'upcoming' },
            { title:'Algebra Drills', host:'Aisha', time:'Wed 3:00 PM', attendees:5, status:'scheduled' },
        ],
        msgs: [
            { name:'Aisha', initial:'AS', text:'Can someone explain the chain rule?', time:'2m ago' },
            { name:'Brian', initial:'BM', text:"d/dx[f(g(x))] = f'(g(x)) * g'(x). Think of peeling layers.", time:'1m ago' },
            { name:'You', initial:'LN', text:'Example: d/dx[sin(x^2)] = cos(x^2) * 2x', time:'now', own:true },
        ]
    },
    {
        name:'Python Coders', desc:'From basics to real projects.',
        initials:['DK','FK','LN'], count:8, tags:['Programming','Projects'],
        pinned: [{ type:'note', title:'Python Best Practices', by:'Dora', time:'3d ago' }],
        resources: [
            { type:'textbook', title:'Introduction to Computing', by:'Shared', pages:220 },
            { type:'notes', title:'OOP Cheat Sheet', by:'Felix', pages:8 },
        ],
        sessions: [{ title:'Code Review Friday', host:'Dora', time:'Fri 2:00 PM', attendees:6, status:'scheduled' }],
        msgs: [
            { name:'Dora', initial:'DK', text:'Just built a budget tracker app!', time:'5m ago' },
            { name:'Felix', initial:'FK', text:'Nice! Share the code on our repo?', time:'3m ago' },
        ]
    },
    {
        name:'Science Lab', desc:'Physics, chemistry, biology \u2014 with experiments.',
        initials:['GN','SM','LN'], count:15, tags:['Science','Experiments'],
        pinned: [], resources: [{ type:'notes', title:'Lab Safety Rules', by:'Grace', pages:4 }],
        sessions: [{ title:'Electromagnetic Induction', host:'Grace', time:'Tomorrow 10:00 AM', attendees:10, status:'upcoming' }],
        msgs: [{ name:'Grace', initial:'GN', text:'Tomorrow: electromagnetic induction. Bring a magnet!', time:'1h ago' }]
    },
];
const discoverGroups = [
    { name:'English Masters', desc:'Speaking & writing practice across Wakiso.', initials:['SA','NK'], count:23, tags:['English','Speaking'] },
    { name:'Solar Technicians', desc:'Installation training. Job placement included.', initials:['TK','JB'], count:18, tags:['Vocational','Solar'] },
    { name:'Business Builders', desc:'Entrepreneurs sharing ideas & ventures.', initials:['AM','RN'], count:14, tags:['Business'] },
    { name:'History Circle', desc:'Exploring Uganda and African history together.', initials:['PN','MK'], count:9, tags:['History','Discussion'] },
];
const qaFeed = [
    { asker:'Sarah', initial:'SN', q:'How do you find the derivative of sin(x\u00b2)?', a:"Chain rule: d/dx[sin(x\u00b2)] = cos(x\u00b2) * 2x.", time:'10m ago', likes:5, replies:3 },
    { asker:'James', initial:'JM', q:"What's the difference between HTTP and HTTPS?", a:'HTTPS adds SSL/TLS encryption. Data is scrambled in transit.', time:'25m ago', likes:12, replies:7 },
    { asker:'Amara', initial:'AN', q:'Why does ice float on water?', a:'Hydrogen bonds form a crystal lattice with gaps, making ice ~9% less dense.', time:'1h ago', likes:8, replies:4 },
    { asker:'David', initial:'DK', q:'How do solar panels generate electricity?', a:'Photons knock electrons free in silicon cells. Our Knowledge Tree uses 4x200W panels.', time:'2h ago', likes:15, replies:9 },
];

let activeGroupIndex = -1, activeGCTab = 'chat';

function renderGrps(filter) {
    const el = document.getElementById('grpContent');
    if (filter === 'my') {
        el.innerHTML = myGroups.map((g, i) => '<div class="grp" onclick="openGC(' + i + ')"><div class="grp-top"><div class="grp-name">' + g.name + '</div><div class="grp-n">' + g.count + ' members</div></div><div class="grp-desc">' + g.desc + '</div><div class="grp-avs">' + g.initials.map(a => '<div class="grp-av">' + a + '</div>').join('') + (g.count > 4 ? '<div class="grp-av" style="font-size:8px;font-weight:700">+' + (g.count - 4) + '</div>' : '') + '</div><div class="grp-tags">' + g.tags.map(t => '<span class="grp-tg">' + t + '</span>').join('') + '</div></div>').join('');
    } else if (filter === 'find') {
        el.innerHTML = discoverGroups.map(g => '<div class="grp"><div class="grp-top"><div class="grp-name">' + g.name + '</div><div class="grp-n">' + g.count + ' members</div></div><div class="grp-desc">' + g.desc + '</div><div class="grp-tags">' + g.tags.map(t => '<span class="grp-tg">' + t + '</span>').join('') + '<button class="btn btn-p" style="margin-left:auto;padding:5px 10px;font-size:10px" onclick="event.stopPropagation();toast(\'ok\',\'Joined\',\'Welcome to ' + g.name + '!\')">Join</button></div></div>').join('');
    } else if (filter === 'qa') {
        el.innerHTML = '<button class="btn btn-s btn-w" style="margin-bottom:10px" onclick="go(\'ai\',document.querySelectorAll(\'.bnav-item\')[2])"><svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2"><use href="#i-message"/></svg> Ask the Community</button>' +
            qaFeed.map(q => '<div class="qa"><div class="qa-top"><div class="qa-av">' + q.initial + '</div><div class="qa-who">' + q.asker + '</div><div class="qa-when">' + q.time + '</div></div><div class="qa-q">' + q.q + '</div><div class="qa-a">' + q.a + '</div><div class="qa-foot"><span class="qa-act"><svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2"><use href="#i-thumb"/></svg> ' + q.likes + '</span><span class="qa-act"><svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2"><use href="#i-message"/></svg> ' + q.replies + '</span><span class="qa-act"><svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2"><use href="#i-bookmark"/></svg> Save</span></div></div>').join('');
    }
}
function filterG(el, f) { document.querySelectorAll('#s-groups .pill').forEach(p => p.classList.remove('on')); el.classList.add('on'); renderGrps(f); }
renderGrps('my');

// ── ENHANCED GROUP CHAT ──
function openGC(i) {
    activeGroupIndex = i; activeGCTab = 'chat';
    const g = myGroups[i];
    document.getElementById('gcTitle').textContent = g.name;
    document.getElementById('gcSub').textContent = g.count + ' members \u00b7 ' + g.tags.join(', ');
    document.querySelectorAll('.gc-tab').forEach(t => t.classList.remove('on'));
    document.querySelector('.gc-tab').classList.add('on');
    document.getElementById('gcInput').style.display = 'flex';
    renderGCChat(g);
    document.getElementById('gcOverlay').classList.add('on');
}
function closeGC() { document.getElementById('gcOverlay').classList.remove('on'); }

function switchGCTab(el, tab) {
    document.querySelectorAll('.gc-tab').forEach(t => t.classList.remove('on'));
    el.classList.add('on');
    activeGCTab = tab;
    document.getElementById('gcInput').style.display = tab === 'chat' ? 'flex' : 'none';
    const g = myGroups[activeGroupIndex];
    const panel = document.getElementById('gcPanel');
    if (tab === 'chat') { panel.innerHTML = '<div class="gc-msgs" id="gcMsgs"></div>'; renderGCChat(g); }
    else if (tab === 'resources') { panel.innerHTML = renderGCResources(g); }
    else if (tab === 'sessions') { panel.innerHTML = renderGCSessions(g); }
    else if (tab === 'pinned') { panel.innerHTML = renderGCPinned(g); }
}
function renderGCChat(g) {
    const msgs = document.getElementById('gcMsgs');
    if (!msgs) return;
    msgs.innerHTML = g.msgs.map(m => '<div class="gm ' + (m.own ? 'own' : '') + '"><div class="gm-av">' + m.initial + '</div><div class="gm-bd"><div class="gm-n">' + m.name + '</div><div class="gm-t">' + m.text + '</div><div class="gm-w">' + m.time + '</div></div></div>').join('');
    setTimeout(() => { msgs.scrollTop = msgs.scrollHeight; }, 50);
}
function renderGCResources(g) {
    if (!g.resources || !g.resources.length) return '<p style="padding:20px;text-align:center;font-size:12px;color:var(--c-text-4)">No shared resources yet.</p>';
    return g.resources.map(r => {
        const icon = r.type === 'textbook' ? '#i-book' : r.type === 'quiz' ? '#i-zap' : '#i-bookmark';
        const bg = r.type === 'textbook' ? 'var(--c-primary-soft)' : r.type === 'quiz' ? 'var(--c-green-soft)' : 'var(--c-blue-soft)';
        return '<div class="gc-res"><div class="gc-res-icon" style="background:' + bg + '"><svg style="width:14px;height:14px;stroke:var(--c-text-3);fill:none;stroke-width:2"><use href="' + icon + '"/></svg></div><div class="gc-res-body"><div class="gc-res-title">' + r.title + '</div><div class="gc-res-meta">' + (r.by ? 'By ' + r.by : '') + (r.pages ? ' \u00b7 ' + r.pages + ' pages' : '') + (r.questions ? ' \u00b7 ' + r.questions + ' questions' : '') + (r.due ? ' \u00b7 Due: ' + r.due : '') + '</div></div><svg style="width:12px;height:12px;stroke:var(--c-text-5);fill:none;stroke-width:2"><use href="#i-chevron"/></svg></div>';
    }).join('');
}
function renderGCSessions(g) {
    const btn = '<button class="btn btn-p btn-w" style="margin-bottom:10px" onclick="toast(\'ok\',\'Scheduled\',\'Session created. Peers notified.\')"><svg style="width:12px;height:12px;stroke:white;fill:none;stroke-width:2"><use href="#i-plus"/></svg> Host New Session</button>';
    if (!g.sessions || !g.sessions.length) return btn + '<p style="padding:20px;text-align:center;font-size:12px;color:var(--c-text-4)">No upcoming sessions.</p>';
    return btn + g.sessions.map(s => '<div class="gc-sess"><div class="gc-sess-title">' + s.title + '</div><div class="gc-sess-meta">Hosted by ' + s.host + ' \u2014 ' + s.time + ' \u2014 ' + s.attendees + ' attending</div><div class="gc-sess-foot"><button class="btn btn-p" style="padding:6px 12px;font-size:10px" onclick="toast(\'ok\',\'Joined\',\'See you at ' + s.title + '!\')">Join</button><span class="gc-sess-status" style="color:' + (s.status === 'upcoming' ? 'var(--c-green)' : 'var(--c-text-4)') + '">' + s.status + '</span></div></div>').join('');
}
function renderGCPinned(g) {
    if (!g.pinned || !g.pinned.length) return '<p style="padding:20px;text-align:center;font-size:12px;color:var(--c-text-4)">Nothing pinned yet.</p>';
    return g.pinned.map(p => '<div class="gc-pin"><div class="gc-pin-icon"><svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><use href="#i-bookmark"/></svg></div><div class="gc-pin-body"><div class="gc-pin-title">' + p.title + '</div><div class="gc-pin-meta">by ' + p.by + ' \u2014 ' + p.time + '</div></div></div>').join('');
}

function sendGM() {
    const input = document.getElementById('gcIn'), msg = input.value.trim(); if (!msg) return; input.value = '';
    const msgs = document.getElementById('gcMsgs'); if (!msgs) return;
    msgs.innerHTML += '<div class="gm own"><div class="gm-av">LN</div><div class="gm-bd"><div class="gm-n">You</div><div class="gm-t">' + msg + '</div><div class="gm-w">now</div></div></div>';
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => { const r = [{ name:'Aisha', i:'AS', t:'Good point!' },{ name:'Brian', i:'BM', t:'Let me think about that.' },{ name:'Grace', i:'GN', t:'Can you explain more?' }][Math.floor(Math.random() * 3)]; msgs.innerHTML += '<div class="gm"><div class="gm-av">' + r.i + '</div><div class="gm-bd"><div class="gm-n">' + r.name + '</div><div class="gm-t">' + r.t + '</div><div class="gm-w">now</div></div></div>'; msgs.scrollTop = msgs.scrollHeight; }, 1200 + Math.random() * 800);
}
function showNewGrp() { document.getElementById('newGrpModal').classList.add('on'); }
function closeNewGrp() { document.getElementById('newGrpModal').classList.remove('on'); }
function createGrp() { const n = document.getElementById('ngName').value.trim(); if (!n) return; toast('ok', 'Created', n + ' is ready!'); closeNewGrp(); document.getElementById('ngName').value = ''; document.getElementById('ngSubj').value = ''; document.getElementById('ngDesc').value = ''; }


/* ══════════════════════════════════════════
   IMPROVED JOBS — OPPORTUNITY RADAR
   ══════════════════════════════════════════ */
const JOB_CATEGORIES = ['All','Technology','Vocational','Education','Business','Agriculture','Healthcare'];
let jobFilter = 'All', jobSearchQuery = '';

const jobs = [
    { abbr:'SD', title:'Junior Software Developer', company:'TechStart Uganda', location:'Remote', match:98, tags:['UGX 1.5M-2.2M/mo','Full-time','Remote'], category:'Technology', skills:['Python','JavaScript','Problem Solving'], posted:'2d ago', description:'Build web applications for East African markets. Training provided.', status:null },
    { abbr:'ST', title:'Solar Technician', company:'Wakiso Solar Solutions', location:'2km away', match:92, tags:['Training','3 months','On-site'], category:'Vocational', skills:['Solar Installation','Electrical Wiring','Measurement'], posted:'1d ago', description:'Install and maintain solar systems for homes and businesses.', status:null },
    { abbr:'DA', title:'Data Analyst Intern', company:'MTN Uganda', location:'Kampala', match:78, tags:['Internship','6 months'], category:'Technology', skills:['Excel','Statistics','SQL'], posted:'3d ago', description:'Analyze telecom data to improve customer experience.', status:null },
    { abbr:'TA', title:'Teaching Assistant', company:'Guardian Angel Primary', location:'Nansana', match:85, tags:['Part-time','Mathematics'], category:'Education', skills:['Mathematics','Patience','Communication'], posted:'1d ago', description:'Assist P4-P7 students with mathematics and science.', status:null },
    { abbr:'ER', title:'Electronics Repair Tech', company:'TechFix Hub', location:'Nansana Market', match:70, tags:['Apprenticeship','Tools provided'], category:'Vocational', skills:['Soldering','Diagnostics','Customer Service'], posted:'5d ago', description:'Repair phones, radios, and small electronics.', status:null },
    { abbr:'MM', title:'Mobile Money Agent', company:'Airtel Uganda', location:'Nansana', match:82, tags:['UGX 400K-600K/mo','Full-time'], category:'Business', skills:['Customer Service','Basic Math','Record Keeping'], posted:'2d ago', description:'Process mobile money transactions. Float provided.', status:null },
    { abbr:'AE', title:'Agricultural Extension Worker', company:'NAADS', location:'Wakiso District', match:65, tags:['Government','Field work'], category:'Agriculture', skills:['Agriculture','Communication','Data Collection'], posted:'1w ago', description:'Train farmers on modern techniques and connect them to markets.', status:null },
    { abbr:'CH', title:'Community Health Worker', company:'Wakiso Health Centre', location:'3km away', match:60, tags:['Part-time','Training provided'], category:'Healthcare', skills:['First Aid','Communication','Community Trust'], posted:'4d ago', description:'Community outreach for health education and screening.', status:null },
    { abbr:'CC', title:'Content Creator', company:'Knowledge Trees', location:'Remote', match:90, tags:['UGX 800K-1.2M/mo','Contract'], category:'Technology', skills:['Writing','Research','Curriculum Design'], posted:'1d ago', description:'Create educational content for the Roots learning platform.', status:null },
    { abbr:'TI', title:'Tailoring Instructor', company:'Nansana Skills Centre', location:'1km away', match:72, tags:['Part-time','Weekends'], category:'Education', skills:['Tailoring','Teaching','Pattern Making'], posted:'3d ago', description:'Teach tailoring basics to youth groups on weekends.', status:null },
    { abbr:'CS', title:'Customer Support Agent', company:'SafeBoda', location:'Kampala', match:75, tags:['UGX 700K-900K/mo','Full-time'], category:'Business', skills:['Communication','Problem Solving','Tech Savvy'], posted:'2d ago', description:'Handle rider and passenger inquiries via phone and chat.', status:null },
    { abbr:'PF', title:'Poultry Farm Assistant', company:'Wakiso Farms Ltd', location:'5km away', match:55, tags:['Full-time','Housing included'], category:'Agriculture', skills:['Animal Care','Record Keeping','Early Riser'], posted:'1w ago', description:'Daily care of 2,000 layer chickens including feeding and egg collection.', status:null },
    { abbr:'WD', title:'Web Developer', company:'Andela Uganda', location:'Kampala/Remote', match:88, tags:['UGX 2M-3.5M/mo','Full-time'], category:'Technology', skills:['React','Node.js','Git'], posted:'3d ago', description:'Build products for international clients. Remote-friendly.', status:null },
    { abbr:'CF', title:'Construction Foreman', company:'Quality Builders', location:'Wakiso', match:50, tags:['UGX 1M-1.5M/mo','Contract'], category:'Vocational', skills:['Construction','Leadership','Safety'], posted:'1w ago', description:'Supervise residential construction projects in Wakiso area.', status:null },
    { abbr:'NA', title:'Nurse Aid', company:'Mulago Hospital', location:'Kampala', match:45, tags:['Training','6 months'], category:'Healthcare', skills:['Care','Hygiene','Empathy'], posted:'5d ago', description:'Support nursing staff with patient care and ward duties.', status:null },
];

function renderJobStats() {
    const applied = jobs.filter(j => j.status === 'applied' || j.status === 'interview').length;
    const saved = jobs.filter(j => j.status === 'saved').length;
    document.getElementById('jobStats').innerHTML = '<div class="job-stat"><div class="job-stat-v">' + jobs.length + '</div><div class="job-stat-l">Available</div></div><div class="job-stat"><div class="job-stat-v">' + applied + '</div><div class="job-stat-l">Applied</div></div><div class="job-stat"><div class="job-stat-v">' + saved + '</div><div class="job-stat-l">Saved</div></div>';
}
function renderJobPills() {
    document.getElementById('jobPills').innerHTML = JOB_CATEGORIES.map(c => '<button class="pill ' + (c === jobFilter ? 'on' : '') + '" onclick="setJobFilter(this,\'' + c + '\')">' + c + '</button>').join('');
}
function setJobFilter(el, cat) { jobFilter = cat; document.querySelectorAll('#s-jobs .pill').forEach(p => p.classList.remove('on')); el.classList.add('on'); renderJobs(); }
function filterJobs() { jobSearchQuery = document.getElementById('jobSearch').value.toLowerCase(); renderJobs(); }

function renderJobTracker() {
    const tracked = jobs.filter(j => j.status);
    const colors = { saved:'var(--c-blue)', applied:'var(--c-amber)', interview:'var(--c-green)' };
    const bgs = { saved:'var(--c-blue-soft)', applied:'var(--c-amber-soft)', interview:'var(--c-green-soft)' };
    document.getElementById('jobTracker').innerHTML = tracked.map(j => '<div class="job-track-card"><div class="job-track-title">' + j.title + '</div><div class="job-track-co">' + j.company + '</div><span class="job-track-status" style="background:' + bgs[j.status] + ';color:' + colors[j.status] + '">' + j.status + '</span></div>').join('');
}

function getJobRec(cat) {
    const map = {
        'Technology': ['ict','comp_science'], 'Vocational': ['agriculture','creative_arts'],
        'Business': ['commerce','entrepreneurship','economics'], 'Healthcare': ['biology','chemistry'],
        'Education': ['english','mathematics'], 'Agriculture': ['agriculture']
    };
    const subjs = map[cat] || ['mathematics'];
    return textbooks.find(t => subjs.includes(t.subject) && (t.classes.includes('S4') || t.classes.includes('S5') || t.classes.includes('S6') || t.tag === 'Vocational'));
}

function renderJobs() {
    let filtered = jobs;
    if (jobFilter !== 'All') filtered = filtered.filter(j => j.category === jobFilter);
    if (jobSearchQuery) filtered = filtered.filter(j => j.title.toLowerCase().includes(jobSearchQuery) || j.skills.some(s => s.toLowerCase().includes(jobSearchQuery)) || j.company.toLowerCase().includes(jobSearchQuery));
    document.getElementById('jobResultLabel').textContent = jobFilter === 'All' ? 'All Opportunities' : jobFilter;
    document.getElementById('jobResultCount').textContent = filtered.length + ' jobs';
    document.getElementById('jobList').innerHTML = filtered.map(j => {
        const idx = jobs.indexOf(j);
        const recBook = j.match < 90 ? getJobRec(j.category) : null;
        return '<div class="job"><div class="job-top"><div class="job-logo">' + j.abbr + '</div><div style="display:flex;align-items:center;gap:6px"><span class="job-posted">' + j.posted + '</span><div class="job-match">' + j.match + '% match</div></div></div><div class="job-title">' + j.title + '</div><div class="job-co">' + j.company + ' \u00b7 ' + j.location + '</div><div class="job-desc">' + j.description + '</div><div class="job-skills">' + j.skills.map(s => '<span class="job-skill">' + s + '</span>').join('') + '</div><div class="job-tags">' + j.tags.map(t => '<span class="job-tg">' + t + '</span>').join('') + '</div>' +
        (recBook ? '<div style="margin:10px 0 4px;padding:8px;background:var(--c-bg);border:1px solid var(--c-border);border-radius:var(--r-sm);display:flex;align-items:center;gap:8px;cursor:pointer" onclick="openTextbook(' + textbooks.indexOf(recBook) + ')"><div style="width:24px;height:24px;background:var(--c-primary-soft);border-radius:4px;display:flex;align-items:center;justify-content:center"><svg style="width:12px;height:12px;stroke:var(--c-primary);fill:none;stroke-width:2"><use href="#i-book"/></svg></div><div style="flex:1"><div style="font-size:9px;color:var(--c-text-4);text-transform:uppercase;font-weight:700">Boost your match</div><div style="font-size:11px;font-weight:600">' + recBook.title + '</div></div><svg style="width:12px;height:12px;stroke:var(--c-text-4);fill:none;stroke-width:2"><use href="#i-chevron"/></svg></div>' : '') +
        '<div class="job-btns"><button class="btn btn-s" onclick="saveJob(' + idx + ')">Save</button><button class="btn btn-p" onclick="applyJob(' + idx + ')">Apply</button></div></div>';
    }).join('') || '<p style="padding:20px 0;text-align:center;font-size:12px;color:var(--c-text-4)">No jobs match your filters.</p>';
    renderJobTracker();
    renderJobStats();
}
function saveJob(idx) { jobs[idx].status = 'saved'; toast('ok', 'Saved', jobs[idx].title); renderJobs(); }
function applyJob(idx) { jobs[idx].status = 'applied'; toast('ok', 'Applied', 'Application sent for ' + jobs[idx].title); renderJobs(); }

renderJobPills();
renderJobs();


/* ══════════════════════════════════════════
   SNEAKERNET CONTENT SHARING
   ══════════════════════════════════════════ */
const meshPeers = [
    { name:'Sarah N.', i:'SN', distance:'3m', signal:'strong', sharing:['Mathematics S3','Physics S2'] },
    { name:'Brian M.', i:'BM', distance:'8m', signal:'strong', sharing:['Python Basics','English S4'] },
    { name:'Grace K.', i:'GK', distance:'15m', signal:'medium', sharing:['Chemistry S3'] },
    { name:'David O.', i:'DO', distance:'22m', signal:'medium', sharing:['Solar Installation','Business Plans'] },
    { name:'Amara T.', i:'AT', distance:'35m', signal:'weak', sharing:['Biology S2','Agriculture P6'] },
    { name:'Felix W.', i:'FW', distance:'12m', signal:'strong', sharing:['ICT S2','History S1'] },
    { name:'Joan M.', i:'JM', distance:'28m', signal:'medium', sharing:['English S1','Social Studies P7'] },
    { name:'Peter K.', i:'PK', distance:'40m', signal:'weak', sharing:['Mathematics S1'] },
];
const myShares = [
    { title:'Mathematics for S4', type:'textbook', size:'2.4 MB', requests:3 },
    { title:'Calculus Summary Notes', type:'notes', size:'450 KB', requests:1 },
    { title:'Python Basics', type:'textbook', size:'1.8 MB', requests:5 },
];
const activeTransfers = [
    { title:'Physics S2', from:'Brian M.', progress:72, size:'1.8 MB', speed:'45 KB/s', status:'downloading' },
    { title:'Chemistry S3', from:'Grace K.', progress:34, size:'2.1 MB', speed:'32 KB/s', status:'downloading' },
    { title:'Mathematics for S4', to:'Sarah N.', progress:100, size:'2.4 MB', speed:'--', status:'complete' },
    { title:'Python Basics', to:'David O.', progress:88, size:'1.8 MB', speed:'28 KB/s', status:'uploading' },
];

let snkInterval;
function openSnk() {
    document.getElementById('snkOverlay').classList.add('on');
    document.getElementById('snkPeerCount').textContent = meshPeers.length;
    renderSnkRadar();
    renderSnkContent('nearby');
    snkInterval = setInterval(updateSnkProgress, 800);
}
function closeSnk() { document.getElementById('snkOverlay').classList.remove('on'); clearInterval(snkInterval); }

function switchSnkTab(el, tab) {
    document.querySelectorAll('.snk-tab').forEach(t => t.classList.remove('on'));
    el.classList.add('on');
    renderSnkContent(tab);
}

function renderSnkRadar() {
    document.getElementById('snkPeerDots').innerHTML = meshPeers.map((p, i) => {
        const angle = (i / meshPeers.length) * 2 * Math.PI - Math.PI / 2;
        const r = p.signal === 'strong' ? 30 : p.signal === 'medium' ? 55 : 78;
        const x = 100 + r * Math.cos(angle) - 11;
        const y = 100 + r * Math.sin(angle) - 11;
        return '<div class="snk-peer-dot ' + p.signal + '" style="left:' + x + 'px;top:' + y + 'px" onclick="toast(\'info\',\'' + p.name + '\',\'' + p.sharing.length + ' items \u2014 ' + p.distance + ' away\')">' + p.i + '</div>';
    }).join('');
}

function renderSnkContent(tab) {
    const el = document.getElementById('snkContent');
    if (tab === 'nearby') {
        el.innerHTML = meshPeers.map(p => {
            const bars = [6, 10, 14];
            const act = p.signal === 'strong' ? 3 : p.signal === 'medium' ? 2 : 1;
            return '<div class="snk-peer" onclick="toast(\'info\',\'' + p.name + '\',\'Tap shared items to request transfer\')"><div class="snk-peer-av">' + p.i + '</div><div class="snk-peer-info"><div class="snk-peer-name">' + p.name + ' <span class="snk-peer-dist">' + p.distance + '</span></div><div class="snk-peer-shares">' + p.sharing.map(s => '<span class="snk-peer-share">' + s + '</span>').join('') + '</div></div><div class="snk-peer-signal">' + bars.map((h, bi) => '<div class="snk-peer-bar ' + (bi < act ? 'active' : '') + '" style="height:' + h + 'px"></div>').join('') + '</div></div>';
        }).join('');
    } else if (tab === 'sharing') {
        el.innerHTML = '<button class="btn btn-p btn-w" style="margin-bottom:10px" onclick="toast(\'info\',\'Share\',\'Select textbooks or notes to broadcast\')"><svg style="width:12px;height:12px;stroke:white;fill:none;stroke-width:2"><use href="#i-plus"/></svg> Share Content</button>' +
            myShares.map(s => '<div class="snk-peer"><div class="snk-peer-av"><svg style="width:12px;height:12px;stroke:var(--c-text-3);fill:none;stroke-width:2"><use href="#i-book"/></svg></div><div class="snk-peer-info"><div class="snk-peer-name">' + s.title + '</div><div style="font-size:9px;color:var(--c-text-5)">' + s.type + ' \u00b7 ' + s.size + ' \u00b7 ' + s.requests + ' request' + (s.requests !== 1 ? 's' : '') + '</div></div></div>').join('');
    } else if (tab === 'transfers') {
        el.innerHTML = activeTransfers.map(t => '<div class="snk-transfer"><div class="snk-transfer-top"><div class="snk-transfer-title">' + t.title + '</div><span class="snk-transfer-pct">' + t.progress + '%</span></div><div class="snk-transfer-meta">' + (t.from ? 'From ' + t.from : 'To ' + t.to) + ' \u00b7 ' + t.size + '</div><div class="pbar" style="margin-bottom:4px"><div class="pfill" style="width:' + t.progress + '%;background:' + (t.status === 'complete' ? 'var(--c-green)' : 'var(--c-blue)') + '"></div></div><div class="snk-transfer-speed">' + t.speed + ' \u00b7 ' + t.status + '</div></div>').join('');
    }
}

function updateSnkProgress() {
    activeTransfers.forEach(t => {
        if (t.status === 'downloading' || t.status === 'uploading') {
            t.progress += Math.floor(Math.random() * 4) + 1;
            if (t.progress >= 100) { t.progress = 100; t.status = 'complete'; t.speed = '--'; }
        }
    });
    const activeSnkTab = document.querySelector('.snk-tab.on');
    if (activeSnkTab && activeSnkTab.textContent === 'Transfers') renderSnkContent('transfers');
}


/* ══════════════════════════════════════════
   KNOWLEDGE TREE NODE LOCATOR
   ══════════════════════════════════════════ */
const ktNodes = [
    { name:'Nansana Knowledge Tree', location:'Nansana Masitowo, off Main Rd', distance:'350m', direction:'NW', bearing:315, status:'online', queue:4, wait:'~12m', power:85, speed:'2.4 Mbps', features:['Solar-powered','BLE Mesh Hub','Content Server','Wi-Fi Hotspot'] },
    { name:'Wakiso Central Hub', location:'Wakiso Town Council, Library Grounds', distance:'1.2km', direction:'E', bearing:90, status:'online', queue:1, wait:'~3m', power:92, speed:'3.1 Mbps', features:['Solar-powered','Generator Backup','Content Server'] },
    { name:'Busukuma Community Node', location:'Busukuma Trading Centre', distance:'1.8km', direction:'SW', bearing:225, status:'offline', queue:0, wait:'--', power:12, speed:'--', features:['Solar-powered','BLE Mesh Hub'] },
];

function openLoc() {
    document.getElementById('locOverlay').classList.add('on');
    renderLocator();
}
function closeLoc() { document.getElementById('locOverlay').classList.remove('on'); }

function renderLocator() {
    const nearest = ktNodes[0];
    document.getElementById('locDist').textContent = nearest.distance + ' ' + nearest.direction;
    document.getElementById('locNeedle').style.transform = 'translateX(-50%) rotate(' + nearest.bearing + 'deg)';
    document.getElementById('locSub').textContent = ktNodes.filter(n => n.status === 'online').length + ' nodes online nearby';
    document.getElementById('locList').innerHTML = ktNodes.map(n => {
        const sc = n.status === 'online' ? 'var(--c-green)' : 'var(--c-red)';
        return '<div class="loc-node" onclick="toast(\'info\',\'' + n.name + '\',\'' + n.distance + ' ' + n.direction + ' \u2014 ' + n.status + '\')"><div class="loc-node-top"><div class="loc-node-name">' + n.name + '</div><span class="loc-node-dist ' + n.status + '">' + n.distance + '</span></div><div class="loc-node-loc">' + n.location + '</div><div class="loc-node-grid"><div class="loc-node-cell"><div class="loc-node-cell-v" style="color:' + sc + '">' + (n.status === 'online' ? 'On' : 'Off') + '</div><div class="loc-node-cell-l">Status</div></div><div class="loc-node-cell"><div class="loc-node-cell-v">' + n.queue + '</div><div class="loc-node-cell-l">Queue</div></div><div class="loc-node-cell"><div class="loc-node-cell-v">' + n.wait + '</div><div class="loc-node-cell-l">Wait</div></div><div class="loc-node-cell"><div class="loc-node-cell-v">' + n.power + '%</div><div class="loc-node-cell-l">Power</div></div></div><div class="loc-node-features">' + n.features.map(f => '<span class="loc-node-feat">' + f + '</span>').join('') + '</div></div>';
    }).join('');
}


/* ══════════════════════════════════════════
   CALCULATOR
   ══════════════════════════════════════════ */
let calcMode = 'basic', calcExpr = '', calcResult = '0', calcHistory = [];

function openCalc() {
    document.getElementById('calcOverlay').classList.add('on');
    renderCalcGrid();
}
function closeCalc() { document.getElementById('calcOverlay').classList.remove('on'); }

function setCalcMode(mode) {
    calcMode = mode;
    document.getElementById('calcModeBasic').className = 'calc-mode-tab' + (mode === 'basic' ? ' on' : '');
    document.getElementById('calcModeScientific').className = 'calc-mode-tab' + (mode === 'scientific' ? ' on' : '');
    renderCalcGrid();
}

function renderCalcGrid() {
    const grid = document.getElementById('calcGrid');
    if (calcMode === 'basic') {
        grid.innerHTML = [
            ['AC','calc-btn--ac','',''],['( )','','',''],['%','calc-btn--op','',''],['÷','calc-btn--op','',''],
            ['7','','',''],['8','','',''],['9','','',''],['×','calc-btn--op','',''],
            ['4','','',''],['5','','',''],['6','','',''],['−','calc-btn--op','',''],
            ['1','','',''],['2','','',''],['3','','',''],['+','calc-btn--op','',''],
            ['0','calc-btn--wide','',''],  ['.','','',''],  ['=','calc-btn--eq','',''],
        ].map(b => '<div class="calc-btn ' + b[1] + '" onclick="calcInput(\'' + b[0] + '\')">' + b[0] + '</div>').join('');
    } else {
        grid.innerHTML = [
            ['sin','calc-btn--fn','',''],['cos','calc-btn--fn','',''],['tan','calc-btn--fn','',''],['π','calc-btn--fn','',''],
            ['log','calc-btn--fn','',''],['ln','calc-btn--fn','',''],['√','calc-btn--fn','',''],['x²','calc-btn--fn','',''],
            ['AC','calc-btn--ac','',''],['( )','','',''],['%','calc-btn--op','',''],['÷','calc-btn--op','',''],
            ['7','','',''],['8','','',''],['9','','',''],['×','calc-btn--op','',''],
            ['4','','',''],['5','','',''],['6','','',''],['−','calc-btn--op','',''],
            ['1','','',''],['2','','',''],['3','','',''],['+','calc-btn--op','',''],
            ['0','calc-btn--wide','',''],  ['.','','',''],  ['=','calc-btn--eq','',''],
        ].map(b => '<div class="calc-btn ' + b[1] + '" onclick="calcInput(\'' + b[0] + '\')">' + b[0] + '</div>').join('');
    }
}

function calcInput(val) {
    const exprEl = document.getElementById('calcExpr');
    const resEl = document.getElementById('calcResult');

    if (val === 'AC') { calcExpr = ''; calcResult = '0'; }
    else if (val === '=') {
        try {
            let expr = calcExpr
                .replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
                .replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(').replace(/tan\(/g, 'Math.tan(')
                .replace(/log\(/g, 'Math.log10(').replace(/ln\(/g, 'Math.log(').replace(/√\(/g, 'Math.sqrt(')
                .replace(/π/g, 'Math.PI').replace(/(\d+)%/g, '($1/100)');
            let result = Function('"use strict"; return (' + expr + ')')();
            if (typeof result === 'number' && isFinite(result)) {
                result = parseFloat(result.toPrecision(12));
                calcHistory.unshift(calcExpr + ' = ' + result);
                if (calcHistory.length > 5) calcHistory.pop();
                calcResult = String(result);
                calcExpr = String(result);
            } else { calcResult = 'Error'; }
        } catch (e) { calcResult = 'Error'; }
    }
    else if (val === 'sin' || val === 'cos' || val === 'tan' || val === 'log' || val === 'ln' || val === '√') {
        calcExpr += val + '(';
    }
    else if (val === 'x²') {
        calcExpr += '**2';
    }
    else if (val === 'π') {
        calcExpr += 'π';
    }
    else if (val === '( )') {
        const open = (calcExpr.match(/\(/g) || []).length;
        const close = (calcExpr.match(/\)/g) || []).length;
        calcExpr += open > close ? ')' : '(';
    }
    else { calcExpr += val; }

    exprEl.textContent = calcExpr;
    resEl.textContent = calcResult;
}


/* ══════════════════════════════════════════
   OFFLINE WIKIPEDIA / ENCYCLOPEDIA
   ══════════════════════════════════════════ */
const wikiArticles = {
    'Photosynthesis': {
        category: 'Science', extract: 'The process by which plants convert light energy into chemical energy.',
        body: '<h3>Overview</h3><p>Photosynthesis is a process used by plants and other organisms to convert light energy, usually from the Sun, into chemical energy that can be stored and later released to fuel the organism\'s activities.</p><h3>The Process</h3><p>Photosynthesis occurs in two stages: the light-dependent reactions and the Calvin cycle. In the light-dependent reactions, light energy is absorbed by chlorophyll and converted to chemical energy in the form of ATP and NADPH.</p><h3>Chemical Equation</h3><p><code>6CO\u2082 + 6H\u2082O + Light \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082</code></p><h3>Importance</h3><ul><li>Produces oxygen essential for aerobic life</li><li>Converts solar energy into usable chemical energy</li><li>Foundation of most food chains on Earth</li><li>Removes carbon dioxide from the atmosphere</li></ul>'
    },
    'Uganda': {
        category: 'Geography', extract: 'A landlocked country in East Africa, known as the Pearl of Africa.',
        body: '<h3>Overview</h3><p>Uganda, officially the Republic of Uganda, is a landlocked country in East-Central Africa bordered by South Sudan, Kenya, Tanzania, Rwanda, and the DRC. The country covers 241,038 km\u00b2 with a population of approximately 45 million people.</p><h3>Geography</h3><p>Uganda sits on the East African Plateau, averaging about 1,100 metres above sea level. Lake Victoria, the largest lake in Africa, borders Uganda to the southeast. The country contains the source of the Nile River.</p><h3>Capital &amp; Government</h3><ul><li>Capital: Kampala</li><li>Government: Presidential republic</li><li>Official languages: English, Swahili</li><li>Currency: Ugandan Shilling (UGX)</li></ul><h3>Districts</h3><p>Uganda has 146 districts. Wakiso District, where the Knowledge Trees project is based, surrounds Kampala and is the most populous district with over 2 million residents.</p>'
    },
    'Solar Energy': {
        category: 'Technology', extract: 'Energy from the Sun captured using photovoltaic cells or solar thermal collectors.',
        body: '<h3>Overview</h3><p>Solar energy is radiant light and heat from the Sun that is harnessed using technologies such as solar panels (photovoltaics), solar thermal energy, and solar architecture.</p><h3>Photovoltaic Effect</h3><p>When photons from sunlight hit a silicon solar cell, they knock electrons free from atoms, creating a flow of electricity. This is the photovoltaic effect, discovered by Edmond Becquerel in 1839.</p><h3>Solar Panel Specifications</h3><ul><li>Typical panel: 200-400W output</li><li>Efficiency: 15-22% for commercial panels</li><li>Lifespan: 25-30 years</li><li>The Knowledge Tree system uses 4 x 200W panels (800W total)</li></ul><h3>Solar in Uganda</h3><p>Uganda receives approximately 5.1 kWh/m\u00b2/day of solar irradiance, making it ideal for solar energy. Only 24% of Uganda\'s population has access to electricity, making off-grid solar solutions critical.</p>'
    },
    'Pythagoras Theorem': {
        category: 'Mathematics', extract: 'A fundamental relation between the three sides of a right triangle.',
        body: '<h3>Overview</h3><p>The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse (the side opposite the right angle) equals the sum of squares of the other two sides.</p><h3>Formula</h3><p><code>a\u00b2 + b\u00b2 = c\u00b2</code></p><p>Where c is the hypotenuse and a, b are the other two sides.</p><h3>Worked Example</h3><p>If a = 3 and b = 4:</p><p><code>3\u00b2 + 4\u00b2 = 9 + 16 = 25 = 5\u00b2</code></p><p>Therefore c = 5.</p><h3>Applications</h3><ul><li>Construction and architecture (measuring right angles)</li><li>Navigation and GPS calculations</li><li>Computer graphics and game development</li><li>Surveying land and distance calculations</li></ul>'
    },
    'Cell Biology': {
        category: 'Science', extract: 'The study of cell structure, function, and behavior.',
        body: '<h3>Overview</h3><p>Cell biology is the study of cell structure, function, and behavior. All living organisms are composed of cells, which are the basic structural and functional units of life.</p><h3>Types of Cells</h3><p><strong>Prokaryotic cells</strong> (bacteria) lack a nucleus. <strong>Eukaryotic cells</strong> (plants, animals) have a membrane-bound nucleus containing DNA.</p><h3>Cell Organelles</h3><ul><li><strong>Nucleus</strong> \u2014 Contains DNA, controls cell activities</li><li><strong>Mitochondria</strong> \u2014 Powerhouse of the cell, produces ATP</li><li><strong>Ribosomes</strong> \u2014 Protein synthesis</li><li><strong>Cell membrane</strong> \u2014 Controls what enters and exits</li><li><strong>Endoplasmic reticulum</strong> \u2014 Transport system</li><li><strong>Golgi apparatus</strong> \u2014 Packaging and shipping</li></ul>'
    },
    'Wakiso District': {
        category: 'Geography', extract: 'The most populous district in Uganda, surrounding Kampala.',
        body: '<h3>Overview</h3><p>Wakiso District is a district in the Central Region of Uganda. It surrounds the capital city Kampala and is the most populous district in Uganda with over 2 million residents.</p><h3>Key Facts</h3><ul><li>Area: 2,704 km\u00b2</li><li>Population: ~2.0 million</li><li>Main town: Wakiso</li><li>Known for: Rapid urbanization, Entebbe International Airport</li></ul><h3>Nansana</h3><p>Nansana is a town in Wakiso District with a population of over 365,000. It is one of the most densely populated areas in Uganda and is the location of the Knowledge Trees project, which aims to provide solar-powered learning hubs to the community.</p><h3>Economy</h3><p>The district\'s economy relies on agriculture (mainly fishing from Lake Victoria), small-scale manufacturing, and services tied to its proximity to Kampala.</p>'
    },
    'Newtons Laws of Motion': {
        category: 'Physics', extract: 'Three laws that form the foundation of classical mechanics.',
        body: '<h3>Overview</h3><p>Newton\'s laws of motion are three laws that together form the foundation of classical mechanics. They describe the relationship between a body and the forces acting upon it.</p><h3>First Law (Law of Inertia)</h3><p>An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by an external force.</p><h3>Second Law (F = ma)</h3><p>The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.</p><p><code>Force = Mass \u00d7 Acceleration</code></p><h3>Third Law</h3><p>For every action, there is an equal and opposite reaction. When you push a wall, the wall pushes back on you with equal force.</p><h3>Applications</h3><ul><li>Engineering and vehicle design</li><li>Rocket propulsion (Third Law)</li><li>Sports science</li><li>Structural engineering</li></ul>'
    },
    'Water Cycle': {
        category: 'Science', extract: 'The continuous movement of water within Earth and its atmosphere.',
        body: '<h3>Overview</h3><p>The water cycle (also known as the hydrological cycle) describes the continuous movement of water on, above, and below the surface of the Earth.</p><h3>Stages</h3><ul><li><strong>Evaporation</strong> \u2014 Water from oceans, lakes, and rivers turns into vapor</li><li><strong>Condensation</strong> \u2014 Water vapor cools and forms clouds</li><li><strong>Precipitation</strong> \u2014 Water falls as rain, snow, or hail</li><li><strong>Collection</strong> \u2014 Water collects in rivers, lakes, and oceans</li><li><strong>Infiltration</strong> \u2014 Water seeps into the ground, becoming groundwater</li></ul><h3>Importance</h3><p>The water cycle is essential for sustaining life on Earth. It distributes freshwater across the planet, supports agriculture, and maintains ecosystems.</p>'
    },
    'Periodic Table': {
        category: 'Chemistry', extract: 'A tabular arrangement of chemical elements ordered by atomic number.',
        body: '<h3>Overview</h3><p>The periodic table is a tabular display of the chemical elements organized by atomic number, electron configuration, and recurring chemical properties. Elements in the same column (group) share similar chemical behaviors.</p><h3>Organization</h3><ul><li><strong>Periods</strong> (rows): 7 periods, each representing an energy level</li><li><strong>Groups</strong> (columns): 18 groups of elements with similar properties</li><li><strong>Metals</strong>: Left side (sodium, iron, gold)</li><li><strong>Non-metals</strong>: Right side (oxygen, nitrogen, carbon)</li><li><strong>Metalloids</strong>: Along the staircase line (silicon, boron)</li></ul><h3>Key Elements</h3><p>Hydrogen (H, 1) is the lightest. Carbon (C, 6) is the basis of organic chemistry. Iron (Fe, 26) is the most common element on Earth by mass. Oxygen (O, 8) makes up 21% of the atmosphere.</p>'
    },
    'Computer Programming': {
        category: 'Technology', extract: 'The process of designing and building executable computer programs.',
        body: '<h3>Overview</h3><p>Computer programming is the process of designing, writing, testing, and maintaining source code of computer programs. Programs are written in programming languages that computers can understand and execute.</p><h3>Popular Languages</h3><ul><li><strong>Python</strong> \u2014 Easy to learn, great for beginners and data science</li><li><strong>JavaScript</strong> \u2014 Powers the web, runs in browsers</li><li><strong>Java</strong> \u2014 Enterprise applications, Android development</li><li><strong>C/C++</strong> \u2014 System programming, game engines</li></ul><h3>Core Concepts</h3><ul><li><strong>Variables</strong> \u2014 Store data (numbers, text, lists)</li><li><strong>Loops</strong> \u2014 Repeat actions (for, while)</li><li><strong>Conditionals</strong> \u2014 Make decisions (if/else)</li><li><strong>Functions</strong> \u2014 Reusable blocks of code</li></ul><h3>Getting Started</h3><p>Start with Python. Write your first program: <code>print("Hello, Knowledge Tree!")</code></p>'
    },
    'Human Digestive System': {
        category: 'Biology', extract: 'The organ system that processes food for energy and nutrients.',
        body: '<h3>Overview</h3><p>The human digestive system is a complex series of organs and glands that processes food. It converts food into nutrients that the body uses for energy, growth, and cell repair.</p><h3>The Digestive Process</h3><ul><li><strong>Mouth</strong> \u2014 Mechanical digestion (chewing) and chemical digestion (saliva/amylase)</li><li><strong>Esophagus</strong> \u2014 Moves food to stomach via peristalsis</li><li><strong>Stomach</strong> \u2014 Acid and enzymes break down proteins (pH 1.5-3.5)</li><li><strong>Small intestine</strong> \u2014 Main site of nutrient absorption (6m long)</li><li><strong>Large intestine</strong> \u2014 Water absorption, forms feces</li></ul><h3>Key Enzymes</h3><p>Amylase breaks down starch. Pepsin breaks down proteins. Lipase breaks down fats. Bile (from the liver) emulsifies fats for easier digestion.</p>'
    },
    'Ohms Law': {
        category: 'Physics', extract: 'The relationship between voltage, current, and resistance in a circuit.',
        body: '<h3>Overview</h3><p>Ohm\'s Law states that the current through a conductor between two points is directly proportional to the voltage across the two points, and inversely proportional to the resistance.</p><h3>Formula</h3><p><code>V = I \u00d7 R</code></p><p>Where V = Voltage (Volts), I = Current (Amperes), R = Resistance (Ohms)</p><h3>Worked Examples</h3><p><strong>Example 1:</strong> If R = 10\u03a9 and I = 2A, then V = 2 \u00d7 10 = 20V</p><p><strong>Example 2:</strong> If V = 12V and R = 4\u03a9, then I = 12/4 = 3A</p><h3>Application to Solar Systems</h3><p>The Knowledge Tree uses a 24V battery system. With a total load of 200W: I = P/V = 200/24 = 8.33A. Wire gauge must handle this current safely.</p>'
    },
    'African History': {
        category: 'History', extract: 'The history of the African continent from earliest human origins to present.',
        body: '<h3>Overview</h3><p>Africa is the cradle of humanity. The earliest known human ancestors (hominids) originated in East Africa, with fossils dating back over 7 million years.</p><h3>Pre-Colonial Kingdoms</h3><ul><li><strong>Kingdom of Buganda</strong> \u2014 Powerful state in present-day Uganda (14th century onwards)</li><li><strong>Kingdom of Bunyoro</strong> \u2014 One of East Africa\'s most powerful kingdoms</li><li><strong>Empire of Mali</strong> \u2014 West African empire famous for Mansa Musa\'s wealth</li><li><strong>Kingdom of Aksum</strong> \u2014 Ethiopian trading empire (1st-7th century)</li></ul><h3>Colonial Period</h3><p>European colonization of Africa accelerated after the 1884-85 Berlin Conference. Uganda became a British protectorate in 1894 and gained independence on October 9, 1962.</p><h3>Independence Era</h3><p>Most African nations gained independence in the 1950s-1960s. Uganda\'s first leader was Milton Obote, and the country has been led by President Yoweri Museveni since 1986.</p>'
    },
    'Quadratic Equations': {
        category: 'Mathematics', extract: 'Polynomial equations of degree two with the form ax\u00b2 + bx + c = 0.',
        body: '<h3>Overview</h3><p>A quadratic equation is any equation that can be written in the form ax\u00b2 + bx + c = 0, where a \u2260 0. The graph of a quadratic is a parabola.</p><h3>Solving Methods</h3><p><strong>1. Factoring:</strong> x\u00b2 + 5x + 6 = 0 \u2192 (x+2)(x+3) = 0 \u2192 x = -2 or x = -3</p><p><strong>2. Quadratic Formula:</strong></p><p><code>x = (-b \u00b1 \u221a(b\u00b2 - 4ac)) / 2a</code></p><p><strong>3. Completing the square:</strong> Rewrite to (x + p)\u00b2 = q form</p><h3>The Discriminant</h3><p>D = b\u00b2 - 4ac determines the nature of roots:</p><ul><li>D > 0: Two distinct real roots</li><li>D = 0: One repeated real root</li><li>D < 0: No real roots (complex numbers)</li></ul>'
    },
    'Climate Change': {
        category: 'Science', extract: 'Long-term shifts in global temperatures and weather patterns.',
        body: '<h3>Overview</h3><p>Climate change refers to long-term shifts in global temperatures and weather patterns. While natural forces have caused climate changes throughout Earth\'s history, human activities have been the main driver since the 1800s, primarily through burning fossil fuels.</p><h3>Causes</h3><ul><li>Burning fossil fuels (coal, oil, gas) releases CO\u2082</li><li>Deforestation reduces carbon absorption</li><li>Agriculture produces methane and nitrous oxide</li><li>Industrial processes release greenhouse gases</li></ul><h3>Effects on Uganda</h3><p>Uganda is experiencing changing rainfall patterns, prolonged droughts, and more frequent flooding. Lake Victoria water levels fluctuate unpredictably, affecting fishing communities.</p><h3>Solutions</h3><ul><li>Solar energy adoption (like Knowledge Trees)</li><li>Reforestation and agroforestry</li><li>Energy-efficient technologies</li><li>Education and awareness</li></ul>'
    },
    'Algebra': {
        category: 'Mathematics', extract: 'A branch of mathematics using symbols and letters to represent numbers.',
        body: '<h3>Overview</h3><p>Algebra is the branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations. It is one of the broad areas of mathematics and a foundation for advanced study.</p><h3>Core Concepts</h3><ul><li><strong>Variables</strong>: Letters (x, y, z) that represent unknown values</li><li><strong>Expressions</strong>: Combinations of numbers and variables (3x + 5)</li><li><strong>Equations</strong>: Statements that two expressions are equal (3x + 5 = 14)</li><li><strong>Inequalities</strong>: Comparisons using < > \u2264 \u2265</li></ul><h3>Solving Linear Equations</h3><p>To solve 3x + 5 = 14:</p><p>Step 1: Subtract 5 from both sides: 3x = 9</p><p>Step 2: Divide both sides by 3: x = 3</p><h3>Simultaneous Equations</h3><p>When two equations share variables: solve by substitution or elimination method.</p>'
    },
};
const wikiCategories = ['All','Science','Mathematics','Physics','Chemistry','Biology','Technology','Geography','History'];
let wikiCatFilter = 'All';

function openWiki() {
    document.getElementById('wikiOverlay').classList.add('on');
    renderWikiCats();
    renderWikiHome();
}
function closeWiki() { document.getElementById('wikiOverlay').classList.remove('on'); }

function renderWikiCats() {
    document.getElementById('wikiCats').innerHTML = wikiCategories.map(c =>
        '<button class="pill ' + (c === wikiCatFilter ? 'on' : '') + '" onclick="setWikiCat(this,\'' + c + '\')">' + c + '</button>'
    ).join('');
}
function setWikiCat(el, cat) {
    wikiCatFilter = cat;
    document.querySelectorAll('#wikiCats .pill').forEach(p => p.classList.remove('on'));
    el.classList.add('on');
    renderWikiHome();
}

function renderWikiHome() {
    const body = document.getElementById('wikiBody');
    const entries = Object.entries(wikiArticles);
    const filtered = wikiCatFilter === 'All' ? entries : entries.filter(([k, v]) => v.category === wikiCatFilter);
    body.innerHTML = filtered.map(([title, a]) => {
        const bg = { Science:'var(--c-green-soft)', Mathematics:'var(--c-primary-soft)', Physics:'var(--c-blue-soft)',
            Chemistry:'var(--c-red-soft)', Biology:'var(--c-green-soft)', Technology:'var(--c-blue-soft)',
            Geography:'var(--c-amber-soft)', History:'var(--c-primary-soft)' }[a.category] || 'var(--c-card)';
        return '<div class="wiki-topic" onclick="viewWikiArticle(\'' + title.replace(/'/g, "\\'") + '\')"><div class="wiki-topic-icon" style="background:' + bg + '"><svg style="width:14px;height:14px;stroke:var(--c-text-3);fill:none;stroke-width:2"><use href="#i-wiki"/></svg></div><div class="wiki-topic-body"><div class="wiki-topic-title">' + title + '</div><div class="wiki-topic-excerpt">' + a.extract + '</div></div><svg style="width:12px;height:12px;stroke:var(--c-text-5);fill:none;stroke-width:2"><use href="#i-chevron"/></svg></div>';
    }).join('') || '<p style="padding:20px;text-align:center;font-size:12px;color:var(--c-text-4)">No articles in this category.</p>';
}

function viewWikiArticle(title) {
    const a = wikiArticles[title]; if (!a) return;
    const body = document.getElementById('wikiBody');
    body.innerHTML = '<div class="wiki-article"><div class="wiki-article-title">' + title + '</div><div class="wiki-article-meta">' + a.category + ' &mdash; Available offline &mdash; Last synced at Nansana Knowledge Tree</div><div class="wiki-article-body">' + a.body + '</div></div>' +
        '<button class="btn btn-s btn-w" onclick="renderWikiHome()"><svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2"><use href="#i-arrow-left"/></svg> Back to articles</button>';
    body.scrollTop = 0;
}

function searchWiki() {
    const q = document.getElementById('wikiSearchInput').value.trim().toLowerCase();
    if (!q) { renderWikiHome(); return; }
    const body = document.getElementById('wikiBody');
    const results = Object.entries(wikiArticles).filter(([title, a]) =>
        title.toLowerCase().includes(q) || a.extract.toLowerCase().includes(q) || a.body.toLowerCase().includes(q)
    );
    body.innerHTML = '<div style="font-size:11px;color:var(--c-text-4);margin-bottom:10px">' + results.length + ' result' + (results.length !== 1 ? 's' : '') + ' for "' + q + '"</div>' +
        (results.length ? results.map(([title, a]) =>
            '<div class="wiki-topic" onclick="viewWikiArticle(\'' + title.replace(/'/g, "\\'") + '\')"><div class="wiki-topic-icon" style="background:var(--c-card)"><svg style="width:14px;height:14px;stroke:var(--c-text-3);fill:none;stroke-width:2"><use href="#i-wiki"/></svg></div><div class="wiki-topic-body"><div class="wiki-topic-title">' + title + '</div><div class="wiki-topic-excerpt">' + a.extract + '</div></div><svg style="width:12px;height:12px;stroke:var(--c-text-5);fill:none;stroke-width:2"><use href="#i-chevron"/></svg></div>'
        ).join('') : '<p style="padding:20px;text-align:center;font-size:12px;color:var(--c-text-4)">No articles found. This content may be available at a Knowledge Tree node.</p>');
}


/* ══════════════════════════════════════════
   DICTIONARY
   ══════════════════════════════════════════ */
const dictDB = {
    'ubiquitous': { phonetic:'/ju\u02D0\u02C8b\u026Ak.w\u026A.t\u0259s/', pos:'adjective', defs:['Present, appearing, or found everywhere.'], examples:['"Computing is ubiquitous in modern life."'], synonyms:['omnipresent','pervasive','universal'] },
    'algorithm': { phonetic:'/\u02C8\u00E6l.\u0261\u0259.\u0279\u026A.\u00F0\u0259m/', pos:'noun', defs:['A process or set of rules to be followed in calculations or problem-solving, especially by a computer.','A step-by-step procedure for solving a mathematical problem.'], examples:['"The sorting algorithm arranged the data in ascending order."'], synonyms:['procedure','formula','method'] },
    'photosynthesis': { phonetic:'/\u02CCfo\u028A.to\u028A\u02C8s\u026An.\u03B8\u0259.s\u026As/', pos:'noun', defs:['The process by which green plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of sugar.'], examples:['"Through photosynthesis, plants convert carbon dioxide into oxygen."'], synonyms:['carbon fixation'] },
    'entrepreneur': { phonetic:'/\u02CC\u0252n.tr\u0259.pr\u0259\u02C8n\u025C\u02D0r/', pos:'noun', defs:['A person who organizes and operates a business, taking on greater than normal financial risks to do so.','An innovator who creates new ventures, products, or services.'], examples:['"She became a successful entrepreneur by starting a mobile money business in Nansana."'], synonyms:['businessperson','innovator','founder'] },
    'resilience': { phonetic:'/r\u026A\u02C8z\u026Al.i.\u0259ns/', pos:'noun', defs:['The capacity to recover quickly from difficulties; toughness.','The ability of a substance or object to spring back into shape.'], examples:['"The community showed great resilience after the floods."'], synonyms:['toughness','adaptability','strength'] },
    'sustainable': { phonetic:'/s\u0259\u02C8ste\u026A.n\u0259.bl/', pos:'adjective', defs:['Able to be maintained at a certain rate or level.','Conserving an ecological balance by avoiding depletion of natural resources.'], examples:['"Solar energy is a sustainable alternative to fossil fuels."'], synonyms:['viable','renewable','long-term'] },
    'curriculum': { phonetic:'/k\u0259\u02C8r\u026Ak.j\u0259.l\u0259m/', pos:'noun', defs:['The subjects comprising a course of study in a school or college.','The range of topics taught and skills expected to be mastered.'], examples:['"The Uganda National Curriculum covers Primary 1 through Secondary 6."'], synonyms:['syllabus','program','coursework'] },
    'democracy': { phonetic:'/d\u026A\u02C8m\u0252k.r\u0259.si/', pos:'noun', defs:['A system of government by the whole population, typically through elected representatives.','Control of an organization by the majority of its members.'], examples:['"Uganda has been a multi-party democracy since 2005."'], synonyms:['self-government','republic','representative government'] },
    'hypothesis': { phonetic:'/ha\u026A\u02C8p\u0252\u03B8.\u0259.s\u026As/', pos:'noun', defs:['A proposed explanation made on the basis of limited evidence as a starting point for further investigation.','An assumption or theory that is put forward for testing.'], examples:['"The scientist formed a hypothesis about why the plants grew faster in sunlight."'], synonyms:['theory','proposition','assumption'] },
    'biodiversity': { phonetic:'/\u02CCba\u026A.\u0259\u028A.da\u026A\u02C8v\u025C\u02D0.s\u0259.ti/', pos:'noun', defs:['The variety of plant and animal life in a particular habitat or in the world as a whole.'], examples:['"Uganda has remarkable biodiversity, with over 1,000 bird species."'], synonyms:['variety of life','ecological diversity'] },
    'infrastructure': { phonetic:'/\u02C8\u026An.fr\u0259.str\u028Ck.t\u0283\u0259r/', pos:'noun', defs:['The basic physical systems of a country or region, including roads, utilities, water, and communications.'], examples:['"Improving rural infrastructure is key to development in Wakiso District."'], synonyms:['framework','foundation','systems'] },
    'velocity': { phonetic:'/v\u0259\u02C8l\u0252s.\u0259.ti/', pos:'noun', defs:['The speed of something in a given direction.','The rate of change of an object\'s position with respect to time and direction.'], examples:['"The velocity of the car was 60 km/h heading north."'], synonyms:['speed','rapidity','pace'] },
    'equation': { phonetic:'/\u026A\u02C8kwe\u026A.\u0292\u0259n/', pos:'noun', defs:['A statement that the values of two mathematical expressions are equal (indicated by the sign =).'], examples:['"The equation 2x + 3 = 7 can be solved to find x = 2."'], synonyms:['formula','expression','identity'] },
    'ecosystem': { phonetic:'/\u02C8i\u02D0.k\u0259\u028A\u02CCs\u026As.t\u0259m/', pos:'noun', defs:['A biological community of interacting organisms and their physical environment.'], examples:['"The wetlands form a delicate ecosystem that supports many species."'], synonyms:['biome','environment','habitat'] },
    'innovation': { phonetic:'/\u02CC\u026An.\u0259\u02C8ve\u026A.\u0283\u0259n/', pos:'noun', defs:['The introduction of something new; a new method, idea, or product.','The process of making changes in something established.'], examples:['"The Knowledge Trees project is an innovation in rural education delivery."'], synonyms:['invention','breakthrough','novelty'] },
    'equilibrium': { phonetic:'/\u02CC\u025B.kw\u026A\u02C8l\u026Ab.r\u026A.\u0259m/', pos:'noun', defs:['A state in which opposing forces or influences are balanced.','The condition of a system where all competing influences are balanced.'], examples:['"In chemistry, equilibrium is reached when the rates of forward and reverse reactions are equal."'], synonyms:['balance','stability','symmetry'] },
};
let dictRecent = ['ubiquitous','algorithm','resilience'];
const dictWOTD = { word:'ubiquitous', def:'Present, appearing, or found everywhere.' };

function openDict() {
    document.getElementById('dictOverlay').classList.add('on');
    renderDictHome();
}
function closeDict() { document.getElementById('dictOverlay').classList.remove('on'); }

function renderDictHome() {
    const body = document.getElementById('dictBody');
    body.innerHTML = '<div class="dict-wotd" onclick="lookupDict(\'ubiquitous\')"><div class="dict-wotd-label">Word of the Day</div><div class="dict-wotd-word">' + dictWOTD.word + '</div><div class="dict-wotd-def">' + dictWOTD.def + '</div></div>' +
        '<div class="sec" style="margin-top:0"><span class="lbl">Recent Lookups</span></div>' +
        '<div class="dict-recent">' + dictRecent.map(w => '<span class="dict-recent-word" onclick="lookupDict(\'' + w + '\')">' + w + '</span>').join('') + '</div>' +
        '<div class="sec"><span class="lbl">Browse All (' + Object.keys(dictDB).length + ' words)</span></div>' +
        Object.keys(dictDB).sort().map(w => '<div class="dict-recent-word" style="display:inline-flex;margin:0 4px 4px 0" onclick="lookupDict(\'' + w + '\')">' + w + '</div>').join('');
}

function lookupDict(word) {
    const entry = dictDB[word.toLowerCase()]; if (!entry) { toast('info', 'Not Found', '"' + word + '" not in offline dictionary. Sync at a Knowledge Tree.'); return; }
    if (!dictRecent.includes(word)) { dictRecent.unshift(word); if (dictRecent.length > 8) dictRecent.pop(); }
    const body = document.getElementById('dictBody');
    body.innerHTML = '<div class="dict-entry"><div class="dict-word">' + word + '</div><div class="dict-phonetic">' + entry.phonetic + '</div>' +
        '<div class="dict-pos">' + entry.pos + '</div>' +
        entry.defs.map((d, i) => '<div class="dict-def">' + (i + 1) + '. ' + d + '</div>').join('') +
        (entry.examples ? entry.examples.map(e => '<div class="dict-example">' + e + '</div>').join('') : '') +
        (entry.synonyms ? '<div class="dict-syn">Synonyms: ' + entry.synonyms.map(s => '<span onclick="lookupDict(\'' + s + '\')">' + s + '</span>').join(', ') + '</div>' : '') +
        '</div><button class="btn btn-s btn-w" onclick="renderDictHome()"><svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2"><use href="#i-arrow-left"/></svg> Back</button>';
    body.scrollTop = 0;
    document.getElementById('dictSearchInput').value = '';
}

function searchDict() {
    const q = document.getElementById('dictSearchInput').value.trim().toLowerCase();
    if (!q) { renderDictHome(); return; }
    if (dictDB[q]) { lookupDict(q); return; }
    const partial = Object.keys(dictDB).filter(w => w.includes(q));
    if (partial.length) {
        const body = document.getElementById('dictBody');
        body.innerHTML = '<div style="font-size:11px;color:var(--c-text-4);margin-bottom:10px">' + partial.length + ' match' + (partial.length !== 1 ? 'es' : '') + '</div>' +
            partial.map(w => '<div class="dict-recent-word" style="display:inline-flex;margin:0 4px 4px 0" onclick="lookupDict(\'' + w + '\')">' + w + '</div>').join('');
    } else {
        toast('info', 'Not Found', '"' + q + '" not in offline dictionary.');
    }
}


/* ══════════════════════════════════════════
   GOVERNMENT FORMS
   ══════════════════════════════════════════ */
const govForms = {
    'Identity & Registration': [
        { name:'National Identity Card (NIN)', desc:'Apply for or replace your National ID.', tag:'Essential', tagStyle:'background:var(--c-green-soft);color:var(--c-green)', icon:'i-user',
            detail: {
                description: 'The National Identification Number (NIN) is issued by the National Identification and Registration Authority (NIRA). Every Ugandan citizen aged 16 and above must register.',
                requirements: ['Birth certificate or baptism card', 'Introduction letter from LC1 chairperson', 'Two passport-size photos', 'Parent/guardian NIN (for first-time applicants under 18)'],
                steps: [
                    { title:'Get an LC1 introduction letter', desc:'Visit your Local Council 1 chairperson to get an introduction letter confirming your residence.' },
                    { title:'Visit the nearest NIRA office', desc:'Go to the nearest NIRA enrollment centre. For Nansana residents, the nearest is at Wakiso District headquarters.' },
                    { title:'Submit documents', desc:'Bring your birth certificate, LC1 letter, and two passport photos. Officials will verify your documents.' },
                    { title:'Biometric capture', desc:'Your fingerprints, photograph, and signature will be captured digitally.' },
                    { title:'Collect your NIN slip', desc:'You will receive a NIN acknowledgment slip. Your physical ID card will be sent for printing and collection later.' },
                ],
                fee: 'Free (first-time registration)',
                time: '2-4 weeks for card delivery'
            }
        },
        { name:'Birth Certificate', desc:'Register a birth or request a copy.', tag:'Essential', tagStyle:'background:var(--c-green-soft);color:var(--c-green)', icon:'i-user',
            detail: {
                description: 'Birth registration is mandatory in Uganda under the Registration of Persons Act. All births must be registered within 3 months of occurrence.',
                requirements: ['Parents\' NINs', 'Hospital notification of birth (if born in hospital)', 'LC1 letter (if born at home)', 'Mother\'s antenatal card'],
                steps: [
                    { title:'Obtain hospital birth notification', desc:'If the child was born in a hospital, get the birth notification form from the hospital.' },
                    { title:'Visit the sub-county NIRA office', desc:'Go to the nearest NIRA registration point with all required documents.' },
                    { title:'Fill Form 1A', desc:'Complete the Birth Registration Form (Form 1A) with the child\'s details and parents\' information.' },
                    { title:'Submit and receive reference', desc:'Submit the form and receive a registration reference number. The certificate takes 2-3 weeks.' },
                ],
                fee: 'Free (within 3 months of birth), UGX 10,000 (late registration)',
                time: '2-3 weeks'
            }
        },
    ],
    'Education': [
        { name:'UNEB PLE Registration', desc:'Register for Primary Leaving Examinations.', tag:'Education', tagStyle:'background:var(--c-blue-soft);color:var(--c-blue)', icon:'i-book',
            detail: {
                description: 'The Primary Leaving Examination (PLE) is the national exam for Primary 7 students, administered by UNEB. Registration is done through schools.',
                requirements: ['School enrollment confirmation', 'Two passport-size photos', 'Birth certificate or sworn affidavit', 'Registration fees'],
                steps: [
                    { title:'Confirm enrollment', desc:'Ensure you are enrolled in a registered primary school recognized by the Ministry of Education.' },
                    { title:'Provide documents to school', desc:'Submit your birth certificate and passport photos to the school head teacher.' },
                    { title:'School registers online', desc:'The school registers all P7 candidates through the UNEB online portal.' },
                    { title:'Verify your entry', desc:'Check that your name, school, and index number are correctly entered.' },
                ],
                fee: 'UGX 26,000 per candidate (2024 rates)',
                time: 'Registration period: February-April'
            }
        },
        { name:'UCE/UACE Results Verification', desc:'Verify or request copies of exam results.', tag:'Education', tagStyle:'background:var(--c-blue-soft);color:var(--c-blue)', icon:'i-award',
            detail: {
                description: 'UNEB provides verification and certified copies of examination results for UCE (O-Level) and UACE (A-Level) examinations.',
                requirements: ['Original or copy of result slip', 'National ID', 'Application letter', 'Payment receipt'],
                steps: [
                    { title:'Write an application letter', desc:'Address it to the Executive Secretary of UNEB requesting verification of your results.' },
                    { title:'Pay the verification fee', desc:'Pay UGX 50,000 at any UNEB-approved bank or mobile money.' },
                    { title:'Submit at UNEB offices', desc:'Submit the application, payment receipt, and copies of your result slip at UNEB offices in Ntinda, Kampala.' },
                    { title:'Collect verified results', desc:'Collect within 7-14 working days. Can also be mailed to your institution.' },
                ],
                fee: 'UGX 50,000',
                time: '7-14 working days'
            }
        },
    ],
    'Business & Employment': [
        { name:'Business Registration', desc:'Register a sole proprietorship or company.', tag:'Business', tagStyle:'background:var(--c-amber-soft);color:var(--c-amber)', icon:'i-briefcase',
            detail: {
                description: 'Business registration in Uganda is handled by the Uganda Registration Services Bureau (URSB). All businesses must be registered to operate legally.',
                requirements: ['National ID of owner(s)', 'Proposed business name (3 options)', 'Physical business address', 'TIN (Tax Identification Number)'],
                steps: [
                    { title:'Name search', desc:'Search for name availability on the URSB Online Business Registration System (OBRS) or visit their offices. Cost: UGX 25,000.' },
                    { title:'Reserve the business name', desc:'Once available, reserve the name for 30 days. This gives you time to complete registration.' },
                    { title:'Complete registration forms', desc:'Fill in Form 1 (for sole proprietorship) or Form 7 (for company) with all required details.' },
                    { title:'Pay registration fees', desc:'Pay the registration fee at the bank. Sole proprietorship: UGX 50,000. Company: UGX 100,000.' },
                    { title:'Receive certificate', desc:'Collect your Certificate of Registration and commence business operations legally.' },
                ],
                fee: 'UGX 50,000 (sole proprietorship) / UGX 100,000 (company)',
                time: '3-5 working days'
            }
        },
        { name:'TIN Registration', desc:'Get a Tax Identification Number from URA.', tag:'Tax', tagStyle:'background:var(--c-amber-soft);color:var(--c-amber)', icon:'i-settings',
            detail: {
                description: 'A Tax Identification Number (TIN) is required for all tax-related transactions in Uganda. It is issued by the Uganda Revenue Authority (URA).',
                requirements: ['National ID', 'Business registration certificate (if business)', 'Passport-size photo', 'Physical address'],
                steps: [
                    { title:'Visit URA web portal', desc:'Go to ura.go.ug and click on "TIN Registration" or visit any URA office.' },
                    { title:'Fill the registration form', desc:'Provide personal details, address, and type of taxpayer (individual or non-individual).' },
                    { title:'Submit documents', desc:'Upload or submit copies of your National ID and any supporting documents.' },
                    { title:'Receive your TIN', desc:'Your TIN is generated immediately online, or within 1-2 days if registered in person.' },
                ],
                fee: 'Free',
                time: 'Same day (online)'
            }
        },
    ],
    'Land & Property': [
        { name:'Land Title Search', desc:'Verify ownership and check land title status.', tag:'Land', tagStyle:'background:var(--c-primary-soft);color:var(--c-primary)', icon:'i-map-pin',
            detail: {
                description: 'A land title search confirms the registered owner of a piece of land and reveals any encumbrances (mortgages, caveats). Done through the Ministry of Lands.',
                requirements: ['Plot number or land reference', 'Search fee receipt', 'Application form'],
                steps: [
                    { title:'Obtain plot details', desc:'Get the plot number, block number, and area/district from the current documents or LC1 chairperson.' },
                    { title:'Pay the search fee', desc:'Pay UGX 10,000 at the Ministry of Lands cashier or designated bank.' },
                    { title:'Submit search form', desc:'Fill and submit the Official Search Form at the Lands Registry in Kampala.' },
                    { title:'Receive search results', desc:'Results show the registered owner, size, tenure type, and any encumbrances or caveats.' },
                ],
                fee: 'UGX 10,000',
                time: '1-3 working days'
            }
        },
    ],
    'Health': [
        { name:'Immunization Card', desc:'Child immunization schedule and records.', tag:'Health', tagStyle:'background:var(--c-green-soft);color:var(--c-green)', icon:'i-check',
            detail: {
                description: 'The child immunization program provides free vaccinations for children from birth to 5 years at all government health facilities.',
                requirements: ['Child\'s birth notification or certificate', 'Mother\'s antenatal card', 'Previous immunization card (if any)'],
                steps: [
                    { title:'Visit nearest health centre', desc:'Go to the nearest government health centre (HC II, III, or IV) on immunization days (usually Thursday).' },
                    { title:'Register the child', desc:'Register the child\'s details including date of birth, name, and mother\'s name.' },
                    { title:'Receive immunizations', desc:'The health worker will administer the appropriate vaccines based on the child\'s age.' },
                    { title:'Keep the card safe', desc:'The immunization card records all vaccines given. Bring it to every visit. Schools require it for enrollment.' },
                ],
                fee: 'Free',
                time: 'Same day. Follow the schedule on the card for subsequent visits.'
            }
        },
    ],
};
let selectedGovForm = null;

function openGov() {
    document.getElementById('govOverlay').classList.add('on');
    renderGovForms();
}
function closeGov() { document.getElementById('govOverlay').classList.remove('on'); selectedGovForm = null; }

function filterGovForms() {
    const q = document.getElementById('govSearchInput').value.trim().toLowerCase();
    renderGovForms(q);
}

function renderGovForms(searchQ) {
    const el = document.getElementById('govContent');
    if (selectedGovForm) { renderGovDetail(); return; }
    let html = '';
    Object.entries(govForms).forEach(([cat, forms]) => {
        let filtered = forms;
        if (searchQ) filtered = forms.filter(f => f.name.toLowerCase().includes(searchQ) || f.desc.toLowerCase().includes(searchQ));
        if (filtered.length === 0) return;
        html += '<div class="gov-category"><div class="gov-category-label">' + cat + '</div>';
        html += filtered.map((f, i) => {
            const key = cat + '::' + i;
            return '<div class="gov-form" onclick="openGovDetail(\'' + key.replace(/'/g, "\\'") + '\')"><div class="gov-form-icon" style="background:var(--c-card-up)"><svg style="width:16px;height:16px;stroke:var(--c-text-3);fill:none;stroke-width:2"><use href="#' + f.icon + '"/></svg></div><div class="gov-form-body"><div class="gov-form-name">' + f.name + '</div><div class="gov-form-desc">' + f.desc + '</div></div><span class="gov-form-tag" style="' + f.tagStyle + '">' + f.tag + '</span></div>';
        }).join('');
        html += '</div>';
    });
    el.innerHTML = html || '<p style="padding:20px;text-align:center;font-size:12px;color:var(--c-text-4)">No forms match your search.</p>';
}

function openGovDetail(key) {
    const [cat, idx] = key.split('::');
    const form = govForms[cat][parseInt(idx)];
    if (!form || !form.detail) return;
    selectedGovForm = form;
    renderGovDetail();
}

function renderGovDetail() {
    const f = selectedGovForm; if (!f) return;
    const d = f.detail;
    const el = document.getElementById('govContent');
    el.innerHTML = '<button class="btn btn-s btn-w" style="margin-bottom:12px" onclick="selectedGovForm=null;renderGovForms()"><svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2"><use href="#i-arrow-left"/></svg> All Forms</button>' +
        '<div class="gov-form-detail"><div class="gov-form-detail-title">' + f.name + '</div><div class="gov-form-detail-desc">' + d.description + '</div>' +
        '<div class="gov-category-label" style="margin-bottom:6px">Requirements</div>' +
        d.requirements.map(r => '<div class="gov-req"><div class="gov-req-check" onclick="this.classList.toggle(\'done\')"><svg style="width:10px;height:10px;stroke:white;fill:none;stroke-width:3;display:none"><use href="#i-check"/></svg></div>' + r + '</div>').join('') +
        '<div class="gov-category-label" style="margin:14px 0 8px">Step-by-step Process</div>' +
        d.steps.map((s, i) => '<div class="gov-step"><div class="gov-step-num">' + (i + 1) + '</div><div class="gov-step-body"><div class="gov-step-title">' + s.title + '</div><div class="gov-step-desc">' + s.desc + '</div></div></div>').join('') +
        '<div style="display:flex;gap:8px;margin-top:14px"><div style="flex:1;padding:10px;background:var(--c-bg);border:1px solid var(--c-border);border-radius:var(--r-sm);text-align:center"><div style="font-family:var(--mono);font-size:12px;font-weight:700;color:var(--c-primary)">' + d.fee + '</div><div style="font-size:8px;color:var(--c-text-5);text-transform:uppercase;margin-top:2px">Fee</div></div><div style="flex:1;padding:10px;background:var(--c-bg);border:1px solid var(--c-border);border-radius:var(--r-sm);text-align:center"><div style="font-family:var(--mono);font-size:12px;font-weight:700;color:var(--c-primary)">' + d.time + '</div><div style="font-size:8px;color:var(--c-text-5);text-transform:uppercase;margin-top:2px">Processing Time</div></div></div></div>';
    document.getElementById('govBody').scrollTop = 0;
}


/* ══════════════════════════════════════════
   AI TUTOR — REAL AI INTEGRATION
   Uses free public APIs: Wikipedia API as knowledge base
   + built-in comprehensive response engine
   ══════════════════════════════════════════ */
