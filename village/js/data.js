// FunRide Bike Village 3D: Map coordinates, legend categories, every booth (ITEMS) and the guided tour stops.
// Loaded in order by main.js once fonts and logos are ready; top-level names are shared across files.
"use strict";

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- map coordinates: 1 world unit = 10 map pixels ---------- */
const S = 10, X = px => (px - 690) / S, Z = py => (py - 540) / S;
const V3 = THREE.Vector3;
const col = h => new THREE.Color(h).convertSRGBToLinear();

/* ---------- legend categories (from the site map legend) ---------- */
const CATS = {
  stage:{name:'Stage & Tech',bg:'#1d1ea6',fg:'#ffffff'},
  sponsor:{name:'Sponsors',bg:'#ffd23d',fg:'#1b1d6e'},
  tent:{name:'Tents & Portalets',bg:'#3db2f0',fg:'#ffffff'},
  byd:{name:'BYD',bg:'#5cd6df',fg:'#132060'},
  dot:{name:'DOT Booth',bg:'#ff7a1d',fg:'#ffffff'},
  ops:{name:'Operations',bg:'#23219c',fg:'#ffffff'},
  merch:{name:'Merchants',bg:'#c3ef69',fg:'#1f3a12'},
  standby:{name:'Standby & Ramp',bg:'#1fae4a',fg:'#ffffff'},
  start:{name:'Start & Finish',bg:'#861a1d',fg:'#ffffff'},
  cardinal:{name:'Cardinal',bg:'#2f5b2c',fg:'#ffffff'},
  restricted:{name:'Restricted',bg:'#141414',fg:'#7bd23a'},
  landmark:{name:'Roads & landmarks',bg:'#ffffff',fg:'#16187a'}
};

/* ---------- every booth and marker on the map (x,y = centre in map pixels) ----------
   Scale: 10 map px = 1 m = 1 world unit, so 1 ft = 3.048 px.
   Booths with `ft:[along x, along y]` are drawn at their real size; `tent` picks the 3D model;
   `back` is the side the back siding / back panel faces (n, s, e, w). */
