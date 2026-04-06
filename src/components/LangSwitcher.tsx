import { langNames, type Lang } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

const LangSwitcher = () => {
  const { lang, setLang } = useAppStore();

  return (
    <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
      <SelectTrigger className="w-[130px] bg-secondary border-border">
        <Globe className="h-4 w-4 mr-1 text-primary" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.entries(langNames) as [Lang, string][]).map(([code, name]) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LangSwitcher;
