import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { itemDimensions, type ItemDimension } from "@/data/itemDimensions";
import { Package, Plus, Trash2, Search, PencilLine, X } from "lucide-react";

export interface AddedItem {
  id: string;
  nome: string;
  altura: number;
  largura: number;
  comprimento: number;
  quantidade: number;
}

interface ItemDimensionInputProps {
  items: AddedItem[];
  onItemsChange: (items: AddedItem[]) => void;
}

const ItemDimensionInput = ({ items, onItemsChange }: ItemDimensionInputProps) => {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualNome, setManualNome] = useState("");
  const [altura, setAltura] = useState("");
  const [largura, setLargura] = useState("");
  const [comprimento, setComprimento] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [selectedItem, setSelectedItem] = useState<ItemDimension | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    if (search.length < 2) return [];
    const q = search.toLowerCase();
    return itemDimensions.filter(
      (i) => i.nome.toLowerCase().includes(q) || i.categoria.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectItem = (item: ItemDimension) => {
    setSelectedItem(item);
    setSearch(item.nome);
    setAltura(String(item.altura));
    setLargura(String(item.largura));
    setComprimento(String(item.comprimento));
    setShowSuggestions(false);
    setManualMode(false);
  };

  const handleAdd = () => {
    const a = parseFloat(altura);
    const l = parseFloat(largura);
    const c = parseFloat(comprimento);
    const qty = parseInt(quantidade) || 1;
    const nome = manualMode ? manualNome : (selectedItem?.nome || search);

    if (!nome || isNaN(a) || isNaN(l) || isNaN(c) || a <= 0 || l <= 0 || c <= 0) return;

    const newItem: AddedItem = {
      id: `${Date.now()}-${Math.random()}`,
      nome,
      altura: a,
      largura: l,
      comprimento: c,
      quantidade: qty,
    };
    onItemsChange([...items, newItem]);
    resetForm();
  };

  const resetForm = () => {
    setSearch("");
    setManualNome("");
    setAltura("");
    setLargura("");
    setComprimento("");
    setQuantidade("1");
    setSelectedItem(null);
    setManualMode(false);
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter((i) => i.id !== id));
  };

  const totalArea = items.reduce((sum, i) => sum + ((i.largura / 100) * (i.comprimento / 100)) * i.quantidade, 0);
  const totalVolume = items.reduce((sum, i) => sum + ((i.altura / 100) * (i.largura / 100) * (i.comprimento / 100)) * i.quantidade, 0);

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-foreground block">O que deseja guardar?</label>

      {/* Search or manual toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setManualMode(false); resetForm(); }}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!manualMode ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:border-primary/50"}`}
        >
          <Search size={12} className="inline mr-1" />
          Buscar item
        </button>
        <button
          type="button"
          onClick={() => { setManualMode(true); setSelectedItem(null); setSearch(""); }}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${manualMode ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:border-primary/50"}`}
        >
          <PencilLine size={12} className="inline mr-1" />
          Informar manualmente
        </button>
      </div>

      {!manualMode ? (
        <div ref={containerRef} className="relative">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); setSelectedItem(null); }}
              placeholder="Ex: geladeira, sofá, caixa..."
              className="h-11 md:h-10 pl-9"
              onFocus={() => search.length >= 2 && setShowSuggestions(true)}
            />
            {search && (
              <button type="button" onClick={() => { setSearch(""); setSelectedItem(null); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>
          {showSuggestions && filteredItems.length > 0 && (
            <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md overflow-hidden max-h-[240px] overflow-y-auto">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-left hover:bg-accent/10 transition-colors"
                  onClick={() => handleSelectItem(item)}
                >
                  <div>
                    <span className="font-medium">{item.nome}</span>
                    <span className="text-muted-foreground text-xs ml-2">{item.categoria}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {item.altura}×{item.largura}×{item.comprimento}cm
                  </span>
                </button>
              ))}
            </div>
          )}
          {showSuggestions && search.length >= 2 && filteredItems.length === 0 && (
            <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md p-3 text-center text-sm text-muted-foreground">
              Nenhum item encontrado.{" "}
              <button type="button" className="text-primary underline" onClick={() => { setManualMode(true); setManualNome(search); }}>
                Informar manualmente
              </button>
            </div>
          )}
        </div>
      ) : (
        <Input
          value={manualNome}
          onChange={(e) => setManualNome(e.target.value)}
          placeholder="Nome do item (ex: Estante de livros)"
          className="h-11 md:h-10"
        />
      )}

      {/* Dimension fields - show when item selected or manual mode */}
      {(selectedItem || manualMode) && (
        <div className="space-y-3 p-3 rounded-lg border bg-muted/30">
          <p className="text-xs text-muted-foreground font-medium">Dimensões (cm) — editáveis</p>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Altura</label>
              <Input type="number" min="1" value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="cm" className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Largura</label>
              <Input type="number" min="1" value={largura} onChange={(e) => setLargura(e.target.value)} placeholder="cm" className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Comprimento</label>
              <Input type="number" min="1" value={comprimento} onChange={(e) => setComprimento(e.target.value)} placeholder="cm" className="h-9 text-sm" />
            </div>
          </div>
          <div className="flex gap-2 items-end">
            <div className="w-24">
              <label className="text-[10px] text-muted-foreground mb-1 block">Qtd</label>
              <Input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder="1" className="h-9 text-sm" />
            </div>
            <Button type="button" onClick={handleAdd} className="h-9 flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-sm">
              <Plus size={14} className="mr-1" />
              Adicionar item
            </Button>
          </div>
        </div>
      )}

      {/* Added items list */}
      {items.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground">Itens adicionados ({items.length})</p>
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
            {items.map((item) => {
              const areaItem = ((item.largura / 100) * (item.comprimento / 100)) * item.quantidade;
              const volItem = ((item.altura / 100) * (item.largura / 100) * (item.comprimento / 100)) * item.quantidade;
              return (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Package size={14} className="shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.quantidade > 1 ? `${item.quantidade}x ` : ""}{item.nome}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.altura}×{item.largura}×{item.comprimento}cm · {areaItem.toFixed(2)}m² · {volItem.toFixed(2)}m³
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)} className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs font-semibold p-2 rounded-lg bg-primary/5 border border-primary/10">
            <span className="text-foreground">Total:</span>
            <span className="text-primary">{Math.max(totalArea, 1).toFixed(1)} m² · {totalVolume.toFixed(1)} m³</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDimensionInput;