const FT = 3.048;
const RACK_FREE = 16;   // Bike Rack: slots 16-29 on the west side take the finishers' bikes
const ITEMS = [
  // Stage & Tech
  {id:'stage',name:'Main Stage',cat:'stage',x:497,y:580,ft:[14,24],ht:.914,vert:1,kind:'stage',tent:'stage',szLabel:'12 × 20',szPlan:'20 × 12 FT · 3 FT H',sz:'L 20 ft × W 12 ft × H 3 ft',desc:'Main stage on the west side of the floor, facing the booth area.'},
  {id:'satellite-stage',name:'Satellite Stage (KM 0)',cat:'stage',x:862,y:121,ft:[12,12],ht:.914,tent:'stage',sz:'L 12 ft × W 12 ft × H 3 ft',label:'SATELLITE\nSTAGE',desc:'Satellite stage on the KM 0 plaza beside the start, set just inside the plaza edge: off Roxas Boulevard and clear of the rider route.'},
  {id:'tech',name:'Tech',cat:'stage',x:493,y:477,ft:[10,20],tent:'open',back:'w',vert:1,desc:'Tech booth just north of the stage.'},
  // Sponsors
  {id:'smoke10',name:'Smoke10',cat:'sponsor',x:509,y:414,ft:[10,10],rot:30,tent:'open',label:'SMOKE10',desc:'Sponsor booth between the BYD tent and Tech.'},
  // branded sponsor setups (from the sample tent designs): `brand` picks the design, `disp` is the
  // photo wall + 3D letters standing 1 ft to the east of the tent (w x d in ft)
  {id:'oxecure',name:'Oxecure',cat:'sponsor',x:717.18,y:523,ft:[7.5,10],tent:'open',brand:'oxdro',mate:'dro',sz:'15 ft × 10 ft tent, shared with Dr. O',label:'OXECURE',desc:'Left half of the 15 × 10 ft tent shared with Dr. O: Oxecure backdrop, main table and 4 covered chairs, with the cocktail table in the middle.'},
  {id:'dro',name:'Dr. O',cat:'sponsor',x:740.04,y:523,ft:[7.5,10],tent:'open',brand:'oxdro',shared:1,disp:{w:6.7,d:4},sz:'15 ft × 10 ft tent, shared with Oxecure · 8 × 4 ft photo wall',label:'DR. O',desc:'Right half of the tent shared with Oxecure: Dr. O backdrop, main table and 4 covered chairs. Beside the tent: an 8 × 4 ft Dr. O photo wall with 3D letters D (2 ft), r (1.5 ft) and O (3 ft).'},
  {id:'neutrak',name:'Neutra K',cat:'sponsor',x:832,y:477,ft:[10,10],tent:'open',label:'NEUTRA K',desc:'Sponsor booth in the northeast queue block.'},
  {id:'wertph',name:'Wert PH',cat:'sponsor',x:832,y:524,ft:[10,10],tent:'open',label:'WERT PH',desc:'Sponsor booth below Neutra K.'},
  {id:'bdo',name:'BDO',cat:'sponsor',x:707.24,y:640,ft:[10,10],tent:'open',brand:'bdo',disp:{w:6.5,d:4},sz:'10 ft × 10 ft tent · 8 × 4 ft photo wall',label:'BDO',desc:'BDO branded tent in the middle block: 8 × 8 ft backdrop, main table, cocktail table, 5 covered chairs and a monitor. Beside it: an 8 × 4 ft photo wall with 3D BDO letters (3 × 2 ft each).'},
  {id:'specialign',name:'Specialign',cat:'sponsor',x:763.24,y:640,ft:[10,10],tent:'open',brand:'specialign',disp:{w:4,d:4},sz:'10 ft × 10 ft tent · 8 × 4 ft photo wall',label:'SPECIALIGN',desc:'Specialign branded tent beside BDO: 8 × 8 ft backdrop, main table, cocktail table, 5 covered chairs and a monitor. Beside it: an 8 × 4 ft photo wall with a 3 × 2 ft 3D letter S.'},
  {id:'fitbar',name:'Fitbar',cat:'sponsor',x:838,y:638,ft:[10,10],tent:'open',label:'FITBAR',desc:'Sponsor booth in the east block.'},
  {id:'cargoboss',name:'Cargo Boss',cat:'sponsor',x:838,y:673,ft:[10,10],tent:'open',label:'CARGO\nBOSS',desc:'Sponsor booth between Fitbar and Espace Wellness.'},
  {id:'popcycle',name:'Popcycle',cat:'sponsor',x:725,y:716,ft:[10,10],tent:'open',label:'POPCYCLE',desc:'Sponsor booth in the south block.'},
  {id:'gatorade',name:'Gatorade',cat:'sponsor',x:765,y:711.4,ft:[10,5],tent:'open',back:'e',sz:'10 ft × 10 ft, shared with Pepsi',label:'GATORADE',desc:'Shares one 10 × 10 ft open tent with Pepsi, beside Popcycle.'},
  {id:'pepsi',name:'Pepsi',cat:'sponsor',x:765,y:726.6,ft:[10,5],tent:'open',back:'e',sz:'10 ft × 10 ft, shared with Gatorade',label:'PEPSI',desc:'Shares one 10 × 10 ft open tent with Gatorade.'},
  {id:'espace',name:'Espace Wellness',cat:'sponsor',x:838,y:713,ft:[5,5],tent:'stall',label:'ESPACE\nWELLNESS',desc:'Booth stall only (no tent), below Cargo Boss.'},
  // Tents & Portalets
  {id:'byd-tent',name:'BYD Tent',cat:'tent',x:419,y:437,ft:[12,12],tent:'aircon',back:'w',label:'BYD',desc:'BYD VIP aircon tent, first in the row of tents along the west fence.'},
  {id:'dot-tent',name:'DOT Tent',cat:'tent',x:419,y:533,ft:[12,12],tent:'aircon',back:'w',label:'DOT',desc:'DOT VIP aircon tent between the BYD tent and the artists tent.'},
  {id:'artists-tent',name:'Artists & Other Sponsors Tent',cat:'tent',x:419,y:665,ft:[12,24],tent:'aircon',back:'w',vert:1,label:'ARTISTS & OTHER SPONSORS',desc:'VIP aircon tent for artists and other sponsors, linked to the Artists Entrance.'},
  {id:'vip-portalets',name:'VIP Portalets',cat:'tent',x:330,y:558,w:26,h:74,ht:2.4,vert:1,label:'VIP PORTALETS',desc:'VIP portalets outside the west fence.'},
  {id:'common-portalets-1',name:'Common Portalets (west)',cat:'tent',x:812,y:175,w:100,h:24,ht:2.4,label:'COMMON\nPORTALETS',desc:'Common portalets at the south edge of the KM 0 plaza, 1 of 2.'},
  {id:'common-portalets-2',name:'Common Portalets (east)',cat:'tent',x:922,y:175,w:100,h:24,ht:2.4,label:'COMMON\nPORTALETS',desc:'Common portalets at the south edge of the KM 0 plaza, 2 of 2.'},
  // DOT
  {id:'dot-booth',name:'DOT Booth',cat:'dot',x:618.5,y:528,ft:[20,15],tent:'open',brand:'dot',disp:{w:6.5,d:4},szLabel:'10 × 20',sz:'10 ft × 20 ft tent · 8 × 4 ft photo wall',label:'DOT\nBOOTH',desc:'Department of Tourism branded tent (10 × 20 ft) in the northwest queue block: 8 × 20 ft backdrop, main table, cocktail table, 8 covered chairs and a monitor. Beside it: an 8 × 4 ft photo wall with 3D DOT letters (3 × 2 ft each).'},
  // BYD Showroom from the BYD proposed layout, expanded to a 10 x 15 m truss tent, raised floor + turf with the Shark 6, inflatable arch in front
  {id:'byd-showroom',name:'BYD Showroom',cat:'byd',x:630,y:677,ft:[32.8,49.2],tent:'big',kind:'byd-showroom',sz:'33 ft × 49 ft (10 × 15 m) truss tent, arch included',label:'BYD SHOWROOM',desc:'BYD truss tent from the proposed layout: a raised black floor with the BYD Cafe, AC Health and Test Drive Registration counters, cafe tables and digital standees, then turf with the Shark 6 pickup and camping chairs. In front: the BYD sign, an inflatable BYD arch, inflatable tubes and six BYD flags on the truss.'},
  {id:'byd-td-reg',name:'BYD Test Drive Registration',cat:'byd',x:1086,y:888,ft:[10,10],tent:'open',topLogo:'byd',label:'BYD TEST DRIVE\nREGISTRATION',desc:'Sign up here for the BYD Test Drive. Just outside the Entrance.'},
  // test drive stays on Independence Road and stops at the South Drive corner (x 1232)
  {id:'byd-td',name:'BYD Test Drive',cat:'byd',x:1122.5,y:939,w:165,h:30,kind:'byd-td',sz:'2 tents, 16.5 × 3 m',label:'BYD TEST DRIVE',desc:'Two shallow white tents on the north half of Independence Road with the display cars parked side-on: Shark 6 DM-O, Seal and Atto 2. The south half of the road stays open as the test drive lane.'},
  {id:'byd-garage',name:'BYD Garage',cat:'byd',x:1010,y:939,w:50,h:30,kind:'byd-garage',sz:'1 tent, 5 × 3 m',label:'BYD GARAGE',desc:'Test drive check-in tent: registration table with staff. Test drive cars leave from the lane right in front of it.'},
  {id:'byd-td-lane',name:'BYD Test Drive Lane',cat:'byd',x:1108.5,y:972,w:247,h:30,kind:'td-lane',sz:'3 m wide lane',label:'TEST DRIVE',desc:'Open lane on the south half of Independence Road. Test drive cars pull out in front of the BYD Garage, drive east and turn onto South Drive, then come back the same way.'},
  {id:'artists-entrance',name:'Artists Entrance',cat:'byd',x:252,y:898,w:88,h:32,label:'ARTISTS\nENTRANCE',desc:'Separate entrance for artists, set back on the lawn just inside Independence Road, with a path up to the west fence.'},
  // Operations
  // Operations column: tents with back sidings, back panel on the barrier (west) side
  {id:'baggage',name:'Baggage Area',cat:'ops',x:890,y:495.7,ft:[10,30],tent:'back',back:'w',vert:1,label:'BAGGAGE AREA',desc:'Bag drop at the top of the operations column.'},
  {id:'reg-1',name:'Registration (north)',cat:'ops',x:890,y:564.25,ft:[10,10],tent:'back',back:'w',vert:1,label:'REGISTRATION',desc:'Registration desk 1 of 2 in the operations column.'},
  {id:'reg-2',name:'Registration (south)',cat:'ops',x:890,y:613.25,ft:[10,10],tent:'back',back:'w',vert:1,label:'REGISTRATION',desc:'Registration desk 2 of 2 in the operations column.'},
  {id:'kit',name:'Kit Claiming',cat:'ops',x:890,y:685.7,ft:[10,30],tent:'back',back:'w',vert:1,label:'KIT CLAIMING',desc:'Claim your race kit here.'},
  {id:'info',name:'Info / Lost & Found',cat:'ops',x:890,y:760.25,ft:[10,10],tent:'back',back:'w',vert:1,label:'INFO / LOST\n& FOUND',desc:'Information desk and lost and found.'},
  {id:'command',name:'Command Center',cat:'ops',x:890,y:805.25,ft:[10,10],tent:'back',back:'w',vert:1,label:'COMMAND\nCENTER',desc:'Event command post.'},
  {id:'ems',name:'EMS',cat:'ops',x:890,y:850.25,ft:[10,10],tent:'back',back:'w',label:'EMS',desc:'Emergency medical services, closest booth to the Entrance.'},
  {id:'bike-check',name:'Bike Check Station',cat:'ops',x:642,y:315,ft:[10,10],tent:'open',back:'w',label:'BIKE\nCHECK',desc:'Bike check at the southeast corner of Standby per Wave.'},
  {id:'bike-rack',name:'Bike Rack',cat:'ops',x:1019,y:625,w:66,h:325,ht:.6,vert:1,kind:'rack',label:'BIKE RACK',desc:'Long bike rack along the east fence.'},
  {id:'bikes-coffee',name:'Bikes and Coffee',cat:'ops',x:1002,y:421,ft:[10,10],tent:'open',label:'BIKES &\nCOFFEE',desc:'Bikes and Coffee in the northeast corner, beside the bike rack.'},
  {id:'myriad',name:'Myriad',cat:'ops',x:490,y:685,ft:[10,10],rot:-35,tent:'open',back:'w',label:'MYRIAD',desc:'Myriad booth beside the stage.'},
  {id:'arf',name:'ARF',cat:'ops',x:512,y:722,ft:[10,10],rot:-35,tent:'open',back:'w',label:'ARF',desc:'ARF booth beside Myriad.'},
  {id:'pw-21',name:'Photowall 21 KM',cat:'ops',x:727,y:405,w:44,h:16,kind:'wall',sz:'To follow',label:'21 KM',desc:'Photowall for 21 km finishers. Size to follow.'},
  {id:'pw-10',name:'Photowall 10 KM',cat:'ops',x:790,y:405,w:44,h:16,kind:'wall',sz:'To follow',label:'10 KM',desc:'Photowall for 10 km finishers. Size to follow.'},
  {id:'pw-5',name:'Photowall 5 KM',cat:'ops',x:866,y:405,w:44,h:16,kind:'wall',sz:'To follow',label:'5 KM',desc:'Photowall for 5 km finishers. Size to follow.'},
  // Merchants (2 named + 8 open slots)
  {id:'m-open-1',name:'Open merchant slot 1',cat:'merch',x:619,y:794,ft:[10,10],tent:'open',label:'',desc:'Open merchant slot.'},
  {id:'m-sugar',name:'Sugar High',cat:'merch',x:661,y:794,ft:[10,10],tent:'open',label:'SUGAR\nHIGH',desc:'Merchant booth in the first row.'},
  {id:'m-swiss',name:'Swiss Proli & Take Out',cat:'merch',x:703,y:794,ft:[10,10],tent:'open',label:'SWISS PROLI\n& TAKE OUT',desc:'Merchant booth in the first row.'},
  {id:'m-open-2',name:'Open merchant slot 2',cat:'merch',x:745,y:794,ft:[10,10],tent:'open',label:'',desc:'Open merchant slot.'},
  {id:'m-open-3',name:'Open merchant slot 3',cat:'merch',x:787,y:794,ft:[10,10],tent:'open',label:'',desc:'Open merchant slot.'},
  {id:'m-open-4',name:'Open merchant slot 4',cat:'merch',x:829,y:794,ft:[10,10],tent:'open',label:'',desc:'Open merchant slot.'},
  {id:'m-open-5',name:'Open merchant slot 5',cat:'merch',x:705,y:865,ft:[10,10],tent:'open',label:'',desc:'Open merchant slot.'},
  {id:'m-open-6',name:'Open merchant slot 6',cat:'merch',x:749,y:865,ft:[10,10],tent:'open',label:'',desc:'Open merchant slot.'},
  {id:'m-open-7',name:'Open merchant slot 7',cat:'merch',x:793,y:865,ft:[10,10],tent:'open',label:'',desc:'Open merchant slot.'},
  {id:'m-open-8',name:'Open merchant slot 8',cat:'merch',x:835,y:865,ft:[10,10],tent:'open',label:'',desc:'Open merchant slot.'},
  // Standby & Ramp
  {id:'standby',name:'Standby per Wave',cat:'standby',x:571,y:267,w:177,h:131,ht:.3,label:'STANDBY\nPER WAVE',desc:'Riders wait here by wave before heading to the start.'},
  {id:'ramp',name:'Ramp',cat:'standby',x:676,y:140,w:22,h:40,vert:1,kind:'ramp',label:'RAMP',desc:'Green ramp up onto the KM 0 plaza, at the top of Exit to Start.'},
  {id:'exit-to-start',name:'Exit to Start',cat:'standby',x:676,y:210,w:22,h:96,vert:1,kind:'ramp',white:1,label:'EXIT TO START',desc:'Lane from Standby per Wave north to the ramp and the start line.'},
  // Start & Finish
  {id:'start',name:'Start',cat:'start',x:895,y:65,w:20,h:66,kind:'arch',label:'START',desc:'Gun start at KM 0 on Roxas Boulevard. Waves line up two abreast in the closed south lane facing South Drive, roll through the arch, U-turn at the cones and ride west in the same lane to Katigbak Parkway.'},
  {id:'finish',name:'Finish',cat:'start',x:814,y:956,w:20,h:68,kind:'arch',label:'FINISH',desc:'Finish line on Independence Road.'},
  // crowd-control barricade between the finish bike parking and the BYD Garage / Test Drive tents (open to the village side)
  {id:'barricade-byd',name:'Barricade (Finish / BYD)',cat:'start',x:1102.5,y:956,w:245,h:64,kind:'barricade',path:[[980,924],[980,988],[1225,988]],sz:'1.1 m high crowd barriers',desc:'Metal crowd barriers that separate the finish bike parking from the BYD area and run along the south edge of the test drive lane. The east end stays open so test drive cars can turn onto South Drive.'},
  // Cardinal
  {id:'cardinal',name:'Cardinal',cat:'cardinal',x:560,y:911,w:62,h:18,ht:.9,label:'CARDINAL',desc:'Cardinal on the roadside lawn just north of Independence Road, west of the finish, so the road stays clear.'},
  // Restricted
  {id:'restricted',name:'Restricted Area',cat:'restricted',x:994,y:282,w:132,h:132,kind:'restricted',desc:'No setup in this area.'},
  // Landmarks (roads and fixed places)
  {id:'entrance',name:'Entrance',cat:'landmark',x:1008.5,y:882,w:66,h:16,kind:'gate',ends:[[985,905],[1032,859]],label:'ENTRANCE',desc:'Main entrance from Independence Road, at the southeast corner.'},
  {id:'exit',name:'Exit',cat:'landmark',x:622,y:884,w:62,h:16,kind:'gate',ends:[[599,863],[645,905]],label:'EXIT',desc:'Exit at the southwest corner, past the merchants.'},
  {id:'km0',name:'KM 0',cat:'landmark',x:612,y:120,w:46,h:14,kind:'none',desc:'Kilometer Zero, the plaza on the south side of Roxas Boulevard.'},
  {id:'grandstand',name:'Quirino Grandstand',cat:'landmark',x:795,y:1035,w:646,h:77,kind:'none',desc:'Quirino Grandstand, south of Independence Road.'},
  {id:'parking-w',name:'Parking (west)',cat:'landmark',x:192,y:1040,w:178,h:76,kind:'none',desc:'Parking lot southwest of the grandstand.'},
  {id:'parking-e',name:'Parking (east)',cat:'landmark',x:1219,y:1040,w:136,h:76,kind:'none',desc:'Parking lot southeast of the grandstand.'}
];
const TENT = {back:'Tent with back siding', open:'Open tent', stall:'Booth stall only', big:'Big booth', aircon:'Aircon tent (VIP)', stage:'Stage'};
const fmtFt = n => String(Math.round(n * 10) / 10);
ITEMS.forEach(it => {
  if (!it.ft) return;
  it.w = it.ft[0] * FT; it.h = it.ft[1] * FT;
  if (!it.sz) it.sz = `${fmtFt(it.ft[0])} ft × ${fmtFt(it.ft[1])} ft`;
});
const BY = {}; ITEMS.forEach(it => BY[it.id] = it);

