# FunRide Bike Village

**FunRide PH · Event site**: Rizal Park, Manila (not to scale)

The village sits on the lawn between **Roxas Boulevard** (north) and **Independence Road** (south), with **Katigbak Parkway** on the west and **South Drive** on the east. Riders start at **KM 0** and finish on **Independence Road**.

---

## Guided tour (in rider order)

1. **Entrance & BYD Test Drive** (Independence Road). Guests walk in through the Entrance at the southeast corner. BYD Test Drive Registration is right outside the gate. The BYD Garage and BYD Test Drive sit along Independence Road toward South Drive.
2. **Operations column.** Right inside the gate, a single column holds the services: EMS, Command, Info / Lost & Found, Kit Claiming, two Registration desks and the Baggage Area. A barricade runs along its west side, with a ~3 m opening between the two Registration desks: that is the Registration entrance, and a red flow lane runs through it.
3. **Bike Rack.** The long bike rack runs along the east fence. Park here before you explore the booths.
4. **Bikes and Coffee & Photowall.** Bikes and Coffee is in the northeast corner. Along the top of the queue lanes are the three photowalls: 21 KM, 10 KM and 5 KM.
5. **Sponsor blocks, north.** The red rider-flow lanes split the floor into blocks. The north blocks hold the DOT Booth, Dr. O, Oxecure, Neutra K and Wert PH.
6. **Sponsor blocks, south.** BDO, Specialign, Fitbar, Cargo Boss, Popcycle, Gatorade, Pepsi and Espace Wellness.
7. **BYD Showroom.** The southwest block holds the BYD Showroom, a 10 × 15 m truss tent.
8. **Merchants.** Two rows of merchant booths near the exit: Sugar High and Swiss Proli & Take Out, plus 8 open merchant slots.
9. **Stage & Tech.** The stage faces the floor from the west, with Tech to its north. Myriad and ARF sit beside the stage, and Smoke10 is just above Tech.
10. **Tents along the west fence.** Three tents line the west fence: BYD, DOT, and Artists & Other Sponsors. VIP Portalets stand just outside the fence.
11. **Artists Entrance.** Artists step off Independence Road onto the lawn and go through their own entrance (set back inside, not on the road), and follow a path north to the artists tent.
12. **Standby per Wave.** Riders gather here by wave after Registration, Kit Claiming, Baggage and the Bike Check Station (southeast corner). When a wave is called, it rides north along Exit to Start, straight up the green Ramp and off its north end onto the KM 0 plaza, then out onto Roxas Boulevard.
13. **Common Portalets & restricted area.** Two Common Portalets sit side by side at the south edge of the KM 0 plaza. The black circle is a restricted area with no setup.
14. **Gun start at KM 0** (Roxas Boulevard). Only the south lane of Roxas is closed (cones on the centre line). Each wave lines up two abreast behind the START arch, facing South Drive. On the gun the wave rolls through the arch, U-turns at the cones and rides west in the same lane to Katigbak Parkway. The Satellite Stage is on the plaza, and Rizal Park is across the road.
15. **Finish on Independence Road.** Finishers appear on Independence Road and ride east past Cardinal. Past the FINISH arch nobody stops on the road: riders get off and walk their bikes straight in through the Entrance to rack them at the Bike Rack along the east fence, then walk into the Bike Village. Independence Road stays clear except for the BYD Test Drive Lane.
16. **Quirino Grandstand.** South of Independence Road, with parking on both sides.

---

## Layout updates

Newest first. Add a line here whenever the layout, the 3D sim or the PDF changes.

