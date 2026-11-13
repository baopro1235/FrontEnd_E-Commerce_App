import { ChevronRight, LogOut } from "lucide-react"
import { Link, Navigate, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import ProfileSidebar from "@/features/profile/components/ProfileSidebar"
import PersonalInfoSection from "@/features/profile/components/PersonalInfoSection"
import SecuritySection from "@/features/profile/components/SecuritySection"
import ShippingAddressSection from "@/features/profile/components/ShippingAddressSection"
import { useProfileActions } from "@/features/profile/hooks/useProfileActions"
import "./profile-page.css"

function ProfilePage() {
  const {
    user,
    logout,
    profileForm,
    addressForm,
    passwordForm,
    profileMessage,
    profileError,
    addressMessage,
    addressError,
    passwordMessage,
    passwordError,
    isAddressFormOpen,
    editingAddressId,
    openNewAddressForm,
    openEditAddressForm,
    closeAddressForm,
    saveProfile,
    saveAddress,
    chooseDefaultAddress,
    deleteAddress,
    savePassword,
  } = useProfileActions()
  const navigate = useNavigate()

  if (!user) {
    return <Navigate replace to="/login" />
  }

  function signOut() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <main className="profile-page">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:py-12">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <Link
              className="flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              to="/"
            >
              Paintmart <ChevronRight aria-hidden="true" /> Tài khoản
            </Link>
            <h1 className="profile-title">Hồ sơ của tôi</h1>
            <p className="text-sm text-muted-foreground">
              Quản lý thông tin cá nhân, địa chỉ giao hàng và bảo mật tài khoản.
            </p>
          </div>
          <Button
            className="w-fit"
            onClick={signOut}
            type="button"
            variant="outline"
          >
            <LogOut aria-hidden="true" data-icon="inline-start" />
            Đăng xuất
          </Button>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <ProfileSidebar user={user} />

          <div className="flex min-w-0 flex-col gap-6">
            <PersonalInfoSection
              email={user.email}
              error={profileError}
              form={profileForm}
              message={profileMessage}
              onSave={saveProfile}
            />
            <ShippingAddressSection
              addresses={user.addresses}
              editingAddressId={editingAddressId}
              error={addressError}
              form={addressForm}
              isFormOpen={isAddressFormOpen}
              message={addressMessage}
              onClose={closeAddressForm}
              onDelete={deleteAddress}
              onOpenEdit={openEditAddressForm}
              onOpenNew={openNewAddressForm}
              onSave={saveAddress}
              onSetDefault={chooseDefaultAddress}
            />
            <SecuritySection
              error={passwordError}
              form={passwordForm}
              message={passwordMessage}
              onSave={savePassword}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage
