import { useAppStore } from "@/lib/store";
import { Mail, Shield, Info, Calendar } from "lucide-react";

const Help = () => {
  const { lang } = useAppStore();
  const isTr = lang === "tr";

  return (
    <div className="container py-8 max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-foreground">
        {isTr ? "Yardım" : "Help"}
      </h1>

      {/* About */}
      <section className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          {isTr ? "MYHUB Nedir?" : "What is MYHUB?"}
        </h2>
        <p className="text-muted-foreground">
          {isTr
            ? "MYHUB, Scratch topluluğu için oluşturulmuş bir proje paylaşım ve keşif platformudur. Projelerinizi paylaşabilir, diğer kullanıcıların projelerini keşfedebilir, beğenebilir ve yorum yapabilirsiniz."
            : "MYHUB is a project sharing and discovery platform built for the Scratch community. You can share your projects, explore others' projects, like and comment on them."}
        </p>
      </section>

      {/* Founded */}
      <section className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {isTr ? "Ne Zaman Kuruldu?" : "When Was It Founded?"}
        </h2>
        <p className="text-muted-foreground">
          {isTr
            ? "MYHUB, 2025 yılında kurulmuştur. Scratch topluluğuna hizmet etmek amacıyla geliştirilmektedir."
            : "MYHUB was founded in 2025. It is being developed to serve the Scratch community."}
        </p>
      </section>

      {/* Rules */}
      <section className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {isTr ? "Kurallar" : "Rules"}
        </h2>
        <ul className="text-muted-foreground space-y-2 list-disc list-inside">
          <li>{isTr ? "Uygunsuz veya zararlı içerik paylaşmayın." : "Do not share inappropriate or harmful content."}</li>
          <li>{isTr ? "Başkalarının projelerini izinsiz kopyalamayın." : "Do not copy others' projects without permission."}</li>
          <li>{isTr ? "Spam veya tekrarlayan içerik paylaşmayın." : "Do not share spam or repetitive content."}</li>
          <li>{isTr ? "Diğer kullanıcılara saygılı olun." : "Be respectful to other users."}</li>
          <li>{isTr ? "Topluluk kurallarına uymayan hesaplar askıya alınabilir." : "Accounts violating community rules may be suspended."}</li>
        </ul>
      </section>

      {/* Contact */}
      <section className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          {isTr ? "Yardım E-postası" : "Help Email"}
        </h2>
        <p className="text-muted-foreground">
          {isTr
            ? "Herhangi bir sorun veya sorunuz için bize ulaşın:"
            : "Contact us for any issues or questions:"}
        </p>
        <a
          href="mailto:a8112146@gmail.com"
          className="text-primary hover:underline font-medium"
        >
          a8112146@gmail.com
        </a>
      </section>
    </div>
  );
};

export default Help;
