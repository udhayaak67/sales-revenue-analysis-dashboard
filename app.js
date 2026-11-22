// SalesPulse: client-side dashboard. No backend or build step required.
const demoRows = [
["2026-01-04","Wireless Mouse","Electronics","Accessories",24,799],
["2026-01-09","Office Chair","Furniture","Furniture",8,5499],
["2026-01-15","Notebook Set","Stationery","Office",42,249],
["2026-02-03","Bluetooth Speaker","Electronics","Audio",15,1899],
["2026-02-11","Desk Lamp","Home & Living","Lighting",18,1299],
["2026-02-21","Wireless Mouse","Electronics","Accessories",31,799],
["2026-03-02","Office Chair","Furniture","Furniture",11,5499],
["2026-03-13","Water Bottle","Home & Living","Kitchen",37,499],
["2026-03-25","Notebook Set","Stationery","Office",55,249],
["2026-04-05","Bluetooth Speaker","Electronics","Audio",22,1899],
["2026-04-14","Desk Lamp","Home & Living","Lighting",25,1299],
["2026-04-27","Wireless Mouse","Electronics","Accessories",29,799],
["2026-05-06","Office Chair","Furniture","Furniture",13,5499],
["2026-05-18","Water Bottle","Home & Living","Kitchen",48,499],
["2026-05-26","Notebook Set","Stationery","Office",61,249],
["2026-06-03","Bluetooth Speaker","Electronics","Audio",27,1899],
["2026-06-12","Desk Lamp","Home & Living","Lighting",32,1299],
["2026-06-24","Wireless Mouse","Electronics","Accessories",36,799],
["2026-07-08","Office Chair","Furniture","Furniture",15,5499],
["2026-07-17","Water Bottle","Home & Living","Kitchen",53,499],
["2026-07-28","Notebook Set","Stationery","Office",72,249],
["2026-08-04","Bluetooth Speaker","Electronics","Audio",34,1899],
["2026-08-16","Desk Lamp","Home & Living","Lighting",39,1299],
["2026-08-25","Wireless Mouse","Electronics","Accessories",41,799],
["2026-09-02","Office Chair","Furniture","Furniture",17,5499],
["2026-09-12","Water Bottle","Home & Living","Kitchen",59,499],
["2026-09-23","Notebook Set","Stationery","Office",80,249],
["2026-10-06","Bluetooth Speaker","Electronics","Audio",38,1899],
["2026-10-15","Desk Lamp","Home & Living","Lighting",44,1299],
["2026-10-27","Wireless Mouse","Electronics","Accessories",47,799],
["2026-11-03","Office Chair","Furniture","Furniture",19,5499],
["2026-11-12","Water Bottle","Home & Living","Kitchen",64,499],
["2026-11-19","Notebook Set","Stationery","Office",88,249]
].map((r,i)=>({date:r[0],product:r[1],category:r[2],segment:r[3],units:r[4],price:r[5],orderId:`ORD-${String(i+1).padStart(4,"0")}`}));

