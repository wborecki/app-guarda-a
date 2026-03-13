import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { type StepProps, PHOTO_TIPS } from "./types";

const StepFotos = ({ space, updateSpace }: StepProps) => {
  const { user } = useAuth();
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentCount = (space?.photos?.length || 0) + photoFiles.length;
    const remaining = 5 - currentCount;
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
      toast({ title: `${uploaded.length} foto(s) enviada(s)` });
    }
  };

  const removePhoto = async (url: string) => {
    if (!space) return;
    const newPhotos = space.photos.filter(p => p !== url);
    await updateSpace({ photos: newPhotos });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Camera size={16} className="text-accent" /> Fotos do espaço
        </h2>
        <p className="text-xs text-muted-foreground">
          Envie até 5 fotos do seu espaço. Boas fotos aumentam as chances de reserva.
        </p>

        {/* Tips */}
        <div className="grid grid-cols-2 gap-2">
          {PHOTO_TIPS.map((tip, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/60">
              <Camera size={12} className="text-muted-foreground shrink-0" />
              <span className="text-[11px] text-muted-foreground">{tip}</span>
            </div>
          ))}
        </div>

        {/* Existing photos */}
        {space.photos && space.photos.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {space.photos.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} alt={`Foto ${i + 1}`} className="w-24 h-24 rounded-xl object-cover border border-border" />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New photo previews */}
        {photoFiles.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {photoFiles.map((file, i) => (
              <div key={i} className="relative group">
                <img src={URL.createObjectURL(file)} alt={`Nova ${i + 1}`} className="w-24 h-24 rounded-xl object-cover border-2 border-dashed border-accent/40" />
                <button
                  type="button"
                  onClick={() => setPhotoFiles(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload area */}
        {((space.photos?.length || 0) + photoFiles.length) < 5 && (
          <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-accent/40 transition-colors cursor-pointer bg-secondary/20">
            <Upload size={20} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Clique para selecionar fotos ({(space.photos?.length || 0) + photoFiles.length}/5)
            </span>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
          </label>
        )}

        {photoFiles.length > 0 && (
          <Button
            type="button"
            onClick={uploadPhotos}
            disabled={uploadingPhotos}
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm"
          >
            {uploadingPhotos ? <><Loader2 size={14} className="animate-spin mr-1" /> Enviando...</> : `Enviar ${photoFiles.length} foto(s)`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepFotos;
