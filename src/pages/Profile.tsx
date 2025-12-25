import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

// Schémas de validation
const profileSchema = z.object({
  nom: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom est trop long'),
  email: z.string().trim().email('Email invalide').max(255, 'Email trop long'),
  poste: z.string().trim().min(2, 'Le poste doit contenir au moins 2 caractères').max(100, 'Le poste est trop long'),
});

const passwordSchema = z.object({
  current: z.string().min(1, 'Veuillez entrer votre mot de passe actuel'),
  new: z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
  confirm: z.string(),
}).refine((data) => data.new === data.confirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirm'],
});

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    nom: 'Admin User',
    email: 'admin@youthplatform.ma',
    poste: 'Administrateur',
    photoUrl: 'data:image/jpeg;base64,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',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (profileErrors[field]) {
      setProfileErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Erreur',
          description: 'Veuillez sélectionner une image valide.',
          variant: 'destructive',
        });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Erreur',
          description: 'L\'image ne doit pas dépasser 5MB.',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, photoUrl: reader.result as string }));
        toast({
          title: 'Photo mise à jour',
          description: 'Votre photo de profil a été changée.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setProfileErrors({});
    
    const result = profileSchema.safeParse(profile);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setProfileErrors(errors);
      toast({
        title: 'Erreur de validation',
        description: 'Veuillez corriger les erreurs dans le formulaire.',
        variant: 'destructive',
      });
      return;
    }

    setSavingProfile(true);
    // Simuler une sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavingProfile(false);

    toast({
      title: 'Profil mis à jour',
      description: 'Vos informations ont été enregistrées avec succès.',
    });
  };

  const handleChangePassword = async () => {
    setPasswordErrors({});

    const result = passwordSchema.safeParse(passwords);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setPasswordErrors(errors);
      toast({
        title: 'Erreur de validation',
        description: 'Veuillez corriger les erreurs dans le formulaire.',
        variant: 'destructive',
      });
      return;
    }

    setSavingPassword(true);
    // Simuler une sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavingPassword(false);

    toast({
      title: 'Mot de passe changé',
      description: 'Votre mot de passe a été mis à jour avec succès.',
    });
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
      <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles</p>
        </div>

        {/* Photo de profil */}
        <Card>
          <CardHeader>
            <CardTitle>Photo de profil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-primary/20">
                <AvatarImage src={profile.photoUrl} alt="Profile" />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  {profile.nom.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-10 w-10"
                variant="secondary"
                onClick={handlePhotoClick}
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Cliquez sur l'icône pour changer votre photo (max 5MB)
            </p>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom complet</Label>
              <Input
                id="nom"
                value={profile.nom}
                onChange={(e) => handleProfileChange('nom', e.target.value)}
                className={profileErrors.nom ? 'border-destructive' : ''}
              />
              {profileErrors.nom && (
                <p className="text-sm text-destructive">{profileErrors.nom}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className={profileErrors.email ? 'border-destructive' : ''}
              />
              {profileErrors.email && (
                <p className="text-sm text-destructive">{profileErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="poste">Poste</Label>
              <Input
                id="poste"
                value={profile.poste}
                onChange={(e) => handleProfileChange('poste', e.target.value)}
                className={profileErrors.poste ? 'border-destructive' : ''}
              />
              {profileErrors.poste && (
                <p className="text-sm text-destructive">{profileErrors.poste}</p>
              )}
            </div>
            <Button onClick={handleSaveProfile} className="w-full md:w-auto" disabled={savingProfile}>
              {savingProfile ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {savingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </CardContent>
        </Card>

        {/* Changement de mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle>Changer le mot de passe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={(e) => handlePasswordChange('current', e.target.value)}
                  className={passwordErrors.current ? 'border-destructive pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {passwordErrors.current && (
                <p className="text-sm text-destructive">{passwordErrors.current}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={(e) => handlePasswordChange('new', e.target.value)}
                  className={passwordErrors.new ? 'border-destructive pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {passwordErrors.new && (
                <p className="text-sm text-destructive">{passwordErrors.new}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwords.confirm}
                onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                className={passwordErrors.confirm ? 'border-destructive' : ''}
              />
              {passwordErrors.confirm && (
                <p className="text-sm text-destructive">{passwordErrors.confirm}</p>
              )}
            </div>
            <Button onClick={handleChangePassword} variant="outline" className="w-full md:w-auto" disabled={savingPassword}>
              {savingPassword ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {savingPassword ? 'Modification...' : 'Changer le mot de passe'}
            </Button>
          </CardContent>
        </Card>
      </div>
  );
}
