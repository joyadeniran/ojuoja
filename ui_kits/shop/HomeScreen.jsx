const { Button, SectionHeading, CategoryCard, ProductCard, VendorCard, Accordion, PatternPanel, DeliveryNote, Tag } = window.OjuojaDesignSystem_fd3102;
const PHOTO = "../../assets/photography/";

const CATEGORIES = [
  { title:"Food & Snacks", description:"Hot plates and small chops from nearby kitchens.", image: PHOTO+"cat-food-snacks.png" },
  { title:"Groceries", description:"Everyday staples from the market, picked this morning.", image: PHOTO+"cat-groceries.png" },
  { title:"Drinks", description:"Chilled minerals, juices and water by the crate.", image: PHOTO+"cat-drinks.png" },
];

const PRODUCTS = [
  { name:"Fresh sweet corn (5 pcs)", price:1800, was:2200, vendor:"Mama T Stores", verified:true, rating:4.8, image:PHOTO+"prod-corn.png", flag:{label:"-18%"} },
  { name:"Bell peppers, mixed (1kg)", price:3200, vendor:"Ojuoja Fresh", verified:true, rating:4.7, image:PHOTO+"prod-peppers.png" },
  { name:"Small chops platter", price:5500, vendor:"Iya Basira Kitchen", rating:4.6, image:PHOTO+"prod-snacks.png", flag:{label:"Trending",tone:"accent"} },
  { name:"Ugwu & efo bundle", price:1200, vendor:"Ita Elewa Greens", verified:true, rating:4.9, image:PHOTO+"prod-greens.png" },
];

const FAQS = [
  { q:"What is Ojuoja?", a:"Ojuoja is a marketplace that puts verified Ikorodu vendors — kitchens, groceries, drinks — in one basket and delivers to your door." },
  { q:"How long does delivery take?", a:"Most orders inside Ikorodu arrive within 35 to 60 minutes, depending on your area and the vendor's prep time." },
  { q:"Which areas do you cover?", a:"Ita Elewa, Agric, Ijede Road, Sabo, Igbogbo and Ebute today. New areas open every month." },
  { q:"How do I pay?", a:"Card, bank transfer, or cash to the rider on delivery." },
  { q:"How do I become a vendor?", a:"Register your shop, upload a valid ID and your first ten products. Verification takes two working days." },
];

