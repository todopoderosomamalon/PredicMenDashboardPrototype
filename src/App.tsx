import { useMemo, useState, type ReactNode } from "react";
import { cafeData, type PeriodKey, type SeasonKey, type StoreKey } from "./data";

type Page = "Resumen" | "Ventas" | "Menú sugerido" | "Inventario" | "Alertas de clima" | "Reportes" | "Tiendas";
type IconName = "grid" | "chart" | "menu" | "box" | "cloud" | "file" | "store" | "arrow" | "plus" | "download" | "check" | "close" | "sort" | "hamburger";
type ClimateDecision = "Aprobado" | "Ignorado" | null;

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    chart: <><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h10"/><circle cx="19" cy="18" r="2"/></>,
    box: <><path d="m21 8-9 5-9-5"/><path d="M3 8l9-5 9 5v9l-9 5-9-5Z"/><path d="M12 13v9"/></>,
    cloud: <><path d="M17.5 19H6a4 4 0 0 1-.5-8 6.5 6.5 0 0 1 12.4-1.4A4.8 4.8 0 0 1 17.5 19Z"/><path d="M8 22h8"/></>,
    file: <><path d="M6 2h9l4 4v16H6Z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h6"/></>,
    store: <><path d="M3 9h18l-2-6H5Z"/><path d="M5 9v12h14V9"/><path d="M9 21v-7h6v7"/></>,
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    download: <><path d="M12 3v13"/><path d="m7 11 5 5 5-5"/><path d="M4 21h16"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    sort: <path d="m8 9 4-4 4 4M16 15l-4 4-4-4"/>,
    hamburger: <path d="M4 6h16M4 12h16M4 18h16"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Button({ children, variant = "primary", icon, onClick, type = "button" }: { children: ReactNode; variant?: "primary" | "secondary" | "dark" | "warning" | "ghost"; icon?: IconName; onClick?: () => void; type?: "button" | "submit" }) {
  return <button type={type} className={`btn btn-${variant}`} onClick={onClick}>{icon && <Icon name={icon} size={16}/>}<span>{children}</span></button>;
}
function Card({ children, className = "" }: { children: ReactNode; className?: string }) { return <section className={`card ${className}`}>{children}</section>; }
function PageHeader({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: ReactNode }) { return <header className="page-header"><div><div className="eyebrow">{eyebrow || "Panel de predicción"}</div><h1>{title}</h1></div>{action}</header>; }
function CardTitle({ children, detail }: { children: ReactNode; detail?: string }) { return <div className="card-heading"><h2>{children}</h2>{detail && <span>{detail}</span>}</div>; }
function Metric({ label, value, note }: { label: string; value: string; note?: string }) { return <Card className="metric"><span className="metric-label">{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</Card>; }
function Badge({ children, tone = "brown" }: { children: ReactNode; tone?: "green" | "orange" | "blue" | "gray" | "red" | "brown" }) { return <span className={`badge badge-${tone}`}>{children}</span>; }
function Toast({ children }: { children: ReactNode }) { return <div className="toast"><Icon name="check"/><span>{children}</span></div>; }

function BarChart({ values, labels, active, compare }: { values: number[]; labels: string[]; active?: number; compare?: number[] }) {
  return <div className="bar-chart">{values.map((value, index) => <div className="bar-group" key={labels[index]}><div className="bars"><div className={`bar ${active === undefined || active === index ? "bar-strong" : "bar-soft"}`} style={{ height: `${Math.min(value, 100)}%` }}><span className="chart-tooltip">{value}k</span></div>{compare && <div className="bar bar-gray" style={{ height: `${compare[index]}%` }}><span className="chart-tooltip">{compare[index]}k</span></div>}</div><span>{labels[index]}</span></div>)}</div>;
}
function HorizontalBars({ values }: { values: number[] }) { return <div className="horizontal-bars">{["Bebidas", "Panadería", "Alimentos"].map((label, index) => <div className="horizontal-row" key={label}><span>{label}</span><div><i style={{ width: `${values[index]}%` }}/></div><b>{values[index]}%</b></div>)}</div>; }
const statusTone = (status: string) => status === "En stock" ? "green" : status.includes("Comprar") ? "orange" : status.includes("Ajustado") ? "blue" : status.includes("Baja") ? "red" : status.includes("Estable") ? "gray" : "brown";
function DataTable({ headers, rows, sortable = false, onSort, selectedCell }: { headers: string[]; rows: (string | number | ReactNode)[][]; sortable?: boolean; onSort?: (index: number) => void; selectedCell?: [number, number] }) {
  return <div className="table-wrap"><table><thead><tr>{headers.map((header, index) => <th key={header} onClick={() => sortable && onSort?.(index)} className={sortable ? "sortable" : ""}>{header}{sortable && <Icon name="sort" size={13}/>}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, index) => <td key={index} className={selectedCell?.[0] === rowIndex && selectedCell[1] === index ? "selected-data-cell" : undefined}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) { return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true"><div className="modal-head"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Cerrar"><Icon name="close"/></button></div>{children}</div></div>; }
function StoreSelect({ store, setStore }: { store: StoreKey; setStore: (store: StoreKey) => void }) { return <div className="select-shell"><span>Tienda</span><select value={store} onChange={(e) => setStore(e.target.value as StoreKey)}>{Object.keys(cafeData.stores).map((name) => <option key={name}>{name}</option>)}</select></div>; }
function PeriodPills({ period, setPeriod }: { period: PeriodKey; setPeriod: (period: PeriodKey) => void }) { return <div className="pills period-pills">{(["Semana", "Mes", "Estación"] as PeriodKey[]).map((item) => <button key={item} className={period === item ? "active" : ""} onClick={() => setPeriod(item)}>{item}</button>)}</div>; }
function HeaderControls({ store, setStore, period, setPeriod }: { store: StoreKey; setStore: (store: StoreKey) => void; period?: PeriodKey; setPeriod?: (period: PeriodKey) => void }) { return <div className="header-controls"><StoreSelect store={store} setStore={setStore}/>{period && setPeriod && <PeriodPills period={period} setPeriod={setPeriod}/>}</div>; }
const adjustedUnits = (name: string, units: number, approved: boolean) => approved && cafeData.weather.adjustedProductNames.includes(name) ? Math.round(units * cafeData.weather.salesFactor) : units;
const money = (value: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);

function Summary({ setPage, store, setStore, climateApproved }: { setPage: (page: Page) => void; store: StoreKey; setStore: (store: StoreKey) => void; climateApproved: boolean }) {
  const [period, setPeriod] = useState<PeriodKey>("Semana");
  const [season, setSeason] = useState<SeasonKey>("Verano");
  const seasons = Object.keys(cafeData.seasons) as SeasonKey[];
  const seasonData = cafeData.seasons[season];
  const storeFactor = cafeData.stores[store].factor;
  const periodData = cafeData.periods[period];
  const climateFactor = climateApproved ? 1.06 : 1;
  const values = periodData.values.map((value) => Math.round(value * storeFactor * climateFactor));
  return <>
    <PageHeader title="Predicción por temporada" eyebrow={`Tienda: ${store}`} action={<HeaderControls store={store} setStore={setStore} period={period} setPeriod={setPeriod}/>}/>
    {period === "Estación" && <div className="season-row"><span>Temporada</span><div className="pills">{seasons.map((item) => <button key={item} className={season === item ? "active" : ""} onClick={() => setSeason(item)}>{item}</button>)}</div></div>}
    <div className="alert alert-warning"><div className="alert-icon"><Icon name="cloud"/></div><div><b>Aviso de clima</b><span>El pronóstico cambió: {cafeData.weather.description}. Se ajustó la predicción de la próxima semana.</span></div><Button variant="warning" onClick={() => setPage("Alertas de clima")}>Ver alerta</Button></div>
    <div className="metric-grid"><Metric label="Ventas previstas" value={money(seasonData.sales * storeFactor * periodData.multiplier * climateFactor)} note={`Vista por ${period.toLowerCase()}`}/><Metric label="Producto estrella" value={seasonData.star} note="Mayor demanda prevista"/><Metric label="Combos sugeridos" value="3" note="Listos para promoción"/><Metric label="Precisión del modelo" value={seasonData.accuracy} note="Últimos 90 días"/></div>
    <div className="two-columns">
      <Card><CardTitle detail={periodData.detail}>Ventas previstas</CardTitle><BarChart values={values} labels={periodData.labels} active={period === "Estación" ? seasons.indexOf(season) : undefined}/></Card>
      <Card><CardTitle>Menú sugerido para {season.toLowerCase()}</CardTitle><div className="recommendations">{cafeData.summaryCombos.map((combo, index) => <div className="rec cream" key={combo}><span>Combo {index + 1}</span><b>{combo}</b></div>)}<Button variant="dark" icon="arrow" onClick={() => setPage("Menú sugerido")}>Ver menú completo</Button></div></Card>
    </div>
    <Card><CardTitle detail={`Plan para ${season.toLowerCase()}`}>Ingredientes estimados (apoyo)</CardTitle><DataTable selectedCell={[0, 1]} headers={["Ingrediente", "Cantidad semanal", "Total estación", "Estado"]} rows={cafeData.seasonalIngredients.map((row) => [...row.slice(0, 3), <Badge tone={statusTone(row[3])}>{row[3]}</Badge>])}/></Card>
  </>;
}

function Sales({ store, setStore, climateApproved }: { store: StoreKey; setStore: (store: StoreKey) => void; climateApproved: boolean }) {
  const [period, setPeriod] = useState<PeriodKey>("Semana");
  const [sort, setSort] = useState({ index: 2, asc: false });
  const factor = cafeData.stores[store].factor;
  const periodData = cafeData.periods[period];
  const products = cafeData.products.map((row) => [row[0], row[1], Math.round(adjustedUnits(row[0], row[2], climateApproved) * factor * periodData.multiplier), row[3]]).sort((a, b) => {
    const result = typeof a[sort.index] === "number" ? Number(a[sort.index]) - Number(b[sort.index]) : String(a[sort.index]).localeCompare(String(b[sort.index]));
    return sort.asc ? result : -result;
  });
  return <>
    <PageHeader title="Predicción de ventas" eyebrow={`Tienda: ${store}`} action={<HeaderControls store={store} setStore={setStore} period={period} setPeriod={setPeriod}/>}/>
    <Card><CardTitle detail={periodData.detail}>Ventas previstas por {period === "Semana" ? "semana" : period === "Mes" ? "mes" : "estación"}</CardTitle><BarChart values={periodData.values.map((value) => Math.round(value * factor * (climateApproved ? 1.06 : 1)))} labels={periodData.labels}/></Card>
    <div className="two-columns uneven"><Card><CardTitle>Por categoría</CardTitle><HorizontalBars values={cafeData.categories.map((value) => Math.round(value * (.75 + factor * .25)))}/></Card><Card><CardTitle>Horas pico</CardTitle><div className="peak"><span>Mayor flujo esperado</span><strong>{cafeData.stores[store].peak}</strong><div><span>Día más fuerte</span><b>{cafeData.stores[store].day}</b></div></div></Card></div>
    <Card><CardTitle detail="Haz clic en una columna para ordenar">Productos previstos</CardTitle><DataTable sortable onSort={(index) => setSort((previous) => ({ index, asc: previous.index === index ? !previous.asc : true }))} headers={["Producto", "Categoría", "Unidades previstas", "Tendencia"]} rows={products.map((row) => [row[0], row[1], Number(row[2]).toLocaleString("es-MX"), <Badge tone={statusTone(String(row[3]))}>{row[3]}</Badge>])}/></Card>
  </>;
}

function SuggestedMenu({ store, setStore, climateApproved }: { store: StoreKey; setStore: (store: StoreKey) => void; climateApproved: boolean }) {
  const [period, setPeriod] = useState<PeriodKey>("Semana");
  const [promotions, setPromotions] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const factor = cafeData.stores[store].factor * cafeData.periods[period].multiplier;
  const toggle = (name: string) => {
    const active = promotions.includes(name);
    setPromotions(active ? promotions.filter((item) => item !== name) : [...promotions, name]);
    setToast(active ? "Combo retirado de la promoción." : "Combo agregado a la promoción.");
    window.setTimeout(() => setToast(""), 2200);
  };
  return <>
    <PageHeader title="Menú sugerido" eyebrow={`Combos según las ventas previstas · Tienda: ${store}`} action={<HeaderControls store={store} setStore={setStore} period={period} setPeriod={setPeriod}/>}/>
    <div className="combo-grid">{cafeData.combos.map((combo) => {
      const active = promotions.includes(combo.name);
      const units = Math.round(adjustedUnits(combo.beverage, combo.units, climateApproved) * factor);
      return <Card className="combo-card" key={combo.name}><div className="combo-accent"/><span className="combo-label">Combo recomendado</span><h2>{combo.name}</h2><div className="combo-units"><strong>{units.toLocaleString("es-MX")}</strong><span>unidades previstas</span></div><div className="combo-price"><strong>{money(combo.price)}</strong><small>{money(combo.normalPrice)} precio normal</small></div><Button variant={active ? "dark" : "primary"} icon="check" onClick={() => toggle(combo.name)}>{active ? "En promoción ✓" : "Usar en promoción"}</Button></Card>;
    })}</div>
    <Card><CardTitle detail={`Ordenado por demanda · ${period.toLowerCase()}`}>Productos con más venta prevista</CardTitle><DataTable headers={["Puesto", "Producto", "Categoría", "Unidades", "Tendencia"]} rows={cafeData.products.map((row, index) => [index + 1, row[0], row[1], Math.round(adjustedUnits(row[0], row[2], climateApproved) * factor).toLocaleString("es-MX"), <Badge tone={statusTone(row[3])}>{row[3]}</Badge>])}/></Card>
    {toast && <Toast>{toast}</Toast>}
  </>;
}

function Inventory({ store, setStore }: { store: StoreKey; setStore: (store: StoreKey) => void }) {
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tab, setTab] = useState<"Pedido de la estación" | "Revisión a mitad">("Pedido de la estación");
  return <>
    <PageHeader title="Inventario (apoyo)" eyebrow={`Tienda: ${store}`} action={<HeaderControls store={store} setStore={setStore}/>}/>
    <div className="inventory-toolbar"><div className="pills"><button className={tab === "Pedido de la estación" ? "active" : ""} onClick={() => setTab("Pedido de la estación")}>Pedido de la estación</button><button className={tab === "Revisión a mitad" ? "active" : ""} onClick={() => setTab("Revisión a mitad")}>Revisión a mitad</button></div>{tab === "Pedido de la estación" && <Button icon="plus" onClick={() => { setModal(true); setSuccess(false); }}>Generar pedido de la estación</Button>}</div>
    {tab === "Revisión a mitad" ? <div className="alert coverage-alert"><div className="alert-icon"><Icon name="box"/></div><div><b>Cobertura estimada a mitad de la estación</b><span>Revisa cuántas semanas alcanza cada ingrediente antes de hacer ajustes.</span></div></div> : <div className="metric-grid three"><Metric label="Ingredientes a comprar" value="8" note="3 requieren prioridad"/><Metric label="En stock suficiente" value="14" note="Cobertura para 9 días"/><Metric label="Riesgo de merma" value="3.2%" note="−1.4% vs. mes anterior"/></div>}
    {tab === "Revisión a mitad" ? <Card><CardTitle>Cobertura por ingrediente</CardTitle><DataTable headers={["Ingrediente", "Cobertura estimada", "Recomendación"]} rows={cafeData.stockCoverage}/></Card> : <Card><CardTitle detail="Un pedido al inicio de la estación, con 10% de margen de seguridad">Pedido sugerido por ingrediente</CardTitle><DataTable headers={["Ingrediente", "Recetas que lo usan", "Por semana", "Total estación", "Estado"]} rows={cafeData.inventory.map((row) => [...row.slice(0, 4), <Badge tone={statusTone(row[4])}>{row[4]}</Badge>])}/></Card>}
    <Card className="recipe-example"><div><span>Receta de ejemplo</span><b>Latte clásico</b></div><p>18 g de café molido + 220 ml de leche · Proyección basada en ventas previstas.</p></Card>
    {modal && <Modal title="Pedido de la estación" onClose={() => setModal(false)}>{success ? <div className="success-state"><div><Icon name="check" size={28}/></div><h3>Pedido generado</h3><p>La solicitud quedó lista para revisión del proveedor.</p><Button onClick={() => setModal(false)}>Cerrar</Button></div> : <><p className="modal-intro">Incluye 10% de margen de seguridad. Revisa las cantidades antes de confirmar.</p><DataTable headers={["Ingrediente", "Cantidad"]} rows={cafeData.inventory.slice(0, 4).map((row) => [row[0], row[3]])}/><div className="modal-actions"><Button variant="secondary" onClick={() => setModal(false)}>Cancelar</Button><Button icon="check" onClick={() => setSuccess(true)}>Confirmar</Button></div></>}</Modal>}
  </>;
}

function WeatherAlerts({ store, setStore, decision, setDecision }: { store: StoreKey; setStore: (store: StoreKey) => void; decision: ClimateDecision; setDecision: (decision: ClimateDecision) => void }) {
  const weather = cafeData.weather;
  const factor = cafeData.stores[store].factor;
  const history = [["12 jun 2025", "Lluvia intensa → Nublado", "Aprobado"], ["02 jun 2025", "22 °C → 18 °C", "Ignorado"]];
  if (decision) history.unshift(["Hoy, 08:42", `${weather.previous} → ${weather.current}`, decision]);
  return <>
    <PageHeader title="Alertas de clima" eyebrow={`Si el pronóstico cambia, se ajusta la predicción y el menú. · Tienda: ${store}`} action={<StoreSelect store={store} setStore={setStore}/>}/>
    <div className={`alert ${decision === "Aprobado" ? "alert-success" : "alert-warning"}`}><div className="alert-icon"><Icon name={decision === "Aprobado" ? "check" : "cloud"}/></div><div><b>{decision === "Aprobado" ? "Ajuste aprobado correctamente" : "Cambio detectado"}</b><span>Pronóstico {weather.previous} → {weather.current} para {weather.date}.</span></div>{decision && <Badge tone={decision === "Aprobado" ? "green" : "gray"}>{decision}</Badge>}</div>
    <div className="two-columns"><Card><CardTitle>Predicción original</CardTitle><DataTable headers={["Producto", "Unidades"]} rows={weather.originalProducts.map(([name, units]) => [name, Math.round(units * factor).toLocaleString("es-MX")])}/></Card><Card className="adjusted-card"><CardTitle detail="+30% en bebidas frías">Predicción ajustada por clima</CardTitle><DataTable headers={["Producto", "Unidades"]} rows={weather.originalProducts.map(([name, units]) => [name, <span className={weather.adjustedProductNames.includes(name) ? "changed-value" : ""}>{Math.round(adjustedUnits(name, units, true) * factor).toLocaleString("es-MX")}</span>])}/><div className="card-actions"><Button icon="check" onClick={() => setDecision("Aprobado")}>Aprobar ajuste</Button><Button variant="secondary" onClick={() => setDecision("Ignorado")}>Mantener original</Button></div></Card></div>
    <Card><CardTitle>Historial de alertas</CardTitle><DataTable headers={["Fecha", "Cambio de clima", "Acción"]} rows={history.map((row) => [row[0], row[1], <Badge tone={row[2] === "Aprobado" ? "green" : "gray"}>{row[2]}</Badge>])}/></Card>
  </>;
}

function Reports({ store, setStore }: { store: StoreKey; setStore: (store: StoreKey) => void }) {
  const [toast, setToast] = useState(false);
  const factor = cafeData.stores[store].factor;
  return <><PageHeader title="Reportes" eyebrow={`Tienda: ${store}`} action={<div className="header-controls"><StoreSelect store={store} setStore={setStore}/><Button icon="download" onClick={() => { setToast(true); window.setTimeout(() => setToast(false), 2600); }}>Exportar PDF</Button></div>}/><Card><div className="chart-title-row"><CardTitle detail="Comparativo en miles de MXN">Previsto vs. real</CardTitle><div className="legend"><span><i className="brown-dot"/>Previsto</span><span><i className="gray-dot"/>Real</span></div></div><BarChart values={cafeData.reports.predicted.map((v) => Math.round(v * factor))} compare={cafeData.reports.actual.map((v) => Math.round(v * factor))} labels={["Primavera", "Verano", "Otoño", "Invierno"]}/></Card><div className="metric-grid three"><Metric label="Error promedio" value="5.8%" note="−0.9% este trimestre"/><Metric label="Merma evitada" value="$8,420" note="Equivale a 740 kg"/><Metric label="Ajustes de emergencia" value="12" note="9 aprobados · 3 ignorados"/></div>{toast && <Toast>Tu reporte se exportó correctamente.</Toast>}</>;
}

type Location = { name: string; zone: string; sales: string; order: string; alerts: number; star: string };
function Locations({ goToSummary }: { goToSummary: (store: StoreKey) => void }) {
  const [locations, setLocations] = useState<Location[]>(cafeData.locations);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({ name: "", zone: "" });
  const [recipes, setRecipes] = useState(cafeData.recipes);
  const addLocation = () => { if (!form.name.trim() || !form.zone.trim()) return; setLocations([...locations, { name: form.name, zone: form.zone, sales: "$0", order: "Pendiente", alerts: 0, star: "Por calcular" }]); setForm({ name: "", zone: "" }); setAddModal(false); };
  return <>
    <PageHeader title="Tiendas" action={<Button icon="plus" onClick={() => setAddModal(true)}>Agregar tienda</Button>}/>
    <div className="branch-grid">{locations.map((location) => <Card className="branch-card" key={location.name}><div className="branch-top"><div className="branch-symbol"><Icon name="store"/></div><div><h2>{location.name}</h2><span>{location.zone}</span></div></div><div className="branch-stats"><div><span>Ventas previstas</span><b>{location.sales}</b></div><div><span>Ingredientes a pedir</span><b>{location.order}</b></div><div><span>Producto estrella</span><b>{location.star}</b></div><div><span>Alertas activas</span><Badge tone={location.alerts ? "orange" : "gray"}>{location.alerts}</Badge></div></div><Button variant="dark" icon="arrow" onClick={() => goToSummary(location.name as StoreKey)}>Ver detalle</Button></Card>)}</div>
    <div className="location-note"><Icon name="plus"/><span>Las tiendas nuevas se suman solas: solo hay que cargar sus ventas en el historial.</span></div>
    <Card><CardTitle detail="Valores por porción · haz clic para editar">Configuración de recetas</CardTitle><div className="recipe-grid">{recipes.map((recipe, index) => <div className="recipe-row" key={`${recipe.product}-${recipe.ingredient}`}><div><b>{recipe.product}</b><span>{recipe.ingredient}</span></div><label>Cantidad <input type="number" value={recipe.amount} onChange={(e) => setRecipes(recipes.map((r, i) => i === index ? { ...r, amount: Number(e.target.value) } : r))}/><small>{recipe.ingredient === "Pan" ? "u." : recipe.ingredient === "Leche" ? "ml" : "g"}</small></label></div>)}</div></Card>
    {addModal && <Modal title="Agregar tienda" onClose={() => setAddModal(false)}><form onSubmit={(e) => { e.preventDefault(); addLocation(); }}><label className="field">Nombre de la tienda<input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Tienda 4"/></label><label className="field">Zona<input value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} placeholder="Ej. Cancún · Zona sur"/></label><div className="modal-actions"><Button variant="secondary" onClick={() => setAddModal(false)}>Cancelar</Button><Button type="submit" icon="plus">Agregar tienda</Button></div></form></Modal>}
  </>;
}

export default function App() {
  const [page, setPage] = useState<Page>("Resumen");
  const [store, setStore] = useState<StoreKey>("Todas");
  const [climateDecision, setClimateDecision] = useState<ClimateDecision>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menu: { name: Page; icon: IconName }[] = [
    { name: "Resumen", icon: "grid" }, { name: "Ventas", icon: "chart" }, { name: "Menú sugerido", icon: "menu" }, { name: "Inventario", icon: "box" },
    { name: "Alertas de clima", icon: "cloud" }, { name: "Reportes", icon: "file" }, { name: "Tiendas", icon: "store" },
  ];
  const content = useMemo(() => {
    const common = { store, setStore };
    if (page === "Resumen") return <Summary {...common} setPage={setPage} climateApproved={climateDecision === "Aprobado"}/>;
    if (page === "Ventas") return <Sales {...common} climateApproved={climateDecision === "Aprobado"}/>;
    if (page === "Menú sugerido") return <SuggestedMenu {...common} climateApproved={climateDecision === "Aprobado"}/>;
    if (page === "Inventario") return <Inventory {...common}/>;
    if (page === "Alertas de clima") return <WeatherAlerts {...common} decision={climateDecision} setDecision={setClimateDecision}/>;
    if (page === "Reportes") return <Reports {...common}/>;
    return <Locations goToSummary={(selectedStore) => { setStore(selectedStore); setPage("Resumen"); }}/>;
  }, [page, store, climateDecision]);
  return <div className="app-shell">
    <header className="mobile-header"><button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}><Icon name={menuOpen ? "close" : "hamburger"}/></button><div className="brand"><div className="brand-mark"><span/><span/><span/></div><strong>CaféSmart</strong></div></header>
    {menuOpen && <button className="nav-overlay" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú"/>}
    <aside className={`sidebar ${menuOpen ? "mobile-open" : ""}`}><div className="brand"><div className="brand-mark"><span/><span/><span/></div><strong>CaféSmart</strong></div><nav><span className="nav-label">Navegación</span>{menu.map((item) => <button key={item.name} className={page === item.name ? "active" : ""} onClick={() => { setPage(item.name); setMenuOpen(false); }}><Icon name={item.icon}/><span>{item.name}</span>{page === item.name && <i/>}</button>)}</nav><div className="sidebar-footer"><div className="avatar">CS</div><div><b>CaféSmart</b><span>Administrador</span></div></div></aside>
    <main><div className="content">{content}</div></main>
  </div>;
}
