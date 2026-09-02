const { Breadcrumb, Button, Badge, Rating, QuantityStepper, Tabs, Accordion, DeliveryNote, VendorCard, ProductCard, Icon } = window.OjuojaDesignSystem_fd3102;

function ProductScreen({ onNav, onAdd }) {
  const [qty, setQty] = React.useState(2);
  const [tab, setTab] = React.useState("Details");
  const p = window.PRODUCTS[0];
  const naira = (n)=>"₦"+n.toLocaleString("en-NG");
  return (
    <main style={{maxWidth:"var(--layout-max)",margin:"0 auto",padding:"32px 32px 96px"}}>
      <Breadcrumb items={[{label:"Home",href:"#"},{label:"Groceries",href:"#"},{label:p.name}]}/>
      <div style={{marginTop:24,display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"start"}}>
        <div>
          <div style={{background:"var(--pattern-lime-stripe)",borderRadius:"var(--radius-lg)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",height:420}}>
            <img src={p.image} alt="" style={{width:"78%",objectFit:"contain"}}/>
          </div>
          <div style={{marginTop:14,display:"flex",gap:12}}>
            {[window.PHOTO+"prod-corn.png",window.PHOTO+"prod-greens.png",window.PHOTO+"prod-peppers.png"].map((s,i)=>(
              <div key={i} style={{width:84,height:84,borderRadius:"var(--radius-media)",overflow:"hidden",background:"var(--surface-card)",border:i===0?"2px solid var(--border-brand)":"1px solid var(--border-subtle)"}}>
                <img src={s} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{display:"flex",gap:8}}>
            <Badge tone="soft" icon="badge-check">Verified vendor</Badge>
            <Badge tone="lime" icon="bike">35 mins</Badge>
            <Badge tone="danger">-18%</Badge>
          </div>
          <h1 style={{marginTop:16,fontFamily:"var(--font-display)",fontWeight:700,fontSize:40,lineHeight:1.06,letterSpacing:"-.015em",color:"var(--text-heading)"}}>{p.name}</h1>
          <div style={{marginTop:12,display:"flex",alignItems:"center",gap:14}}>
            <Rating value={4.8} count={212}/>
            <span style={{fontSize:13,color:"var(--text-muted)"}}>Sold by {p.vendor}</span>
          </div>
          <div style={{marginTop:20,display:"flex",alignItems:"baseline",gap:12}}>
            <span style={{fontFamily:"var(--font-body)",fontWeight:700,fontSize:32,color:"var(--text-brand)"}}>{naira(p.price)}</span>
            <span style={{fontSize:16,color:"var(--text-faint)",textDecoration:"line-through"}}>{naira(p.was)}</span>
          </div>
          <p style={{marginTop:16,fontSize:15,color:"var(--text-muted)",maxWidth:"46ch"}}>
            Picked this morning at Ikorodu market and kept in the shade until your rider arrives. Sold in bundles of five, husk on.
          </p>
          <div style={{marginTop:26,display:"flex",alignItems:"center",gap:14}}>
            <QuantityStepper value={qty} onChange={setQty} unit="bundles"/>
            <Button badgeIcon="shopping-basket" onClick={()=>{onAdd(p);onNav("basket")}}>Add to Basket</Button>
            <Button variant="secondary" leadingIcon="heart">Save</Button>
          </div>
          <div style={{marginTop:22}}><DeliveryNote><strong>Free delivery</strong> within Ikorodu on baskets over ₦10,000</DeliveryNote></div>
          <div style={{marginTop:32}}>
            <Tabs variant="underline" items={["Details","Vendor","Reviews"]} value={tab} onChange={setTab}/>
            <div style={{paddingTop:18}}>
              {tab==="Details" && <Accordion numbered={false} defaultOpen={0} items={[
                {q:"What's in the bundle",a:"Five ears of sweet corn, husk on, roughly 1.4kg in total."},
                {q:"Storage",a:"Keep in the husk in a cool place and use within three days."},
                {q:"Returns",a:"Tell the rider before they leave and we replace it on the next run."}]}/>}
              {tab==="Vendor" && <VendorCard name="Mama T Stores" area="Ita Elewa" verified rating={4.9} deliveryMins={35}/>}
              {tab==="Reviews" && (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {[["Bimpe A.","Corn was still warm from the sun. Rider called ahead."],["Tunde O.","Second order this week. Good price for five."]].map(([n,t])=>(
                    <div key={n} style={{padding:16,background:"var(--surface-card)",borderRadius:"var(--radius-md)"}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}><strong style={{fontSize:14,color:"var(--text-heading)"}}>{n}</strong><Rating value={5} size={12}/></div>
                      <p style={{marginTop:6,fontSize:14,color:"var(--text-muted)"}}>{t}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div style={{marginTop:80}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
          <h2 style={{fontFamily:"var(--font-display)",fontSize:28,color:"var(--text-brand)",margin:0}}>More from this vendor</h2>
          <Icon name="arrow-right" size={20}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24}}>
          {window.PRODUCTS.map((x,i)=><ProductCard key={i} {...x} onAdd={()=>onAdd(x)}/>)}
        </div>
      </div>
    </main>
  );
}
Object.assign(window, { ProductScreen });
