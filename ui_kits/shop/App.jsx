const { Toast } = window.OjuojaDesignSystem_fd3102;

function App() {
  const [screen, setScreen] = React.useState("home");
  const [items, setItems] = React.useState([
    { name:"Ijebu garri (2kg)", vendor:"Mama T Stores", price:2400, qty:2, image: window.PHOTO+"prod-greens.png" },
    { name:"Bell peppers, mixed (1kg)", vendor:"Ojuoja Fresh", price:3200, qty:1, image: window.PHOTO+"prod-peppers.png" },
  ]);
  const [toast, setToast] = React.useState(null);

  const nav = (s) => { setScreen(s); window.scrollTo({ top: 0 }); };
  const add = (p) => {
    setItems(prev => {
      const i = prev.findIndex(x => x.name === p.name);
      if (i > -1) { const next = [...prev]; next[i] = { ...next[i], qty: next[i].qty + 1 }; return next; }
      return [...prev, { name:p.name, vendor:p.vendor, price:p.price, qty:1, image:p.image }];
    });
    setToast({ tone:"success", title:"Added to basket", message: p.name + (p.vendor ? " from " + p.vendor : "") });
  };
  React.useEffect(() => { if (!toast) return; const t = setTimeout(()=>setToast(null), 3600); return ()=>clearTimeout(t); }, [toast]);

  return (
    <div>
      <window.Header onNav={nav} cartCount={items.reduce((s,i)=>s+i.qty,0)} active={screen}/>
      {screen === "home" && <window.HomeScreen onNav={nav} onAdd={add}/>}
      {screen === "category" && <window.CategoryScreen onNav={nav} onAdd={add}/>}
      {screen === "product" && <window.ProductScreen onNav={nav} onAdd={add}/>}
      {screen === "basket" && (
        <window.BasketScreen items={items} onNav={nav}
          onQty={(i,n)=>setItems(prev=>prev.map((x,j)=>j===i?{...x,qty:n}:x))}
          onRemove={(i)=>setItems(prev=>prev.filter((_,j)=>j!==i))}
          onCheckout={()=>setToast({tone:"info",icon:"bike",title:"Order placed",message:"A rider will call you in a few minutes."})}/>
      )}
      <window.Footer/>
      {toast && (
        <div style={{position:"fixed",right:24,bottom:24,zIndex:50}}>
          <Toast {...toast} onClose={()=>setToast(null)}/>
        </div>
      )}
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
