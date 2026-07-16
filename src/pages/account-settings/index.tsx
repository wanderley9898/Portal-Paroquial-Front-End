import { useAuth } from "@/auth/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userService } from "@/lib/api/user.service";
import { ImagePlus, Settings } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

export function AccountSettingsPage() {
  const { user, refreshUser } = useAuth();

  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileDocument, setProfileDocument] = useState(user?.document || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const avatarPreviewUrl = useMemo(() => {
    const raw = (user?.avatarUrl || "").trim();
    if (!raw) return "";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return raw.startsWith("/") ? raw : `/${raw}`;
  }, [user?.avatarUrl]);

  const normalizedName = (user?.name ?? "").trim();
  const byWords = normalizedName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const compactName = normalizedName.replace(/\s+/g, "").toUpperCase();
  const userInitials = (byWords + compactName).slice(0, 2) || "US";

  const clearFeedback = () => {
    setSettingsError("");
    setSettingsSuccess("");
  };

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearFeedback();
    setIsSavingProfile(true);

    try {
      await userService.updateProfile({
        name: profileName.trim(),
        email: profileEmail.trim(),
        phone: profilePhone.trim(),
        document: profileDocument.trim(),
      });
      await refreshUser();
      setSettingsSuccess("Perfil atualizado com sucesso.");
    } catch (error) {
      setSettingsError(
        (error as Error)?.message || "Nao foi possível atualizar o perfil.",
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearFeedback();

    if (!currentPassword || !newPassword) {
      setSettingsError("Preencha senha atual e nova senha.");
      return;
    }

    if (newPassword.length < 6) {
      setSettingsError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSettingsError("A confirmação da nova senha não confere.");
      return;
    }

    setIsSavingPassword(true);

    try {
      await userService.updatePassword({
        oldPassword: currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSettingsSuccess("Senha atualizada com sucesso.");
    } catch (error) {
      setSettingsError(
        (error as Error)?.message || "Não foi possível atualizar a senha.",
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleUploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    clearFeedback();
    setIsUploadingAvatar(true);

    try {
      await userService.updateAvatar(file);
      await refreshUser();
      setSettingsSuccess("Avatar atualizado com sucesso.");
    } catch (error) {
      setSettingsError(
        (error as Error)?.message || "Não foi possível atualizar avatar.",
      );
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-gold" />
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold/80">
              Conta
            </p>
          </div>
          <h1 className="mt-3 font-display text-4xl text-foreground md:text-5xl">
            Configurações da conta
          </h1>
          <p className="mt-2 max-w-2xl font-serif text-muted-foreground">
            Atualize seus dados de perfil, troque senha e gerencie o avatar da
            sua conta.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-xl border border-border/60 bg-card/40 p-5 md:p-6">
          <Tabs defaultValue="profile" className="space-y-5">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="password">Senha</TabsTrigger>
              <TabsTrigger value="avatar">Avatar</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="profile-name">Nome</Label>
                  <Input
                    id="profile-name"
                    value={profileName}
                    onChange={(event) => setProfileName(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={profileEmail}
                    onChange={(event) => setProfileEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="profile-phone">Telefone</Label>
                    <Input
                      id="profile-phone"
                      value={profilePhone}
                      onChange={(event) => setProfilePhone(event.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="profile-document">Documento</Label>
                    <Input
                      id="profile-document"
                      value={profileDocument}
                      onChange={(event) =>
                        setProfileDocument(event.target.value)
                      }
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-gold text-primary-foreground hover:bg-gold/90"
                >
                  {isSavingProfile ? "Salvando..." : "Salvar perfil"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="password" className="space-y-4">
              <form onSubmit={handleSavePassword} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="current-password">Senha atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-password">Nova senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    minLength={6}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    minLength={6}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSavingPassword}
                  className="bg-gold text-primary-foreground hover:bg-gold/90"
                >
                  {isSavingPassword ? "Atualizando..." : "Atualizar senha"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="avatar" className="space-y-4">
              <div className="flex items-center gap-4 rounded border border-border/60 bg-card/60 p-4">
                {avatarPreviewUrl ? (
                  <img
                    src={avatarPreviewUrl}
                    alt="Avatar do usuário"
                    className="h-16 w-16 rounded-full border border-gold/30 object-cover"
                  />
                ) : (
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-card text-lg font-semibold uppercase text-gold">
                    {userInitials}
                  </span>
                )}
                <div>
                  <p className="font-sans text-sm text-foreground">
                    Avatar da conta
                  </p>
                  <p className="font-serif text-xs text-muted-foreground">
                    PNG ou JPG ate 2MB.
                  </p>
                </div>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-gold/40 px-3 py-2 font-sans text-sm text-gold hover:bg-gold/10">
                <ImagePlus className="h-4 w-4" />
                {isUploadingAvatar ? "Enviando..." : "Enviar novo avatar"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleUploadAvatar}
                  disabled={isUploadingAvatar}
                  className="hidden"
                />
              </label>
            </TabsContent>
          </Tabs>

          {settingsError && (
            <p className="mt-4 rounded border border-destructive/30 bg-destructive/10 px-3 py-2 font-sans text-xs text-destructive">
              {settingsError}
            </p>
          )}
          {settingsSuccess && (
            <p className="mt-4 rounded border border-gold/30 bg-gold/10 px-3 py-2 font-sans text-xs text-gold">
              {settingsSuccess}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
