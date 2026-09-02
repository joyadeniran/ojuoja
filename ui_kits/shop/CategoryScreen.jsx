const { Breadcrumb, SectionHeading, ProductCard, Tag, Select, Checkbox, Pagination, Button, VendorCard, EmptyState } = window.OjuojaDesignSystem_fd3102;

function CategoryScreen({ onNav, onAdd }) {
  const [page, setPage] = React.useState(1);
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);
  const [chip, setChip] = React.useState("All");
  const all = window.PRODUCTS.concat(window.PRODUCTS.map(p=>({...p,name:p.name+" — large",price:p.price+900,flag:undefined,was:undefined})));
  const list = verifiedOnly ? all.filter(p=>p.verified) : all;
  return (
    <main style={{maxWidth:"var(--layout-max)",margin:"0 auto",padding:"32px 32px 96px"}}>
      <Breadcrumb items={[{label:"Home",href:"#"},{label:"Groceries"}]}/>
      <div style={{marginTop:20,display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:24}}>
        <SectionHeading title="Groceries" subtitle="Staples, produce and provisions from verified Ikorodu vendors."/>
        <Select label="Sort by" options={["Most popular","Price: low to high","Closest vendor"]}/>
      </div>
      <div style={{marginTop:32,display:"grid",gridTemplateColumns:"236px 1fr",gap:32,alignItems:"start"}}>
        <aside style={{display:"flex",flexDirection:"column",gap:22,position:"sticky",top:96}}>
          <div>
            <div style={{font:"600 11px/1 var(--font-body)",letterSpacing:".09em",textTransform:"uppercase",color:"var(--text-faint)",marginBottom:12}}>Vendor</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <Checkbox checked={verifiedOnly} onChange={setVerifiedOnly}>Verified vendors only</Checkbox>
              <Checkbox checked={false} onChange={()=>{}}>Open now</Checkbox>
              <Checkbox checked={false} onChange={()=>{}}>Free delivery</Checkbox>
            </div>
          </div>
          <div>
            <div style={{font:"600 11px/1 var(--font-body)",letterSpacing:".09em",textTransform:"uppercase",color:"var(--text-faint)",marginBottom:12}}>Area</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {["Ita Elewa","Agric","Sabo","Igbogbo"].map(a=><Tag key={a} selected={chip===a} onClick={()=>setChip(chip===a?"All":a)}>{a}</Tag>)}
            </div>
          </div>
          <div style={{paddingTop:8,borderTop:"1px solid var(--border-subtle)"}}>
            <div style={{font:"600 11px/1 var(--font-body)",letterSpacing:".09em",textTransform:"uppercase",color:"var(--text-faint)",margin:"14px 0 12px"}}>Top vendor</div>
            <VendorCard name="Ojuoja Fresh" area="Agric" verified rating={4.8} deliveryMins={40}/>
          </div>
        </aside>
        <div>
          {list.length === 0 ? (
            <EmptyState title="Nothing matches those filters" message="Try widening your area or turning off verified-only." action={<Button size="sm" onClick={()=>setVerifiedOnly(false)}>Clear filters</Button>}/>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
              {list.map((p,i)=><ProductCard key={i} {...p} onAdd={()=>onAdd(p)} onClick={()=>onNav("product")}/>)}
            </div>
          )}
          <div style={{marginTop:40,display:"flex",justifyContent:"center"}}><Pagination page={page} pages={6} onChange={setPage}/></div>
        </div>
      </div>
    </main>
  );
}
Object.assign(window, { CategoryScreen });
