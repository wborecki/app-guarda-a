import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Loader2, ImagePlus } from "lucide-react";
import { type StepProps, PHOTO_TIPS } from "./types";

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
      toast({ title: `${uploaded.length} foto(s) enviada(s)!` });
    }
  };

  const removePhoto = async (url: string) => {
    if (!space) return;
    await updateSpace({ photos: space.photos.filter(p => p !== url) });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Camera size={16} className="text-accent" /> Fotos do espaço
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Fotos reais aumentam a confiança e as chances de reserva. <span className="font-medium text-foreground">Opcional, mas recomendado.</span>
          </p>
        </div>

        {/* Tips as simple list */}
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
          <p className="text-[11px] font-medium text-foreground mb-1.5">📸 Sugestões de fotos:</p>
          <ul className="text-[11px] text-muted-foreground space-y-0.5">
            {PHOTO_TIPS.map((tip, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
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
            <span className="text-[10px] text-muted-foreground/60">{totalPhotos}/5 fotos</span>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
          </label>
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
