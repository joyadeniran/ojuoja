const { Logo } = window.OjuojaDesignSystem_fd3102;

const COLS = [
  ["About us","Pricing","Service","Blog","Case studies"],
  ["Vendors","Delivery areas","Support","Careers","Press"],
  ["Terms","Privacy","Refunds","Contact","WhatsApp"],
];

function Footer() {
  return (
    <footer style={{background:"var(--surface-brand)",color:"#fff",paddingTop:64,overflow:"hidden"}}>
      <div style={{maxWidth:"var(--layout-max)",margin:"0 auto",padding:"0 32px",display:"grid",gridTemplateColumns:"1.4fr repeat(3,1fr)",gap:32}}>
        <div style={{color:"rgba(255,255,255,.82)",fontSize:14,maxWidth:"28ch"}}>
          From hidden local gems to your daily essentials, discover the best of Ikorodu's vendors, delivered straight to you.
        </div>
        {COLS.map((col,i)=>(
          <div key={i} style={{display:"flex",flexDirection:"column",gap:12}}>
            {col.map(l=><a key={l} href="#" onClick={(e)=>e.preventDefault()} style={{color:"rgba(255,255,255,.9)",fontSize:14,textDecoration:"none"}}>{l}</a>)}
          </div>
        ))}
      </div>
      <div style={{maxWidth:"var(--layout-max)",margin:"48px auto 0",padding:"20px 32px 0",borderTop:"1px solid var(--border-on-brand)",display:"flex",justifyContent:"space-between",fontSize:13,color:"rgba(255,255,255,.8)"}}>
        <span>All Rights Reserved</span><span>www.ojuoja.shop</span>
      </div>
      <div style={{marginTop:24,display:"flex",justifyContent:"center",overflow:"hidden"}}>
        <img src="../../assets/logo-white.svg" alt="" style={{width:"120%",maxWidth:"none",marginBottom:-40,display:"block"}}/>
      </div>
    </footer>
  );
}
Object.assign(window, { Footer });