/* ---------- guided tour, in rider order ---------- */
const TOUR = [
  {t:'Welcome to the Bike Village',k:'Rizal Park, Manila',d:'The village sits on the lawn between Roxas Boulevard (north) and Independence Road (south). Riders start at KM 0 and finish on Independence Road. Watch the waves roll out live while you tour.',ids:[],target:[690,540],az:.2,el:.9,dist:118},
  {t:'Entrance & BYD Test Drive',k:'Independence Road',d:'Guests walk in through the Entrance at the southeast corner. BYD Test Drive Registration is right outside the gate, and along Independence Road three white BYD tents hold the registration table, the Shark 6 and the test drive line-up: Atto 2, Seal 5 DM-i, Seal, Sealion 6 and Sealion 8.',ids:['entrance','byd-td-reg','byd-garage','byd-td'],az:.35,el:.5,dist:34},
  {t:'Operations column',k:'Operations',d:'Right inside the gate, a single column of tents with back sidings holds the services: EMS, Command Center, Info / Lost & Found and two Registration desks (10 × 10 ft each), plus Kit Claiming and the Baggage Area (10 × 30 ft each). A barricade runs along its west side, with an opening between the two Registration desks for the Registration entrance.',ids:['ems','command','info','kit','reg-2','reg-1','baggage'],az:-1.15,el:.45,dist:38},
  {t:'Bike Rack',k:'Operations',d:'The long bike rack runs along the east fence. Park here before you explore the booths.',ids:['bike-rack'],az:-.9,el:.55,dist:40},
  {t:'Bikes and Coffee & Photowall',k:'Operations',d:'Bikes and Coffee sits in the northeast corner. Along the top of the queue lanes are the three photowalls: 21 KM, 10 KM and 5 KM.',ids:['bikes-coffee','pw-21','pw-10','pw-5'],az:.15,el:.45,dist:38},
  {t:'Sponsor blocks, north',k:'Sponsors · DOT Booth',d:'The red rider-flow lanes split the floor into blocks. The north blocks hold the branded DOT tent (10 × 20 ft) and the Oxecure / Dr. O shared tent (15 × 10 ft), each with a photo wall and 3D letters beside it, plus Neutra K and Wert PH.',ids:['dot-booth','oxecure','dro','neutrak','wertph'],az:.15,el:.5,dist:30},
  {t:'Sponsor blocks, south',k:'Sponsors',d:'Further down: the branded BDO and Specialign tents (10 × 10 ft, each with a photo wall and 3D letters), then Fitbar, Cargo Boss, Popcycle, Gatorade, Pepsi and Espace Wellness.',ids:['bdo','specialign','fitbar','cargoboss','popcycle','gatorade','pepsi','espace'],az:.25,el:.5,dist:30},
  {t:'BYD Showroom',k:'BYD',d:'The southwest block holds the BYD Showroom: a 10 × 15 m truss tent with the BYD Cafe, AC Health and Test Drive Registration counters on a raised floor, the Shark 6 on turf, and an inflatable BYD arch at the front.',ids:['byd-showroom'],az:.7,el:.5,dist:26},
  {t:'Merchants',k:'Merchants',d:'Two rows of merchant booths sit near the exit: Sugar High and Swiss Proli & Take Out, plus 8 open merchant slots.',ids:['m-open-1','m-sugar','m-swiss','m-open-2','m-open-3','m-open-4','m-open-5','m-open-6','m-open-7','m-open-8'],az:.05,el:.55,dist:34},
  {t:'Stage & Tech',k:'Stage & Tech · Operations',d:'The stage faces the floor from the west, with Tech to its north. Myriad and ARF sit beside the stage, and Smoke10 is just above Tech.',ids:['stage','tech','myriad','arf','smoke10'],az:1.25,el:.45,dist:36},
  {t:'Tents along the west fence',k:'Tents & Portalets',d:'Three tents line the west fence: BYD, DOT, and Artists & Other Sponsors. VIP Portalets stand just outside the fence.',ids:['byd-tent','dot-tent','artists-tent','vip-portalets'],az:1.3,el:.5,dist:38},
  {t:'Artists Entrance',k:'BYD',d:'Artists step off Independence Road onto the lawn, go through their own entrance and follow the path north to the artists tent.',ids:['artists-entrance'],target:[290,800],az:.6,el:.6,dist:34},
  {t:'Standby per Wave',k:'Standby & Ramp',d:'Riders gather here by wave after Registration, Kit Claiming, Baggage and the Bike Check Station at the southeast corner. When a wave is called, it rides north along the Exit to Start lane, straight up the green Ramp and off its north end onto the KM 0 plaza, then out onto Roxas Boulevard.',ids:['standby','bike-check','exit-to-start','ramp'],az:-.45,el:.55,dist:40},
  {t:'Common Portalets & restricted area',k:'Tents & Portalets · Restricted',d:'Two Common Portalets sit side by side at the south edge of the KM 0 plaza. The black circle is a restricted area with no setup.',ids:['common-portalets-1','common-portalets-2','restricted'],az:.3,el:.6,dist:40},
  {t:'Gun start at KM 0',k:'Roxas Boulevard',d:'Only the south lane of Roxas Boulevard is closed (orange cones on the centre line). Each wave lines up two abreast behind the START arch, facing South Drive. On the gun at KM 0 the wave rolls through the arch, U-turns at the cones and rides west in the same lane toward Katigbak Parkway.',ids:['start','km0','satellite-stage'],target:[850,80],az:2.75,el:.5,dist:46},
  {t:'Finish on Independence Road',k:'Start & Finish · Cardinal',d:'Finishers appear on Independence Road and ride east past Cardinal to cross the FINISH arch. They go straight in through the Entrance and park at the Bike Rack, so no bikes stay on the road, then walk in to start the Bike Village experience.',ids:['finish','cardinal'],target:[820,950],az:-.15,el:.45,dist:50},
  {t:'Quirino Grandstand',k:'Landmarks',d:'South of Independence Road: the Quirino Grandstand, with parking on both sides. That completes the tour.',ids:['grandstand','parking-w','parking-e'],az:3.0,el:.55,dist:66}
];