| Date | Change |
|---|---|
| 2026-11-24 | **3D file split into smaller files (no layout change).** `FunRide Bike Village.html` is now just the page markup (about 90 lines, was 2,600 lines / 500 KB). The styles are in `village/style.css`, the sponsor logos in `village/logos.js`, and the code in `village/js/`: `data.js` (booth list, legend, tour stops — edit booths here), `scene.js`, `booths.js`, `brands.js`, `byd.js`, `world.js`, `people.js`, `riders.js` and `ui.js`, loaded in order by `village/main.js`. Keep the `village` folder next to the HTML; it still opens straight from disk. The Layout Plan builder now reads the booths from `village/js/data.js`. |
| 2026-11-24 | **Cardinal moved off the road.** Cardinal now stands on the lawn just north of Independence Road (centre x 560, y 911, was y 935 on the road's north half), between the road edge and the hedge west of the Exit, so it no longer blocks the road or the finishers riding in. The Layout Plan PDF and PNG were rebuilt to match (the plan builder also needed two fixes: it now reads the booth data with Windows line endings, and it no longer draws the 21 KM marker removed earlier). |
| 2026-11-24 | **Wider view and look-around in the walkthroughs.** The eye-level walkthroughs (Morning and After the race) now use a wide lens (75° instead of 42°), easing back to the normal lens in Guided tour, Explore and Top view. While a walkthrough plays you can **drag (mouse or finger) to look around** without stopping it; the walk keeps moving and the view drifts back to the guided direction about 3 s after you let go. Each new step starts facing forward. |
| 2026-11-24 | **Empty booths in the morning.** During the Morning walkthrough (eye level and in Top view) the booth staff and visitors are removed from every booth except the race operations booths riders need before the start: Registration (both desks), Kit Claiming, Baggage, Bike Check, Info / Lost & Found, Command Center, EMS and Tech (17 of the 66 booth people stay). They all come back in the other modes. |
| 2026-11-24 | **Tour stops face the booth fronts.** The sponsor tents open to the south, so the After the race stops now stand on the red lane in front of each booth instead of behind it: Wert PH (with Neutra K behind) from the middle lane, Oxecure & Dr. O and the DOT Booth from the middle lane, **BDO & Specialign from the cross aisle south of them** (was looking at their backdrops from the north), Cargo Boss & Espace Wellness from the lane below them, Popcycle and Gatorade / Pepsi from the lane below them, and the BYD Showroom from in front of its arch. All Morning walkthrough stops already faced the fronts. |
| 2026-11-24 | **After the race from the rider's eyes; walkthroughs in Top view.** After the race now starts as *you*: you ride the last stretch of Independence Road at eye level behind your wave and cross under the FINISH arch, get off just past it, and walk your bike (beside you on your left) in through the Entrance and up the east red lane to your own slot at the south end of the Bike Rack, where you rack it. Then the village tour continues on foot as before. The camera no longer brushes the hedge by the Entrance. Your wave (3 riders) starts ahead of you at the same pace, so nobody comes within about 4 m of you; no other finishers arrive during After the race. **Top view** now has a **Live / Morning / After the race** switch in the bottom bar: Live is the free-running sim, and Morning or After the race plays that walkthrough from above with *you* marked by a yellow ring (on foot, or riding and then walking your bike), with Back / Pause / Next. |
| 2026-11-24 | **Red lanes cleaned up and followed; no overlapping panels.** The red queue lanes are one lane per aisle: the near-duplicate lanes at x 684 / 688 and x 793 / 798 / 800 are merged into single lanes at **x 688** and **x 796** (x 796 now runs straight through both sponsor blocks). Gaps are closed: a lane into Standby per Wave (y 285), a short lane to Bikes and Coffee, the merchants aisle joined to the west lane, and the east lane runs through the Entrance gate and the merchants lane through the Exit gate. No lane crosses a booth. Everyone now walks the red lanes: the Morning walkthrough uses the east lane (x 945) past Registration, Kit Claiming and Baggage instead of a path beside the booths, the After the race tour and finishers walking their bikes use the lanes, and so do the background walkers. The only off-lane bits are through the gates and the last 3 m into a rack slot. **Bike Check** moved to (642, 315) so it sits fully inside the corner of Standby per Wave, and the **MERCHANTS** ground label moved off the aisle lane. Panels keep at least 8 px apart at every size checked (phone 446 px, 880 px, 1280 px): on phones the mode buttons wrap into two rows instead of scrolling, the booth card and booth list sit just below them, and opening the booth list hides the tour bar; on desktop the tour bar narrows to leave room for the booth card and the booth list stops above it. |
| 2026-11-24 | **Cleaner layout.** The top bar is now **Guided tour · Walkthrough · Explore · Top view** plus a **⋯** menu holding Simulation on/off and Hide panels (H still works). **Walkthrough** is one button; a **Morning / After the race** switch in the bottom bar picks the phase, and the button reopens the last phase used. The top-left box shows only **Bike Village** and the Live clock; the subtitle and the wave status moved to the top of the booth list. Road dashes and the red queue lanes are thinner and lighter. Walkthroughs show fewer background walkers (about a quarter of the crowd in the morning, a few village walkers after the race) and no floating name tags, since the bottom bar already names each stop. |
| 2026-11-24 | **Cleaner sim.** Removed the **Routes** view and all moving red dots (including the ones in the Morning walkthrough). **Finishers now walk their bikes**: they roll through the FINISH arch, get off about 4 m past it and walk beside the bike in through the Entrance to the Bike Rack. In the **Morning walkthrough** the red dashed queue lanes inside the booth area are hidden; only one dashed lane shows, from the Entrance up the east side and along the top lane to the Exit to Start, toward KM 0. The other modes still show all the queue lanes. |
| 2026-11-24 | **Walkthrough split into two phases, gun start, closable boxes.** **Morning walkthrough** (pre-race, 9 steps): Entrance → Registration → Kit Claiming → Baggage → the eastern red lane north and along the top lane to the Bike Check Station → Standby per Wave, where a full wave of 12 riders waits on their bikes. The camera then follows the wave out the Exit to Start lane, up the Ramp, across the KM 0 plaza past the Satellite Stage, and stops behind the grid at the START arch. When the camera arrives the gun fires automatically after a 3 s countdown (or press the new **Gun start** button), and the wave rolls through the arch onto Roxas Boulevard. During this phase there are no finishers. **After the race** (replaces "Finish & village", 13 steps): no bikes on Roxas, Exit to Start or Standby per Wave. A wave of 8 finishers crosses the FINISH arch and goes straight in through the Entrance to the **Bike Rack** on the east fence, so no bikes are parked on Independence Road any more (the old road corral is gone; the rack's west side, south half, is kept free for them). The camera then tours Bikes and Coffee, the 21 / 10 / 5 KM photowalls, Neutra K & Wert PH, Oxecure & Dr. O, the DOT Booth, BDO & Specialign, Fitbar / Cargo Boss / Espace Wellness, Popcycle / Gatorade / Pepsi, the BYD Showroom and the Merchants, and ends at the Main Stage. The top-left box and the tour bar each have a **×** close button, **Esc** closes them (or the booth card, if one is open), and a small **Info** pill in the top-left corner brings them back. |
| 2026-11-24 | **New Routes view.** A **Routes** button shows only the pathing as moving dots, from an overview camera, with a **Morning / After the race** toggle. **Morning** is the one and only route (red): Entrance → Registration → Kit Claiming → Baggage → Bike Check → Standby per Wave, with sponsor and merchant booths closed. **After the race** shows three routes: finishers riding in on Independence Road to the bike corral (blue), and two walking routes from the corral through the Entrance into the village and out by the Exit: **Route A** through the east blocks (red) and **Route B** through the west blocks (yellow). The booths are open in this view. |
| 2026-11-24 | **Road clean-up, closed booths in the morning, smoother sim.** Removed the **21 KM marker** from Independence Road in front of the Quirino Grandstand (the 21 KM photowall stays). The **Artists Entrance** moved off the road onto the lawn just inside Independence Road (centre x 252, y 898), and its path now ends at the entrance. **Finishers** now appear on Independence Road (west end) instead of coming down Katigbak Parkway. In the **Morning walkthrough**, sponsor, DOT and merchant booths are shown **closed** (grey shutters with a red CLOSED sign), and **red dots flow along the rider route toward Standby per Wave**. Smoother sim: the eye-level cameras (Morning walkthrough, Finish & village) now ease their heading and never tip down at the ground when arriving at a booth or the end of a step; people and bikes turn smoothly at corners and when they stop to face a booth. |
| 2026-11-24 | **Start, finish and morning flow in the 3D sim.** Waves now ride the Exit to Start lane and go straight up the Ramp (on top of the slab) and off its north end onto the KM 0 plaza, instead of turning off mid-ramp. Only the **south lane of Roxas Boulevard** is used: cones on the centre line, a 2-abreast × 6-row start grid west of the START arch facing South Drive, and U-turn cones at x 978. A starter with a gun stands at KM 0 beside the arch; after a 4 s countdown the **gun start** (flash + smoke) sends the wave east through the arch, round the U-turn and west in the same lane; riders drop out of the sim once they reach **Katigbak Parkway**. START is now painted on the west (approach) side. **Finishers** come down Katigbak, ride east on Independence Road, cross FINISH, park in the corral, then walk in through the Entrance into the village. New **Morning walkthrough** mode (eye level, 6 steps): Entrance → Registration → Kit Claiming → Baggage → Bike Check → Standby per Wave, with people on foot doing the same flow. **Walk the lanes** is now **Finish & village**: a chase camera rides in behind a finisher, crosses FINISH, parks, then walks the lanes. Every info box (title, booth list, tour bar, booth card) has a **minimise** button, and **Hide panels** (or H) hides them all for a full view. |
| 2026-11-24 | **People face the right way.** Every person now has a visible front (eyes, hair on the back of the head, shoes pointing forward). Every labelled open tent, tent with back siding and booth stall (merchants, sponsors, Tech, Registration, Kit Claiming, Baggage, Info, Command, EMS, Bike Check, BYD Test Drive Registration) now has staff behind the front table facing out (2 staff when the table is long), and about 6 in 10 get a customer at the table facing in. Open merchant slots stay empty. Sponsor booth and BYD Showroom staff face visitors, counter guests face the counters, showroom visitors face the standees, tables or the Shark 6, and BYD Garage staff face the table. Rotated tents (Smoke10, Myriad, ARF) follow the rotation. 67 booth people, none overlapping furniture or each other. |
| 2026-11-24 | **BYD Showroom people:** 3 staff behind the Cafe, AC Health and Test Drive counters, a guest at each counter, 6 visitors on the raised floor and cafe tables, 5 on the turf around the Shark 6 and camping sets (17 total; the staff stools behind the AC Health and Test Drive counters were removed to make room). **Booth people fix:** people now stand on the booth's real floor (raised floor / turf / tent floor) instead of being sunk into it, follow the booth's rotation, and were checked so none overlap furniture, cars or each other. Open the 3D file with `#debug` to expose scene data for this check. |
| 2026-11-24 | AC Health / AC Mobility booth removed. **BYD Showroom** expanded from 10 × 9 m to **10 × 15 m** (32.8 × 49.2 ft), same design stretched: raised floor and turf both grow, trusses/flags follow. It now fills the old AC + showroom block (centre moved from y 717 to y 677). |
| 2026-11-24 | Main Stage is labelled **L 20 ft × W 12 ft × H 3 ft** everywhere (info card, booth list, plan, schedule); the 3D stage keeps its larger drawn size. |
| 2026-11-24 | Main Stage enlarged from 20 × 12 ft to 24 × 14 ft (same centre; at least 3.6 m from Tech, Myriad, the tents and 5.4 m from the lane). The back wall is now an LED screen showing the FunRide PH logo and "Moving people. Inspiring change.", with a lighting truss on top. |
| 2026-11-24 | DOT Booth is labelled **10 × 20 ft** everywhere (info card, booth list, plan, schedule); the 3D tent keeps its larger drawn size. |
| 2026-11-24 | BYD Test Drive Registration tent is now a white canopy with the BYD logo printed on the roof. BYD Showroom roof now stands on steel box-truss towers with base plates (corners and mid sides). Satellite Stage moved back beside the START arch (x 862), set just inside the KM 0 plaza edge so it is off Roxas Boulevard and clear of the rider route (no longer rotated). |
| 2026-11-24 | DOT Booth enlarged from a 15 × 10 ft to a 20 × 15 ft branded tent (8 × 20 ft backdrop, lounge spread to fit), photo wall still 1 ft east. It stays centred in its lane block with about 1.6 m clear of the red lanes on both sides. |
| 2026-11-24 | Official Lead Vehicles removed from the start line. Satellite Stage moved off the road onto the west side of the KM 0 plaza (no longer rotated). BYD Garage (5 × 3 m, registration) and BYD Test Drive (16.5 × 3 m, Shark 6, Seal, Atto 2 side-on) now take only the north half of Independence Road; the south half is a marked **Test Drive Lane** with a car that drives out to South Drive and back. Barricade now runs across the road at the finish side and along the south edge of the lane, open at the east end. |
| 2026-11-24 | BYD Recharging Hub removed completely (it sat on the KM 0 plaza next to the rider route). |
| 2026-11-24 | START and FINISH arches cleaned up: the sign panel now sits centred on the arch crown (both faces), a checkered line runs right under each arch, and the word is painted on the road on the riders' approach side. Added a metal crowd barricade between the finish bike parking and the BYD Garage / Test Drive tents, closing the road side of the BYD area. |
| 2026-11-24 | BYD built from the BYD proposed layout PDF. **BYD Showroom** is now a 10 × 9 m (32.8 × 29.5 ft) truss tent: raised floor with BYD Cafe, AC Health and Test Drive Registration counters, turf with the Shark 6, BYD sign, inflatable arch and tubes, 6 flags. AC Health / AC Mobility moved 0.3 m north to keep a gap. **BYD Garage** (7 × 6 m) and **BYD Test Drive** (14 × 6 m) are white tents on Independence Road with the registration table and 7 cars. New: **BYD Recharging Hub** (12 × 3.8 m) on the KM 0 plaza and 3 wrapped **Official Lead Vehicles** on Roxas ahead of the START arch. KM 0 and Roxas Boulevard ground labels moved out of the way. |
| 2026-11-24 | DOT, Oxecure / Dr. O, BDO and Specialign rebuilt from the sample tent designs: real logos, branded peaked canopy, backdrop, main table, cocktail table, covered chairs, monitor, feather banners and carpet, plus an 8 × 4 ft photo wall with 3D letters 1 ft east of each tent. DOT is now a 15 × 10 ft tent (was a 10 × 20 ft big booth). Oxecure moved to the left half of the shared tent, Dr. O to the right. The Registration label no longer has a hyphen. Link straight to a booth with `#booth=<id>`, e.g. `#booth=bdo`. |
| 2026-11-24 | Ops barricade opened (~3 m) between the two Registration desks; the red flow lane runs straight through it as the Registration entrance. |
| 2026-11-24 | Red dashed "Bike Village" box removed from the Site Overview. |
| 2026-11-24 | PDF/PNG reduced to one **Site Overview** page, now with booth names and sizes. The detailed booth page and size schedule were dropped. |
| 2026-11-24 | BYD Test Drive shortened so it stays on Independence Road and stops at the South Drive corner. |
| 2026-11-24 | AC Health / AC Mobility and BYD Showroom split into two separate 24.5 × 32 ft big booths with a walkway between them (was one 32 × 49 ft booth). |

---

## Booth sizes

Booths in the 3D model and in `FunRide Bike Village - Layout Plan.pdf` are drawn at these sizes (10 map px = 1 m). The PDF is a single **Site Overview** page (whole site, booth names and sizes, red flow lanes). Regenerate the PDF and PNG after any change with `node tools/build-layout-plan.js`.

| Type | Booths | Size (ft) |
|---|---|---|
| Tent with back siding | EMS, Command Center, Info / Lost & Found, Registration ×2 | 10 × 10 |
| Tent with back siding | Kit Claiming, Baggage Area | 10 × 30 |
| Branded tent + 8 × 4 ft photo wall | Specialign, BDO | 10 × 10 |
| Branded tent + 8 × 4 ft photo wall | DOT | 10 × 20 |
| Branded tent (shared) + 8 × 4 ft photo wall | Oxecure / Dr. O | 10 × 15 |
| Open tent | Bikes and Coffee, Neutra K, Wert PH, Fitbar, Cargo Boss, Popcycle, Myriad, ARF, Smoke10, Bike Check Station, BYD Test Drive Registration | 10 × 10 |
| Open tent (shared) | Gatorade / Pepsi | 10 × 10 |
| Open tent | Tech | 10 × 20 |
| Booth stall only | Espace Wellness | 5 × 5 |
| BYD truss tent + arch | BYD Showroom | 32.8 × 49.2 (10 × 15 m) |
| BYD tents | BYD Garage, BYD Test Drive | 5 × 3 m, 16.5 × 3 m |
| BYD lane | Test Drive Lane | 24.7 × 3 m |
| Aircon tent (VIP) | Artists & Other Sponsors | 12 × 24 |
| Aircon tent (VIP) | DOT, BYD | 12 × 12 |
| Merchants | 10 booths | 10 × 10 each |
| Photowall | 5 km, 10 km, 21 km | To follow |
| Stage | Main Stage (LED screen) | 20 L × 12 W × 3 H |
| Stage | Satellite Stage (KM 0) | 12 L × 12 W × 3 H |

---

## Legend & booth list

### Stage & Tech
| Booth | Location |
|---|---|
| Stage | Main stage on the west side of the floor, facing the booth area |
| Satellite Stage | KM 0 plaza beside the START arch, just inside the plaza edge (off the road) |
| Tech | Just north of the stage |

### Sponsors
| Booth | Location |
|---|---|
| Smoke10 | Between the BYD tent and Tech |
| Oxecure | Left half of the shared tent beside the DOT Booth |
| Dr. O | Right half of the shared tent, with its photo wall and 3D letters to the east |
| Neutra K | Northeast queue block |
| Wert PH | Below Neutra K |
| BDO | Middle block; photo wall with 3D BDO letters on its east side |
| Specialign | Beside BDO; photo wall with a 3D S on its east side |
| Fitbar | East block |
| Cargo Boss | Between Fitbar and Espace Wellness |
| Popcycle | South block |
| Gatorade | Beside Popcycle |
| Pepsi | Just below Gatorade |
| Espace Wellness | Below Fitbar |

### Tents & Portalets
| Booth | Location |
|---|---|
| BYD Tent | First in the row of tents along the west fence |
| DOT Tent | Between the BYD tent and the artists tent |
| Artists & Other Sponsors Tent | West fence, linked to the Artists Entrance |
| VIP Portalets | Outside the west fence |
| Common Portalets (west) | South edge of the KM 0 plaza (1 of 2) |
| Common Portalets (east) | South edge of the KM 0 plaza (2 of 2) |

### DOT Booth
| Booth | Location |
|---|---|
| DOT Booth | Northwest queue block; 10 × 20 ft branded tent, photo wall with 3D DOT letters on its east side |

### BYD
| Booth | Location |
|---|---|
| BYD Showroom | Southwest block, 10 × 15 m truss tent; Shark 6, cafe, AC Health and test drive counters, arch at the front |
| BYD Test Drive Registration | Just outside the Entrance; sign up here for the test drive |
| BYD Garage | Independence Road, north half; test drive registration table |
| BYD Test Drive | Independence Road, north half; two shallow tents with Shark 6, Seal and Atto 2 |
| BYD Test Drive Lane | Independence Road, south half; test drive cars drive east and turn onto South Drive |
| Artists Entrance | On the lawn just inside Independence Road (not on the road), with a path up to the west fence |

### Operations
| Booth | Location |
|---|---|
| Baggage Area | Top of the operations column (bag drop) |
| Registration (north) | Operations column, desk 1 of 2 |
| Registration (south) | Operations column, desk 2 of 2 |
| Kit Claiming | Operations column; claim your race kit here |
| Info / Lost & Found | Operations column |
| Command | Operations column; event command post |
| EMS | Closest booth to the Entrance; emergency medical services |
| Bike Check Station | Southeast corner of Standby per Wave |
| Bike Rack | Along the east fence; finishers rack their bikes here (west side, south half) |
| Bikes and Coffee | Northeast corner, above the bike rack |
| Myriad | Beside the stage |
| ARF | Beside Myriad |
| Photowall 21 KM | Top of the queue lanes |
| Photowall 10 KM | Top of the queue lanes |
| Photowall 5 KM | Top of the queue lanes |

### Merchants
| Booth | Location |
|---|---|
| Sugar High | First row |
| Swiss Proli & Take Out | First row |
| Open slots 1–4 | First row |
| Open slots 5–8 | Second row |

### Standby & Ramp
| Booth | Location |
|---|---|
| Standby per Wave | Riders wait here by wave before heading to the start |
| Exit to Start | Lane from Standby per Wave north to the ramp; riders ride on it straight up the Ramp |
| Ramp | Green ramp up onto the KM 0 plaza, at the top of Exit to Start |

### Start & Finish
| Marker | Location |
|---|---|
| Start | Gun start at KM 0 on Roxas Boulevard; grid in the closed south lane facing South Drive, U-turn west to Katigbak Parkway |
| Finish | Independence Road |
| Barricade (Finish / BYD) | Across the road between the finish bike parking and the BYD area, then along the south edge of the test drive lane |

### Cardinal
| Booth | Location |
|---|---|
| Cardinal | Roadside lawn just north of Independence Road, west of the finish (off the road) |

### Restricted
| Area | Note |
|---|---|
| Restricted Area | Black circle north of the bike rack; no setup here |

### Roads & landmarks
| Place | Location |
|---|---|
| Entrance | Main entrance from Independence Road, southeast corner |
| Exit | Southwest corner, past the merchants |
| KM 0 | Kilometer Zero plaza, south side of Roxas Boulevard |
| Quirino Grandstand | South of Independence Road |
| Parking (west) | Southwest of the grandstand |
| Parking (east) | Southeast of the grandstand |