function HomeScreen({ onNav, onAdd }) {
  return (
    <main>
      <PatternPanel variant="lime" padded={false}>
        <div style={{maxWidth:"var(--layout-max)",margin:"0 auto",padding:"0 32px",display:"grid",gridTemplateColumns:"1fr 0.85fr",alignItems:"end",minHeight:460}}>
          <div style={{paddingTop:72,paddingBottom:72}}>
            <h1 style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:56,lineHeight:1.02,letterSpacing:"-.015em",color:"var(--oj-green-900)",margin:0}}>
              Your Next Craving<br/>is Just Around the<br/>Corner.
            </h1>
            <p style={{marginTop:18,fontSize:15,color:"var(--oj-green-800)",maxWidth:"42ch"}}>
              Discover the best of Ikorodu vendors, delivered straight to you.
            </p>
            <div style={{marginTop:26,display:"flex",gap:14,alignItems:"center"}}>
              <Button badgeIcon="shopping-basket" onClick={()=>onNav("category")}>Shop Now!</Button>
              <Button variant="secondary" onClick={()=>onNav("category")}>Browse vendors</Button>
            </div>
          </div>
          <div style={{alignSelf:"end",display:"flex",justifyContent:"flex-end"}}>
            <img src={PHOTO+"hero-basket-lime.png"} alt="" style={{width:"100%",maxWidth:420,display:"block"}}/>
          </div>
        </div>
      </PatternPanel>

      <section style={{maxWidth:"var(--layout-max)",margin:"0 auto",padding:"96px 32px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"start"}}>
          <SectionHeading title={<>Closer Than<br/>You Think</>}/>
          <div>
            <p style={{fontSize:15,color:"var(--text-muted)",maxWidth:"52ch"}}>
              Explore new flavors, trends, and essentials from verified vendors across Ikorodu. Every shop on Ojuoja is checked by hand before it opens for orders.
            </p>
            <div style={{marginTop:22,display:"flex",gap:12,flexWrap:"wrap"}}>
              <Button badgeIcon="shopping-basket" onClick={()=>onNav("category")}>Shop Now!</Button>
              <DeliveryNote><strong>Free delivery</strong> on baskets over ₦10,000</DeliveryNote>
            </div>
          </div>
        </div>
        <div style={{marginTop:40,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
          {CATEGORIES.map(c=><CategoryCard key={c.title} {...c} onClick={()=>onNav("category")}/>)}
        </div>
      </section>

      <section style={{maxWidth:"var(--layout-max)",margin:"0 auto",padding:"96px 32px 0"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:24}}>
          <SectionHeading level={2} title={<>Trending in Ikorodu<br/>this week</>}/>
          <div style={{display:"flex",gap:10}}>
            <Tag selected>All</Tag><Tag>Food & Snacks</Tag><Tag>Groceries</Tag><Tag>Drinks</Tag>
          </div>
        </div>
        <div style={{marginTop:32,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24}}>
          {PRODUCTS.map(p=><ProductCard key={p.name} {...p} onAdd={()=>onAdd(p)} onClick={()=>onNav("product")}/>)}
        </div>
      </section>

      <section style={{maxWidth:"var(--layout-max)",margin:"0 auto",padding:"96px 32px 0",textAlign:"center"}}>
        <SectionHeading align="center" title={<>Get the best grocery<br/>deals within Ikorodu.</>} subtitle="One basket, many vendors, one delivery fee. Order before 6pm for same-day drop-off." />
        <div style={{marginTop:24,display:"flex",justifyContent:"center"}}>
          <Button badgeIcon="shopping-basket" onClick={()=>onNav("category")}>Shop Now!</Button>
        </div>
      </section>

      <div style={{maxWidth:"var(--layout-max)",margin:"48px auto 0",padding:"0 32px"}}>
        <PatternPanel variant="green" padded={false} style={{borderRadius:"var(--radius-md)",display:"flex",justifyContent:"center",alignItems:"flex-end",height:360}}>
          <img src={PHOTO+"hero-basket-lime.png"} alt="" style={{height:"92%",objectFit:"contain",mixBlendMode:"multiply"}}/>
        </PatternPanel>
      </div>

      <section style={{maxWidth:820,margin:"0 auto",padding:"96px 32px 0"}}>
        <SectionHeading align="center" title={<>Frequently Asked<br/>Questions</>}/>
        <div style={{marginTop:32}}><Accordion items={FAQS} defaultOpen={0}/></div>
      </section>

      <section style={{maxWidth:"var(--layout-max)",margin:"96px auto 0",padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
          <VendorCard name="Mama T Stores" area="Ita Elewa" verified rating={4.9} deliveryMins={35}/>
          <VendorCard name="Iya Basira Kitchen" area="Sabo" rating={4.6} deliveryMins={45}/>
          <VendorCard name="Ojuoja Fresh" area="Agric" verified rating={4.8} deliveryMins={40}/>
        </div>
      </section>

      <section style={{maxWidth:"var(--layout-max)",margin:"96px auto 96px",padding:"0 32px"}}>
        <PatternPanel variant="market" padded={false} style={{height:300,display:"flex",alignItems:"center"}}>
          <div style={{background:"var(--surface-brand)",color:"#fff",padding:"36px 40px",maxWidth:440,marginLeft:56}}>
            <h2 style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:34,lineHeight:1.06,letterSpacing:"-.015em",color:"#fff",margin:0}}>Skip the Distance,<br/>Find the Flavor</h2>
            <p style={{marginTop:14,fontSize:14,color:"rgba(255,255,255,.86)"}}>Ikorodu's vendors, verified and delivered. No traffic, no haggling, no wasted trip.</p>
            <div style={{marginTop:20}}><Button variant="onbrand" badgeIcon="shopping-basket" onClick={()=>onNav("category")}>Shop Now!</Button></div>
          </div>
        </PatternPanel>
      </section>
    </main>
  );
}
Object.assign(window, { HomeScreen, PRODUCTS, CATEGORIES, FAQS, PHOTO });
