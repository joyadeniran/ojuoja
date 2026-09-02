const { Logo, Icon, SearchField, IconButton, Button } = window.OjuojaDesignSystem_fd3102;

function Header({ onNav, cartCount = 0, active = "home" }) {
  return (
    <header style={{position:"sticky",top:0,zIndex:20,background:"#fff",borderBottom:"1px solid var(--border-subtle)"}}>
      <div style={{maxWidth:"var(--layout-max-wide)",margin:"0 auto",height:"var(--layout-header-h)",padding:"0 32px",display:"flex",alignItems:"center",gap:28}}>
        <a href="#" onClick={(e)=>{e.preventDefault();onNav("home")}} style={{lineHeight:0}}><Logo height={26}/></a>
        <button type="button" style={{display:"inline-flex",alignItems:"center",gap:8,height:36,padding:"0 16px",border:0,borderRadius:"var(--radius-pill)",background:"var(--surface-lime)",color:"var(--oj-green-900)",font:"600 13px/1 var(--font-body)",cursor:"pointer"}}>
          <Icon name="layout-grid" size={14}/>Categories<Icon name="chevron-down" size={14}/>
        </button>
        <nav style={{display:"flex",gap:22,font:"500 13px/1 var(--font-body)"}}>
          <a href="#" onClick={(e)=>e.preventDefault()} style={{color:"var(--text-body)",textDecoration:"none"}}>About Ojuoja</a>
          <a href="#" onClick={(e)=>e.preventDefault()} style={{color:"var(--text-body)",textDecoration:"none"}}>Become a Vendor</a>
        </nav>
        <div style={{flex:1,maxWidth:340,marginLeft:"auto"}}><SearchField submit={false}/></div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <IconButton icon="shopping-basket" variant="solid" label="Basket" count={cartCount} onClick={()=>onNav("basket")}/>
          <span style={{width:38,height:38,borderRadius:"var(--radius-sm)",background:"var(--pattern-market-bars)",backgroundColor:"#fff",display:"inline-block"}}/>
        </div>
      </div>
    </header>
  );
}
Object.assign(window, { Header });