let rows = [...demoRows], revenueChart, categoryChart;
const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n || 0);
const number = n => new Intl.NumberFormat("en-IN").format(n || 0);
const palette = ["#7469e8","#4e83ee","#f0a35c","#31b58b","#df75a8","#8c9bb7"];
function filteredRows(){
  const start=$("startDate").value, end=$("endDate").value, cat=$("categoryFilter").value;
  return rows.filter(r=>(!start||r.date>=start)&&(!end||r.date<=end)&&(cat==="all"||r.category===cat));
}
function groupSum(data,key,valueFn){return data.reduce((a,r)=>{const k=key(r);a[k]=(a[k]||0)+valueFn(r);return a;},{});}
function initFilters(){
  const dates=rows.map(r=>r.date).sort(); $("startDate").value=dates[0]; $("endDate").value=dates[dates.length-1];
  const cats=[...new Set(rows.map(r=>r.category))].sort();
  $("categoryFilter").innerHTML='<option value="all">All categories</option>'+cats.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function render(){
  const data=filteredRows(), revenue=data.reduce((s,r)=>s+r.units*r.price,0), units=data.reduce((s,r)=>s+r.units,0), orders=new Set(data.map(r=>r.orderId)).size;
  $("totalRevenue").textContent=money(revenue); $("totalOrders").textContent=number(orders); $("unitsSold").textContent=number(units); $("avgOrder").textContent=money(orders?revenue/orders:0);
  renderRevenue(data); renderCategories(data,revenue); renderProducts(data,revenue); renderInsights(data,revenue,units);
}
function renderRevenue(data){
  const monthly=groupSum(data,r=>r.date.slice(0,7),r=>r.units*r.price), labels=Object.keys(monthly).sort();
  if(revenueChart) revenueChart.destroy();
  revenueChart=new Chart($("revenueChart"),{type:"line",data:{labels:labels.map(m=>new Date(m+"-02").toLocaleDateString("en-IN",{month:"short",year:"2-digit"})),datasets:[{data:labels.map(m=>monthly[m]),borderColor:"#7167e8",backgroundColor:"rgba(113,103,232,.12)",fill:true,tension:.38,pointRadius:3,pointBackgroundColor:"#7167e8",borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>money(c.raw)}}},scales:{x:{grid:{display:false},ticks:{color:"#929bad",font:{size:10}}},y:{beginAtZero:true,grid:{color:"#f0f2f6"},ticks:{color:"#929bad",font:{size:9},callback:v=>"₹"+(v>=1000?(v/1000).toFixed(0)+"k":v)}}}}});
}
function renderCategories(data,total){
  const sums=groupSum(data,r=>r.category,r=>r.units*r.price), labels=Object.keys(sums).sort((a,b)=>sums[b]-sums[a]);
  if(categoryChart) categoryChart.destroy();
  categoryChart=new Chart($("categoryChart"),{type:"doughnut",data:{labels,datasets:[{data:labels.map(l=>sums[l]),backgroundColor:labels.map((_,i)=>palette[i%palette.length]),borderWidth:0,hoverOffset:5}]},options:{responsive:true,maintainAspectRatio:false,cutout:"70%",plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>`${c.label}: ${money(c.raw)}`}}}}});
  $("categoryLegend").innerHTML=labels.map((l,i)=>`<div class="legend-item"><i class="legend-dot" style="background:${palette[i%palette.length]}"></i>${escapeHtml(l)}<span class="legend-value">${total?Math.round(sums[l]/total*100):0}%</span></div>`).join("")||'<div class="empty-state">No category data</div>';
}
function renderProducts(data,total){
  const products=Object.values(data.reduce((a,r)=>{const p=a[r.product]||(a[r.product]={name:r.product,units:0,revenue:0});p.units+=r.units;p.revenue+=r.units*r.price;return a;},{})).sort((a,b)=>b.revenue-a.revenue).slice(0,5);
  $("productsTable").innerHTML=products.length?products.map((p,i)=>`<tr><td><div class="product-cell"><span class="product-avatar">${escapeHtml(p.name.slice(0,1))}</span>${escapeHtml(p.name)}</div></td><td>${number(p.units)}</td><td><strong>${money(p.revenue)}</strong></td><td><span class="share-track"><span class="share-fill" style="display:block;width:${total?p.revenue/total*100:0}%"></span></span>${total?Math.round(p.revenue/total*100):0}%</td></tr>`).join(""):'<tr><td colspan="4" class="empty-state">No product data for these filters.</td></tr>';
}
function renderInsights(data,revenue,units){
  const category=Object.entries(groupSum(data,r=>r.category,r=>r.units*r.price)).sort((a,b)=>b[1]-a[1])[0];
  const product=Object.entries(groupSum(data,r=>r.product,r=>r.units*r.price)).sort((a,b)=>b[1]-a[1])[0];
  const average=data.length?revenue/data.length:0;
  const items=[
    ["✦","Leading category",category?`${category[0]} contributes ${Math.round(category[1]/(revenue||1)*100)}% of selected revenue.`:"No category data in this period."],
    ["★","Best-selling product",product?`${product[0]} is the top product by revenue at ${money(product[1])}.`:"No product data in this period."],
    ["↗","Sales activity",`${number(units)} units sold across ${number(new Set(data.map(r=>r.orderId)).size)} orders.`],
    ["₹","Average transaction",`${money(average)} revenue per imported sales row.`]
  ];
  $("insights").innerHTML=items.map(x=>`<div class="insight"><span class="insight-icon">${x[0]}</span><div><strong>${x[1]}</strong><p>${x[2]}</p></div></div>`).join("");
}
function parseCSV(text){
  const lines=text.trim().split(/\r?\n/); if(lines.length<2) throw new Error("CSV must contain a header and at least one data row.");
  const headers=lines[0].split(",").map(h=>h.trim().toLowerCase());
  const required=["date","product","category","units","price"];
  const indexes=Object.fromEntries(required.map(k=>[k,headers.indexOf(k)]));
  const missing=required.filter(k=>indexes[k]===-1); if(missing.length) throw new Error("Missing required columns: "+missing.join(", "));
  return lines.slice(1).filter(Boolean).map((line,i)=>{
    const cols=line.split(",").map(v=>v.trim()), date=cols[indexes.date], units=Number(cols[indexes.units]), price=Number(cols[indexes.price]);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!cols[indexes.product]||!cols[indexes.category]||!Number.isFinite(units)||!Number.isFinite(price)||units<0||price<0) throw new Error(`Invalid data on CSV row ${i+2}. Check date, product, category, units and price.`);
    return {date,product:cols[indexes.product],category:cols[indexes.category],segment:headers.includes("segment")?cols[headers.indexOf("segment")]:"Other",units,price,orderId:headers.includes("orderid")&&cols[headers.indexOf("orderid")]?cols[headers.indexOf("orderid")]:`CSV-${i+1}`};
  });
}
$("csvInput").addEventListener("change",async e=>{
  const file=e.target.files[0]; if(!file)return;
  try{rows=parseCSV(await file.text());initFilters();render();document.querySelector(".live-pill").innerHTML='<i></i> Custom data loaded';alert(`Imported ${rows.length} sales rows successfully.`);}
  catch(err){alert("Could not import CSV: "+err.message);}
  e.target.value="";
});
["startDate","endDate","categoryFilter"].forEach(id=>$(id).addEventListener("change",render));
$("resetFilters").addEventListener("click",()=>{initFilters();render();});
$("downloadCsv").addEventListener("click",()=>{
  const headers=["date","product","category","segment","units","price","orderId"];
  const csv=[headers.join(","),...filteredRows().map(r=>headers.map(h=>`"${String(r[h]).replace(/"/g,'""')}"`).join(","))].join("\n");
  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"})),a=document.createElement("a");a.href=url;a.download="sales-dashboard-export.csv";a.click();URL.revokeObjectURL(url);
});
initFilters();render();
