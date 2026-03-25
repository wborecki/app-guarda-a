import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Loader2, ImagePlus, CheckCircle2, AlertTriangle } from "lucide-react";
import { type StepProps } from "./types";
import StepGuidance from "./StepGuidance";

const PHOTO_GUIDE = [
  { emoji: "📷", title: "Visão geral", desc: "Mostre o espaço completo, de um ângulo amplo", priority: "Essencial" },
  { emoji: "🚪", title: "Entrada / acesso", desc: "Como o locatário chega até o espaço", priority: "Essencial" },
  { emoji: "📦", title: "Espaço interno", desc: "Mostre o interior e o que cabe dentro", priority: "Recomendado" },
  { emoji: "🔒", title: "Segurança", desc: "Portão, tranca, câmera ou portaria", priority: "Recomendado" },
  { emoji: "🌤️", title: "Condições", desc: "Mostre que o espaço é limpo e conservado", priority: "Diferencial" },
];

const PHOTO_DONTS = [
  "Fotos escuras ou borradas",
  "Espaço sujo ou desorganizado",
  "Objetos pessoais aparecendo",
  "Fotos de outros cômodos",
];

const StepFotos = ({ space, updateSpace }: StepProps) => {
  const { user } = useAuth();
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalPhotos = (space?.photos?.length || 0) + photoFiles.length;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - totalPhotos;
    if (remaining <= 0) {
      toast({ title: "Limite atingido", description: "Máximo de 5 fotos.", variant: "destructive" });
      return;
    }
    setPhotoFiles(prev => [...prev, ...files.slice(0, remaining)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadPhotos = async () => {
    if (!space || !user || photoFiles.length === 0) return;
    setUploadingPhotos(true);
    const uploaded: string[] = [];

    for (const file of photoFiles) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${space.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("space-photos").upload(path, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from("space-photos").getPublicUrl(path);
        uploaded.push(urlData.publicUrl);
      }
    }

    const newPhotos = [...(space.photos || []), ...uploaded];
    await updateSpace({ photos: newPhotos });
    setPhotoFiles([]);
    setUploadingPhotos(false);
    if (uploaded.length > 0) {
      toast({ title: `✅ ${uploaded.length} foto(s) enviada(s) com sucesso!` });
    }
  };

  const removePhoto = async (url: string) => {
    if (!space) return;
    await updateSpace({ photos: space.photos.filter(p => p !== url) });
  };

  return (
    <div className="space-y-5">
      <StepGuidance
        icon={Camera}
        title="Fotos que geram confiança"
        subtitle="Espaços com fotos recebem até 5x mais interesse. Mostre que seu espaço é real, organizado e seguro."
        tip="Use luz natural, tire fotos de diferentes ângulos e mantenha o espaço limpo antes de fotografar."
      />

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Camera size={16} className="text-accent" /> Fotos do espaço
          </h2>
          <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            Opcional, mas recomendado
          </span>
        </div>

        {/* Photo guide cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PHOTO_GUIDE.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-secondary/30 border border-border/50">
              <span className="text-base mt-0.5">{item.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[11px] font-semibold text-foreground">{item.title}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                    item.priority === "Essencial" ? "bg-accent/10 text-accent" :
                    item.priority === "Recomendado" ? "bg-primary/10 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>{item.priority}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* What to avoid */}
        <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
          <p className="text-[10px] font-semibold text-destructive mb-1.5 flex items-center gap-1">
            <AlertTriangle size={10} /> O que evitar:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PHOTO_DONTS.map((item, i) => (
              <span key={i} className="text-[10px] text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/50">
                ✕ {item}
              </span>
            ))}
          </div>
        </div>

        {/* Photos grid */}
        {(space.photos?.length > 0 || photoFiles.length > 0) && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {(space.photos || []).map((url, i) => (
              <div key={`existing-${i}`} className="relative group aspect-square">
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full rounded-xl object-cover border border-border" />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-xs"
                >
                  <X size={12} />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[8px] bg-foreground/70 text-background px-1.5 py-0.5 rounded-md font-medium">
                    Capa
                  </span>
                )}
              </div>
            ))}
            {photoFiles.map((file, i) => (
              <div key={`new-${i}`} className="relative group aspect-square">
                <img src={URL.createObjectURL(file)} alt={`Nova ${i + 1}`} className="w-full h-full rounded-xl object-cover border-2 border-dashed border-accent/40" />
                <button
                  type="button"
                  onClick={() => setPhotoFiles(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-xs"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload area */}
        {totalPhotos < 5 && (
          <label className="flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed border-border hover:border-accent/50 transition-colors cursor-pointer bg-secondary/10 hover:bg-secondary/20">
            <ImagePlus size={24} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground text-center">
              Arraste ou clique para adicionar fotos
            </span>
            <span className="text-[10px] text-muted-foreground/60">{totalPhotos}/5 fotos · JPG, PNG</span>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
          </label>
        )}

        {totalPhotos >= 5 && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
            <CheckCircle2 size={13} className="text-primary" />
            <span className="text-[11px] text-primary font-medium">Máximo de fotos atingido ✓</span>
          </div>
        )}

        {photoFiles.length > 0 && (
          <Button
            type="button"
            onClick={uploadPhotos}
            disabled={uploadingPhotos}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm h-10"
          >
            {uploadingPhotos ? <><Loader2 size={14} className="animate-spin mr-1.5" /> Enviando...</> : `Enviar ${photoFiles.length} foto(s)`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepFotos;
