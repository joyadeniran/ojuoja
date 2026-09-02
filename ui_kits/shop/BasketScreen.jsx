const { SectionHeading, CartLine, Card, Button, Input, Checkbox, DeliveryNote, EmptyState, Dialog, Badge } = window.OjuojaDesignSystem_fd3102;

function BasketScreen({ items, onQty, onRemove, onNav, onCheckout }) {
  const [pay, setPay] = React.useState("transfer");
  const [confirm, setConfirm] = React.useState(null);
  const naira = (n)=>"₦"+n.toLocaleString("en-NG");
  const subtotal = items.reduce((s,i)=>s+i.price*i.qty,0);
  const delivery = subtotal > 10000 || subtotal === 0 ? 0 : 700;
  return (
    <main style={{maxWidth:"var(--layout-max)",margin:"0 auto",padding:"40px 32px 96px",position:"relative"}}>
      <SectionHeading title="Your Basket" subtitle={items.length ? `${items.length} item${items.length>1?"s":""} from ${new Set(items.map(i=>i.vendor)).size} vendor(s)` : undefined}/>
      {items.length === 0 ? (
        <div style={{marginTop:32,maxWidth:520}}>
          <EmptyState title="Your basket is empty" message="Start with what's trending in Ikorodu today." action={<Button badgeIcon="shopping-basket" onClick={()=>onNav("home")}>Shop Now!</Button>}/>
        </div>
      ) : (
        <div style={{marginTop:32,display:"grid",gridTemplateColumns:"1fr 360px",gap:40,alignItems:"start"}}>
          <div>
            {items.map((it,i)=>(
              <CartLine key={i} {...it} onQty={(n)=>onQty(i,n)} onRemove={()=>setConfirm(i)}/>
            ))}
            <div style={{marginTop:28,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <Input label="Delivery address" shape="boxy" leadingIcon="map-pin" defaultValue="12 Ita Elewa Road, Ikorodu"/>
              <Input label="Phone number" shape="boxy" leadingIcon="phone" defaultValue="0803 000 0000"/>
            </div>
            <div style={{marginTop:22,display:"flex",flexDirection:"column",gap:12}}>
              <Checkbox radio checked={pay==="transfer"} onChange={()=>setPay("transfer")}>Bank transfer</Checkbox>
              <Checkbox radio checked={pay==="cash"} onChange={()=>setPay("cash")}>Cash to the rider</Checkbox>
            </div>
          </div>
          <Card tone="flat">
            <div style={{font:"600 11px/1 var(--font-body)",letterSpacing:".09em",textTransform:"uppercase",color:"var(--text-faint)"}}>Order summary</div>
            <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:12,fontSize:14,color:"var(--text-body)"}}>
              <div style={{display:"flex",justifyContent:"space-between"}}><span>Subtotal</span><strong>{naira(subtotal)}</strong></div>
              <div style={{display:"flex",justifyContent:"space-between"}}><span>Delivery</span><strong>{delivery ? naira(delivery) : "Free"}</strong></div>
              <div style={{display:"flex",justifyContent:"space-between",paddingTop:12,borderTop:"1px solid var(--border-subtle)",fontSize:17,color:"var(--text-heading)"}}><span>Total</span><strong>{naira(subtotal+delivery)}</strong></div>
            </div>
            <div style={{marginTop:20}}><Button block badgeIcon="wallet" onClick={onCheckout}>Place Order</Button></div>
            <div style={{marginTop:16}}><DeliveryNote icon="clock">Order before <strong>6pm</strong> for same-day delivery</DeliveryNote></div>
            <div style={{marginTop:14,display:"flex",gap:8}}><Badge tone="soft" icon="shield-check">Buyer protection</Badge><Badge tone="lime" icon="bike">35–60 mins</Badge></div>
          </Card>
        </div>
      )}
      <Dialog open={confirm!==null} title="Remove this item?" onClose={()=>setConfirm(null)}
        footer={<><Button variant="ghost" size="sm" onClick={()=>setConfirm(null)}>Keep it</Button><Button variant="danger" size="sm" onClick={()=>{onRemove(confirm);setConfirm(null)}}>Remove</Button></>}>
        {confirm!==null && items[confirm] ? `${items[confirm].name} will be removed from your basket.` : ""}
      </Dialog>
    </main>
  );
}
Object.assign(window, { BasketScreen });
